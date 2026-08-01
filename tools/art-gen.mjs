/**
 * Produktion der Seitenbilder.
 *
 *   node tools/art-gen.mjs plan                        # was fehlt
 *   node tools/art-gen.mjs gen --id b1.c00.s02.p02     # ein Bild
 *   node tools/art-gen.mjs gen --chapter b1.c00 --max 25
 *   node tools/art-gen.mjs gen --stale                 # auch Veraltetes neu
 *
 * Regeln, die hier nicht verhandelbar sind (Skill `flux-bildgenerierung`):
 *  - `disable_pup: true`, fixer Seed, `width`/`height` statt `aspect_ratio`
 *  - Request-JSON gleichnamig neben das Bild, polling_url sofort hinein
 *  - was existiert, wird nie ungefragt neu erzeugt (siehe `exists`/`stale`)
 *  - Guthaben vor jedem Block nennen
 *  - Blockgroesse begrenzt (`--max`), Standard 25
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { content, artById } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'
import { buildPrompt, promptHash } from '../src/content/art/prompt.ts'
import { seedFrom } from '../src/core/rng.ts'
import { GEN_W, GEN_H, credits, loadKey, submit, awaitResult, download } from './bfl.mjs'

const argv = process.argv.slice(2)
const cmd = argv[0] ?? 'plan'
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const flag = n => argv.includes(`--${n}`)

const ROOT = join(import.meta.dirname, '..')
const RAW = join(ROOT, 'public', 'illustrations', '_raw')
const REFS = join(ROOT, 'public', 'illustrations', '_refs')

const reg = new Registry(content)
const refCap = Number(arg('refs', '1'))

/** Referenzbilder einer Figur als Base64 — bis zu drei, in fester Reihenfolge. */
function refsFor(char) {
  const out = []
  for (let i = 1; i <= 3; i++) {
    const file = join(REFS, `${char}-${i}.png`)
    if (existsSync(file)) out.push(readFileSync(file).toString('base64'))
  }
  return out
}

// `--ids a,b,c` — die uebliche Form der Nacharbeit. Nach einer QA-Runde steht
// eine Liste von Ausschuss-Bildern fest; `--stale` waere dafuer zu grob (es
// nimmt alles, dessen Prompt sich je geaendert hat) und `--id` zu fein.
const idList = (arg('ids') ?? '').split(',').map(s => s.trim()).filter(Boolean)

function pages() {
  const chapter = arg('chapter')
  const id = arg('id')
  const out = []
  for (const book of reg.books) {
    for (const scene of reg.scenesOf(book.id)) {
      if (chapter && scene.chapter !== chapter) continue
      for (const page of scene.pages) {
        if (id && page.id !== id) continue
        if (idList.length && !idList.includes(page.id)) continue
        const art = artById.get(page.art.promptId)
        if (art) out.push({ page, art })
      }
    }
  }
  return out
}

/**
 * Bestandsschutz. Frueher hiess "fertig": Datei da UND Prompt unveraendert —
 * und ein einziger geaenderter Baustein machte damit den gesamten Bestand
 * wieder zu Arbeit. Bei 436 Bildern ueber Wochen ist das keine Kleinigkeit,
 * sondern der Unterschied zwischen "Prompt verbessern" und "Prompt nicht
 * anfassen, weil es zu teuer ist" (real am 01.08.2026: der neue Weltanker
 * haette 53 bezahlte Bilder auf einen Schlag entwertet).
 *
 * Deshalb zwei getrennte Zustaende:
 *  - FEHLT:    keine Datei. Wird erzeugt, ohne dass jemand fragt.
 *  - VERALTET: Datei da, Prompt seither geaendert. Wird NUR auf Ansage neu
 *              erzeugt (`--stale`, oder gezielt `--id`).
 *
 * Damit kostet eine Prompt-Verbesserung erst einmal gar nichts, und die
 * Entscheidung, wofuer man zahlt, bleibt beim Menschen und vor dem Lauf.
 */
// Dateiname = PROMPT-ID, nicht Seiten-ID. Zwei Seiten duerfen sich ein Bild
// teilen (geteilte Seiten tun das immer), und dann darf es auch nur einmal
// erzeugt und einmal abgelegt werden. Vorher hing beides an der Seite — die
// zweite Haelfte suchte eine Datei, die es nie geben wird.
const rawName = art => art.id

function exists({ art }) {
  return existsSync(join(RAW, `${rawName(art)}.png`)) && existsSync(join(RAW, `${rawName(art)}.json`))
}

function stale({ art }) {
  if (!exists({ art })) return false
  try { return JSON.parse(readFileSync(join(RAW, `${rawName(art)}.json`), 'utf8'))._promptHash !== promptHash(art) } catch { return true }
}

function request({ art }) {
  const req = {
    prompt: buildPrompt(art),
    width: GEN_W, height: GEN_H,
    seed: seedFrom(art.id) % 2147483647,
    disable_pup: true, output_format: 'png',
  }
  // Referenzen der beteiligten Figuren mitschicken — der einzige Grund, warum
  // dieselbe Person ueber elf Bilder dieselbe bleibt.
  //
  // ⚠️ Sie sind NICHT gratis. Gemessen am 31.07.2026 an identischen Requests:
  //     0 Referenzen = 3,0 Credits
  //     1 Referenz   = 4,5 Credits
  //     4 Referenzen = 9,0 Credits
  // Also 3 Grundpreis plus 1,5 je Referenz, linear. Bei 436 Bildern ist das
  // der groesste Budgethebel ueberhaupt — deshalb wird die Zahl GEWAEHLT, nicht
  // maximiert. Faustregel: Figur klein im Bild -> 1 reicht (verifiziert an
  // b1.c00.s01.p01), Gesicht erkennbar -> 3.
  let slot = 0
  const cap = refCap
  for (const char of art.characters ?? []) {
    for (const b64 of refsFor(char)) {
      if (slot >= cap) break
      req[slot === 0 ? 'input_image' : `input_image_${slot + 1}`] = b64
      slot++
    }
  }
  return req
}

const costOf = list => list.reduce((n, p) =>
  n + 3 + 1.5 * Math.min(refCap, (p.art.characters ?? []).flatMap(refsFor).length), 0)

if (cmd === 'plan') {
  const all = pages()
  const missing = all.filter(p => !exists(p))
  const outdated = all.filter(p => stale(p))
  const byTier = {}
  for (const p of missing) byTier[p.art.tier] = (byTier[p.art.tier] ?? 0) + 1

  console.log(`\n  Seiten: ${all.length} · vorhanden: ${all.length - missing.length} · fehlen: ${missing.length}`)
  console.log(`  Stufen der fehlenden: ${JSON.stringify(byTier)}`)
  console.log(`  Kosten fuer die fehlenden: ${costOf(missing)} Credits (3 je Bild + 1,5 je Referenz)\n`)
  for (const p of missing.slice(0, 30)) {
    const refs = (p.art.characters ?? []).flatMap(refsFor).length
    console.log(`    ${p.page.id}  ${p.art.tier.padEnd(8)} ${refs ? refs + ' Referenzen' : '—'}`)
  }

  if (outdated.length) {
    console.log(`\n  VERALTET: ${outdated.length} Bilder liegen vor, ihr Prompt hat sich seither geaendert.`)
    console.log(`  Sie werden NICHT automatisch neu erzeugt. Neu waeren sie ${costOf(outdated)} Credits.`)
    console.log(`  Gezielt: --id <id> · alle: gen --stale\n`)
    for (const p of outdated.slice(0, 40)) console.log(`    ${p.page.id}`)
  }
  console.log('')
  process.exit(0)
}

if (cmd !== 'gen') { console.error(`Unbekannter Befehl: ${cmd}`); process.exit(1) }

mkdirSync(RAW, { recursive: true })
const key = loadKey()
const max = Number(arg('max', '25'))
// Standard: nur was FEHLT. Veraltetes kommt nur auf ausdrueckliche Ansage
// dazu — `--stale` fuer alle, oder `--id` fuer ein einzelnes.
const wanted = p => flag('force') || !exists(p) || (flag('stale') && stale(p))
  || arg('id') === p.page.id || idList.includes(p.page.id)
const todo = pages().filter(wanted).slice(0, max)
if (!todo.length) { console.log('  Nichts zu tun.'); process.exit(0) }

const before = await credits(key)
console.log(`\n  Guthaben vorher: ${before} Credits`)
const est = todo.reduce((n, p) =>
  n + 3 + 1.5 * Math.min(refCap, (p.art.characters ?? []).flatMap(refsFor).length), 0)
console.log(`  Block: ${todo.length} Bilder · erwartet ${est} Credits
`)

const jobs = []
for (const t of todo) {
  const req = request(t)
  const meta = join(RAW, `${rawName(t.art)}.json`)
  // Das JSON traegt den Prompt im Klartext, aber NICHT die Referenzbilder —
  // sonst waere jede Datei mehrere Megabyte gross. Die Referenzen liegen
  // ohnehin daneben und sind ueber `_refs` eindeutig.
  const record = { ...req, _promptHash: promptHash(t.art), _page: t.page.id, _prompt: t.art.id, _tier: t.art.tier }
  for (const k of Object.keys(record)) if (k.startsWith('input_image')) record[k] = `<${k} aus _refs>`
  writeFileSync(meta, JSON.stringify(record, null, 2) + '\n')
  try {
    const res = await submit(key, 'flux-2-pro', req)
    record._polling = res.polling_url
    record._cost = res.cost
    writeFileSync(meta, JSON.stringify(record, null, 2) + '\n')
    console.log(`  → ${t.page.id} · ${res.cost} Credits`)
    jobs.push({ ...t, polling: res.polling_url })
  } catch (err) {
    console.warn(`  ✗ ${t.page.id} nicht abgeschickt: ${err.message}`)
  }
}

let ok = 0, failed = 0
for (const job of jobs) {
  try {
    await download(await awaitResult(key, job.polling), join(RAW, `${rawName(job.art)}.png`))
    console.log(`  ✓ ${job.page.id}`)
    ok++
  } catch (err) {
    console.warn(`  ✗ ${job.page.id}: ${err.message.split(' — ')[0]}`)
    failed++
  }
}

const after = await credits(key)
console.log(`\n  fertig: ${ok} · fehlgeschlagen: ${failed}`)
console.log(`  Guthaben: ${before} → ${after} (${before - after} Credits)\n`)
