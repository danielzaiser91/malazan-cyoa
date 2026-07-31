/**
 * Die Nebenansichten: Marginalien (Codex), Blatt (Charakterbogen), Rückschau
 * und Einstellungen. Alle als Dialog ueber dem Lese-View, alle mit Tastatur
 * bedienbar und mit Fokusfalle.
 */

import type { Engine } from '../core/engine.ts'
import type { I18n } from '../core/i18n.ts'
import type { Registry } from '../model/registry.ts'
import type { ProfileSettings } from '../model/state.ts'
import type { Lang, StatId } from '../model/types.ts'
import { STAT_IDS } from '../model/types.ts'
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
  const byCategory = new Map<string, typeof known>()
  for (const entry of known) {
    const list = byCategory.get(entry.category) ?? []
    list.push(entry)
    byCategory.set(entry.category, list)
  }
  for (const [category, entries] of byCategory) {
    body.append(el('h3', { class: 'codex__cat', text: t.t(`codex.cat.${category}`) }))
    for (const entry of entries) {
      const open = entry.id === openId
      const details = el('details', { class: 'codex__entry', open })
      details.append(
        el('summary', { class: 'codex__summary', text: t.t(entry.titleKey) }),
        el('p', { class: 'codex__body', text: t.t(entry.bodyKey) }),
      )
      const seeKnown = (entry.see ?? []).filter(id => engine.meta.codex.includes(id))
      if (seeKnown.length) {
        const row = el('p', { class: 'codex__see' })
        for (const id of seeKnown) {
          const ref = reg.codex(id)
          if (ref) row.append(el('span', { class: 'codex__ref', text: t.t(ref.titleKey) }))
        }
        details.append(row)
      }
      body.append(details)
    }
  }
}

export function buildSheet(body: HTMLElement, reg: Registry, engine: Engine, t: I18n): void {
  const run = engine.run
  const sheetId = engine.currentSheetId
  const stats = engine.activeStats

  body.append(el('p', { class: 'sheet__who' },
    `${t.t('ui.playing')}: `,
    el('strong', { text: sheetId ? t.t(`sheet.${sheetId}.title`) : t.t('pov.recruit') }),
  ))

  const grid = el('dl', { class: 'sheet__stats' })
  for (const id of STAT_IDS as readonly StatId[]) {
    grid.append(
      el('dt', { class: 'sheet__statName', title: t.t(`stat.${id}.hint`) }, t.t(`stat.${id}`)),
      el('dd', { class: 'sheet__statValue' },
        el('span', { class: 'sheet__bar', style: `--v:${Math.min(10, stats[id] ?? 0)}` }),
        el('span', { text: String(stats[id] ?? 0) }),
      ),
    )
  }
  grid.append(
    el('dt', { class: 'sheet__statName', title: t.t('stat.attention.hint') }, t.t('stat.attention')),
    el('dd', { class: 'sheet__statValue' },
      el('span', { class: 'sheet__bar sheet__bar--warn', style: `--v:${Math.min(20, run.attention)}` }),
      el('span', { text: String(run.attention) }),
    ),
  )
  body.append(grid)

  body.append(el('p', { class: 'sheet__line' },
    `${t.t('ui.level', { n: run.level })} · ${t.t('ui.xp')} ${run.xp} · ${t.t('ui.coin')} ${run.coin} · ` +
    `${t.t('ui.playtime')} ${formatTime(run.playtimeMs)}`,
  ))

  body.append(el('h3', { text: t.t('ui.talents') }))
  if (!run.talents.length) body.append(el('p', { class: 'muted', text: t.t('ui.noItems') }))
  for (const id of run.talents) {
    const def = reg.talent(id)
    if (!def) continue
    body.append(el('p', { class: 'sheet__talent' },
      el('strong', { text: t.t(def.titleKey) }), ' — ', t.t(def.effectKey),
    ))
  }

  body.append(el('h3', { text: t.t('ui.items') }))
  const itemIds = Object.keys(run.items)
  if (!itemIds.length) body.append(el('p', { class: 'muted', text: t.t('ui.noItems') }))
  for (const id of itemIds) {
    const def = reg.item(id)
    body.append(el('p', { class: 'sheet__item' },
      el('strong', { text: def ? t.t(def.titleKey) : id }), ` ×${run.items[id]}`,
    ))
  }

  // Flags im Klartext — nie als Balken, nie als Herzchen.
  body.append(el('h3', { text: t.t('ui.flags') }))
  const active = Object.entries(run.flags).filter(([, v]) => v).map(([k]) => k)
  if (!active.length) body.append(el('p', { class: 'muted', text: t.t('ui.noFlags') }))
  for (const flag of active) body.append(el('p', { class: 'sheet__flag', text: t.t(`flag.${flag}`) }))

  body.append(el('h3', { text: t.t('ui.cardsFound', { n: engine.meta.cards.length, total: reg.pack.cards.length }) }))
  for (const id of engine.meta.cards) {
    const def = reg.card(id)
    if (!def) continue
    body.append(el('p', { class: 'sheet__card' },
      el('strong', { text: t.t(def.titleKey) }), ' — ', t.t(def.bodyKey),
    ))
  }
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
