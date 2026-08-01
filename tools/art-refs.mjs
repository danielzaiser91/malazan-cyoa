/**
 * Referenz-Sheets fuer wiederkehrende Figuren.
 *
 *   node tools/art-refs.mjs plan            # was fehlt, was es kostet
 *   node tools/art-refs.mjs gen             # fehlende erzeugen
 *   node tools/art-refs.mjs gen --only paranChild
 *
 * Warum ueberhaupt: Ein Charakterblatt als TEXT haelt eine Figur ueber ein
 * paar Bilder zusammen, nicht ueber elf. Referenzbilder tun das — bis zu acht
 * pro Request.
 *
 * ⚠️ **Korrektur 31.07.2026:** Hier stand, Referenzen kosteten nichts extra.
 * Falsch. Gemessen an identischen Requests: 0 Refs = 3 Credits, 1 Ref = 4,5,
 * 4 Refs = 9 — also 1,5 je Referenzbild, linear. Deshalb steht `--refs` in
 * `art-gen.mjs` standardmaessig auf 1 und nicht auf allem, was da ist.
 *
 * Bewusst EIN Blickwinkel je Bild statt eines Sheets mit mehreren Ansichten
 * nebeneinander: ein Sheet-Layout laedt Beschriftungen ein, und gegen
 * Text-Artefakte haben wir keine Negative Prompts.
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { content, artById } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'
import { CHARACTER_SHEETS, REFERENCE_ANCHOR } from '../src/content/art/style.ts'
import { seedFrom } from '../src/core/rng.ts'
import { GEN_W, GEN_H, credits, loadKey, submit, awaitResult, download } from './bfl.mjs'

const argv = process.argv.slice(2)
const cmd = argv[0] ?? 'plan'
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }

const OUT = join(import.meta.dirname, '..', 'public', 'illustrations', '_refs')

/**
 * Welche Figur wie viele Ansichten bekommt — nach Haeufigkeit im Content,
 * nicht nach Wichtigkeit in der Geschichte. Wer einmal vorkommt, braucht keine.
 */
const VIEWS = {
  paranChild: [
    'a three-quarter view portrait from the chest up, head turned slightly away, plain flat background',
    'a strict profile view from the side, head level, plain flat background',
    'a full figure standing straight, seen from the front at a slight distance, plain flat background',
  ],
  bridgeburner: [
    'a three-quarter view portrait from the chest up, plain flat background',
    'a full figure standing at ease, seen from the front at a slight distance, plain flat background',
  ],
  lorn: [
    'a three-quarter view portrait from the chest up, plain flat background',
    'a full figure standing straight, seen from the front at a slight distance, plain flat background',
  ],
}

/** Wie oft eine Figur tatsaechlich in Bild-Prompts vorkommt. */
function usage() {
  const reg = new Registry(content)
  const counts = {}
  for (const b of reg.books) {
    for (const s of reg.scenesOf(b.id)) {
      for (const p of s.pages) {
        for (const c of artById.get(p.art.promptId)?.characters ?? []) counts[c] = (counts[c] ?? 0) + 1
      }
    }
  }
  return counts
}

function targets(only) {
  const out = []
  for (const [char, views] of Object.entries(VIEWS)) {
    if (only && char !== only) continue
    views.forEach((view, i) => out.push({ char, view, n: i + 1, file: join(OUT, `${char}-${i + 1}.png`) }))
  }
  return out
}

/**
 * Referenz-Prompt: derselbe MALSTIL wie die Szenenbilder, aber ohne deren
 * Kompositionsregeln.
 *
 * Gemessen am 31.07.2026: Mit dem vollen Anker zog `figures small against
 * architecture and sky` Mauern und Landschaft in ein Portraet, das einen
 * schlichten Hintergrund haben sollte. Der Anker beschreibt das Bild, das er
 * anleiten soll — fuer eine Referenz ist das der falsche Auftrag.
 */
function refPrompt(char, view) {
  return `${REFERENCE_ANCHOR} ${CHARACTER_SHEETS[char]}. ${view}. ` +
    'even soft light, the background a single unbroken tone. ' +
    'single figure, centred, the whole figure inside the frame.'
}

if (cmd === 'plan') {
  const used = usage()
  console.log('\n  Figur          im Content   Ansichten   Status')
  for (const [char, views] of Object.entries(VIEWS)) {
    const have = views.filter((_, i) => existsSync(join(OUT, `${char}-${i + 1}.png`))).length
    console.log(`  ${char.padEnd(14)} ${String(used[char] ?? 0).padStart(4)} Bilder   ${views.length}          ${have}/${views.length} vorhanden`)
  }
  const missing = targets().filter(t => !existsSync(t.file)).length
  console.log(`\n  Zu erzeugen: ${missing} · ${missing * 3} Credits\n`)
  const skipped = Object.entries(used).filter(([c]) => !VIEWS[c])
  if (skipped.length) console.log(`  Ohne Referenz (zu selten): ${skipped.map(([c, n]) => `${c} (${n})`).join(', ')}\n`)
  process.exit(0)
}

if (cmd !== 'gen') { console.error(`Unbekannter Befehl: ${cmd}`); process.exit(1) }

mkdirSync(OUT, { recursive: true })
const key = loadKey()
const todo = targets(arg('only')).filter(t => !existsSync(t.file))
if (!todo.length) { console.log('  Nichts zu tun.'); process.exit(0) }

console.log(`\n  Guthaben vorher: ${await credits(key)} Credits`)
console.log(`  Zu erzeugen: ${todo.length} Referenzen · ${todo.length * 3} Credits\n`)

const jobs = []
for (const t of todo) {
  const req = {
    prompt: refPrompt(t.char, t.view),
    width: GEN_W, height: GEN_H,
    seed: seedFrom(`ref:${t.char}:${t.n}`) % 2147483647,
    disable_pup: true, output_format: 'png',
  }
  const meta = join(OUT, `${t.char}-${t.n}.json`)
  writeFileSync(meta, JSON.stringify({ ...req, _char: t.char, _view: t.n }, null, 2) + '\n')
  try {
    const res = await submit(key, 'flux-2-pro', req)
    // Sofort wegschreiben: Stirbt der Prozess jetzt, ist das Bild bezahlt und
    // ohne diese URL nicht mehr abholbar. Real passiert am 31.07.2026.
    writeFileSync(meta, JSON.stringify({ ...req, _char: t.char, _view: t.n, _polling: res.polling_url, _cost: res.cost }, null, 2) + '\n')
    console.log(`  → ${t.char}-${t.n} · ${res.cost} Credits`)
    jobs.push({ ...t, polling: res.polling_url })
  } catch (err) {
    console.warn(`  ✗ ${t.char}-${t.n} nicht abgeschickt: ${err.message}`)
  }
}

// Ein moderierter oder fehlgeschlagener Job darf die anderen nicht mitreissen.
let ok = 0, failed = 0
for (const job of jobs) {
  try {
    await download(await awaitResult(key, job.polling), job.file)
    console.log(`  ✓ ${job.char}-${job.n}`)
    ok++
  } catch (err) {
    console.warn(`  ✗ ${job.char}-${job.n}: ${err.message.split(' — ')[0]}`)
    failed++
  }
}
console.log(`\n  fertig: ${ok} · fehlgeschlagen: ${failed}`)
console.log(`\n  Guthaben nachher: ${await credits(key)} Credits\n`)

/** Referenzen einer Figur als Base64 — fuer `input_image` im Szenen-Request. */
export function refsFor(char, max = 3) {
  const out = []
  for (let i = 1; i <= max; i++) {
    const file = join(OUT, `${char}-${i}.png`)
    if (existsSync(file)) out.push(readFileSync(file).toString('base64'))
  }
  return out
}
