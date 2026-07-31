/**
 * Stilfindung: EIN Motiv, fuenf Stil-Anker, gleicher Seed.
 *
 *   node tools/art-style.mjs --page b1.c00.s01.p01
 *   node tools/art-style.mjs --page b1.c00.s01.p01 --only A,C   # Teilmenge
 *
 * Gleicher Seed fuer alle Varianten ist der ganze Trick: sonst vergleicht man
 * Stil UND Kompositionsrauschen und weiss nicht, was man beurteilt.
 *
 * Modell ist `flux-2-pro`, nicht `klein-4b`. Beurteilt wird hier Pinselstrich
 * und Korn — genau das, was ein destilliertes Modell am unzuverlaessigsten
 * rendert. Die 8 Credits Ersparnis waeren ein falsches Nein auf der teuersten
 * Entscheidung des Projekts wert gewesen.
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { content, artById } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'
import { CHARACTER_SHEETS, MOOD_PHRASE, PALETTES, PLACE_SHEETS } from '../src/content/art/style.ts'
import { seedFrom } from '../src/core/rng.ts'
import { STYLE_ANCHORS, COMPOSITION, GEN_W, GEN_H, loadKey, submit, awaitResult, download } from './bfl.mjs'

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }

const pageId = arg('page', 'b1.c00.s01.p01')
const only = arg('only')?.split(',').map(s => s.trim().toUpperCase())

const reg = new Registry(content)
const scene = reg.books.flatMap(b => reg.scenesOf(b.id)).find(s => s.pages.some(p => p.id === pageId))
const page = scene?.pages.find(p => p.id === pageId)
const art = artById.get(page?.art.promptId ?? '')
if (!page || !art) { console.error(`Unbekannte Seite: ${pageId}`); process.exit(1) }

/** Szene + Licht + Komposition — bei allen Varianten identisch. */
function body() {
  const parts = [art.subject]
  for (const c of art.characters ?? []) if (CHARACTER_SHEETS[c]) parts.push(CHARACTER_SHEETS[c])
  if (art.place && PLACE_SHEETS[art.place]) parts.push(PLACE_SHEETS[art.place])
  if (art.detail) parts.push(art.detail)
  parts.push(MOOD_PHRASE[page.art.mood])
  parts.push(PALETTES[art.palette].phrase)
  parts.push(COMPOSITION[art.tier])
  return parts.join('. ') + '.'
}

const OUT = join(import.meta.dirname, '..', 'public', 'illustrations', '_style')
mkdirSync(OUT, { recursive: true })

const seed = seedFrom(pageId) % 2147483647
const key = loadKey()
const variants = Object.entries(STYLE_ANCHORS).filter(([id]) => !only || only.includes(id))

console.log(`\n  Motiv:   ${pageId}`)
console.log(`  Seed:    ${seed} (identisch fuer alle Varianten)`)
console.log(`  Groesse: ${GEN_W}x${GEN_H}`)
console.log(`  Varianten: ${variants.map(([id]) => id).join(', ')}`)
console.log(`  Erwartete Kosten: ${(variants.length * 3).toFixed(0)} Credits\n`)

const jobs = []
for (const [id, anchor] of variants) {
  const file = join(OUT, `anker-${id}.png`)
  if (existsSync(file)) { console.log(`  · ${id} existiert bereits, uebersprungen`); continue }
  const req = {
    prompt: `${anchor} ${body()}`,
    width: GEN_W, height: GEN_H,
    seed, disable_pup: true, output_format: 'png',
  }
  writeFileSync(join(OUT, `anker-${id}.json`), JSON.stringify({ ...req, _variant: id, _page: pageId }, null, 2) + '\n')
  const res = await submit(key, 'flux-2-pro', req)
  console.log(`  → ${id} abgeschickt · ${res.cost} Credits`)
  jobs.push({ id, file, polling: res.polling_url })
}

let total = 0
for (const job of jobs) {
  const url = await awaitResult(key, job.polling)
  await download(url, job.file)
  total += 3
  console.log(`  ✓ ${job.id} → ${job.file}`)
}
console.log(`\n  Fertig. Ausgegeben: ~${total} Credits.\n`)
