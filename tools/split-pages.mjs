/**
 * Teilt zu lange Seiten in zwei — Text, Content-Eintrag und Baender in einem Zug.
 *
 *   node tools/split-pages.mjs plan          # was zu lang ist
 *   node tools/split-pages.mjs run <id> ...  # teilen
 *
 * Warum ueberhaupt: Ab 800 px Fensterhoehe darf eine Seite nicht scrollen (die
 * Rechnung steht in `_reference/ux-befunde.md` § 1). Wer scrollt, sieht die
 * Auswahlmoeglichkeiten nicht, waehrend er liest, und entscheidet blind.
 *
 * Drei Entscheidungen, die hier festgeschrieben sind:
 *
 *  - **Die zweite Haelfte heisst `<id>b`, es wird NICHT umnummeriert.** Die
 *    Reihenfolge steht im Array, nicht in der ID; und `meta.pagesRead` haelt
 *    Seiten-IDs fest, die eine Umnummerierung stillschweigend entwerten wuerde.
 *  - **Beide Haelften teilen sich Bild und Alt-Text.** Eine fortlaufende Szene
 *    braucht keinen Motivwechsel alle 150 Woerter, und es spart Credits.
 *  - **Getrennt wird an einer Absatzgrenze**, nie mitten im Absatz — und an
 *    derselben logischen Stelle in beiden Sprachen (gleicher Absatz-Index),
 *    damit DE und EN Seite fuer Seite dasselbe erzaehlen.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { content } from '../src/content/index.ts'
import { WORD_BANDS } from '../src/core/constants.ts'

const ROOT = join(import.meta.dirname, '..')
const argv = process.argv.slice(2)
const cmd = argv[0] ?? 'plan'

const words = s => s.trim().split(/\s+/).length
const bandFor = n => Object.entries(WORD_BANDS).find(([, b]) => n >= b.min && n <= b.max)?.[0]

const mods = {}
for (const lang of ['de', 'en']) {
  for (const ch of ['c00', 'c01']) {
    const m = await import(`../src/locales/${lang}/b1/${ch}.ts`)
    mods[`${lang}.${ch}`] = Object.values(m)[0]
  }
}
const dict = lang => ({ ...mods[`${lang}.c00`], ...mods[`${lang}.c01`] })

function pages() {
  const out = []
  for (const book of content.books)
    for (const chapter of book.chapters ?? [])
      for (const scene of chapter.scenes ?? [])
        for (const page of scene.pages) out.push({ page, chapter: chapter.id.split('.')[1] })
  return out
}

const DE = dict('de'), EN = dict('en')
const tooLong = pages().filter(({ page }) => {
  const n = Math.max(words(DE[page.bodyKey] ?? ''), words(EN[page.bodyKey] ?? ''))
  return n > WORD_BANDS.long.max
})

if (cmd === 'plan') {
  console.log(`\n  ${tooLong.length} Seiten ueber ${WORD_BANDS.long.max} Woertern:\n`)
  for (const { page } of tooLong) {
    const d = DE[page.bodyKey] ?? '', e = EN[page.bodyKey] ?? ''
    console.log(`    ${page.id.padEnd(16)} de ${words(d)} (${d.split('\n\n').length} Abs.) · en ${words(e)} (${e.split('\n\n').length} Abs.)`)
  }
  console.log('')
  process.exit(0)
}

/**
 * Absatz-Index, ab dem die zweite Haelfte beginnt.
 *
 * Gewaehlt wird die Grenze, die die LAENGERE der beiden Haelften am kleinsten
 * macht — und zwar ueber beide Sprachen zugleich, weil ein Band fuer beide gilt
 * und Englisch rund 8 % laenger ausfaellt. Die naheliegende Regel „erste Grenze
 * jenseits der Mitte" ist schlechter: Bei einem langen Absatz kurz vor der
 * Mitte springt sie weit darueber hinaus (real 185/85 statt 128/142).
 */
function splitAt(de, en) {
  const pd = de.split('\n\n'), pe = en.split('\n\n')
  let best = 1, bestMax = Infinity
  for (let i = 1; i < pd.length; i++) {
    const worst = Math.max(
      words(pd.slice(0, i).join(' ')), words(pd.slice(i).join(' ')),
      words(pe.slice(0, i).join(' ')), words(pe.slice(i).join(' ')),
    )
    if (worst < bestMax) { bestMax = worst; best = i }
  }
  return best
}

const targets = argv.slice(1).length ? argv.slice(1) : tooLong.map(x => x.page.id)
let done = 0

for (const id of targets) {
  const entry = pages().find(x => x.page.id === id)
  if (!entry) { console.log(`  ! ${id}: unbekannt`); continue }
  const { page, chapter } = entry
  const short = id.split('.').slice(2).join('.')

  // --- Texte teilen ------------------------------------------------------
  // Die Bruchstelle wird an der DEUTSCHEN Fassung bestimmt und auf die
  // englische uebertragen: gleicher Absatz-Index, damit beide Sprachen an
  // derselben Stelle umblaettern.
  const cut = splitAt(DE[page.bodyKey], EN[page.bodyKey])
  const parts = {}
  for (const [lang, d] of [['de', DE], ['en', EN]]) {
    const paras = d[page.bodyKey].split('\n\n')
    parts[lang] = [paras.slice(0, cut).join('\n\n'), paras.slice(cut).join('\n\n')]
  }

  const bandA = bandFor(Math.max(words(parts.de[0]), words(parts.en[0])))
  const bandB = bandFor(Math.max(words(parts.de[1]), words(parts.en[1])))
  if (!bandA || !bandB) {
    console.log(`  ! ${id}: eine Haelfte passt in kein Band ` +
      `(${words(parts.de[0])}/${words(parts.de[1])} de) — von Hand teilen`)
    continue
  }

  // --- Locale-Dateien ----------------------------------------------------
  for (const lang of ['de', 'en']) {
    const file = join(ROOT, 'src', 'locales', lang, 'b1', `${chapter}.ts`)
    let s = readFileSync(file, 'utf8')
    const key = `'${page.bodyKey}':`
    const i = s.indexOf(key)
    if (i < 0) { console.log(`  ! ${lang} ${id}: Schluessel nicht gefunden`); continue }
    // Vom Schluessel bis zum naechsten Schluessel auf gleicher Ebene.
    const rest = s.slice(i)
    const end = rest.search(/\n  '[^']+':/)
    const block = rest.slice(0, end < 0 ? rest.length : end)
    const lit = t => t.split('\n\n').map((p, n, a) =>
      `    '${p.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}${n < a.length - 1 ? '\\n\\n' : ''}'`)
      .join(' +\n')
    const next = `'${page.bodyKey}':\n${lit(parts[lang][0])},\n  '${page.bodyKey.replace('.body', 'b.body')}':\n${lit(parts[lang][1])},`
    s = s.replace(block, next)
    writeFileSync(file, s)
  }

  // --- Content -----------------------------------------------------------
  // Das Ende des Seiten-Objekts wird durch KLAMMERZAEHLUNG bestimmt, nicht per
  // Regex: Eine Seite enthaelt verschachtelte Objekte (`art`, `interactions`,
  // `inserts`), und ein nicht-gieriges `[\s\S]*?\}` endet zuverlaessig an der
  // ersten inneren Klammer statt an der richtigen.
  const file = join(ROOT, 'src', 'content', 'b1', `${chapter}.ts`)
  let s = readFileSync(file, 'utf8')
  const idAt = s.indexOf(`id: \`\${C}.${short}\`,`)
  if (idAt < 0) { console.log(`  ! ${id}: Content-Eintrag nicht gefunden`); continue }
  const open = s.lastIndexOf('{', idAt)
  let depth = 0, close = -1
  for (let k = open; k < s.length; k++) {
    if (s[k] === '{') depth++
    else if (s[k] === '}') { depth--; if (depth === 0) { close = k; break } }
  }
  if (close < 0) { console.log(`  ! ${id}: Objektende nicht gefunden`); continue }
  const lineStart = s.lastIndexOf('\n', open) + 1
  const indent = s.slice(lineStart, open).match(/^\s*/)[0]
  const objEnd = s.indexOf('\n', close) + 1
  const anchor = s.slice(lineStart, objEnd)
  // Die zweite Haelfte erbt Bild und Alt-Text. Interaktionen und Effekte
  // bleiben bei der ERSTEN — sie gehoeren zum Anfang der Seite.
  const added = `${indent}{\n` +
    `${indent}  id: \`\${C}.${short}b\`,\n` +
    `${indent}  bodyKey: \`\${C}.${short}b.body\`,\n` +
    `${indent}  band: '${bandB}',\n` +
    `${indent}  art: { promptId: \`\${C}.${short}\`, altKey: \`\${C}.${short}.alt\`, mood: '${page.art.mood}' },\n` +
    `${indent}},\n`
  // Band der ersten Haelfte im herausgeloesten Block nachziehen, dann Block
  // und neue Seite zusammen wieder einsetzen.
  const first = anchor.replace(/band: '[a-z]+'/, `band: '${bandA}'`)
  s = s.slice(0, lineStart) + first + added + s.slice(objEnd)
  writeFileSync(file, s)

  console.log(`  · ${id} -> ${bandA} + ${short}b ${bandB}  (${words(parts.de[0])}/${words(parts.de[1])} de)`)
  done++
}

console.log(`\n  geteilt: ${done}\n`)
