/**
 * "Die Auslegung" — der Flowchart. Rendert AUSSCHLIESSLICH das Ansichtsmodell
 * aus `core/reading.ts`; dieser View hat keinen Zugriff auf den Content und
 * kann den Spoiler-Vertrag deshalb gar nicht brechen.
 *
 * Zwei gleichwertige Darstellungen: SVG-Karte und Textliste. Die Liste ist
 * nicht nur Barrierefreiheit, sie ist auf einem schmalen Telefon die bessere.
 */

import type { Reading, ReadingCard } from '../core/reading.ts'
import type { I18n } from '../core/i18n.ts'
import { btn, clear, el } from './dom.ts'
import { OUTCOME_GLYPH } from './story.ts'

export type ReadingFilter = 'all' | 'unvisited' | 'deadends' | 'side' | 'chapter'

export interface ReadingHost {
  t: I18n
  reading(): Reading
  currentChapter(): string
  coverage(): { pagesRead: number; pagesTotal: number; endingsFound: number; endingsTotal: number; cardsFound: number; cardsTotal: number; codexFound: number; codexTotal: number }
  /** Sprungziel; der Host stellt die Rueckfrage und rollt zurueck. */
  requestJump(sceneId: string): void
  reduceMotion: boolean
}

const COL_W = 220
const ROW_H = 96
const CARD_W = 168
const CARD_H = 68

export class ReadingView {
  readonly root: HTMLElement
  private readonly host: ReadingHost
  private readonly canvas = el('div', { class: 'reading__canvas' })
  private readonly detail = el('aside', { class: 'reading__detail', 'aria-live': 'polite' })
  private readonly bar = el('div', { class: 'reading__bar' })
  private filter: ReadingFilter = 'all'
  private mode: 'chart' | 'list' = 'chart'

  constructor(host: ReadingHost) {
    this.host = host
    this.root = el('section', { class: 'reading', 'aria-label': host.t.t('ui.reading') },
      this.bar, this.canvas, this.detail,
    )
  }

  render(): void {
    const { t } = this.host
    const reading = this.host.reading()
    const cov = this.host.coverage()

    // --- Kopfleiste: Filter, Ansicht, Abdeckung ---------------------------
    clear(this.bar)
    const filters: ReadingFilter[] = ['all', 'unvisited', 'deadends', 'side', 'chapter']
    const group = el('div', { class: 'reading__filters', role: 'group', 'aria-label': t.t('ui.filter.all') })
    for (const f of filters) {
      group.append(btn(t.t(`ui.filter.${f}`), () => { this.filter = f; this.render() }, {
        class: `chip${this.filter === f ? ' chip--on' : ''}`,
        'aria-pressed': this.filter === f ? 'true' : 'false',
      }))
    }
    this.bar.append(
      group,
      btn(t.t(this.mode === 'chart' ? 'ui.listView' : 'ui.chartView'), () => {
        this.mode = this.mode === 'chart' ? 'list' : 'chart'
        this.render()
      }, { class: 'chip' }),
      el('p', { class: 'reading__coverage' },
        el('span', { text: t.t('ui.coverage', { read: cov.pagesRead, total: cov.pagesTotal }) }),
        el('span', { text: t.t('ui.endingsFound', { n: cov.endingsFound, total: cov.endingsTotal }) }),
        el('span', { text: t.t('ui.cardsFound', { n: cov.cardsFound, total: cov.cardsTotal }) }),
        el('span', { text: t.t('ui.codexFound', { n: cov.codexFound, total: cov.codexTotal }) }),
      ),
    )

    clear(this.canvas)
    clear(this.detail)
    const cards = reading.cards.filter(c => this.matches(c, reading))
    this.canvas.append(this.mode === 'chart' ? this.chart(reading, cards) : this.list(reading, cards))
  }

  private matches(card: ReadingCard, reading: Reading): boolean {
    switch (this.filter) {
      case 'all': return true
      case 'unvisited': return card.state === 'rumoured' || card.state === 'locked'
      case 'deadends': return card.outcome !== undefined && card.outcome !== 'progress' && card.outcome !== 'ending'
      case 'side': return card.kind === 'side' || card.kind === 'branch'
      case 'chapter': return card.chapter === this.host.currentChapter() && reading.book === reading.book
    }
  }

  // -- SVG-Karte -------------------------------------------------------------

  private chart(reading: Reading, cards: ReadingCard[]): SVGSVGElement {
    const { t } = this.host
    const cols = reading.columns.length || 1
    const rows = Math.max(1, ...cards.map(c => c.row + 1))
    const width = cols * COL_W + 40
    const height = rows * ROW_H + 90
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))
    svg.setAttribute('role', 'group')
    svg.setAttribute('aria-label', t.t('ui.reading'))
    svg.classList.add('chart')

    const pos = new Map<string, { x: number; y: number }>()
    for (const c of cards) {
      pos.set(c.id, { x: 20 + c.column * COL_W, y: 70 + c.row * ROW_H })
    }

    // Kapitelspalten
    for (const col of reading.columns) {
      const x = 20 + col.order * COL_W
      const head = document.createElementNS(ns, 'text')
      head.setAttribute('x', String(x))
      head.setAttribute('y', '34')
      head.setAttribute('class', 'chart__col')
      head.setAttribute('fill', col.accent)
      head.textContent = t.t(col.titleKey)
      svg.append(head)
    }

    // Kanten zuerst, damit die Karten darauf liegen
    for (const edge of reading.edges) {
      const a = pos.get(edge.from)
      const b = pos.get(edge.to)
      if (!a || !b) continue
      const path = document.createElementNS(ns, 'path')
      const x1 = a.x + CARD_W, y1 = a.y + CARD_H / 2
      const x2 = b.x, y2 = b.y + CARD_H / 2
      const mid = (x1 + x2) / 2
      path.setAttribute('d', `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`)
      path.setAttribute('class', `chart__edge chart__edge--${edge.style}`)
      svg.append(path)
    }

    for (const card of cards) {
      const p = pos.get(card.id)!
      const g = document.createElementNS(ns, 'g')
      g.setAttribute('transform', `translate(${p.x} ${p.y})`)
      g.setAttribute('class', `chart__card chart__card--${card.state}${card.kind ? ` chart__card--${card.kind}` : ''}`)

      const rect = document.createElementNS(ns, 'rect')
      rect.setAttribute('width', String(CARD_W))
      rect.setAttribute('height', String(CARD_H))
      rect.setAttribute('rx', '6')
      g.append(rect)

      if (card.titleKey) {
        const code = document.createElementNS(ns, 'text')
        code.setAttribute('x', '10'); code.setAttribute('y', '20')
        code.setAttribute('class', 'chart__code')
        code.textContent = card.code ?? ''
        const title = document.createElementNS(ns, 'text')
        title.setAttribute('x', '10'); title.setAttribute('y', '40')
        title.setAttribute('class', 'chart__title')
        title.textContent = truncate(t.t(card.titleKey), 22)
        g.append(code, title)
        if (card.outcome) {
          const badge = document.createElementNS(ns, 'text')
          badge.setAttribute('x', String(CARD_W - 14)); badge.setAttribute('y', '22')
          badge.setAttribute('class', 'chart__badge')
          badge.setAttribute('text-anchor', 'end')
          badge.textContent = OUTCOME_GLYPH[card.outcome] ?? ''
          g.append(badge)
        }
      } else {
        // Rueckseite: kein Titel, kein Code, kein Bild. Nur, dass es sie gibt.
        const back = document.createElementNS(ns, 'text')
        back.setAttribute('x', String(CARD_W / 2)); back.setAttribute('y', '42')
        back.setAttribute('text-anchor', 'middle')
        back.setAttribute('class', 'chart__back')
        back.textContent = card.lockHintKey ? '⊘' : '?'
        g.append(back)
      }

      const label = card.titleKey
        ? `${card.code ?? ''} ${t.t(card.titleKey)}`
        : t.t(card.lockHintKey ?? 'ui.card.unknown')
      g.setAttribute('tabindex', '0')
      g.setAttribute('role', 'button')
      g.setAttribute('aria-label', label)
      const open = () => this.showDetail(card)
      g.addEventListener('click', open)
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
      })
      svg.append(g)
    }
    return svg
  }

  // -- Textliste -------------------------------------------------------------

  private list(reading: Reading, cards: ReadingCard[]): HTMLElement {
    const { t } = this.host
    const wrap = el('div', { class: 'reading__list' })
    for (const col of reading.columns) {
      const own = cards.filter(c => c.chapter === col.id).sort((a, b) => a.row - b.row)
      if (!own.length) continue
      const section = el('section', {},
        el('h3', { class: 'reading__listHead', text: t.t(col.titleKey), style: `--accent:${col.accent}` }),
      )
      const ul = el('ul', { class: 'reading__listItems' })
      for (const card of own) {
        const li = el('li', { class: `reading__listItem reading__listItem--${card.state}` })
        if (card.titleKey) {
          const b = btn('', () => this.showDetail(card), { class: 'reading__listBtn' })
          b.append(
            el('span', { class: 'reading__listCode', text: card.code ?? '' }),
            el('span', { class: 'reading__listTitle', text: t.t(card.titleKey) }),
            card.outcome
              ? el('span', { class: 'reading__listBadge', text: `${OUTCOME_GLYPH[card.outcome]} ${t.t(`ui.outcome.${card.outcome}`)}` })
              : el('span', {}),
          )
          li.append(b)
        } else {
          li.append(el('span', { class: 'reading__listUnknown', text: t.t(card.lockHintKey ?? 'ui.card.unknown') }))
        }
        ul.append(li)
      }
      section.append(ul)
      wrap.append(section)
    }
    return wrap
  }

  // -- Detailpanel -----------------------------------------------------------

  private showDetail(card: ReadingCard): void {
    const { t } = this.host
    clear(this.detail)
    if (!card.titleKey) {
      this.detail.append(
        el('h3', { text: t.t('ui.card.unknown') }),
        card.lockHintKey ? el('p', { text: t.t(card.lockHintKey) }) : el('p', { text: '' }),
      )
      return
    }
    this.detail.append(
      el('h3', {}, el('span', { class: 'reading__detailCode', text: card.code ?? '' }), t.t(card.titleKey)),
      card.povKey ? el('p', { class: 'reading__detailPov', text: t.t(card.povKey) }) : el('p', {}),
      el('p', { class: 'reading__detailSummary', text: t.t(card.summaryKey ?? '') }),
      card.outcome
        ? el('p', { class: 'reading__detailBadge', text: `${OUTCOME_GLYPH[card.outcome]} ${t.t(`ui.outcome.${card.outcome}`)}` })
        : el('p', {}),
      card.jumpable
        ? btn(t.t('ui.jump'), () => this.host.requestJump(card.id), { class: 'btn btn--primary' })
        : el('p', { class: 'reading__detailLocked', text: t.t(card.lockHintKey ?? 'ui.card.locked') }),
    )
  }
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max - 1) + '…'
}
