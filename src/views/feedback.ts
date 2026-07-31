/**
 * Uebersetzt Engine-Ereignisse in Bild UND Klang.
 *
 * Das ist die Durchsetzungsstelle der Feel-Regel: Die Engine liefert fuer jede
 * Zustandsaenderung ein Ereignis, und hier bekommt JEDES eine sichtbare
 * Einblendung und einen eigenen Klang. Kommt ein neuer Ereignistyp dazu und
 * fehlt hier sein Fall, faellt das sofort auf — der `switch` ist erschoepfend.
 */

import type { EngineEvent } from '../core/engine.ts'
import type { AudioEngine, Sfx } from '../core/audio.ts'
import type { I18n } from '../core/i18n.ts'
import { el } from './dom.ts'

export interface Toast {
  icon: string
  text: string
  sfx: Sfx
  tone: 'good' | 'bad' | 'neutral' | 'rare'
}

/** Ein Ereignis → eine Einblendung. `undefined` heisst: nichts anzuzeigen. */
export function toastFor(ev: EngineEvent, t: I18n): Toast | undefined {
  switch (ev.kind) {
    case 'stat': {
      const name = t.t(`stat.${ev.stat}`)
      const sign = ev.delta > 0 ? '+' : ''
      return {
        icon: ev.delta > 0 ? '▲' : '▼',
        text: `${name} ${sign}${ev.delta} → ${ev.value}`,
        sfx: ev.delta > 0 ? 'stat-up' : 'stat-down',
        tone: ev.delta > 0 ? 'good' : 'bad',
      }
    }
    case 'item':
      return {
        icon: ev.delta > 0 ? '✚' : '✖',
        text: `${t.t(`item.${ev.item}.title`)} ${ev.delta > 0 ? '+' : ''}${ev.delta}`,
        sfx: 'item', tone: ev.delta > 0 ? 'good' : 'bad',
      }
    case 'coin':
      return {
        icon: '◉', text: `${t.t('ui.coin')} ${ev.delta > 0 ? '+' : ''}${ev.delta} → ${ev.value}`,
        sfx: 'coin', tone: ev.delta > 0 ? 'good' : 'bad',
      }
    case 'flag':
      // Flags sind Charakterzustand; sie erscheinen im Blatt im Klartext.
      return { icon: '❖', text: t.t(`flag.${ev.flag}`), sfx: 'flag', tone: 'neutral' }
    case 'xp':
      return { icon: '✦', text: `${t.t('ui.xp')} +${ev.delta}`, sfx: 'page', tone: 'neutral' }
    case 'levelup':
      return { icon: '★', text: t.t('ui.level', { n: ev.level }), sfx: 'levelup', tone: 'rare' }
    case 'card':
      return { icon: '🂠', text: t.t(`card.${ev.card}.title`), sfx: 'card', tone: 'rare' }
    case 'codex':
      return { icon: '✎', text: t.t(`codex.${ev.codex}.title`), sfx: 'codex', tone: 'neutral' }
    case 'achievement':
      return { icon: '❦', text: t.t(`ach.${ev.achievement}.title`), sfx: 'achievement', tone: 'rare' }
    case 'attention':
      if (!ev.threshold) return undefined
      return {
        icon: '👁', text: t.t(`ui.attention.${ev.threshold}`),
        sfx: 'attention', tone: 'bad',
      }
    case 'check':
      return {
        icon: ev.passed ? '✔' : '✘',
        text: t.t(ev.passed ? 'ui.checkPassed' : 'ui.checkFailed', { total: ev.total, dc: ev.dc }),
        sfx: ev.passed ? 'check-pass' : 'check-fail',
        tone: ev.passed ? 'good' : 'bad',
      }
    case 'checkpoint':
      return { icon: '⚑', text: t.t('ui.checkpointSet'), sfx: 'checkpoint', tone: 'neutral' }
    case 'jump':
      return { icon: '↺', text: t.t('ui.jumpTitle'), sfx: 'jump', tone: 'neutral' }
    case 'blocked':
      return ev.reason === 'locked'
        ? { icon: '⊘', text: t.t('ui.locked'), sfx: 'locked', tone: 'bad' }
        : undefined
    // Szenenwechsel, Seitenwechsel, Game Over und Enden haben eigene, groessere
    // Darstellungen im Story-View — sie brauchen keine kleine Einblendung.
    case 'page':
    case 'scene':
    case 'gameover':
    case 'ending':
      return undefined
  }
}

/** Klang fuer Ereignisse, die keine Einblendung bekommen. */
export function bareSfx(ev: EngineEvent): Sfx | undefined {
  switch (ev.kind) {
    case 'page': return 'page'
    case 'scene': return 'scene'
    case 'gameover': return 'gameover'
    case 'ending': return 'ending'
    default: return undefined
  }
}

/**
 * Haengt die Einblendungen an und spielt ihre Klaenge. Gestapelt, versetzt, und
 * bei `reduce-motion` ohne Bewegung — aber niemals weggelassen.
 */
export class FeedbackLayer {
  private readonly host: HTMLElement
  private readonly audio: AudioEngine
  private readonly t: I18n

  constructor(host: HTMLElement, audio: AudioEngine, t: I18n) {
    this.host = host
    this.audio = audio
    this.t = t
  }

  emit(events: EngineEvent[]): void {
    let delay = 0
    for (const ev of events) {
      const bare = bareSfx(ev)
      if (bare) this.audio.play(bare)
      const toast = toastFor(ev, this.t)
      if (!toast) continue
      const at = delay
      delay += 140
      window.setTimeout(() => this.show(toast), at)
    }
  }

  private show(toast: Toast): void {
    this.audio.play(toast.sfx)
    const node = el('div', { class: `toast toast--${toast.tone}`, role: 'status', 'aria-live': 'polite' },
      el('span', { class: 'toast__icon', 'aria-hidden': 'true', text: toast.icon }),
      el('span', { class: 'toast__text', text: toast.text }),
    )
    this.host.append(node)
    window.setTimeout(() => node.classList.add('toast--in'), 10)
    window.setTimeout(() => {
      node.classList.remove('toast--in')
      window.setTimeout(() => node.remove(), 400)
    }, 3200)
  }
}
