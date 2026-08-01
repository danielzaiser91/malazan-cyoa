/**
 * Kontaktbogen: viele Bilder als ein Raster, zum Draufschauen.
 *
 *   node tools/art-sheet.mjs                 # alles
 *   node tools/art-sheet.mjs --chapter b1.c01
 *
 * Warum: Ein Kapitel hat 30 Bilder. Sie einzeln zu oeffnen kostet Zeit und
 * verhindert genau das, worauf es bei einer Bildstrecke ankommt — zu sehen, ob
 * sie ZUSAMMEN funktioniert. Stilbrueche, Epochen-Drift und Wiederholungen
 * fallen im Raster in Sekunden auf und beim Einzelbild gar nicht.
 *
 * Kostet keine Credits. Ausgabe: `public/illustrations/_sheet/<name>.png`.
 */

import sharp from 'sharp'
import { mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'illustrations')
const SHEET = join(OUT, '_sheet')

const chapter = arg('chapter')
const COLS = Number(arg('cols', '4'))
const W = 320, H = 180

const ids = readdirSync(OUT)
  .filter(f => f.endsWith('.webp') && !f.includes('@640'))
  .map(f => f.replace(/\.webp$/, ''))
  .filter(id => !chapter || id.startsWith(chapter))
  .sort()

if (!ids.length) { console.log('  Keine Bilder gefunden.'); process.exit(0) }

const rows = Math.ceil(ids.length / COLS)
const composites = []

for (let i = 0; i < ids.length; i++) {
  const buf = await sharp(join(OUT, `${ids[i]}.webp`)).resize(W, H).png().toBuffer()
  composites.push({ input: buf, left: (i % COLS) * W, top: Math.floor(i / COLS) * H })
}

mkdirSync(SHEET, { recursive: true })
const name = chapter ? `${chapter}.png` : 'alle.png'
const file = join(SHEET, name)

await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: '#101010' } })
  .composite(composites)
  .png()
  .toFile(file)

console.log(`\n  ${ids.length} Bilder · ${COLS}x${rows} · ${file}`)
console.log(`  Reihenfolge zeilenweise:\n`)
for (let r = 0; r < rows; r++) {
  console.log('   ' + ids.slice(r * COLS, r * COLS + COLS).map(s => s.replace(/^b1\./, '')).join('  '))
}
console.log('')
