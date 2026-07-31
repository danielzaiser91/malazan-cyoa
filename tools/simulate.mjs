/**
 * Headless-Durchspieler.
 *
 *   node tools/simulate.mjs                 # 200 zufaellige + 200 gierige Laeufe
 *   node tools/simulate.mjs --runs 500      # mehr
 *   node tools/simulate.mjs --book b1       # anderes Buch
 *   node tools/simulate.mjs --json          # maschinenlesbar
 *
 * Laeuft OHNE Build: Node 24 entfernt die Typen der importierten `.ts`-Dateien
 * selbst. Deshalb tragen alle relativen Importe im Projekt ihre `.ts`-Endung.
 */

import { content } from '../src/content/index.ts'
import { locales } from '../src/locales/index.ts'
import { Registry } from '../src/model/registry.ts'
import { createSave } from '../src/core/save.ts'
import { simulate } from '../src/core/simulate.ts'
import { wordCount } from '../src/core/i18n.ts'
import { WORD_BANDS } from '../src/core/constants.ts'

const argv = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const flag = name => argv.includes(`--${name}`)

const bookId = arg('book', 'b1')
const runs = Number(arg('runs', '200'))

const reg = new Registry(content)
const book = reg.book(bookId)
if (!book) {
  console.error(`Unbekanntes Buch: ${bookId}`)
  process.exit(1)
}

const makeSave = () => createSave({
  id: 'sim', name: 'Simulator', sigil: 'obelisk', background: 'marine',
  pronouns: 'they', lang: 'de', bookId, entry: book.entry,
  seed: 1, createdAt: '2026-07-31T00:00:00.000Z',
})

const random = simulate(reg, makeSave, bookId, { runs, strategy: 'random' })
const greedy = simulate(reg, makeSave, bookId, { runs, strategy: 'greedy' })

const scenes = reg.scenesOf(bookId)
const totalPages = scenes.reduce((n, s) => n + s.pages.length, 0)

// Wortzahl-Verteilung je Sprache und Band.
const distribution = {}
for (const lang of ['de', 'en']) {
  const dict = locales[lang]
  const byBand = {}
  for (const s of scenes) {
    for (const p of s.pages) {
      const n = wordCount(dict[p.bodyKey] ?? '')
      const b = (byBand[p.band] ??= { count: 0, total: 0, min: Infinity, max: 0, out: 0 })
      b.count++; b.total += n
      b.min = Math.min(b.min, n); b.max = Math.max(b.max, n)
      const band = WORD_BANDS[p.band]
      if (n < band.min || n > band.max) b.out++
    }
  }
  distribution[lang] = byBand
}

const totalWords = Object.fromEntries(['de', 'en'].map(lang => [
  lang,
  scenes.reduce((n, s) => n + s.pages.reduce((m, p) => m + wordCount(locales[lang][p.bodyKey] ?? ''), 0), 0),
]))

const report = {
  book: bookId,
  scenes: scenes.length,
  pages: totalPages,
  words: totalWords,
  random: summarise(random),
  greedy: summarise(greedy),
  neverVisited: greedy.neverVisited.filter(id => random.neverVisited.includes(id)),
  distribution,
}

function summarise(sim) {
  const finishes = {}
  for (const r of sim.runs) finishes[r.finish] = (finishes[r.finish] ?? 0) + 1
  return {
    crashes: sim.crashes.length,
    finishes,
    endings: sim.endingsFound,
    bestCoverage: Number(sim.bestCoverage.toFixed(3)),
    meanPages: Number(sim.meanPages.toFixed(1)),
  }
}

if (flag('json')) {
  console.log(JSON.stringify(report, null, 2))
} else {
  const pct = x => `${(x * 100).toFixed(1)} %`
  console.log(`\n  Buch ${bookId} · ${report.scenes} Szenen · ${report.pages} Seiten`)
  console.log(`  Woerter: de ${totalWords.de} · en ${totalWords.en}\n`)
  for (const [name, s] of [['zufaellig', report.random], ['gierig', report.greedy]]) {
    console.log(`  ${name.padEnd(10)} ${runs} Laeufe`)
    console.log(`    Abstuerze:     ${s.crashes}`)
    console.log(`    Ausgaenge:     ${Object.entries(s.finishes).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
    console.log(`    Enden:         ${s.endings.join(', ') || '—'}`)
    console.log(`    Beste Deckung: ${pct(s.bestCoverage)} (Ziel 60 %)`)
    console.log(`    Seiten/Lauf:   ${s.meanPages}\n`)
  }
  console.log(`  Nie besucht:   ${report.neverVisited.join(', ') || '—'}\n`)
  for (const lang of ['de', 'en']) {
    console.log(`  Wortverteilung ${lang}:`)
    for (const [band, b] of Object.entries(distribution[lang])) {
      const target = WORD_BANDS[band]
      console.log(`    ${band.padEnd(9)} n=${String(b.count).padStart(3)}  ` +
        `min ${String(b.min).padStart(3)}  mittel ${String(Math.round(b.total / b.count)).padStart(3)}  ` +
        `max ${String(b.max).padStart(3)}  (Band ${target.min}–${target.max})  ausserhalb: ${b.out}`)
    }
    console.log('')
  }
}

const failed = report.random.crashes + report.greedy.crashes + report.neverVisited.length
process.exit(failed > 0 ? 1 : 0)
