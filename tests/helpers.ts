/** Gemeinsame Hilfen fuer die Content-Validierung. */

import { content, artById } from '../src/content/index.ts'
import { locales } from '../src/locales/index.ts'
import { Registry } from '../src/model/registry.ts'
import { I18n } from '../src/core/i18n.ts'
import { createSave } from '../src/core/save.ts'
import { Engine, emptyMeta } from '../src/core/engine.ts'
import type { Lang, Scene } from '../src/model/types.ts'
import type { SaveFile } from '../src/model/state.ts'

export const reg = new Registry(content)
export { content, artById, locales }

export const LANGS: Lang[] = ['de', 'en']

export function i18nFor(lang: Lang): I18n {
  const i = new I18n(lang)
  i.register(lang, locales[lang])
  return i
}

export function allScenes(): Scene[] {
  return reg.books.flatMap(b => reg.scenesOf(b.id))
}

export function allPages() {
  return allScenes().flatMap(s => s.pages.map(p => ({ scene: s, page: p })))
}

/** Frisches Testprofil — deterministisch, ohne Uhr. */
export function testSave(bookId = 'b1', seed = 1234): SaveFile {
  const book = reg.book(bookId)!
  return createSave({
    id: 'test',
    name: 'Testlauf',
    sigil: 'obelisk',
    background: 'marine',
    pronouns: 'they',
    lang: 'de',
    bookId,
    entry: book.entry,
    seed,
    createdAt: '2026-07-31T00:00:00.000Z',
  })
}

export function freshEngine(bookId = 'b1', seed = 1234): Engine {
  const save = testSave(bookId, seed)
  save.meta = emptyMeta()
  return Engine.start(reg, save, bookId, seed)
}
