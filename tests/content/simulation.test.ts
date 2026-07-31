/**
 * Validierung 11 — Durchspiel-Simulation. Der Walker spielt N zufaellige und
 * N gierige Laeufe: kein Absturz, keine Schleife ohne Ausgang, jedes Ende
 * erreichbar, jede Szene irgendwann besucht.
 */

import { describe, expect, it } from 'vitest'
import { reg, testSave } from '../helpers.ts'
import { simulate } from '../../src/core/simulate.ts'
import { SPINE_COVERAGE_TARGET } from '../../src/core/constants.ts'

const BOOK = 'b1'
const make = () => testSave(BOOK)

describe('11 · Durchspiel-Simulation', () => {
  const random = simulate(reg, make, BOOK, { runs: 40, strategy: 'random' })
  const greedy = simulate(reg, make, BOOK, { runs: 40, strategy: 'greedy' })

  it('kein Lauf stuerzt ab', () => {
    expect(random.crashes).toEqual([])
    expect(greedy.crashes).toEqual([])
  })

  it('kein Lauf bleibt haengen oder laeuft in die Schrittgrenze', () => {
    const bad = [...random.runs, ...greedy.runs]
      .filter(r => r.finish === 'stuck' || r.finish === 'steps-exhausted')
      .map(r => `${r.finish} nach ${r.steps} Schritten, zuletzt ${r.scenes.at(-1)}`)
    expect(bad).toEqual([])
  })

  it('jede Szene wird von der Simulation irgendwann besucht', () => {
    const never = greedy.neverVisited.filter(id => random.neverVisited.includes(id))
    expect(never).toEqual([])
  })

  it('jedes registrierte Ende wird erreicht', () => {
    const found = new Set([...random.endingsFound, ...greedy.endingsFound])
    const missing = reg.endingsOf(BOOK).map(e => e.id).filter(id => !found.has(id))
    expect(missing).toEqual([])
  })

  it('ein gieriger Lauf sieht mindestens 60 % der Seiten', () => {
    expect(greedy.bestCoverage).toBeGreaterThanOrEqual(SPINE_COVERAGE_TARGET)
  })

  it('die Simulation ist deterministisch — gleicher Seed, gleiches Ergebnis', () => {
    const a = simulate(reg, make, BOOK, { runs: 5, strategy: 'random', seed: 42 })
    const b = simulate(reg, make, BOOK, { runs: 5, strategy: 'random', seed: 42 })
    expect(a.runs.map(r => r.scenes)).toEqual(b.runs.map(r => r.scenes))
  })
})
