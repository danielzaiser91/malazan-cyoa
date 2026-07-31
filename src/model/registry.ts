/**
 * Indiziert einen `ContentPack` einmal und beantwortet danach jede Frage in O(1).
 * Rein und DOM-frei: Tests, Simulator und Views nutzen dieselbe Registry.
 *
 * Nichts hier kennt `b1`. Die Buch-ID kommt immer aus den Daten.
 */

import type {
  AchievementDef, Book, BookId, CardDef, Chapter, ChapterId, CodexEntry,
  ContentPack, Ending, EndingId, ItemDef, Page, PageId, Scene, SceneId, SheetDef, TalentDef,
} from './types.ts'

export class Registry {
  readonly pack: ContentPack
  private readonly booksById = new Map<BookId, Book>()
  private readonly chaptersById = new Map<ChapterId, Chapter>()
  private readonly scenesById = new Map<SceneId, Scene>()
  private readonly pagesById = new Map<PageId, Page>()
  private readonly sceneBook = new Map<SceneId, BookId>()

  constructor(pack: ContentPack) {
    this.pack = pack
    for (const book of pack.books) {
      this.booksById.set(book.id, book)
      for (const chapter of book.chapters) {
        this.chaptersById.set(chapter.id, chapter)
        for (const scene of chapter.scenes) {
          this.scenesById.set(scene.id, scene)
          this.sceneBook.set(scene.id, book.id)
          for (const page of scene.pages) this.pagesById.set(page.id, page)
        }
      }
    }
  }

  book(id: BookId): Book | undefined { return this.booksById.get(id) }
  chapter(id: ChapterId): Chapter | undefined { return this.chaptersById.get(id) }
  scene(id: SceneId): Scene | undefined { return this.scenesById.get(id) }
  page(id: PageId): Page | undefined { return this.pagesById.get(id) }
  bookOf(scene: SceneId): BookId | undefined { return this.sceneBook.get(scene) }

  get books(): Book[] { return this.pack.books }

  /** Alle Szenen eines Buches in Kapitel-Reihenfolge. */
  scenesOf(bookId: BookId): Scene[] {
    const book = this.booksById.get(bookId)
    if (!book) return []
    return [...book.chapters]
      .sort((a, b) => a.order - b.order)
      .flatMap(c => c.scenes)
  }

  chaptersOf(bookId: BookId): Chapter[] {
    const book = this.booksById.get(bookId)
    if (!book) return []
    return [...book.chapters].sort((a, b) => a.order - b.order)
  }

  endingsOf(bookId: BookId): Ending[] { return this.booksById.get(bookId)?.endings ?? [] }

  ending(bookId: BookId, id: EndingId): Ending | undefined {
    return this.endingsOf(bookId).find(e => e.id === id)
  }

  codex(id: string): CodexEntry | undefined { return this.pack.codex.find(c => c.id === id) }
  card(id: string): CardDef | undefined { return this.pack.cards.find(c => c.id === id) }
  talent(id: string): TalentDef | undefined { return this.pack.talents.find(t => t.id === id) }
  item(id: string): ItemDef | undefined { return this.pack.items.find(i => i.id === id) }
  achievement(id: string): AchievementDef | undefined {
    return this.pack.achievements.find(a => a.id === id)
  }
  sheet(id: string): SheetDef | undefined { return this.pack.sheets.find(s => s.id === id) }

  /**
   * Alle Szenen-IDs, auf die der Ausgang einer Szene zeigt — inklusive der
   * Fehlschlag-Ziele von Proben. Eine misslungene Probe ist eine echte Kante:
   * Sie fuehrt irgendwohin, und der Graph muss das wissen, sonst gilt ein
   * Zweig, den nur ein Fehlschlag oeffnet, faelschlich als Waise.
   */
  targetsOf(scene: Scene): SceneId[] {
    switch (scene.exit.type) {
      case 'goto': return [scene.exit.to]
      case 'choice': return scene.exit.choices.flatMap(c => c.check ? [c.to, c.check.fail] : [c.to])
      case 'gameover': return []
      case 'ending': return []
    }
  }
}
