/**
 * Der zusammengesetzte Content. EINZIGE Stelle, an der Buecher registriert
 * werden — alles andere geht ueber die `Registry` und kennt keine Buch-ID.
 */

import type { ArtPrompt } from './art/types.ts'
import type { Book, ContentPack } from '../model/types.ts'
import { chapter00 } from './b1/c00.ts'
import { art00 } from './art/b1/c00.ts'
import { achievements, cards, codex, items, sheets, talents } from './common.ts'

const b1: Book = {
  id: 'b1',
  titleKey: 'b1.title',
  entry: 'b1.c00.s01',
  chapters: [chapter00],
  endings: [
    // TEMPORAER: Entwicklungs-Ende, solange Kapitel 1 fehlt. Faellt mit c01 weg.
    { id: 'wip', titleKey: 'ending.wip.title', summaryKey: 'ending.wip.summary', cardId: 'ending-wip' },
  ],
}

export const content: ContentPack = {
  books: [b1],
  codex,
  cards,
  talents,
  items,
  achievements,
  sheets,
}

/** Alle Bild-Prompts, nach `promptId` auffindbar. */
export const artPrompts: ArtPrompt[] = [...art00]

export const artById = new Map<string, ArtPrompt>(artPrompts.map(p => [p.id, p]))
