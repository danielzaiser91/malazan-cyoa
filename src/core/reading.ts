/**
 * "Die Auslegung" — das Ansichtsmodell des Flowcharts, in-fiction eine
 * Deck-of-Dragons-Legung von Kruppe.
 *
 * Dieses Modul ist die einzige Stelle, an der entschieden wird, WAS der Spieler
 * ueber eine Karte erfahren darf. Der View rendert ausschliesslich, was hier
 * herauskommt — er hat keinen Zugriff auf den Content. Damit ist der
 * Spoiler-Vertrag an genau einer Stelle pruefbar (Validierung Nr. 8), statt in
 * jedem Template neu.
 *
 * Aufgeloester Widerspruch der Vorlage: `_reference/02-…` § 6 verlangt einerseits
 * "gesperrte Karte zeigt ihren Titel ausgegraut", andererseits "eine nie
 * erreichte Karte darf Titel, Zusammenfassung, Bild, POV und Code nicht
 * verraten". Beides gilt: gesperrt UND schon einmal erreicht zeigt den Titel,
 * gesperrt und nie erreicht zeigt nur den Sperrhinweis. Vermerkt in `status.md`.
 */

import type { BookId, Outcome, SceneId } from '../model/types.ts'
import type { MetaState } from '../model/state.ts'
import type { Registry } from '../model/registry.ts'
import { evaluate, type EvalContext } from './conditions.ts'

export type CardState = 'rumoured' | 'reached' | 'completed' | 'exhausted' | 'locked'

/**
 * Eine Karte in der Auslegung. Felder, die Inhalt verraten, sind optional und
 * fehlen bei allem, was der Spieler noch nicht erreicht hat — sie werden gar
 * nicht erst gesetzt, statt im View ausgeblendet zu werden.
 */
export interface ReadingCard {
  id: SceneId
  chapter: string
  state: CardState
  /** Spalte (Kapitelreihenfolge) und Zeile im Layout. */
  column: number
  row: number
  /** Nur bei erreichten Karten gesetzt. */
  code?: string
  kind?: string
  titleKey?: string
  summaryKey?: string
  povKey?: string
  artId?: string
  outcome?: Outcome
  /** In-fiction formulierter Sperrhinweis. Darf nichts verraten. */
  lockHintKey?: string
  /** Kann der Spieler hierher springen? */
  jumpable: boolean
}

export interface ReadingEdge {
  from: SceneId
  to: SceneId
  /** `taken` = durchgezogen, `known` = gestrichelt. Unbekannte Kanten fehlen ganz. */
  style: 'taken' | 'known'
}

export interface Reading {
  book: BookId
  columns: { id: string; titleKey: string; accent: string; order: number }[]
  cards: ReadingCard[]
  edges: ReadingEdge[]
}

export interface ReadingInput {
  reg: Registry
  book: BookId
  meta: MetaState
  ctx: EvalContext
}

export function buildReading({ reg, book, meta, ctx }: ReadingInput): Reading {
  const chapters = reg.chaptersOf(book)
  const columnOf = new Map<string, number>()
  chapters.forEach((c, i) => columnOf.set(c.id, i))

  const cards: ReadingCard[] = []
  const edges: ReadingEdge[] = []
  const rows = new Map<string, number>()

  const nextRow = (chapterId: string): number => {
    const n = rows.get(chapterId) ?? 0
    rows.set(chapterId, n + 1)
    return n
  }

  // Erst alles einsammeln, was der Spieler ueberhaupt sehen darf.
  const rumoured = new Set<SceneId>()
  for (const scene of reg.scenesOf(book)) {
    if (!meta.scenes[scene.id]?.reached) continue
    for (const to of reg.targetsOf(scene)) {
      if (!meta.scenes[to]?.reached) rumoured.add(to)
    }
  }

  for (const scene of reg.scenesOf(book)) {
    const know = meta.scenes[scene.id]
    const reached = know?.reached === true
    const isRumoured = rumoured.has(scene.id)
    if (!reached && !isRumoured) continue // Unbekannt: existiert fuer den Spieler nicht.

    const column = columnOf.get(scene.chapter) ?? 0
    const row = nextRow(scene.chapter)
    const unlocked = evaluate(scene.requires, ctx)

    if (!reached) {
      // Nur geruechtweise bekannt: die Rueckseite der Karte. Kein Titel, kein
      // Bild, kein POV, kein Code — hoechstens der in-fiction Sperrhinweis, und
      // der ist so formuliert, dass er den Weg zeigt statt den Inhalt.
      const card: ReadingCard = {
        id: scene.id,
        chapter: scene.chapter,
        state: unlocked ? 'rumoured' : 'locked',
        column,
        row,
        jumpable: false,
      }
      if (!unlocked && scene.lockHintKey) card.lockHintKey = scene.lockHintKey
      cards.push(card)
      continue
    }

    const state: CardState =
      !unlocked ? 'locked'
        : scene.kind === 'deadend' && know?.outcome ? 'exhausted'
          : know?.outcome ? 'completed'
            : 'reached'

    cards.push({
      id: scene.id,
      chapter: scene.chapter,
      state,
      column,
      row,
      code: scene.code,
      kind: scene.kind,
      titleKey: scene.titleKey,
      summaryKey: scene.summaryKey,
      povKey: `pov.${scene.pov}`,
      artId: scene.pages[0]?.id,
      ...(know?.outcome ? { outcome: know.outcome } : {}),
      jumpable: true,
    })

    for (const to of reg.targetsOf(scene)) {
      if (!meta.scenes[to]?.reached && !rumoured.has(to)) continue
      const taken = (know?.taken ?? []).length > 0 && meta.scenes[to]?.reached === true
      edges.push({ from: scene.id, to, style: taken ? 'taken' : 'known' })
    }
  }

  return {
    book,
    columns: chapters.map((c, i) => ({ id: c.id, titleKey: c.titleKey, accent: c.accent, order: i })),
    cards,
    edges,
  }
}

/**
 * Textfassung derselben Auslegung — Barrierefreiheits-Fallback und auf einem
 * schmalen Telefon die ehrlich bessere Ansicht.
 */
export function readingAsList(reading: Reading): { column: string; cards: ReadingCard[] }[] {
  return reading.columns.map(col => ({
    column: col.id,
    cards: reading.cards.filter(c => c.chapter === col.id).sort((a, b) => a.row - b.row),
  }))
}
