/**
 * Der Spielkern. Kennt kein DOM, keine Uhr und keinen Zufall ausser dem
 * gesaeten — die Zeit kommt als Argument herein, der Wurf aus `rng.ts`.
 * Genau deshalb kann `tools/simulate.mjs` das gesamte Buch durchspielen und die
 * Validierungs-Suite jede Kante pruefen.
 *
 * Die Engine gibt auf JEDE Handlung eine Ereignisliste zurueck. Die View
 * uebersetzt jedes Ereignis in Bild UND Klang. Ein stiller Effekt ist damit
 * strukturell unmoeglich: Was der Zustand aendert, steht in der Liste.
 */

import type {
  Choice, Interaction, Outcome, Page, Scene, SceneId,
} from '../model/types.ts'
import type { MetaState, RunState, SaveFile, SceneKnowledge } from '../model/state.ts'
import { SAVE_SCHEMA } from '../model/state.ts'
import type { Registry } from '../model/registry.ts'
import { evaluate, type EvalContext } from './conditions.ts'
import { applyEffects, type EffectEvent } from './effects.ts'
import { CHECK, START_COIN, START_STATS, XP } from './constants.ts'
import { rollDie } from './rng.ts'

export type EngineEvent =
  | EffectEvent
  | { kind: 'page'; page: string; scene: SceneId; index: number }
  | { kind: 'scene'; scene: SceneId; first: boolean }
  | { kind: 'checkpoint'; scene: SceneId }
  | { kind: 'check'; stat: string; roll: number; total: number; dc: number; passed: boolean; usedFortune: boolean }
  | { kind: 'jump'; scene: SceneId }
  | { kind: 'gameover'; scene: SceneId; outcome: Outcome; reasonKey: string; suggest: SceneId[] }
  | { kind: 'ending'; ending: string; scene: SceneId }
  | { kind: 'blocked'; reason: 'locked' | 'unknown' | 'not-at-exit' }

/** Was die View ueber die aktuelle Seite wissen muss. */
export interface PageView {
  scene: Scene
  page: Page
  index: number
  total: number
  /** Bedingte Zusatzabsaetze, die gerade greifen. */
  inserts: string[]
  interactions: InteractionView[]
  atExit: boolean
}

export interface InteractionView {
  interaction: Interaction
  locked: boolean
  used: boolean
}

/** Was ein Sprung zuruecknehmen wuerde — jeweils von/nach, nie nur eine Differenz. */
export interface JumpDiff {
  stats: Record<string, { from: number; to: number }>
  coin: { from: number; to: number }
  level: { from: number; to: number }
  xp: { from: number; to: number }
  items: string[]
}

export interface ChoiceView {
  choice: Choice
  locked: boolean
  /** Schon einmal genommen — wird gedimmt, nie entfernt. */
  played: boolean
  /** Bekanntes Ergebnis dieses Weges, falls schon erkundet. */
  knownOutcome?: Outcome
}

function emptyRun(book: string, entry: SceneId, seed: number, background: keyof typeof START_STATS): RunState {
  return {
    book,
    scene: entry,
    page: 0,
    stats: { ...START_STATS[background] },
    sheets: {},
    xp: 0,
    level: 1,
    coin: START_COIN,
    items: {},
    flags: {},
    talents: [],
    attention: 0,
    seed,
    rolls: 0,
    entered: [],
    pagesApplied: [],
    interactionsUsed: [],
    playtimeMs: 0,
  }
}

export function emptyMeta(): MetaState {
  return { scenes: {}, codex: [], cards: [], achievements: [], endings: [], gameOvers: 0, pagesRead: [] }
}

export class Engine {
  readonly reg: Registry
  save: SaveFile
  /** Wird true, sobald der Lauf terminal ist (Game Over oder Ende). */
  finished: false | 'gameover' | 'ending' = false

  constructor(reg: Registry, save: SaveFile) {
    this.reg = reg
    this.save = save
  }

  /** Frischer Lauf fuer ein Profil. Betritt sofort die Eingangsszene des Buches. */
  static start(reg: Registry, save: SaveFile, bookId: string, seed: number): Engine {
    const book = reg.book(bookId)
    if (!book) throw new Error(`Unbekanntes Buch: ${bookId}`)
    save.run = emptyRun(book.id, book.entry, seed, save.profile.background)
    const engine = new Engine(reg, save)
    engine.enterScene(book.entry, 0)
    return engine
  }

  // -- Zugriff ---------------------------------------------------------------

  get run(): RunState { return this.save.run }
  get meta(): MetaState { return this.save.meta }

  get ctx(): EvalContext {
    return {
      run: this.save.run,
      meta: this.save.meta,
      background: this.save.profile.background,
      stats: this.activeStats,
    }
  }

  /**
   * Die Wertetafel, die gerade zaehlt. In einem Interlude die der Kanon-Figur,
   * sonst die des Rekruten. Wird beim ersten Betreten aus dem Content geseedet
   * und lebt danach im Lauf (rollt also bei einem Sprung korrekt zurueck).
   */
  get activeStats(): Record<string, number> {
    const sheetId = this.currentSheetId
    if (!sheetId) return this.save.run.stats
    let bag = this.save.run.sheets[sheetId]
    if (!bag) {
      const def = this.reg.sheet(sheetId)
      bag = { ...(def?.stats ?? this.save.run.stats) }
      this.save.run.sheets[sheetId] = bag
    }
    return bag
  }

  /** `undefined`, solange der Spieler als er selbst unterwegs ist. */
  get currentSheetId(): string | undefined {
    return this.reg.scene(this.save.run.scene)?.sheet
  }

  /** Effekt-Ziel inklusive der richtigen Wertetafel. */
  private get target() {
    return { run: this.save.run, meta: this.save.meta, stats: this.activeStats }
  }

  get scene(): Scene {
    const s = this.reg.scene(this.save.run.scene)
    if (!s) throw new Error(`Unbekannte Szene: ${this.save.run.scene}`)
    return s
  }

  get page(): Page {
    const scene = this.scene
    return scene.pages[Math.min(this.save.run.page, scene.pages.length - 1)]
  }

  /** Steht der Spieler auf der letzten Seite der Szene, also am Ausgang? */
  get atExit(): boolean {
    return this.save.run.page >= this.scene.pages.length - 1
  }

  view(): PageView {
    const scene = this.scene
    const page = this.page
    const ctx = this.ctx
    return {
      scene,
      page,
      index: this.save.run.page,
      total: scene.pages.length,
      inserts: (page.inserts ?? []).filter(i => evaluate(i.when, ctx)).map(i => i.bodyKey),
      interactions: (page.interactions ?? []).map(interaction => ({
        interaction,
        locked: !evaluate(interaction.requires, ctx),
        used: this.save.run.interactionsUsed.includes(`${page.id}:${interaction.id}`),
      })),
      atExit: this.atExit,
    }
  }

  /** Auswahlmoeglichkeiten am Szenenende, inklusive Sperr- und Gespielt-Zustand. */
  choices(): ChoiceView[] {
    const scene = this.scene
    if (scene.exit.type !== 'choice') return []
    const ctx = this.ctx
    const taken = this.save.meta.scenes[scene.id]?.taken ?? []
    return scene.exit.choices.map(choice => ({
      choice,
      locked: !evaluate(choice.requires, ctx),
      played: taken.includes(choice.id),
      knownOutcome: this.save.meta.scenes[choice.to]?.outcome,
    }))
  }

  // -- Handlungen ------------------------------------------------------------

  /** Eine Seite weiter. Am Szenenende passiert nichts — dort wird gewaehlt. */
  next(elapsedMs = 0): EngineEvent[] {
    this.save.run.playtimeMs += elapsedMs
    const scene = this.scene
    if (this.save.run.page >= scene.pages.length - 1) {
      // Ein `goto`-Ausgang braucht keine Entscheidung: einfach weiterlaufen.
      if (scene.exit.type === 'goto') return this.leaveVia(undefined, scene.exit.to)
      if (scene.exit.type === 'gameover') return this.finishGameOver(scene)
      if (scene.exit.type === 'ending') return this.finishEnding(scene, scene.exit.endingId)
      return [{ kind: 'blocked', reason: 'not-at-exit' }]
    }
    this.save.run.page += 1
    return this.openPage()
  }

  /** Eine Seite zurueck — reines Nachlesen, aendert nichts. */
  back(): boolean {
    if (this.save.run.page === 0) return false
    this.save.run.page -= 1
    return true
  }

  interact(id: string, elapsedMs = 0): EngineEvent[] {
    this.save.run.playtimeMs += elapsedMs
    const page = this.page
    const interaction = (page.interactions ?? []).find(i => i.id === id)
    if (!interaction) return [{ kind: 'blocked', reason: 'unknown' }]
    if (!evaluate(interaction.requires, this.ctx)) return [{ kind: 'blocked', reason: 'locked' }]
    const key = `${page.id}:${interaction.id}`
    if (!interaction.repeatable && this.save.run.interactionsUsed.includes(key)) {
      return [{ kind: 'blocked', reason: 'unknown' }]
    }
    if (!interaction.repeatable) this.save.run.interactionsUsed.push(key)
    return applyEffects(interaction.effects, this.target)
  }

  choose(choiceId: string, elapsedMs = 0): EngineEvent[] {
    this.save.run.playtimeMs += elapsedMs
    const scene = this.scene
    if (scene.exit.type !== 'choice') return [{ kind: 'blocked', reason: 'not-at-exit' }]
    if (!this.atExit) return [{ kind: 'blocked', reason: 'not-at-exit' }]
    const choice = scene.exit.choices.find(c => c.id === choiceId)
    if (!choice) return [{ kind: 'blocked', reason: 'unknown' }]
    if (!evaluate(choice.requires, this.ctx)) return [{ kind: 'blocked', reason: 'locked' }]

    const events: EngineEvent[] = applyEffects(choice.costs, this.target)
    let target = choice.to

    if (choice.check) {
      const stats = this.activeStats
      const useFortune = choice.check.fortune === true && (stats.fortune ?? 0) > 0
      const die = rollDie(this.save.run.seed, this.save.run.rolls, CHECK.die)
      this.save.run.rolls += 1
      const bonus = useFortune ? (stats.fortune ?? 0) * CHECK.fortuneBonus : 0
      const total = (stats[choice.check.stat] ?? 0) + die + bonus
      const passed = total >= choice.check.dc
      if (useFortune) {
        events.push(...applyEffects([{ attention: CHECK.attentionPerFortuneUse }], this.target))
      }
      events.push({
        kind: 'check', stat: choice.check.stat, roll: die, total,
        dc: choice.check.dc, passed, usedFortune: useFortune,
      })
      if (!passed) target = choice.check.fail
    }

    events.push(...this.leaveVia(choice, target))
    return events
  }

  /** Sprung in der Auslegung: stellt den Schnappschuss dieser Szene exakt wieder her. */
  jumpTo(sceneId: SceneId): EngineEvent[] {
    const snap = this.save.checkpoints[sceneId]
    if (!snap) return [{ kind: 'blocked', reason: 'unknown' }]
    // Nur der Lauf rollt zurueck. Wissen (besuchte Szenen, Codex, Karten,
    // Erfolge, Enden) bleibt — das ist die Nicht-Verhandelbare Nr. 9.
    this.save.run = structuredCloneish(snap.run)
    this.finished = false
    const events: EngineEvent[] = [{ kind: 'jump', scene: sceneId }]
    events.push(...this.enterScene(sceneId, 0, { replay: true }))
    return events
  }

  /** Was ein Sprung kosten wuerde — fuer den Bestaetigungsdialog im Klartext. */
  jumpDiff(sceneId: SceneId): JumpDiff | undefined {
    const snap = this.save.checkpoints[sceneId]
    if (!snap) return undefined
    const stats: Record<string, { from: number; to: number }> = {}

    // Werte sind nur vergleichbar, wenn Ziel und Gegenwart DIESELBE Wertetafel
    // benutzen. Die alte Fassung nahm die Tafel der aktuellen Szene und fiel,
    // wenn sie im Schnappschuss fehlte, auf die Werte des Spielcharakters
    // zurueck — dann standen im Dialog Parans Werte gegen die des Rekruten.
    // Gemeldet am 01.08.2026: frisch gestartet, zum Startpunkt zurueck, und der
    // Dialog versprach vier Wertaenderungen, von denen keine eintrat.
    const targetSheet = this.reg.scene(sceneId)?.sheet
    if (targetSheet === this.currentSheetId) {
      const now = this.activeStats
      // Fehlt die Tafel im Schnappschuss, wurde sie damals noch nicht
      // angelegt — nach dem Sprung entsteht sie frisch aus ihrer Definition,
      // und genau dagegen wird verglichen.
      const then = targetSheet
        ? snap.run.sheets[targetSheet] ?? this.reg.sheet(targetSheet)?.stats
        : snap.run.stats
      if (then) {
        for (const [k, v] of Object.entries(now)) {
          const target = (then as Record<string, number>)[k] ?? v
          if (target !== v) stats[k] = { from: v, to: target }
        }
      }
    }
    const lost = Object.keys(this.save.run.items).filter(i => !(i in snap.run.items))
    return {
      stats,
      coin: { from: this.save.run.coin, to: snap.run.coin },
      level: { from: this.save.run.level, to: snap.run.level },
      xp: { from: this.save.run.xp, to: snap.run.xp },
      items: lost,
    }
  }

  // -- Innereien -------------------------------------------------------------

  private leaveVia(choice: Choice | undefined, target: SceneId): EngineEvent[] {
    const scene = this.scene
    const know = this.knowledge(scene.id)
    if (choice && !know.taken.includes(choice.id)) know.taken.push(choice.id)
    know.outcome = choice?.outcome ?? defaultOutcome(scene)
    const next = this.reg.scene(target)
    if (!next) return [{ kind: 'blocked', reason: 'unknown' }]
    return this.enterScene(target, XP.scene)
  }

  private enterScene(id: SceneId, xpGain: number, opts: { replay?: boolean } = {}): EngineEvent[] {
    const scene = this.reg.scene(id)
    if (!scene) return [{ kind: 'blocked', reason: 'unknown' }]
    const first = !this.save.meta.scenes[id]?.reached
    this.save.run.scene = id
    this.save.run.page = 0

    const events: EngineEvent[] = []

    // Schnappschuss ZUERST und genau einmal: er haelt den Zustand fest, wie er
    // beim ersten Betreten war — vor `onEnter`, damit ein Sprung die Szene
    // vollstaendig und identisch wiederholt.
    if (!this.save.checkpoints[id]) {
      this.save.checkpoints[id] = { schema: SAVE_SCHEMA, run: structuredCloneish(this.save.run) }
      events.push({ kind: 'checkpoint', scene: id })
    }

    const know = this.knowledge(id)
    know.reached = true
    events.push({ kind: 'scene', scene: id, first })

    if (!this.save.run.entered.includes(id)) {
      this.save.run.entered.push(id)
      events.push(...applyEffects(scene.onEnter, this.target))
      if (xpGain > 0 && !opts.replay) {
        const bonus = scene.kind === 'convergence' ? XP.convergence : xpGain
        events.push(...applyEffects([{ xp: bonus }], this.target))
      }
    }

    events.push(...this.openPage())

    // Eine Szene ohne Seiten waere ein Content-Fehler; die Validierung faengt das.
    if (scene.pages.length === 0) {
      if (scene.exit.type === 'gameover') events.push(...this.finishGameOver(scene))
      else if (scene.exit.type === 'ending') events.push(...this.finishEnding(scene, scene.exit.endingId))
    }
    return events
  }

  private openPage(): EngineEvent[] {
    const scene = this.scene
    const page = scene.pages[this.save.run.page]
    if (!page) return []
    const events: EngineEvent[] = [
      { kind: 'page', page: page.id, scene: scene.id, index: this.save.run.page },
    ]
    if (!this.save.meta.pagesRead.includes(page.id)) this.save.meta.pagesRead.push(page.id)
    if (!this.save.run.pagesApplied.includes(page.id)) {
      this.save.run.pagesApplied.push(page.id)
      events.push(...applyEffects(page.effects, this.target))
    }
    return events
  }

  private finishGameOver(scene: Scene): EngineEvent[] {
    if (scene.exit.type !== 'gameover') return []
    const know = this.knowledge(scene.id)
    know.outcome = scene.exit.outcome
    this.save.meta.gameOvers += 1
    this.finished = 'gameover'
    const events: EngineEvent[] = applyEffects([{ xp: XP.deadendSurvivedAsKnowledge }], this.target)
    events.push({
      kind: 'gameover', scene: scene.id, outcome: scene.exit.outcome,
      reasonKey: scene.exit.reasonKey,
      suggest: scene.exit.suggest.filter(s => this.save.checkpoints[s]),
    })
    return events
  }

  private finishEnding(scene: Scene, endingId: string): EngineEvent[] {
    const know = this.knowledge(scene.id)
    know.outcome = 'ending'
    if (!this.save.meta.endings.includes(endingId)) this.save.meta.endings.push(endingId)
    this.finished = 'ending'
    const ending = this.reg.ending(this.save.run.book, endingId)
    const events: EngineEvent[] = ending ? applyEffects([{ card: ending.cardId }], this.target) : []
    events.push({ kind: 'ending', ending: endingId, scene: scene.id })
    return events
  }

  private knowledge(id: SceneId): SceneKnowledge {
    const existing = this.save.meta.scenes[id]
    if (existing) return existing
    const fresh: SceneKnowledge = { reached: false, taken: [] }
    this.save.meta.scenes[id] = fresh
    return fresh
  }
}

function defaultOutcome(scene: Scene): Outcome {
  if (scene.kind === 'side') return 'lore'
  if (scene.kind === 'ending') return 'ending'
  return 'progress'
}

/**
 * Tiefe Kopie ohne `structuredClone`: der RunState ist reines JSON, und so
 * bleibt der Core auch in aelteren Laufzeitumgebungen und im Simulator gleich.
 */
function structuredCloneish<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
