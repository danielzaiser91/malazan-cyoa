/**
 * Headless-Walker. Spielt das Buch ohne Browser durch — das Werkzeug, das einen
 * verzweigten Graphen mit hunderten Seiten ehrlich haelt.
 *
 * Wird sowohl von der Test-Suite (Validierung 11) als auch von
 * `tools/simulate.mjs` benutzt, damit beide dasselbe messen.
 */

import type { Registry } from '../model/registry.ts'
import type { SceneId } from '../model/types.ts'
import { Engine } from './engine.ts'
import type { SaveFile } from '../model/state.ts'
import { rollInt } from './rng.ts'

export interface RunReport {
  ok: boolean
  error?: string
  /** Wie der Lauf endete. */
  finish: 'ending' | 'gameover' | 'stuck' | 'steps-exhausted'
  endingId?: string
  scenes: SceneId[]
  pages: number
  steps: number
  words: number
}

export interface SimOptions {
  runs: number
  /** `random` waehlt beliebig, `greedy` bevorzugt unbesuchte Ziele. */
  strategy: 'random' | 'greedy'
  maxSteps?: number
  seed?: number
}

export interface SimSummary {
  runs: RunReport[]
  crashes: string[]
  /** Szenen, die in KEINEM Lauf besucht wurden. */
  neverVisited: SceneId[]
  endingsFound: string[]
  /** Beste Abdeckung eines einzelnen Laufs (Anteil der Seiten). */
  bestCoverage: number
  meanPages: number
}

/**
 * Spielt einen Lauf. `makeSave` liefert einen frischen Spielstand — der
 * Simulator legt selbst keinen an, damit er nichts ueber Profile wissen muss.
 */
export function playOnce(
  reg: Registry,
  makeSave: () => SaveFile,
  bookId: string,
  seed: number,
  strategy: SimOptions['strategy'],
  maxSteps = 500,
): RunReport {
  const report: RunReport = {
    ok: true, finish: 'steps-exhausted', scenes: [], pages: 0, steps: 0, words: 0,
  }
  try {
    const engine = Engine.start(reg, makeSave(), bookId, seed)
    const seen = new Set<SceneId>()
    let cursor = 0
    report.scenes.push(engine.run.scene)
    seen.add(engine.run.scene)

    while (report.steps < maxSteps) {
      report.steps += 1
      const before = `${engine.run.scene}#${engine.run.page}`

      if (engine.atExit && engine.scene.exit.type === 'choice') {
        const options = engine.choices().filter(c => !c.locked)
        if (options.length === 0) { report.finish = 'stuck'; break }
        let pick = options[rollInt(seed, cursor++, options.length)]
        if (strategy === 'greedy') {
          const fresh = options.filter(o => !seen.has(o.choice.to))
          if (fresh.length) pick = fresh[rollInt(seed, cursor++, fresh.length)]
        }
        engine.choose(pick.choice.id)
      } else {
        engine.next()
      }

      const scene = engine.run.scene
      if (!seen.has(scene)) { seen.add(scene); report.scenes.push(scene) }

      if (engine.finished === 'ending') {
        report.finish = 'ending'
        const last = reg.scene(scene)
        report.endingId = last?.exit.type === 'ending' ? last.exit.endingId : undefined
        break
      }
      if (engine.finished === 'gameover') { report.finish = 'gameover'; break }

      if (`${engine.run.scene}#${engine.run.page}` === before) { report.finish = 'stuck'; break }
    }
    report.pages = engine.meta.pagesRead.length
  } catch (err) {
    report.ok = false
    report.error = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err)
  }
  return report
}

export function simulate(
  reg: Registry,
  makeSave: () => SaveFile,
  bookId: string,
  opts: SimOptions,
): SimSummary {
  const baseSeed = opts.seed ?? 20260731
  const runs: RunReport[] = []
  for (let i = 0; i < opts.runs; i++) {
    runs.push(playOnce(reg, makeSave, bookId, baseSeed + i * 7919, opts.strategy, opts.maxSteps))
  }
  const visited = new Set(runs.flatMap(r => r.scenes))
  const totalPages = reg.scenesOf(bookId).reduce((n, s) => n + s.pages.length, 0)
  return {
    runs,
    crashes: runs.filter(r => !r.ok).map(r => r.error ?? 'unbekannt'),
    neverVisited: reg.scenesOf(bookId).map(s => s.id).filter(id => !visited.has(id)),
    endingsFound: [...new Set(runs.map(r => r.endingId).filter((x): x is string => !!x))],
    bestCoverage: totalPages === 0 ? 0 : Math.max(0, ...runs.map(r => r.pages / totalPages)),
    meanPages: runs.length ? runs.reduce((n, r) => n + r.pages, 0) / runs.length : 0,
  }
}
