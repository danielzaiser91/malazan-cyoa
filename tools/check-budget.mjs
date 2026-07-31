/**
 * Performance-Budget: der JS-Bundle darf 200 KB gzip nicht ueberschreiten,
 * ein einzelnes Bild nicht 300 KB. Laeuft nach `vite build` in der CI.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const ASSETS = join(DIST, 'assets')
const IMAGES = join(ROOT, 'public', 'illustrations')

const JS_BUDGET = 200 * 1024
const IMG_BUDGET = 300 * 1024

if (!existsSync(ASSETS)) {
  console.error('  dist/assets fehlt — erst `npm run build` laufen lassen.')
  process.exit(1)
}

let js = 0
for (const file of readdirSync(ASSETS)) {
  if (!file.endsWith('.js')) continue
  js += gzipSync(readFileSync(join(ASSETS, file))).length
}

const tooBig = []
if (existsSync(IMAGES)) {
  for (const file of readdirSync(IMAGES)) {
    if (!/\.(webp|avif|png|jpg)$/.test(file)) continue
    const size = statSync(join(IMAGES, file)).size
    if (size > IMG_BUDGET) tooBig.push(`${file} (${Math.round(size / 1024)} KB)`)
  }
}

const pct = (js / JS_BUDGET * 100).toFixed(0)
console.log(`  JS gzip: ${(js / 1024).toFixed(1)} KB von ${JS_BUDGET / 1024} KB (${pct} %)`)
for (const t of tooBig) console.error(`  ! Bild ueber Budget: ${t}`)

if (js > JS_BUDGET || tooBig.length) {
  console.error('  Budget verletzt.')
  process.exit(1)
}
console.log('  Budget eingehalten.')
