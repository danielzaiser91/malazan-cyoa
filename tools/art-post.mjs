/**
 * Nachbearbeitung der erzeugten Bilder. Kostet keine Credits.
 *
 *   node tools/art-post.mjs                  # alles Offene verarbeiten
 *   node tools/art-post.mjs --force          # auch schon Verarbeitetes neu
 *   node tools/art-post.mjs --signatures     # zusaetzlich Signatur-Verdacht melden
 *
 * Drei Schritte je Bild:
 *   1. Schnitt 1344x768 -> 1280x720 (mittig). Exaktes 16:9, und nimmt
 *      Artefakte direkt an der Kante mit.
 *   2. webp 1280 und webp 640 fuer `srcset`, Qualitaet adaptiv (82 bis 66).
 *   3. Budget pruefen: hoechstens 180 KB je Bild.
 *
 * ⚠️ **Signaturen werden NICHT automatisch uebermalt.** Der erste Entwurf tat
 * das und lag in beide Richtungen falsch: Fehlalarm auf einer dunklen
 * Turmsilhouette, gleichzeitig die echte Signatur verpasst, weil sie auf
 * strukturiertem Stein sass. Gemessen: der Hochpass trennt die duennen
 * Signaturstriche nicht vom Farbkorn des Oelstils — beide liegen bei einer
 * Energie von etwa 5 bis 8.
 *
 * Dazu die Verhaeltnismaessigkeit: In der Auslieferungsgroesse (1280 breit, im
 * Story-View auf ~640 skaliert) ist so eine Signatur ein kaum sichtbarer Fleck.
 * Auffaellig war sie nur bei 2-facher Vergroesserung. Ein automatischer Eingriff,
 * der echtes Bildmaterial uebermalen kann, ist dafuer der falsche Preis.
 *
 * Gilt weiterhin: Der Stil-Anker verhindert sie bei randfuellenden Motiven
 * ohnehin (siehe `src/content/art/style.ts`). Bleibt in Einzelfaellen doch eine
 * stoerend sichtbar, ist `flux-tools/erase-v1` mit Maske der richtige Weg —
 * gezielt, 4 Credits, mit Blick darauf.
 */

import sharp from 'sharp'
import { mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { GEN_W, GEN_H, OUT_W, OUT_H } from './bfl.mjs'
import { findAll } from './signature.mjs'

const argv = process.argv.slice(2)
const flag = n => argv.includes(`--${n}`)

const ROOT = join(import.meta.dirname, '..')
const RAW = join(ROOT, 'public', 'illustrations', '_raw')
const OUT = join(ROOT, 'public', 'illustrations')
const IMG_BUDGET = 180 * 1024

async function processImage(id) {
  const raw = join(RAW, `${id}.png`)
  const big = join(OUT, `${id}.webp`)
  const small = join(OUT, `${id}@640.webp`)
  if (!flag('force') && existsSync(big) && existsSync(small)) return null

  const meta = await sharp(raw).metadata()
  if (meta.width !== GEN_W || meta.height !== GEN_H) {
    return { id, error: `unerwartete Groesse ${meta.width}x${meta.height}` }
  }

  const cropped = await sharp(raw)
    .extract({
      left: Math.round((GEN_W - OUT_W) / 2),
      top: Math.round((GEN_H - OUT_H) / 2),
      width: OUT_W, height: OUT_H,
    })
    .png()
    .toBuffer()

  // Qualitaet adaptiv statt pauschal: die hoechste Stufe nehmen, die unter dem
  // Budget bleibt.
  //
  // Gemessen am 01.08.2026: Der Oelstil kostet Platz. Bei Qualitaet 82 lagen
  // 11 von 23 Bildern ueber 180 KB, das dichteste bei 250 KB — die Nutzlast ist
  // das Farbkorn, und Korn komprimiert schlecht. Der Verlust dabei ist
  // minimal: die mittlere Abweichung zu Qualitaet 92 steigt von 3,07 (q82) auf
  // nur 4,33 (q70) von 255, also ein halbes Prozent fuer 30 % weniger Bytes.
  // Korn ist rauschartig; was dabei wegfaellt, sieht niemand.
  //
  // Pauschal q70 waere trotzdem verschenkt: ein ruhiges Motiv liegt bei q82
  // schon bei 129 KB und braucht die Absenkung nicht.
  let quality = 0
  for (const q of [82, 78, 74, 70, 66]) {
    quality = q
    await sharp(cropped).webp({ quality: q }).toFile(big)
    if (statSync(big).size <= IMG_BUDGET) break
  }
  await sharp(cropped).resize(640).webp({ quality: Math.min(80, quality) }).toFile(small)

  const size = statSync(big).size
  const suspects = flag('signatures') ? await findAll(cropped, OUT_W, OUT_H) : []
  return { id, size, quality, over: size > IMG_BUDGET, suspects }
}

mkdirSync(OUT, { recursive: true })
const ids = existsSync(RAW)
  ? readdirSync(RAW).filter(f => f.endsWith('.png')).map(f => f.replace(/\.png$/, '')).sort()
  : []

if (!ids.length) { console.log('  Keine Rohbilder in _raw.'); process.exit(0) }

console.log(`\n  ${ids.length} Rohbilder\n`)
let over = 0, skipped = 0, flagged = 0, total = 0
for (const id of ids) {
  const r = await processImage(id)
  if (!r) { skipped++; continue }
  if (r.error) { console.log(`  ! ${id}: ${r.error}`); continue }
  if (r.over) over++
  total += r.size
  if (r.suspects.length) flagged++
  console.log(`  · ${id.padEnd(18)} ${String(Math.round(r.size / 1024)).padStart(4)} KB  q${r.quality}` +
    (r.over ? '  ⚠ ueber Budget' : '') +
    (r.suspects.length ? `  ? Signatur-Verdacht: ${r.suspects.map(s => s.corner).join(', ')}` : ''))
}
const done = ids.length - skipped
console.log(`\n  verarbeitet: ${done} · uebersprungen: ${skipped}` +
  (done ? ` · im Schnitt ${Math.round(total / done / 1024)} KB` : '') +
  (over ? ` · ueber Budget: ${over}` : '') +
  (flag('signatures') ? ` · Signatur-Verdacht: ${flagged}` : ''))
console.log('')
