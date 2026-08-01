/**
 * Die Nebenansichten: Marginalien (Codex), Figur (Charakterbogen), Nachlesen
 * und Einstellungen. Alle als Dialog ueber dem Lese-View, alle mit Tastatur
 * bedienbar und mit Fokusfalle.
 */

import type { Engine } from '../core/engine.ts'
import type { I18n } from '../core/i18n.ts'
import type { Registry } from '../model/registry.ts'
import type { ProfileSettings } from '../model/state.ts'
import type { Lang, StatId } from '../model/types.ts'
import { STAT_IDS } from '../model/types.ts'
import { sigilGlyph } from './title.ts'
import { illustration } from '../core/placeholder.ts'
import { btn, clear, el, focus } from './dom.ts'
import { GAME_VERSION } from '../core/version.ts'

export class Dialog {
  readonly root: HTMLElement
  private readonly titleNode = el('h2', { class: 'dialog__title', id: 'dialog-title' })
  private readonly bodyNode = el('div', { class: 'dialog__body' })
  private lastFocus: HTMLElement | null = null

  constructor(private readonly t: I18n) {
    this.root = el('div', {
      class: 'dialog', role: 'dialog', 'aria-modal': 'true',
      'aria-labelledby': 'dialog-title', hidden: true,
    },
      el('div', { class: 'dialog__panel' },
        el('header', { class: 'dialog__head' },
          this.titleNode,
          btn(this.t.t('ui.close'), () => this.close(), { class: 'dialog__close', 'aria-label': this.t.t('ui.close') }),
        ),
        this.bodyNode,
      ),
    )
    this.root.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); this.close() }
      if (e.key === 'Tab') this.trap(e)
    })
    this.root.addEventListener('click', e => { if (e.target === this.root) this.close() })
  }

  open(title: string, build: (body: HTMLElement) => void): void {
    this.lastFocus = document.activeElement as HTMLElement | null
    this.titleNode.textContent = title
    clear(this.bodyNode)
    build(this.bodyNode)
    this.root.hidden = false
    focus(this.root.querySelector<HTMLElement>('.dialog__close'))
  }

  close(): void {
    this.root.hidden = true
    focus(this.lastFocus)
  }

  get isOpen(): boolean { return !this.root.hidden }

  private trap(e: KeyboardEvent): void {
    const focusables = [...this.root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )].filter(n => !n.hasAttribute('disabled'))
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables.at(-1)!
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); focus(last) }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); focus(first) }
  }
}

// ---------------------------------------------------------------------------

export function buildCodex(body: HTMLElement, reg: Registry, engine: Engine, t: I18n, openId?: string): void {
  const known = reg.pack.codex.filter(c => engine.meta.codex.includes(c.id))
  if (!known.length) {
    body.append(el('p', { class: 'muted', text: t.t('ui.noFlags') }))
    return
  }

  // Vorher standen alle Kategorien untereinander, jede Ueberschrift gefolgt von
  // allen Eintraegen. Bei 20 Eintraegen schon unuebersichtlich, bei den 60+
  // eines fertigen Buches unbrauchbar. Jetzt filtert man, statt zu scrollen.
  const categories = [...new Set(known.map(c => c.category))]
  const counts = new Map(categories.map(c => [c, known.filter(k => k.category === c).length]))

  let filter: string | null = null
  let query = ''

  const bar = el('div', { class: 'filterbar', role: 'group', 'aria-label': t.t('ui.codex') })
  const search = el('input', {
    class: 'filterbar__search', type: 'search',
    placeholder: t.t('ui.search'), 'aria-label': t.t('ui.search'),
  }) as HTMLInputElement
  const list = el('div', { class: 'codex__list' })

  const chips = new Map<string | null, HTMLElement>()
  const addChip = (id: string | null, label: string, n: number) => {
    const b = btn(`${label} ${n}`, () => { filter = id; render() }, {
      class: 'chip chip--filter', role: 'radio', 'aria-checked': String(filter === id),
    })
    chips.set(id, b)
    bar.append(b)
  }
  addChip(null, t.t('ui.all'), known.length)
  for (const c of categories) addChip(c, t.t(`codex.cat.${c}`), counts.get(c) ?? 0)

  function render(): void {
    for (const [id, node] of chips) node.setAttribute('aria-checked', String(filter === id))
    clear(list)
    const q = query.trim().toLowerCase()
    const shown = known.filter(c => (!filter || c.category === filter) && (
      !q || t.t(c.titleKey).toLowerCase().includes(q) || t.t(c.bodyKey).toLowerCase().includes(q)
    ))
    if (!shown.length) { list.append(el('p', { class: 'muted', text: t.t('ui.noMatch') })); return }

    for (const entry of shown) {
      const details = el('details', { class: 'codex__entry', open: entry.id === openId || shown.length === 1 })
      details.append(el('summary', { class: 'codex__summary', text: t.t(entry.titleKey) }))

      const inner = el('div', { class: 'codex__inner' })
      // Das Bild kommt aus den Seiten-Illustrationen — ein Eintrag ueber
      // Malaz-Stadt braucht kein zweites Bild von Malaz-Stadt. Faellt still
      // weg, wenn die Datei fehlt: In einem halb bebilderten Buch ist ein
      // kaputtes Bildsymbol schlimmer als gar keins.
      if (entry.art) {
        const art = illustration(entry.art, import.meta.env.BASE_URL)
        const img = el('img', {
          class: 'codex__art', alt: '', loading: 'lazy', decoding: 'async', src: art.src,
        }) as HTMLImageElement
        img.onerror = () => img.remove()
        inner.append(img)
      }
      inner.append(el('p', { class: 'codex__body', text: t.t(entry.bodyKey) }))

      const seeKnown = (entry.see ?? []).filter(id => engine.meta.codex.includes(id))
      if (seeKnown.length) {
        const row = el('p', { class: 'codex__see' })
        for (const id of seeKnown) {
          const ref = reg.codex(id)
          if (ref) row.append(el('span', { class: 'codex__ref', text: t.t(ref.titleKey) }))
        }
        inner.append(row)
      }
      details.append(inner)
      list.append(details)
    }
  }

  search.addEventListener('input', () => { query = search.value; render() })
  body.append(bar, search, list)
  render()
}

/**
 * Farbe je Herkunft. Sie traegt das Wappen, die Werte-Balken und den Rand des
 * Kopfbereichs — so hat jedes Profil auf den ersten Blick ein eigenes Gesicht,
 * ohne dass ein einziges Bild noetig waere.
 */
const BACKGROUND_HUE: Record<string, string> = {
  marine: '#8C5A3C',
  sapper: '#6E7679',
  mage: '#4C4A78',
}

/** Wappen statt Portraet: Zeichen-Glyph auf der Farbe der Herkunft. */
function crest(profile: { sigil: string; background: string; name: string }): HTMLElement {
  const hue = BACKGROUND_HUE[profile.background] ?? '#4C4A78'
  const box = el('div', { class: 'crest', style: `--crest:${hue}` })
  box.append(
    el('span', { class: 'crest__glyph', text: sigilGlyph(profile.sigil) }),
    el('span', { class: 'crest__initial', text: (profile.name[0] ?? '?').toUpperCase() }),
  )
  return box
}

/**
 * Reiter. Ein Zustand, eine Darstellung: Der sichtbare Bereich haengt an
 * `aria-selected`, nicht an einer zweiten Klasse — dieselbe Regel wie bei den
 * Auswahl-Chips, und aus demselben Grund.
 */
function tabs(body: HTMLElement, panels: { id: string; label: string; count?: number; build: (el: HTMLElement) => void }[]): void {
  const bar = el('div', { class: 'tabs', role: 'tablist' })
  const host = el('div', { class: 'tabs__body' })
  const nodes = new Map<string, HTMLElement>()

  for (const panel of panels) {
    const pane = el('div', { class: 'tabs__pane', role: 'tabpanel', id: `pane-${panel.id}` })
    panel.build(pane)
    nodes.set(panel.id, pane)
    host.append(pane)

    const label = panel.count === undefined ? panel.label : `${panel.label} ${panel.count}`
    const b = btn(label, () => select(panel.id), {
      class: 'tabs__tab', role: 'tab', 'aria-selected': 'false', 'aria-controls': `pane-${panel.id}`,
    })
    bar.append(b)
  }

  function select(id: string): void {
    for (const tab of bar.children) {
      tab.setAttribute('aria-selected', String(tab.getAttribute('aria-controls') === `pane-${id}`))
    }
    for (const [key, pane] of nodes) pane.hidden = key !== id
  }

  body.append(bar, host)
  select(panels[0]!.id)
}

/** Ein Wert als Balken mit Zahl — lesbar auch ohne Farbe. */
function statRow(name: string, hint: string, value: number, max: number, warn = false): HTMLElement {
  const row = el('div', { class: `statline${warn ? ' statline--warn' : ''}`, title: hint })
  row.append(
    el('span', { class: 'statline__name', text: name }),
    el('span', { class: 'statline__track' },
      el('span', { class: 'statline__fill', style: `--v:${Math.max(0, Math.min(1, value / max)) * 100}%` }),
    ),
    el('span', { class: 'statline__value', text: String(value) }),
  )
  return row
}

export function buildSheet(body: HTMLElement, reg: Registry, engine: Engine, t: I18n): void {
  const run = engine.run
  const sheetId = engine.currentSheetId
  const stats = engine.activeStats
  const profile = engine.save.profile

  // --- Kopf: wer, was, wie weit ------------------------------------------
  const head = el('div', { class: 'sheet__head' })
  head.append(crest(profile))
  const who = el('div', { class: 'sheet__who' })
  who.append(
    el('h3', { class: 'sheet__name', text: sheetId ? t.t(`sheet.${sheetId}.title`) : profile.name }),
    el('p', { class: 'sheet__origin', text: sheetId ? t.t('ui.playing') : t.t(`bg.${profile.background}`) }),
    el('div', { class: 'sheet__facts' },
      el('span', { class: 'fact' }, el('b', { text: String(run.level) }), ' ', t.t('ui.levelWord')),
      el('span', { class: 'fact' }, el('b', { text: String(run.xp) }), ' ', t.t('ui.xp')),
      el('span', { class: 'fact' }, el('b', { text: String(run.coin) }), ' ', t.t('ui.coin')),
      el('span', { class: 'fact' }, el('b', { text: formatTime(run.playtimeMs) })),
    ),
  )
  head.append(who)
  body.append(head)

  // --- Reiter -------------------------------------------------------------
  const itemIds = Object.keys(run.items)
  const activeFlags = Object.entries(run.flags).filter(([, v]) => v).map(([k]) => k)

  tabs(body, [
    {
      id: 'stats',
      label: t.t('ui.statsTab'),
      build: pane => {
        const grid = el('div', { class: 'statgrid' })
        for (const id of STAT_IDS as readonly StatId[]) {
          grid.append(statRow(t.t(`stat.${id}`), t.t(`stat.${id}.hint`), stats[id] ?? 0, 10))
        }
        pane.append(grid)
        // Aufmerksamkeit steht abgesetzt: Sie ist kein Wert, den man steigern
        // will, sondern der Preis fuer Fuegung.
        pane.append(el('div', { class: 'statgrid statgrid--single' },
          statRow(t.t('stat.attention'), t.t('stat.attention.hint'), run.attention, 20, true)))
      },
    },
    {
      id: 'talents',
      label: t.t('ui.talents'),
      count: run.talents.length,
      build: pane => {
        if (!run.talents.length) { pane.append(el('p', { class: 'muted', text: t.t('ui.noItems') })); return }
        for (const id of run.talents) {
          const def = reg.talent(id)
          if (!def) continue
          pane.append(el('div', { class: 'card' },
            el('b', { text: t.t(def.titleKey) }),
            el('p', { class: 'card__body', text: t.t(def.effectKey) }),
          ))
        }
      },
    },
    {
      id: 'items',
      label: t.t('ui.items'),
      count: itemIds.length,
      build: pane => {
        if (!itemIds.length) { pane.append(el('p', { class: 'muted', text: t.t('ui.noItems') })); return }
        for (const id of itemIds) {
          const def = reg.item(id)
          pane.append(el('div', { class: 'card' },
            el('b', { text: def ? t.t(def.titleKey) : id }),
            el('span', { class: 'card__count', text: `×${run.items[id]}` }),
          ))
        }
      },
    },
    {
      id: 'marks',
      label: t.t('ui.flags'),
      count: activeFlags.length,
      build: pane => {
        if (!activeFlags.length) { pane.append(el('p', { class: 'muted', text: t.t('ui.noFlags') })); return }
        // Merkmale im Klartext — nie als Balken, nie als Herzchen.
        for (const flag of activeFlags) pane.append(el('p', { class: 'sheet__flag', text: t.t(`flag.${flag}`) }))
      },
    },
    {
      id: 'cards',
      label: t.t('ui.cards'),
      count: engine.meta.cards.length,
      build: pane => {
        if (!engine.meta.cards.length) { pane.append(el('p', { class: 'muted', text: t.t('ui.noItems') })); return }
        for (const id of engine.meta.cards) {
          const def = reg.card(id)
          if (!def) continue
          pane.append(el('div', { class: 'card' },
            el('b', { text: t.t(def.titleKey) }),
            el('p', { class: 'card__body', text: t.t(def.bodyKey) }),
          ))
        }
      },
    },
  ])
}

export function buildBacklog(
  body: HTMLElement,
  entries: readonly { pageId: string; title: string; body: string }[],
  t: I18n,
): void {
  if (!entries.length) { body.append(el('p', { class: 'muted', text: t.t('ui.noItems') })); return }
  for (const entry of [...entries].reverse()) {
    const details = el('details', { class: 'backlog__entry' })
    details.append(
      el('summary', { text: `${entry.title} · ${entry.pageId.split('.').at(-1)}` }),
      el('p', { class: 'backlog__body', text: entry.body }),
    )
    body.append(details)
  }
}

export interface SettingsHost {
  settings: ProfileSettings
  t: I18n
  onChange(next: ProfileSettings): void
  onLang(lang: Lang): void
  showContentWarning(): void
  buildId: string
}

export function buildSettings(body: HTMLElement, host: SettingsHost): void {
  const { t } = host
  const s = host.settings
  const update = (patch: Partial<ProfileSettings>) => host.onChange({ ...host.settings, ...patch })

  body.append(row(t.t('ui.settings.lang'), select(
    [['de', 'Deutsch'], ['en', 'English']], s.lang, v => host.onLang(v as Lang),
  )))
  body.append(row(t.t('ui.settings.fontScale'), range(0.8, 1.6, 0.05, s.fontScale, v => update({ fontScale: v }))))
  body.append(row(t.t('ui.settings.lineWidth'), select(
    [['narrow', '45'], ['normal', '60'], ['wide', '75']], s.lineWidth,
    v => update({ lineWidth: v as ProfileSettings['lineWidth'] }),
  )))
  body.append(row(t.t('ui.settings.serif'), toggle(s.serif, v => update({ serif: v }))))
  body.append(row(t.t('ui.settings.dyslexic'), toggle(s.dyslexic, v => update({ dyslexic: v }))))
  body.append(row(t.t('ui.settings.contrast'), toggle(s.contrast === 'high', v => update({ contrast: v ? 'high' : 'normal' }))))
  body.append(row(t.t('ui.settings.reduceMotion'), toggle(s.reduceMotion, v => update({ reduceMotion: v }))))
  body.append(row(t.t('ui.settings.textSpeed'), select(
    [['instant', '∞'], ['fast', '»'], ['slow', '›']], s.textSpeed,
    v => update({ textSpeed: v as ProfileSettings['textSpeed'] }),
  )))
  body.append(row(t.t('ui.settings.autoAdvance'), toggle(s.autoAdvance, v => update({ autoAdvance: v }))))
  body.append(row(t.t('ui.settings.mute'), toggle(s.muted, v => update({ muted: v }))))
  body.append(row(t.t('ui.settings.volume'), range(0, 1, 0.05, s.volume, v => update({ volume: v }))))

  body.append(btn(t.t('ui.contentWarning'), () => host.showContentWarning(), { class: 'btn' }))
  body.append(el('p', { class: 'settings__version', text: `${t.t('ui.settings.version')}: v${GAME_VERSION} · ${host.buildId}` }))
  body.append(el('p', { class: 'settings__disclaimer', text: t.t('ui.disclaimer') }))
}

function row(label: string, control: HTMLElement): HTMLElement {
  const id = `set-${label.replace(/\W+/g, '-').toLowerCase()}`
  control.id = id
  return el('div', { class: 'settings__row' }, el('label', { for: id, text: label }), control)
}

function toggle(value: boolean, onChange: (v: boolean) => void): HTMLElement {
  const input = el('input', { type: 'checkbox', class: 'settings__toggle' })
  input.checked = value
  input.addEventListener('change', () => onChange(input.checked))
  return input
}

function range(min: number, max: number, step: number, value: number, onChange: (v: number) => void): HTMLElement {
  const input = el('input', { type: 'range', min, max, step, class: 'settings__range' })
  input.value = String(value)
  input.addEventListener('input', () => onChange(Number(input.value)))
  return input
}

function select(options: [string, string][], value: string, onChange: (v: string) => void): HTMLElement {
  const node = el('select', { class: 'settings__select' })
  for (const [v, label] of options) {
    const opt = el('option', { value: v, text: label })
    if (v === value) opt.selected = true
    node.append(opt)
  }
  node.addEventListener('change', () => onChange(node.value))
  return node
}

export function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return h > 0 ? `${h} h ${m} min` : `${m} min`
}
