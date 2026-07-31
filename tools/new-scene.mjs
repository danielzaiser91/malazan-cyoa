/**
 * Legt die vier Dateien einer neuen Szene gemeinsam an, damit sie nie
 * auseinanderdriften: Struktur, Prosa DE, Prosa EN, Bild-Prompt.
 *
 *   node tools/new-scene.mjs --chapter b1.c01 --code 1.2 --pages 3 --kind spine
 *
 * Es schreibt Stuecke zum Einfuegen auf die Standardausgabe statt in die
 * Dateien — die Reihenfolge im Kapitel ist eine Autorenentscheidung.
 */

import { content } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'

const argv = process.argv.slice(2)
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }

const chapter = arg('chapter')
const code = arg('code')
const pages = Number(arg('pages', '3'))
const kind = arg('kind', 'spine')
const pov = arg('pov', 'recruit')
const sheet = arg('sheet')

if (!chapter || !code) {
  console.error('Aufruf: node tools/new-scene.mjs --chapter b1.c01 --code 1.2 [--pages 3] [--kind spine] [--pov recruit] [--sheet id]')
  process.exit(1)
}

const reg = new Registry(content)
const existing = reg.chapter(chapter)?.scenes ?? []
const nextNum = String(existing.length + 1).padStart(2, '0')
const id = `${chapter}.s${nextNum}`
const bands = ['long', 'standard', 'beat']

const pageBlocks = Array.from({ length: pages }, (_, i) => {
  const p = `p${String(i + 1).padStart(2, '0')}`
  return `        {
          id: \`\${C}.s${nextNum}.${p}\`,
          bodyKey: \`\${C}.s${nextNum}.${p}.body\`,
          band: '${bands[Math.min(i, bands.length - 1)]}',
          art: { promptId: \`\${C}.s${nextNum}.${p}\`, altKey: \`\${C}.s${nextNum}.${p}.alt\`, mood: 'march' },
        },`
}).join('\n')

console.log(`\n=== src/content/${chapter.split('.')[0]}/${chapter.split('.')[1]}.ts ===\n`)
console.log(`    {
      id: \`\${C}.s${nextNum}\`,
      code: '${code}',
      kind: '${kind}',
      chapter: C,
      titleKey: \`\${C}.s${nextNum}.title\`,
      summaryKey: \`\${C}.s${nextNum}.summary\`,
      pov: '${pov}',
      spoilerScope: 'gotm',${sheet ? `\n      sheet: '${sheet}',` : ''}
      pages: [
${pageBlocks}
      ],
      exit: { type: 'goto', to: 'TODO' },
    },`)

for (const lang of ['de', 'en']) {
  console.log(`\n=== src/locales/${lang}/${chapter.split('.')[0]}/${chapter.split('.')[1]}.ts ===\n`)
  console.log(`  '${id}.title': 'TODO',`)
  console.log(`  '${id}.summary': 'TODO',`)
  for (let i = 1; i <= pages; i++) {
    const p = `p${String(i).padStart(2, '0')}`
    console.log(`  '${id}.${p}.body': 'TODO',`)
    console.log(`  '${id}.${p}.alt': 'TODO',`)
  }
}

console.log(`\n=== src/content/art/${chapter.split('.')[0]}/${chapter.split('.')[1]}.ts ===\n`)
for (let i = 1; i <= pages; i++) {
  const p = `p${String(i).padStart(2, '0')}`
  console.log(`  {
    id: \`\${C}.s${nextNum}.${p}\`,
    subject: 'TODO',
    mood: 'march', palette: 'bone-dust', tier: '${i === 1 ? 'hero' : 'standard'}',
  },`)
}
console.log('')
