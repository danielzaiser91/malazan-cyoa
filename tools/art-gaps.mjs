/**
 * Bildlücken: wo steht noch ein Platzhalter, und warum.
 *
 *   node tools/art-gaps.mjs            # Übersicht auf der Konsole
 *   node tools/art-gaps.mjs --write    # zusätzlich `_reference/bildluecken.md`
 *
 * Warum als eigenes Werkzeug und nicht als Teil von `art-gen plan`: Der Plan
 * beantwortet „was kostet der nächste Lauf". Diese Übersicht beantwortet „wo
 * fehlt im fertigen Spiel noch etwas" — und die Antwort soll im Repo stehen und
 * im Diff auffallen, wenn ein neues Kapitel Lücken mitbringt.
 *
 * Kostet keine Credits.
 */

import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { content } from '../src/content/index.ts'
import { illustration } from '../src/core/placeholder.ts'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'illustrations')
const write = process.argv.includes('--write')

const rows = []
for (const book of content.books) {
  for (const chapter of book.chapters) {
    for (const scene of chapter.scenes) {
      for (const page of scene.pages) {
        const file = illustration(page.art.promptId, '/').src.replace('/illustrations/', '')
        rows.push({
          page: page.id,
          chapter: chapter.id,
          scene: scene.id,
          prompt: page.art.promptId,
          file,
          has: existsSync(join(OUT, file)),
          // Eine geteilte Seite teilt sich das Bild mit ihrer ersten Haelfte.
          // Das ist kein Mangel, sondern Absicht — aber man will es sehen.
          shared: page.art.promptId !== page.id,
        })
      }
    }
  }
}

const missing = rows.filter(r => !r.has)
const shared = rows.filter(r => r.shared && r.has)
const byChapter = {}
for (const r of rows) {
  const c = (byChapter[r.chapter] ??= { total: 0, missing: 0 })
  c.total++
  if (!r.has) c.missing++
}

console.log(`\n  Seiten: ${rows.length} · mit Bild: ${rows.length - missing.length} · ohne: ${missing.length}`)
console.log(`  Eigene Bilder: ${new Set(rows.map(r => r.file)).size} · geteilt genutzt: ${shared.length}\n`)
for (const [id, c] of Object.entries(byChapter)) {
  const bar = c.missing ? `${c.missing} fehlen` : 'vollständig'
  console.log(`    ${id.padEnd(10)} ${String(c.total).padStart(3)} Seiten · ${bar}`)
}
if (missing.length) {
  console.log('\n  Ohne Bild:')
  for (const r of missing) console.log(`    ${r.page.padEnd(18)} -> ${r.file}`)
}
console.log('')

if (write) {
  const lines = [
    '# Bildlücken',
    '',
    '> Erzeugt von `node tools/art-gaps.mjs --write`. Nicht von Hand pflegen —',
    '> die Datei ist die Momentaufnahme, das Werkzeug ist die Wahrheit.',
    '',
    `Stand: **${rows.length} Seiten**, davon **${rows.length - missing.length} mit Bild** und ` +
    `**${missing.length} ohne**. ${shared.length} Seiten teilen sich ein Bild mit ihrer ersten Hälfte ` +
    '(geteilte Seiten — Absicht, kein Mangel).',
    '',
    '## Nach Kapitel',
    '',
    '| Kapitel | Seiten | Ohne Bild |',
    '|---|---|---|',
    ...Object.entries(byChapter).map(([id, c]) => `| \`${id}\` | ${c.total} | ${c.missing || '—'} |`),
    '',
  ]
  if (missing.length) {
    lines.push('## Seiten ohne Bild', '', '| Seite | erwartete Datei |', '|---|---|',
      ...missing.map(r => `| \`${r.page}\` | \`${r.file}\` |`), '')
  } else {
    lines.push('## Seiten ohne Bild', '', 'Keine. Jede Seite findet ihr Bild.', '')
  }
  if (shared.length) {
    lines.push('## Geteilte Bilder', '',
      'Diese Seiten sind aus einer zu langen Seite entstanden und tragen dasselbe Bild wie ihre',
      'erste Hälfte. Das ist gewollt: Eine fortlaufende Szene braucht keinen Motivwechsel alle',
      '150 Wörter — und es kostet keine Credits.', '',
      '| Seite | nutzt Bild von |', '|---|---|',
      ...shared.map(r => `| \`${r.page}\` | \`${r.prompt}\` |`), '')
  }
  const file = join(ROOT, '_reference', 'bildluecken.md')
  writeFileSync(file, lines.join('\n'))
  console.log(`  geschrieben: ${file}\n`)
}
