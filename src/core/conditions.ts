/**
 * Auswertung der deklarativen Bedingungen. Rein, DOM-frei, ohne Seiteneffekt.
 *
 * Bedingungen lesen BEIDE Schichten: Werte und Flags aus dem Lauf, besuchte
 * Szenen und Karten aus dem Meta-Wissen. Das ist Absicht — "du kennst diesen
 * Namen bereits" ist Wissen und darf einen Sprung ueberleben.
 */

import type { Background, Condition } from '../model/types.ts'
import type { MetaState, RunState } from '../model/state.ts'

export interface EvalContext {
  run: RunState
  meta: MetaState
  background: Background
  /**
   * Die gerade gueltige Wertetafel: normalerweise `run.stats`, in einem
   * Interlude die der Kanon-Figur. Eine Bedingung fragt immer die Werte der
   * Figur ab, die der Spieler in diesem Moment ist.
   */
  stats: Record<string, number>
}

export function evaluate(cond: Condition | undefined, ctx: EvalContext): boolean {
  if (!cond) return true
  if ('all' in cond) return cond.all.every(c => evaluate(c, ctx))
  if ('any' in cond) return cond.any.some(c => evaluate(c, ctx))
  if ('not' in cond) return !evaluate(cond.not, ctx)
  if ('stat' in cond) return (ctx.stats[cond.stat] ?? 0) >= cond.gte
  if ('flag' in cond) return ctx.run.flags[cond.flag] === true
  if ('item' in cond) return (ctx.run.items[cond.item] ?? 0) >= (cond.count ?? 1)
  if ('visited' in cond) return ctx.meta.scenes[cond.visited]?.reached === true
  if ('card' in cond) return ctx.meta.cards.includes(cond.card)
  if ('talent' in cond) return ctx.run.talents.includes(cond.talent)
  if ('background' in cond) return ctx.background === cond.background
  if ('coin' in cond) return ctx.run.coin >= cond.coin
  if ('level' in cond) return ctx.run.level >= cond.level
  // Ein unbekannter Bedingungstyp ist ein Content-Fehler und darf nicht still
  // "wahr" bedeuten — sonst oeffnet ein Tippfehler jede gesperrte Tuer.
  return false
}

/** Alle Blatt-Bedingungen einer Bedingung — fuer Validierung und Sperrhinweise. */
export function leaves(cond: Condition | undefined): Condition[] {
  if (!cond) return []
  if ('all' in cond) return cond.all.flatMap(leaves)
  if ('any' in cond) return cond.any.flatMap(leaves)
  if ('not' in cond) return leaves(cond.not)
  return [cond]
}
