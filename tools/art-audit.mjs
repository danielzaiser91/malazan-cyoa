/**
 * Bestandsaufnahme der Bildlage. Reine Auswertung, generiert nichts.
 *   node tools/art-audit.mjs
 */
import { content, artPrompts, artById } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'
import { CHARACTER_SHEETS, PLACE_SHEETS } from '../src/content/art/style.ts'

const reg = new Registry(content)
const pages = reg.books.flatMap(b => reg.scenesOf(b.id).flatMap(s => s.pages.map(p => ({ s, p }))))

const count = (arr) => arr.reduce((m, k) => (m[k] = (m[k] ?? 0) + 1, m), {})
const sorted = o => Object.entries(o).sort((a, b) => b[1] - a[1])

const prompts = pages.map(({ p }) => artById.get(p.art.promptId)).filter(Boolean)

console.log(`\n=== Seiten mit Bildbedarf: ${pages.length} ===\n`)

console.log('Stufe:')
for (const [k, v] of sorted(count(prompts.map(p => p.tier)))) console.log(`  ${k.padEnd(10)} ${v}`)

console.log('\nStimmung:')
for (const [k, v] of sorted(count(pages.map(({ p }) => p.art.mood)))) console.log(`  ${k.padEnd(14)} ${v}`)

console.log('\nPalette:')
for (const [k, v] of sorted(count(prompts.map(p => p.palette)))) console.log(`  ${k.padEnd(14)} ${v}`)

console.log('\nFiguren (Haeufigkeit in Prompts):')
const chars = count(prompts.flatMap(p => p.characters ?? []))
for (const [k, v] of sorted(chars)) {
  console.log(`  ${k.padEnd(14)} ${String(v).padStart(2)}   ${CHARACTER_SHEETS[k] ? 'Blatt vorhanden' : 'KEIN BLATT'}`)
}
const unused = Object.keys(CHARACTER_SHEETS).filter(k => !chars[k])
console.log(`  — noch ungenutzte Blaetter: ${unused.join(', ') || '—'}`)

console.log('\nOrte:')
const places = count(prompts.map(p => p.place).filter(Boolean))
for (const [k, v] of sorted(places)) console.log(`  ${k.padEnd(14)} ${v}   ${PLACE_SHEETS[k] ? 'Blatt vorhanden' : 'KEIN BLATT'}`)
console.log(`  — noch ungenutzte Ortsblaetter: ${Object.keys(PLACE_SHEETS).filter(k => !places[k]).join(', ') || '—'}`)

console.log('\nSeiten OHNE jede Figur (reine Szenerie):',
  prompts.filter(p => !(p.characters ?? []).length).length)

console.log(`\nBild-Prompts insgesamt: ${artPrompts.length}`)
