/**
 * Das Datenmodell des Spiels. Verbindlich spezifiziert in
 * `_reference/02-story-graph-save-and-ui.md` § 4.
 *
 * Zwei harte Regeln, die diese Datei durchsetzt:
 *  1. **Content traegt keinen Anzeigetext.** Ueberall stehen i18n-Schluessel
 *     (`*Key`), niemals Saetze. Ein deutscher Satz in `src/content/` ist ein Bug.
 *  2. **Content ist serialisierbar.** Keine Funktionen, keine Klassen, kein `eval`.
 *     Bedingungen und Effekte sind deklarative Datenstrukturen — nur so laesst sich
 *     der ganze Graph headless simulieren und validieren.
 */

// ---------------------------------------------------------------------------
// Identitaeten
// ---------------------------------------------------------------------------

/** `b1` — Buch. Nie hartkodiert; die Engine kennt beliebig viele Buecher. */
export type BookId = string
/** `b1.c03` */
export type ChapterId = string
/** `b1.c03.s02` — die springbare Einheit. Stabil, wird nie umnummeriert. */
export type SceneId = string
/** `b1.c03.s02.p04` — ein Bildschirm, genau eine Illustration. */
export type PageId = string

export type CharacterId = string
export type ItemId = string
export type CardId = string
export type CodexId = string
export type TalentId = string
export type AchievementId = string
export type EndingId = string
export type ArtPromptId = string

/** Die sechs Werte aus dem Design-Plan § 4. Alle thematisch, alle sichtbar, alle geprueft. */
export type StatId = 'blade' | 'will' | 'cunning' | 'heart' | 'standing' | 'fortune'

export const STAT_IDS: readonly StatId[] = ['blade', 'will', 'cunning', 'heart', 'standing', 'fortune']

/** Hintergrund des Rekruten — gewaehlt bei der Profilanlage. */
export type Background = 'marine' | 'sapper' | 'mage'

export const BACKGROUNDS: readonly Background[] = ['marine', 'sapper', 'mage']

export type Lang = 'de' | 'en'

export const LANGS: readonly Lang[] = ['de', 'en']

// ---------------------------------------------------------------------------
// Bedingungen und Effekte — deklarativ, serialisierbar, testbar
// ---------------------------------------------------------------------------

export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { stat: StatId; gte: number }
  | { flag: string }
  | { item: ItemId; count?: number }
  | { visited: SceneId }
  | { card: CardId }
  | { talent: TalentId }
  | { background: Background }
  | { coin: number }
  | { level: number }

export type Effect =
  | { stat: StatId; add: number }
  | { flag: string; set: boolean }
  | { item: ItemId; add: number }
  | { xp: number }
  | { coin: number }
  | { card: CardId }
  | { codex: CodexId }
  | { achievement: AchievementId }
  /** Goettliche Aufmerksamkeit — die versteckte Kehrseite von Fuegung. */
  | { attention: number }

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

/** Stimmungs-Tag der Illustration; steuert Licht und Palette der Bild-Pipeline. */
export type ArtMood =
  | 'siege'
  | 'street-night'
  | 'warren'
  | 'dream'
  | 'council'
  | 'march'
  | 'ruin'
  | 'duel'
  | 'divine'
  | 'aftermath'

export const ART_MOODS: readonly ArtMood[] = [
  'siege', 'street-night', 'warren', 'dream', 'council',
  'march', 'ruin', 'duel', 'divine', 'aftermath',
]

/** Laengenband einer Seite. Wortzahlen stehen in `core/wordbands.ts`. */
export type Band = 'beat' | 'standard' | 'long'

export type SceneKind = 'convergence' | 'spine' | 'branch' | 'side' | 'deadend' | 'ending'

export type SpoilerScope = 'gotm' | 'series'

export interface ArtRef {
  promptId: ArtPromptId
  /** i18n-Schluessel des Alt-Textes — zweisprachig, Pflicht auf jeder Seite. */
  altKey: string
  mood: ArtMood
}

/** Ein zusaetzlicher Absatz, der nur unter einer Bedingung erscheint. */
export interface Insert {
  when: Condition
  bodyKey: string
}

/**
 * Interaktion INNERHALB einer Szene. Darf Flags, Werte, Codex und Karten setzen —
 * aber niemals die naechste Szene aendern. Das ist der Preis dafuer, dass ein
 * Checkpoint immer ein Szenen-Eingang ist.
 */
export interface Interaction {
  id: string
  labelKey: string
  /** Text, der nach der Interaktion an der Seite erscheint. */
  responseKey: string
  requires?: Condition
  lockHintKey?: string
  effects?: Effect[]
  /** Mehrfach ausloesbar? Standard: nein (Gespraechsknoten brennen ab). */
  repeatable?: boolean
}

export interface Page {
  id: PageId
  bodyKey: string
  band: Band
  art: ArtRef
  inserts?: Insert[]
  interactions?: Interaction[]
  /** Einmalig beim ersten Betreten der Seite angewandt. */
  effects?: Effect[]
}

export type Risk = 'safe' | 'costly' | 'dangerous' | 'lethal'

/**
 * Wertprobe an einer Auswahl. Bewusst NICHT versteckt: die View zeigt Wert,
 * Schwierigkeit und die Fuegungs-Option, bevor gewuerfelt wird
 * (`01-cyoa-best-practices.md` § 5 — "show the stat before it is tested").
 * Ein Fehlschlag fuehrt in einen anderen Zweig, er blockiert nicht.
 */
export interface Check {
  stat: StatId
  /** Zielwert fuer `stat + W6`. */
  dc: number
  /** Ziel bei Misserfolg. Pflicht — eine Probe darf nie in eine Sackgasse laufen. */
  fail: SceneId
  /**
   * Darf Fuegung mitgeworfen werden? Kostet goettliche Aufmerksamkeit.
   * Die View bietet das als zweite, sichtbar teurere Variante an.
   */
  fortune?: boolean
}

export interface Choice {
  id: string
  labelKey: string
  to: SceneId
  requires?: Condition
  /** Warum gesperrt — in-fiction. Pflicht, sobald `requires` gesetzt ist. */
  lockHintKey?: string
  costs?: Effect[]
  risk?: Risk
  check?: Check
  /** Ergebnis-Abzeichen, das diese Szene im Flowchart traegt, wenn hier abgebogen wird. */
  outcome?: Outcome
  /** Verlangt eine zweite, in-fiction formulierte Bestaetigung. */
  confirm?: boolean
  confirmKey?: string
}

export type Exit =
  | { type: 'goto'; to: SceneId }
  | { type: 'choice'; choices: Choice[] }
  | { type: 'gameover'; reasonKey: string; outcome: Outcome; suggest: SceneId[] }
  | { type: 'ending'; endingId: EndingId }

/** Ergebnis-Abzeichen im Flowchart. Traegt immer ein Glyph — nie nur Farbe. */
export type Outcome = 'death' | 'captured' | 'toolate' | 'lore' | 'loop' | 'progress' | 'ending'

export interface Scene {
  id: SceneId
  /** Anzeige-Code wie `3.2b`. Autoren-kontrolliert, pro Buch eindeutig. */
  code: string
  kind: SceneKind
  chapter: ChapterId
  titleKey: string
  summaryKey: string
  pov: CharacterId
  spoilerScope: SpoilerScope
  pages: Page[]
  exit: Exit
  /** Einmalig beim ersten Betreten gewaehrt (idempotent ueber die Szenen-ID). */
  onEnter?: Effect[]
  requires?: Condition
  lockHintKey?: string
  /**
   * Interlude: gespielt als Kanon-Figur statt als Rekrut. Verweist auf eine
   * feste Wertetafel in `ContentPack.sheets`. Werte-Effekte und Proben laufen
   * dann ueber DIESE Tafel — die Werte des Spielcharakters bleiben unberuehrt,
   * damit sich die beiden Erzaehlspuren nie mechanisch verheddern.
   * Flags, Codex, Karten, XP und Erfolge gehoeren weiterhin dem Spieler.
   */
  sheet?: string
}

/** Feste Wertetafel einer Kanon-Figur fuer Interludes. */
export interface SheetDef {
  id: string
  titleKey: string
  stats: Record<StatId, number>
}

export interface Chapter {
  id: ChapterId
  code: string
  order: number
  titleKey: string
  /** Akzentfarbe der Spalte im Flowchart, aus der Stil-Bibel. */
  accent: string
  scenes: Scene[]
}

export interface Ending {
  id: EndingId
  titleKey: string
  summaryKey: string
  cardId: CardId
}

export interface Book {
  id: BookId
  titleKey: string
  entry: SceneId
  chapters: Chapter[]
  endings: Ending[]
}

// ---------------------------------------------------------------------------
// Codex, Karten, Talente, Items — Stammdaten (ebenfalls textfrei)
// ---------------------------------------------------------------------------

export type CodexCategory =
  | 'people' | 'peoples' | 'places' | 'magic' | 'deck' | 'history' | 'words'

export interface CodexEntry {
  id: CodexId
  category: CodexCategory
  titleKey: string
  bodyKey: string
  spoilerScope: SpoilerScope
  /** Verwandte Eintraege — im Codex als Querverweise gerendert. */
  see?: CodexId[]
}

export interface CardDef {
  id: CardId
  /** Haus der Karte oder `unaligned`. */
  house: 'life' | 'death' | 'light' | 'dark' | 'shadow' | 'unaligned'
  titleKey: string
  bodyKey: string
  /**
   * Karten sind META-Wissen (siehe Save-Spezifikation): Sie rollen bei einem
   * Sprung NICHT zurueck. Ihre Wirkung ist deshalb bewusst eine Auslegungs-Hilfe
   * (eine benachbarte Karte aufdecken) und niemals ein Kampfbonus.
   */
  reveals?: number
}

export interface TalentDef {
  id: TalentId
  titleKey: string
  /** Nennt die Wirkung im Klartext — Sichtbarkeitsregel aus den Feel-Regeln. */
  effectKey: string
  requires?: Condition
}

export interface ItemDef {
  id: ItemId
  titleKey: string
  bodyKey: string
  /** Verbrauchsgut oder Schluesselgegenstand. */
  kind: 'consumable' | 'key' | 'gear'
}

export interface AchievementDef {
  id: AchievementId
  titleKey: string
  bodyKey: string
  /** Vor dem Erreichen verborgen? */
  secret?: boolean
}

/** Alles, was eine Buchausgabe an Stammdaten mitbringt. */
export interface ContentPack {
  books: Book[]
  codex: CodexEntry[]
  cards: CardDef[]
  talents: TalentDef[]
  items: ItemDef[]
  achievements: AchievementDef[]
  sheets: SheetDef[]
}
