/**
 * Anwendung der deklarativen Effekte.
 *
 * Zwei Dinge macht dieses Modul, und beide sind wichtig:
 *  1. Es aendert den Zustand — Werte und Inventar im Lauf, Codex/Karten/Erfolge
 *     im Meta-Wissen (die Trennlinie aus `model/state.ts`).
 *  2. Es gibt fuer JEDEN Effekt ein `EffectEvent` zurueck. Die View macht daraus
 *     eine Animation UND einen Klang. Das ist die technische Durchsetzung der
 *     Feel-Regel "keine unsichtbare oder stumme Mechanik": Ein Effekt, der kein
 *     Ereignis erzeugt, existiert nicht — und ein erzeugtes Ereignis kann die
 *     View nicht uebersehen, weil sie die Liste abarbeitet.
 */

import type { Effect } from '../model/types.ts'
import type { MetaState, RunState } from '../model/state.ts'
import { ATTENTION_HUNTED, ATTENTION_NOTICED, MAX_LEVEL, XP_THRESHOLDS } from './constants.ts'

export type EffectEvent =
  | { kind: 'stat'; stat: string; delta: number; value: number }
  | { kind: 'item'; item: string; delta: number; value: number }
  | { kind: 'flag'; flag: string; value: boolean }
  | { kind: 'coin'; delta: number; value: number }
  | { kind: 'xp'; delta: number; value: number }
  | { kind: 'levelup'; level: number }
  | { kind: 'card'; card: string }
  | { kind: 'codex'; codex: string }
  | { kind: 'achievement'; achievement: string }
  | { kind: 'attention'; delta: number; value: number; threshold?: 'noticed' | 'hunted' }

export interface ApplyTarget {
  run: RunState
  meta: MetaState
  /**
   * Wohin `{stat}`-Effekte gehen. Im Normalfall `run.stats`; waehrend eines
   * Interludes die Wertetafel der Kanon-Figur. Wird von `engine.ts` gesetzt.
   */
  stats?: Record<string, number>
}

/**
 * Wendet eine Effektliste an und meldet, was passiert ist. Mutiert `target` —
 * Aufrufer arbeiten auf einer Kopie (siehe `engine.ts`), damit der Core selbst
 * frei von Ueberraschungen bleibt.
 */
export function applyEffects(effects: Effect[] | undefined, target: ApplyTarget): EffectEvent[] {
  const events: EffectEvent[] = []
  if (!effects) return events
  for (const e of effects) events.push(...applyOne(e, target))
  return events
}

function applyOne(e: Effect, { run, meta, stats }: ApplyTarget): EffectEvent[] {
  if ('stat' in e) {
    const bag: Record<string, number> = stats ?? run.stats
    const value = Math.max(0, (bag[e.stat] ?? 0) + e.add)
    bag[e.stat] = value
    return [{ kind: 'stat', stat: e.stat, delta: e.add, value }]
  }
  if ('flag' in e) {
    run.flags[e.flag] = e.set
    return [{ kind: 'flag', flag: e.flag, value: e.set }]
  }
  if ('item' in e) {
    const value = Math.max(0, (run.items[e.item] ?? 0) + e.add)
    if (value === 0) delete run.items[e.item]
    else run.items[e.item] = value
    return [{ kind: 'item', item: e.item, delta: e.add, value }]
  }
  if ('coin' in e) {
    const value = Math.max(0, run.coin + e.coin)
    run.coin = value
    return [{ kind: 'coin', delta: e.coin, value }]
  }
  if ('xp' in e) {
    run.xp += e.xp
    const events: EffectEvent[] = [{ kind: 'xp', delta: e.xp, value: run.xp }]
    while (run.level < MAX_LEVEL && run.xp >= XP_THRESHOLDS[run.level - 1]) {
      run.level += 1
      events.push({ kind: 'levelup', level: run.level })
    }
    return events
  }
  if ('card' in e) {
    if (meta.cards.includes(e.card)) return []
    meta.cards.push(e.card)
    return [{ kind: 'card', card: e.card }]
  }
  if ('codex' in e) {
    if (meta.codex.includes(e.codex)) return []
    meta.codex.push(e.codex)
    return [{ kind: 'codex', codex: e.codex }]
  }
  if ('achievement' in e) {
    if (meta.achievements.includes(e.achievement)) return []
    meta.achievements.push(e.achievement)
    return [{ kind: 'achievement', achievement: e.achievement }]
  }
  if ('attention' in e) {
    const before = run.attention
    const value = Math.max(0, before + e.attention)
    run.attention = value
    return [{ kind: 'attention', delta: e.attention, value, threshold: crossedThreshold(before, value) }]
  }
  return []
}

function crossedThreshold(before: number, after: number): 'noticed' | 'hunted' | undefined {
  if (before < ATTENTION_HUNTED && after >= ATTENTION_HUNTED) return 'hunted'
  if (before < ATTENTION_NOTICED && after >= ATTENTION_NOTICED) return 'noticed'
  return undefined
}
