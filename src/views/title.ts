/**
 * Startbildschirm und Profilanlage. Vor allem anderen: vier Plaetze, jeder mit
 * eigenem Spielstand, eigenem Wissen und eigener Sprache.
 */

import type { I18n } from '../core/i18n.ts'
import type { Background, Lang } from '../model/types.ts'
import { BACKGROUNDS } from '../model/types.ts'
import type { Profile } from '../model/state.ts'
import { btn, clear, el } from './dom.ts'
import { GAME_VERSION } from '../core/version.ts'
import { placeholderDataUri } from '../core/placeholder.ts'

export interface ProfileSlot {
  id: string
  profile?: Profile
  /** Anteil gelesener Seiten, 0..1. */
  completion: number
}

export interface TitleHost {
  t: I18n
  slots(): ProfileSlot[]
  onContinue(id: string): void
  onCreate(id: string, input: { name: string; background: Background; pronouns: Profile['pronouns']; sigil: string }): void
  onDelete(id: string): void
  onExport(id: string): void
  onImport(file: File): void
  onLang(lang: Lang): void
  lang: Lang
  buildId: string
}

const SIGILS = ['obelisk', 'crown', 'sceptre', 'orb', 'rope', 'chain']

export class TitleView {
  readonly root: HTMLElement
  private readonly slotHost = el('div', { class: 'title__slots' })

  constructor(private readonly host: TitleHost) {
    this.root = el('main', { class: 'title' },
      el('img', {
        class: 'title__art', alt: '',
        src: placeholderDataUri({ id: 'title-screen', mood: 'divine', palette: 'moons-spawn' }),
      }),
      el('div', { class: 'title__inner' },
        el('h1', { class: 'title__h1', text: host.t.t('ui.title') }),
        el('p', { class: 'title__sub', text: host.t.t('ui.subtitle') }),
        this.slotHost,
        el('footer', { class: 'title__foot' },
          el('span', { class: 'title__version', text: `v${GAME_VERSION} · ${host.buildId}` }),
          el('p', { class: 'title__disclaimer', text: host.t.t('ui.disclaimer') }),
        ),
      ),
    )
  }

  render(): void {
    const { t } = this.host
    clear(this.slotHost)
    for (const slot of this.host.slots()) {
      this.slotHost.append(slot.profile ? this.filled(slot) : this.empty(slot))
    }
    const langRow = el('div', { class: 'title__lang' })
    for (const lang of ['de', 'en'] as Lang[]) {
      langRow.append(btn(lang.toUpperCase(), () => this.host.onLang(lang), {
        class: `chip${this.host.lang === lang ? ' chip--on' : ''}`,
        'aria-pressed': this.host.lang === lang ? 'true' : 'false',
      }))
    }
    const importInput = el('input', { type: 'file', accept: '.json', class: 'sr-only', id: 'import-file' })
    importInput.addEventListener('change', () => {
      const file = importInput.files?.[0]
      if (file) this.host.onImport(file)
    })
    this.slotHost.append(el('div', { class: 'title__tools' },
      langRow,
      el('label', { class: 'btn', for: 'import-file', text: t.t('ui.import') }),
      importInput,
    ))
  }

  private filled(slot: ProfileSlot): HTMLElement {
    const { t } = this.host
    const p = slot.profile!
    return el('section', { class: 'slot slot--filled' },
      el('span', { class: 'slot__sigil', 'aria-hidden': 'true', text: sigilGlyph(p.sigil) }),
      el('h2', { class: 'slot__name', text: p.name }),
      el('p', { class: 'slot__meta', text: `${t.t(`bg.${p.background}`)} · ${Math.round(slot.completion * 100)} %` }),
      el('div', { class: 'slot__row' },
        btn(t.t('ui.continue'), () => this.host.onContinue(slot.id), { class: 'btn btn--primary' }),
        btn(t.t('ui.export'), () => this.host.onExport(slot.id), { class: 'btn' }),
        btn(t.t('ui.deleteProfile'), () => this.confirmDelete(slot.id), { class: 'btn btn--quiet' }),
      ),
    )
  }

  private confirmDelete(id: string): void {
    const { t } = this.host
    // Zweimal fragen — ein Profil ist Stunden Lesezeit.
    if (!window.confirm(t.t('ui.deleteConfirm'))) return
    if (!window.confirm(t.t('ui.deleteConfirm2'))) return
    this.host.onDelete(id)
  }

  private empty(slot: ProfileSlot): HTMLElement {
    const { t } = this.host
    const section = el('section', { class: 'slot slot--empty' })
    const open = btn(t.t('ui.newProfile'), () => {
      clear(section)
      section.append(this.form(slot.id))
    }, { class: 'btn btn--primary' })
    section.append(el('span', { class: 'slot__sigil slot__sigil--empty', 'aria-hidden': 'true', text: '·' }), open)
    return section
  }

  private form(id: string): HTMLElement {
    const { t } = this.host
    const name = el('input', { type: 'text', maxlength: 24, class: 'field', id: `name-${id}` })
    name.value = ''
    let background: Background = 'marine'
    let pronouns: Profile['pronouns'] = 'they'
    let sigil = SIGILS[0]

    const bgRow = el('div', { class: 'field__row', role: 'radiogroup', 'aria-label': t.t('ui.background') })
    const bgButtons = new Map<Background, HTMLButtonElement>()
    for (const bg of BACKGROUNDS) {
      const b = btn('', () => {
        background = bg
        for (const [k, node] of bgButtons) node.setAttribute('aria-checked', String(k === bg))
      }, {
        class: 'bgcard', role: 'radio', 'aria-checked': String(bg === background),
        // Der Knopf traegt Ueberschrift + Beschreibung als Kinder; der Name wird
        // deshalb explizit gesetzt statt aus dem Inhalt errechnet.
        'aria-label': `${t.t(`bg.${bg}`)} — ${t.t(`bg.${bg}.desc`)}`,
      })
      b.append(
        el('strong', { text: t.t(`bg.${bg}`) }),
        el('span', { class: 'bgcard__desc', text: t.t(`bg.${bg}.desc`) }),
      )
      bgButtons.set(bg, b)
      bgRow.append(b)
    }

    const pronounRow = el('div', { class: 'field__row', role: 'radiogroup', 'aria-label': t.t('ui.pronouns') })
    const prButtons = new Map<string, HTMLButtonElement>()
    for (const p of ['she', 'he', 'they'] as const) {
      const b = btn(t.t(`ui.pronouns.${p}`), () => {
        pronouns = p
        for (const [k, node] of prButtons) node.setAttribute('aria-checked', String(k === p))
      }, { class: 'chip', role: 'radio', 'aria-checked': String(p === pronouns) })
      prButtons.set(p, b)
      pronounRow.append(b)
    }

    const sigilRow = el('div', { class: 'field__row', role: 'radiogroup', 'aria-label': t.t('ui.sigil') })
    const sgButtons = new Map<string, HTMLButtonElement>()
    for (const s of SIGILS) {
      const b = btn(sigilGlyph(s), () => {
        sigil = s
        for (const [k, node] of sgButtons) node.setAttribute('aria-checked', String(k === s))
      }, {
        class: 'chip chip--sigil', role: 'radio', 'aria-checked': String(s === sigil),
        'aria-label': `${t.t('ui.sigil')}: ${s}`,
      })
      sgButtons.set(s, b)
      sigilRow.append(b)
    }

    return el('form', { class: 'newprofile' },
      el('label', { for: `name-${id}`, text: t.t('ui.name') }), name,
      el('p', { class: 'field__label', text: t.t('ui.pronouns') }), pronounRow,
      el('p', { class: 'field__label', text: t.t('ui.background') }), bgRow,
      el('p', { class: 'field__label', text: t.t('ui.sigil') }), sigilRow,
      btn(t.t('ui.start'), () => {
        this.host.onCreate(id, { name: name.value.trim() || t.t('pov.recruit'), background, pronouns, sigil })
      }, { class: 'btn btn--primary' }),
    )
  }
}

export function sigilGlyph(id: string): string {
  const map: Record<string, string> = {
    obelisk: '⌂', crown: '♛', sceptre: '⚕', orb: '◉', rope: '∞', chain: '⛓',
  }
  return map[id] ?? '◆'
}
