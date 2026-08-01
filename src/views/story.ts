/**
 * Der Lese-View: Illustration, Prosa, Gespraechsknoten, Auswahl am Szenenende,
 * Rückschau. Er LIEST nur den Zustand und schickt Absichten an die App — jede
 * Entscheidung faellt in `core/`.
 */

import type { Engine, EngineEvent } from '../core/engine.ts'
import type { I18n } from '../core/i18n.ts'
import type { Registry } from '../model/registry.ts'
import type { Choice } from '../model/types.ts'
import { btn, clear, el, focus, paragraphs } from './dom.ts'
import { artById } from '../content/index.ts'
import { illustration, placeholderDataUri } from '../core/placeholder.ts'
import { BACKLOG_SIZE } from '../core/constants.ts'

export interface StoryHost {
  engine: Engine
  reg: Registry
  t: I18n
  /** Fuehrt eine Engine-Aktion aus und verteilt die Ereignisse (Bild + Klang). */
  dispatch(action: () => EngineEvent[]): void
  openCodex(id: string): void
  openReading(): void
  /** Stimmung der aktuellen Seite — die Schale legt den Klangteppich danach. */
  setMood(mood: string): void
  reduceMotion: boolean
}

export class StoryView {
  readonly root: HTMLElement
  private readonly host: StoryHost
  private readonly figure = el('figure', { class: 'story__figure' })
  private readonly img = el('img', { class: 'story__art', alt: '', loading: 'lazy', decoding: 'async' })
  private readonly prose = el('div', { class: 'story__prose', tabindex: '-1' })
  private readonly extras = el('div', { class: 'story__extras' })
  private readonly actions = el('div', { class: 'story__actions' })
  private readonly meter = el('p', { class: 'story__meter', 'aria-live': 'polite' })
  private readonly backlog: { pageId: string; title: string; body: string }[] = []
  /** Wird gesetzt, solange eine Bestaetigungsfrage offen ist. */
  private pendingConfirm: Choice | undefined

  constructor(host: StoryHost) {
    this.host = host
    this.figure.append(this.img, el('figcaption', { class: 'sr-only' }))
    this.root = el('article', { class: 'story', 'aria-label': host.t.t('ui.reading') },
      this.figure,
      el('div', { class: 'story__body' }, this.meter, this.prose, this.extras, this.actions),
    )
    this.root.addEventListener('keydown', e => this.onKey(e))
  }

  /**
   * Platzhalter, die in Prosa eingesetzt werden. Der Rekrut wird im Text
   * ausschliesslich beim NAMEN genannt, nie mit einem Pronomen — die
   * Stilvorgabe verlangt dritte Person, und drei Anreden mal zwei Sprachen
   * ergaeben sonst vier Fassungen jeder Seite. Ausfuehrlich in
   * `_knowledgebase/70-style-and-voice.md`.
   */
  private vars(): Record<string, string> {
    return { name: this.host.engine.save.profile.name }
  }

  render(): void {
    const { engine, t } = this.host
    const view = engine.view()
    const scene = view.scene
    const page = view.page

    // --- Illustration -----------------------------------------------------
    const prompt = artById.get(page.art.promptId)
    const fallback = placeholderDataUri({
      id: page.id,
      mood: page.art.mood,
      palette: prompt?.palette ?? 'ash-rust',
    })
    // Das echte Bild, mit dem Platzhalter als Rueckfallebene. Beides ist noetig:
    // Es gibt 436 Seiten und deutlich weniger fertige Illustrationen, und eine
    // Seite ohne Bild soll trotzdem etwas zeigen, das zur Stimmung passt.
    const art = illustration(page.art.promptId, import.meta.env.BASE_URL)
    this.img.onerror = () => {
      this.img.onerror = null
      this.img.removeAttribute('srcset')
      this.img.removeAttribute('sizes')
      this.img.src = fallback
    }
    this.img.srcset = art.srcset
    this.img.sizes = '(max-width: 760px) 100vw, 640px'
    this.img.src = art.src
    this.img.alt = t.t(page.art.altKey)
    // Initial nur auf der ERSTEN Seite einer Szene: Es markiert einen Anfang.
    // Auf jeder Seite waere es Dekoration und keine Information mehr.
    this.prose.classList.toggle('story__prose--opening', view.index === 0)
    this.figure.dataset.mood = page.art.mood
    this.host.setMood(page.art.mood)
    this.figure.classList.remove('story__figure--in')
    if (!this.host.reduceMotion) requestAnimationFrame(() => this.figure.classList.add('story__figure--in'))

    // --- Kopfzeile: wo bin ich, als wen spiele ich ------------------------
    const sheetId = scene.sheet
    clear(this.meter)
    this.meter.append(
      el('span', { class: 'story__chapter', text: t.t(this.host.reg.chapter(scene.chapter)?.titleKey ?? '') }),
      el('span', { class: 'story__code', text: scene.code }),
      el('span', { class: 'story__pages', text: t.t('ui.page', { n: view.index + 1, total: view.total }) }),
      sheetId
        ? el('span', { class: 'story__pov', text: `${t.t('ui.playing')}: ${t.t(`sheet.${sheetId}.title`)}` })
        : el('span', { class: 'story__pov', text: `${t.t('ui.playing')}: ${t.t('pov.recruit')}` }),
    )

    // --- Prosa ------------------------------------------------------------
    clear(this.prose)
    const body = t.t(page.bodyKey, this.vars())
    this.prose.append(this.markCodex(body))
    for (const insertKey of view.inserts) {
      this.prose.append(el('div', { class: 'story__insert' }, this.markCodex(t.t(insertKey, this.vars()))))
    }
    this.pushBacklog(page.id, t.t(scene.titleKey), body)

    // --- Gespraechsknoten (aendern nie die naechste Szene) ----------------
    clear(this.extras)
    for (const iv of view.interactions) {
      if (iv.used) {
        this.extras.append(el('div', { class: 'interaction interaction--used' },
          el('p', { class: 'interaction__label', text: t.t(iv.interaction.labelKey) }),
          paragraphs(t.t(iv.interaction.responseKey, this.vars()), 'interaction__response'),
        ))
        continue
      }
      const button = btn(t.t(iv.interaction.labelKey, this.vars()), () => {
        this.host.dispatch(() => this.host.engine.interact(iv.interaction.id))
        this.render()
      }, {
        class: `interaction__btn${iv.locked ? ' interaction__btn--locked' : ''}`,
        'aria-disabled': iv.locked ? 'true' : 'false',
      })
      if (iv.locked && iv.interaction.lockHintKey) {
        button.title = t.t(iv.interaction.lockHintKey)
      }
      this.extras.append(button)
    }

    // --- Weiter oder Auswahl ---------------------------------------------
    clear(this.actions)
    if (!view.atExit) {
      this.actions.append(this.continueButton())
    } else {
      this.renderExit()
    }

    focus(this.prose)
  }

  // -- Ausgang ---------------------------------------------------------------

  private renderExit(): void {
    const { engine, t } = this.host
    const scene = engine.scene

    if (scene.exit.type === 'choice') {
      const list = el('ul', { class: 'choices', role: 'list' })
      for (const cv of engine.choices()) {
        const c = cv.choice
        const item = el('li', { class: 'choices__item' })
        const label = el('span', { class: 'choice__label', text: t.t(c.labelKey) })
        const marks = el('span', { class: 'choice__marks' })

        if (c.risk) {
          marks.append(el('span', {
            class: `choice__risk choice__risk--${c.risk}`,
            text: RISK_GLYPH[c.risk], title: t.t(`ui.risk.${c.risk}`), 'aria-label': t.t(`ui.risk.${c.risk}`),
          }))
        }
        if (c.check) {
          // Der Wert wird VOR der Probe gezeigt — nie im Nachhinein ueberraschen.
          const value = engine.activeStats[c.check.stat] ?? 0
          marks.append(el('span', {
            class: 'choice__check',
            text: t.t('ui.check', { stat: t.t(`stat.${c.check.stat}`), value, dc: c.check.dc }),
          }))
        }
        if (cv.played) {
          marks.append(el('span', { class: 'choice__played', text: t.t('ui.played') }))
          if (cv.knownOutcome) {
            marks.append(el('span', {
              class: 'choice__outcome',
              text: `${OUTCOME_GLYPH[cv.knownOutcome]} ${t.t(`ui.outcome.${cv.knownOutcome}`)}`,
            }))
          }
        }
        if (cv.locked) {
          marks.append(el('span', { class: 'choice__lock', text: `⊘ ${t.t(c.lockHintKey ?? 'ui.locked')}` }))
        }

        // Der Name wird explizit gesetzt: die Marken (Risiko, Probe, gespielt,
        // Sperre) gehoeren zur Bedeutung der Option und muessen mit vorgelesen
        // werden, nicht nur sichtbar danebenstehen.
        const spoken = [
          t.t(c.labelKey),
          c.risk && t.t(`ui.risk.${c.risk}`),
          cv.played && t.t('ui.played'),
          cv.locked && t.t(c.lockHintKey ?? 'ui.locked'),
        ].filter(Boolean).join(' · ')
        const button = btn('', () => this.pick(c), {
          class: `choice${cv.locked ? ' choice--locked' : ''}${cv.played ? ' choice--played' : ''}`,
          'aria-disabled': cv.locked ? 'true' : 'false',
          'aria-label': spoken,
        })
        button.append(label, marks)
        item.append(button)
        list.append(item)
      }
      this.actions.append(list)
      return
    }

    // `goto`, `gameover` und `ending` brauchen nur einen Schritt weiter.
    this.actions.append(this.continueButton())
  }

  private continueButton(): HTMLButtonElement {
    return btn(this.host.t.t('ui.next'), () => {
      this.host.dispatch(() => this.host.engine.next())
      this.render()
    }, { class: 'btn btn--primary story__next' })
  }

  private pick(choice: Choice): void {
    const { engine, t } = this.host
    const view = engine.choices().find(c => c.choice.id === choice.id)
    if (view?.locked) {
      this.host.dispatch(() => [{ kind: 'blocked', reason: 'locked' }])
      return
    }
    if (choice.confirm && this.pendingConfirm?.id !== choice.id) {
      // Zweite, in-fiction formulierte Rueckfrage: ein Tod ist immer zweimal gewaehlt.
      this.pendingConfirm = choice
      clear(this.actions)
      this.actions.append(
        el('p', { class: 'confirm__text', text: t.t(choice.confirmKey ?? 'ui.confirm') }),
        el('div', { class: 'confirm__row' },
          btn(t.t('ui.confirm'), () => this.pick(choice), { class: 'btn btn--danger' }),
          btn(t.t('ui.cancel'), () => { this.pendingConfirm = undefined; this.render() }, { class: 'btn' }),
        ),
      )
      return
    }
    this.pendingConfirm = undefined
    this.host.dispatch(() => engine.choose(choice.id))
    this.render()
  }

  // -- Codex-Verlinkung im Fliesstext ----------------------------------------

  /**
   * Markiert Eigennamen, zu denen es einen Codex-Eintrag gibt, und macht sie
   * antippbar. Das ist das Feature, das Malazan fuer Neulinge spielbar macht.
   * Es arbeitet auf Textknoten, damit nie HTML aus Prosa entsteht.
   */
  private markCodex(text: string): DocumentFragment {
    const { reg, t, engine } = this.host
    // NUR bereits freigeschaltete Eintraege werden markiert. Ein Verweis auf
    // etwas, das der Spieler noch nicht kennt, waere ein Spoiler und wuerde
    // ausserdem in einen leeren Codex fuehren.
    const known = reg.pack.codex
      .filter(c => engine.meta.codex.includes(c.id))
      .map(c => ({ id: c.id, title: t.t(c.titleKey), body: t.t(c.bodyKey) }))
      .filter(c => c.title.length > 3)
      .sort((a, b) => b.title.length - a.title.length)

    // Jeder Begriff wird auf einer Seite HOECHSTENS EINMAL markiert, beim
    // ersten Vorkommen. Vorher trug jede Wiederholung dieselbe Auszeichnung —
    // bei einem Ortsnamen, der in einem Absatz dreimal faellt, sieht der
    // Fliesstext dann aus wie eine Linksammlung und liest sich entsprechend.
    const used = new Set<string>()

    const frag = document.createDocumentFragment()
    let index = 0
    for (const part of text.split(/\n{2,}/)) {
      if (!part.trim()) continue
      // Dialog erkennt sich selbst am oeffnenden Anfuehrungszeichen — beide
      // Sprachen, beide Konventionen. Das kostet keine Auszeichnung in der
      // Prosa und wirkt trotzdem auf jeder Seite: Rede bekommt eine eigene
      // Farbe und einen Einzug, Erzaehltext bleibt ruhig.
      const speech = /^["\u201e\u201c\u00ab\u203a]/.test(part.trim())
      const p = el('p', { class: speech ? 'p p--speech' : 'p' })
      // Die Staffelung beim Einblenden: jeder Absatz ein Stueck spaeter.
      p.style.setProperty('--i', String(index++))
      let rest = part.trim()
      let guard = 0
      while (rest && guard++ < 400) {
        let best: { idx: number; entry: { id: string; title: string; body: string } } | undefined
        for (const entry of known) {
          if (used.has(entry.id)) continue
          const idx = rest.indexOf(entry.title)
          if (idx >= 0 && (!best || idx < best.idx)) best = { idx, entry }
        }
        if (!best) break
        used.add(best.entry.id)
        if (best.idx > 0) p.append(document.createTextNode(rest.slice(0, best.idx)))
        const mark = btn(best.entry.title, () => this.host.openCodex(best!.entry.id), { class: 'codex-link' })
        mark.setAttribute('aria-label', `${best.entry.title} — ${t.t('ui.codex')}`)
        // Der erste Satz des Eintrags als Kurzhinweis: Wer nur wissen will,
        // wer oder was das ist, soll dafuer die Seite nicht verlassen muessen.
        const teaser = best.entry.body.split(/(?<=[.!?])\s/)[0]?.trim()
        if (teaser) mark.title = teaser.length > 160 ? teaser.slice(0, 157) + '…' : teaser
        p.append(mark)
        rest = rest.slice(best.idx + best.entry.title.length)
      }
      if (rest) p.append(document.createTextNode(rest))
      frag.append(p)
    }
    return frag
  }

  // -- Rückschau -------------------------------------------------------------

  private pushBacklog(pageId: string, title: string, body: string): void {
    if (this.backlog.at(-1)?.pageId === pageId) return
    this.backlog.push({ pageId, title, body })
    while (this.backlog.length > BACKLOG_SIZE) this.backlog.shift()
  }

  backlogEntries(): readonly { pageId: string; title: string; body: string }[] {
    return this.backlog
  }

  // -- Tastatur --------------------------------------------------------------

  private onKey(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement) return
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      const next = this.actions.querySelector<HTMLButtonElement>('.story__next')
      if (next) { e.preventDefault(); next.click() }
    }
    if (e.key === 'ArrowLeft') {
      if (this.host.engine.back()) { e.preventDefault(); this.render() }
    }
    // Zifferntasten waehlen die entsprechende Option — Tastaturbedienung ohne Maus.
    const n = Number(e.key)
    if (n >= 1 && n <= 9) {
      const buttons = this.actions.querySelectorAll<HTMLButtonElement>('.choice')
      const target = buttons[n - 1]
      if (target) { e.preventDefault(); target.click() }
    }
  }
}

const RISK_GLYPH: Record<string, string> = {
  safe: '○', costly: '◔', dangerous: '◑', lethal: '●',
}

export const OUTCOME_GLYPH: Record<string, string> = {
  death: '💀', captured: '⛓', toolate: '⏳', lore: '🔍', loop: '↩', progress: '★', ending: '✦',
}
