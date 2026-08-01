/**
 * Die Schale: Zustandsverwaltung der Oberflaeche, Persistenz-Anbindung,
 * Ereignisverteilung. Sie entscheidet NICHTS ueber die Geschichte — dafuer ist
 * `core/engine.ts` da. Sie liest den Zustand und schickt Absichten.
 */

import { content } from './content/index.ts'
import { locales } from './locales/index.ts'
import { Registry } from './model/registry.ts'
import { Engine, type EngineEvent } from './core/engine.ts'
import { I18n } from './core/i18n.ts'
import { SaveStore, createSave } from './core/save.ts'
import { AudioEngine } from './core/audio.ts'
import { buildReading } from './core/reading.ts'
import { coverage } from './model/graph.ts'
import { seedFrom } from './core/rng.ts'
import { PROFILE_SLOTS } from './core/constants.ts'
import type { Lang } from './model/types.ts'
import type { Profile, ProfileSettings, SaveFile } from './model/state.ts'
import { GAME_VERSION } from './core/version.ts'
import { btn, clear, el } from './views/dom.ts'
import { FeedbackLayer } from './views/feedback.ts'
import { StoryView } from './views/story.ts'
import { ReadingView } from './views/reading.ts'
import { TitleView, type ProfileSlot } from './views/title.ts'
import { Dialog, buildBacklog, buildCodex, buildSettings, buildSheet } from './views/panels.ts'

const BOOK = 'b1'
const CW_KEY = 'malazan-cyoa/cw-ack'
const LANG_KEY = 'malazan-cyoa/lang'

export class App {
  private readonly reg = new Registry(content)
  private readonly store = new SaveStore(window.localStorage)
  private readonly t: I18n
  private readonly audio: AudioEngine
  private readonly host: HTMLElement
  private readonly toastHost = el('div', { class: 'toasts', 'aria-live': 'polite' })
  private readonly dialog: Dialog
  private feedback: FeedbackLayer
  private engine: Engine | undefined
  private story: StoryView | undefined
  private reading: ReadingView | undefined
  private title: TitleView | undefined
  private buildId = 'local'
  private saveTimer = 0
  private lastTick = 0

  constructor(host: HTMLElement) {
    this.host = host
    const lang = (window.localStorage.getItem(LANG_KEY) as Lang | null)
      ?? (navigator.language.startsWith('de') ? 'de' : 'en')
    this.t = new I18n(lang)
    this.t.register('de', locales.de)
    this.t.register('en', locales.en)
    this.audio = new AudioEngine(import.meta.env.DEV)
    this.dialog = new Dialog(this.t)
    this.feedback = new FeedbackLayer(this.toastHost, this.audio, this.t)
    document.documentElement.lang = lang
  }

  start(): void {
    this.host.append(this.toastHost, this.dialog.root)
    void this.pollVersion()
    this.showTitle()
    window.setInterval(() => void this.pollVersion(), 5 * 60 * 1000)
    document.addEventListener('visibilitychange', () => { if (!document.hidden) void this.pollVersion() })
    window.addEventListener('beforeunload', () => this.persist())
  }

  // -- Startbildschirm -------------------------------------------------------

  private showTitle(): void {
    this.audio.stopAmbience()
    this.engine = undefined
    this.title = new TitleView({
      t: this.t,
      lang: this.t.lang,
      buildId: this.buildId,
      slots: () => this.slots(),
      onContinue: id => this.continueProfile(id),
      onCreate: (id, input) => this.createProfile(id, input),
      onDelete: id => { this.store.remove(id); this.showTitle() },
      onExport: id => this.exportProfile(id),
      onImport: file => void this.importProfile(file),
      onLang: lang => { this.setLang(lang); this.showTitle() },
    })
    this.mount(this.title.root)
    this.title.render()
  }

  private slots(): ProfileSlot[] {
    const known = this.store.listIds()
    const out: ProfileSlot[] = []
    for (let i = 0; i < PROFILE_SLOTS; i++) {
      const id = known[i] ?? `slot-${i + 1}`
      const save = known[i] ? this.store.load(id, this.blankSave(id)) : undefined
      out.push({
        id,
        profile: save?.profile,
        completion: save ? coverage(this.reg, BOOK, save.meta).ratio : 0,
      })
    }
    return out
  }

  private blankSave(id: string): SaveFile {
    const book = this.reg.book(BOOK)!
    return createSave({
      id, name: '—', sigil: 'obelisk', background: 'marine', pronouns: 'they',
      lang: this.t.lang, bookId: BOOK, entry: book.entry,
      seed: seedFrom(id), createdAt: new Date().toISOString(),
    })
  }

  private createProfile(id: string, input: { name: string; background: Profile['background']; pronouns: Profile['pronouns']; sigil: string }): void {
    const book = this.reg.book(BOOK)!
    const save = createSave({
      id, name: input.name, sigil: input.sigil, background: input.background,
      pronouns: input.pronouns, lang: this.t.lang, bookId: BOOK, entry: book.entry,
      seed: seedFrom(id + input.name + Date.now()), createdAt: new Date().toISOString(),
    })
    this.engine = Engine.start(this.reg, save, BOOK, save.run.seed)
    this.persist()
    this.afterContentWarning(() => this.showStory())
  }

  private continueProfile(id: string): void {
    const save = this.store.load(id, this.blankSave(id))
    if (!save) return
    this.engine = new Engine(this.reg, save)
    this.applySettings(save.settings, false)
    // Die zuletzt gewaehlte Sprache gewinnt und wandert in den Spielstand.
    this.setLang(this.t.lang)
    this.afterContentWarning(() => this.showStory())
  }

  /** Inhaltswarnung vor dem ersten Kapitel — und jederzeit aus den Einstellungen. */
  private afterContentWarning(next: () => void): void {
    if (window.localStorage.getItem(CW_KEY) === '1') { next(); return }
    this.dialog.open(this.t.t('ui.contentWarning'), body => {
      body.append(
        el('p', { text: this.t.t('ui.contentWarningBody') }),
        btn(this.t.t('ui.understood'), () => {
          window.localStorage.setItem(CW_KEY, '1')
          this.dialog.close()
          next()
        }, { class: 'btn btn--primary' }),
      )
    })
  }

  // -- Lese-Ansicht ----------------------------------------------------------

  private showStory(): void {
    const engine = this.engine
    if (!engine) return this.showTitle()
    this.applySettings(engine.save.settings)

    this.story = new StoryView({
      engine,
      reg: this.reg,
      t: this.t,
      reduceMotion: engine.save.settings.reduceMotion,
      dispatch: action => this.dispatch(action),
      openCodex: id => this.openCodex(id),
      openReading: () => this.showReading(),
      setMood: mood => this.audio.ambience(mood),
    })

    const shell = el('div', { class: 'shell' }, this.toolbar(), this.story.root)
    this.mount(shell)
    this.story.render()
    this.lastTick = Date.now()
    window.clearInterval(this.saveTimer)
    this.saveTimer = window.setInterval(() => {
      const now = Date.now()
      if (this.engine) this.engine.run.playtimeMs += now - this.lastTick
      this.lastTick = now
      this.persist()
    }, 10_000)
  }

  /**
   * Kopfzeile. Links vier Wege IN die Geschichte, rechts abgesetzt zwei, die
   * hinausfuehren.
   *
   * Vorher standen alle sechs als gleich aussehende Textknoepfe nebeneinander —
   * dabei sind die ersten vier Spielinhalt (Auslegung, Marginalien, Blatt,
   * Rueckschau) und die letzten zwei Verwaltung. Dass sie identisch aussahen,
   * war der Fehler: Wer "Profile" neben "Marginalien" sieht, haelt beides fuer
   * dieselbe Art von Sache.
   *
   * Die Verwaltungs-Ecke traegt Symbole statt Text — sie soll erreichbar sein,
   * aber keine Aufmerksamkeit ziehen. **Mit `aria-label` und `title`**: Ein
   * Symbol ohne zugaenglichen Namen waere ein Rueckschritt gegenueber der
   * beschrifteten Fassung, und die Barrierefreiheit ist hier schon nachgewiesen.
   */
  private toolbar(): HTMLElement {
    const t = this.t
    const icon = (glyph: string, label: string, on: () => void) =>
      btn('', on, { class: 'toolbar__icon', 'aria-label': label, title: label, text: glyph })
    return el('nav', { class: 'toolbar', 'aria-label': t.t('ui.menu') },
      el('div', { class: 'toolbar__group' },
        btn(t.t('ui.reading'), () => this.showReading(), { class: 'toolbar__btn' }),
        btn(t.t('ui.codex'), () => this.openCodex(), { class: 'toolbar__btn' }),
        btn(t.t('ui.sheet'), () => this.openSheet(), { class: 'toolbar__btn' }),
        btn(t.t('ui.backlog'), () => this.openBacklog(), { class: 'toolbar__btn' }),
      ),
      el('div', { class: 'toolbar__group toolbar__group--admin' },
        icon('⚙', t.t('ui.settings'), () => this.openSettings()),
        icon('☰', t.t('ui.profiles'), () => { this.persist(); this.showTitle() }),
      ),
    )
  }

  private showReading(): void {
    const engine = this.engine
    if (!engine) return
    this.audio.stopAmbience()
    this.reading = new ReadingView({
      t: this.t,
      reduceMotion: engine.save.settings.reduceMotion,
      reading: () => buildReading({ reg: this.reg, book: BOOK, meta: engine.meta, ctx: engine.ctx }),
      currentChapter: () => engine.scene.chapter,
      coverage: () => coverage(this.reg, BOOK, engine.meta),
      requestJump: id => this.confirmJump(id),
    })
    const shell = el('div', { class: 'shell' },
      el('nav', { class: 'toolbar' },
        btn(this.t.t('ui.back'), () => this.showStory(), { class: 'toolbar__btn' }),
        btn(this.t.t('ui.codex'), () => this.openCodex(), { class: 'toolbar__btn' }),
        btn(this.t.t('ui.sheet'), () => this.openSheet(), { class: 'toolbar__btn' }),
      ),
      this.reading.root,
    )
    this.mount(shell)
    this.reading.render()
  }

  /** Der Sprungdialog nennt im Klartext, was zurueckgenommen wird. */
  private confirmJump(sceneId: string): void {
    const engine = this.engine
    if (!engine) return
    const diff = engine.jumpDiff(sceneId)
    this.dialog.open(this.t.t('ui.jumpTitle'), body => {
      body.append(el('p', { text: this.t.t('ui.jumpWarn') }))
      const lines: string[] = []
      if (diff) {
        const arrow = (label: string, from: number, to: number) => `${label}: ${from} → ${to}`
        for (const [stat, d] of Object.entries(diff.stats)) {
          lines.push(arrow(this.t.t(`stat.${stat}`), d.from, d.to))
        }
        if (diff.coin.from !== diff.coin.to) lines.push(arrow(this.t.t('ui.coin'), diff.coin.from, diff.coin.to))
        if (diff.xp.from !== diff.xp.to) lines.push(arrow(this.t.t('ui.xp'), diff.xp.from, diff.xp.to))
        if (diff.level.from !== diff.level.to) {
          lines.push(`${this.t.t('ui.level', { n: diff.level.from })} → ${this.t.t('ui.level', { n: diff.level.to })}`)
        }
        for (const item of diff.items) lines.push(this.t.t(`item.${item}.title`))
      }
      body.append(el('p', { class: 'jump__loses', text: this.t.t('ui.jumpLoses') }))
      body.append(lines.length
        ? el('ul', {}, ...lines.map(l => el('li', { text: l })))
        : el('p', { class: 'muted', text: this.t.t('ui.jumpNothing') }))
      body.append(el('p', { class: 'jump__keeps', text: this.t.t('ui.jumpKeeps') }))
      body.append(el('div', { class: 'confirm__row' },
        btn(this.t.t('ui.jump'), () => {
          this.dialog.close()
          this.dispatch(() => engine.jumpTo(sceneId))
          this.showStory()
        }, { class: 'btn btn--primary' }),
        btn(this.t.t('ui.cancel'), () => this.dialog.close(), { class: 'btn' }),
      ))
    })
  }

  // -- Dialoge ---------------------------------------------------------------

  private openCodex(openId?: string): void {
    const engine = this.engine
    if (!engine) return
    this.dialog.open(this.t.t('ui.codex'), body => buildCodex(body, this.reg, engine, this.t, openId))
  }

  private openSheet(): void {
    const engine = this.engine
    if (!engine) return
    this.dialog.open(this.t.t('ui.sheet'), body => buildSheet(body, this.reg, engine, this.t))
  }

  private openBacklog(): void {
    const story = this.story
    if (!story) return
    this.dialog.open(this.t.t('ui.backlog'), body => buildBacklog(body, story.backlogEntries(), this.t))
  }

  private openSettings(): void {
    const engine = this.engine
    if (!engine) return
    this.dialog.open(this.t.t('ui.settings'), body => buildSettings(body, {
      settings: engine.save.settings,
      t: this.t,
      buildId: this.buildId,
      onChange: next => {
        // Ton im Dev-Build erst freigeben, wenn der Spieler ihn bewusst anmacht.
        if (engine.save.settings.muted && !next.muted) this.audio.enableInDev()
        engine.save.settings = next
        this.applySettings(next)
        this.persist()
        this.openSettings()
      },
      onLang: lang => {
        engine.save.settings.lang = lang
        this.setLang(lang)
        this.dialog.close()
        this.showStory()
      },
      showContentWarning: () => {
        this.dialog.open(this.t.t('ui.contentWarning'), b => {
          b.append(el('p', { text: this.t.t('ui.contentWarningBody') }))
        })
      },
    }))
  }

  // -- Ereignisse, Persistenz, Einstellungen ---------------------------------

  private dispatch(action: () => EngineEvent[]): void {
    const events = action()
    this.feedback.emit(events)
    for (const ev of events) {
      if (ev.kind === 'gameover') this.showGameOver(ev.reasonKey, ev.suggest)
      if (ev.kind === 'ending') this.showEnding(ev.ending)
    }
    this.persist()
  }

  private showGameOver(reasonKey: string, suggest: string[]): void {
    this.dialog.open(this.t.t('ui.gameover'), body => {
      body.append(
        el('p', { class: 'gameover__reason', text: this.t.t(reasonKey) }),
        el('p', { class: 'muted', text: this.t.t('ui.gameoverHint') }),
      )
      for (const id of suggest) {
        const scene = this.reg.scene(id)
        if (!scene) continue
        body.append(btn(`${scene.code} · ${this.t.t(scene.titleKey)}`, () => {
          this.dialog.close()
          this.confirmJump(id)
        }, { class: 'btn' }))
      }
      body.append(btn(this.t.t('ui.reading'), () => { this.dialog.close(); this.showReading() }, { class: 'btn btn--primary' }))
    })
  }

  private showEnding(endingId: string): void {
    const ending = this.reg.ending(BOOK, endingId)
    this.dialog.open(this.t.t('ui.ending'), body => {
      body.append(
        el('h3', { text: this.t.t(ending?.titleKey ?? '') }),
        el('p', { text: this.t.t(ending?.summaryKey ?? '') }),
        btn(this.t.t('ui.reading'), () => { this.dialog.close(); this.showReading() }, { class: 'btn btn--primary' }),
      )
    })
  }

  /**
   * `adoptLang` steuert, wer bei der Sprache gewinnt. Aus den Einstellungen
   * heraus hat der Spieler die Sprache gerade IM Spielstand geaendert — dort
   * gewinnt der Spielstand. Beim Fortsetzen vom Startbildschirm ist es
   * umgekehrt: Wer dort DE/EN klickt und dann "Weiter", erwartet genau diese
   * Sprache. Vorher hat der Spielstand sie stumm ueberschrieben.
   */
  private applySettings(s: ProfileSettings, adoptLang = true): void {
    const root = document.documentElement
    root.style.setProperty('--font-scale', String(s.fontScale))
    root.style.setProperty('--line-width', s.lineWidth === 'narrow' ? '45ch' : s.lineWidth === 'wide' ? '75ch' : '60ch')
    root.dataset.serif = String(s.serif)
    root.dataset.dyslexic = String(s.dyslexic)
    root.dataset.contrast = s.contrast
    root.dataset.motion = s.reduceMotion ? 'reduce' : 'full'
    this.audio.update({ muted: s.muted, volume: s.volume })
    if (adoptLang && s.lang !== this.t.lang) this.setLang(s.lang)
  }

  private setLang(lang: Lang): void {
    this.t.lang = lang
    document.documentElement.lang = lang
    window.localStorage.setItem(LANG_KEY, lang)
    if (this.engine) this.engine.save.settings.lang = lang
  }

  private persist(): void {
    if (!this.engine) return
    const ok = this.store.write(this.engine.save, new Date().toISOString())
    if (!ok) {
      this.toastHost.append(el('div', { class: 'toast toast--bad toast--in', role: 'alert' },
        el('span', { class: 'toast__text', text: this.t.t('ui.saveError') }),
      ))
    }
  }

  private exportProfile(id: string): void {
    const save = this.store.load(id, this.blankSave(id))
    if (!save) return
    const blob = new Blob([this.store.export(save)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = el('a', { href: url, download: `malazan-${save.profile.name || id}.json` })
    a.click()
    URL.revokeObjectURL(url)
  }

  private async importProfile(file: File): Promise<void> {
    try {
      const text = await file.text()
      const save = this.store.import(text, this.blankSave('slot-import'))
      this.store.write(save, new Date().toISOString())
      this.showTitle()
    } catch {
      window.alert(this.t.t('ui.saveError'))
    }
  }

  private mount(node: HTMLElement): void {
    for (const child of [...this.host.children]) {
      if (child !== this.toastHost && child !== this.dialog.root) child.remove()
    }
    this.host.prepend(node)
  }

  // -- Update-Banner ---------------------------------------------------------

  private async pollVersion(): Promise<void> {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as { version?: string; build?: string }
      if (data.build) this.buildId = data.build
      if (data.version && data.version !== GAME_VERSION) this.showUpdateBanner()
    } catch {
      /* Dev-Server oder offline — kein Grund fuer Laerm */
    }
  }

  private showUpdateBanner(): void {
    if (document.querySelector('.update')) return
    const banner = el('div', { class: 'update', role: 'status' },
      el('span', { text: this.t.t('ui.update.title') }),
      btn(this.t.t('ui.update.action'), () => {
        void (async () => {
          this.persist()
          try {
            const regs = await navigator.serviceWorker?.getRegistrations()
            await Promise.all((regs ?? []).map(r => r.unregister()))
            const keys = await caches?.keys()
            await Promise.all((keys ?? []).map(k => caches.delete(k)))
          } catch { /* nicht verfuegbar — Reload reicht auch so */ }
          location.replace(`${location.pathname}?v=${Date.now()}`)
        })()
      }, { class: 'btn btn--primary' }),
    )
    document.body.append(banner)
  }
}

/** Fuer Tests: leert den Host. */
export function resetHost(host: HTMLElement): void { clear(host) }
