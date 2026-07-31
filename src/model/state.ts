/**
 * Laufzeit-Zustand. Zwei Schichten, und der Unterschied ist die wichtigste Regel
 * des ganzen Spiels (`MASTER_PROMPT.md` § 3.9):
 *
 * | Schicht  | Inhalt                                                        | Sprung |
 * |----------|---------------------------------------------------------------|--------|
 * | RunState | Werte, XP, Level, Muenzen, Inventar, Flags, Talente, Position  | rollt zurueck |
 * | MetaState| Besuchte Szenen, Ausgaenge, Codex, Karten, Erfolge, Enden      | nie |
 *
 * Widerspruch in der Vorlage, hier bewusst aufgeloest: `_reference/02-…` § 5
 * zaehlt in der Snapshot-Liste auch Karten und Codex auf, waehrend dieselbe
 * Datei zwei Absaetze weiter (und `MASTER_PROMPT.md` § 3.9 als Nicht-Verhandelbares)
 * beide ausdruecklich zum Meta-Wissen erklaert. Die Regel gewinnt: ein Snapshot
 * traegt ausschliesslich RunState. Vermerkt in `status.md`.
 */

import type {
  AchievementId, Background, BookId, CardId, CodexId, EndingId, ItemId,
  Lang, Outcome, SceneId, StatId, TalentId,
} from './types.ts'

/** Aktuelle Save-Schema-Version. Bei JEDER brechenden Aenderung hochzaehlen. */
export const SAVE_SCHEMA = 1

export type Stats = Record<StatId, number>

export interface RunState {
  book: BookId
  scene: SceneId
  /** Index innerhalb `scene.pages`. */
  page: number
  stats: Stats
  /**
   * Wertetafeln der Interlude-Figuren, wie sie sich im Laufe des Buches
   * entwickeln. Getrennt von `stats` — siehe `Scene.sheet`.
   */
  sheets: Record<string, Stats>
  xp: number
  level: number
  coin: number
  items: Record<ItemId, number>
  flags: Record<string, boolean>
  talents: TalentId[]
  /** Versteckter Zaehler: wie sehr die Goetter hinsehen. Steigt mit Fuegung. */
  attention: number
  /** Seed des Laufs. Ein Sprung zurueck wuerfelt deshalb dasselbe Ergebnis. */
  seed: number
  /** Wie viele Wuerfe seit Laufbeginn gezogen wurden — Teil des Snapshots. */
  rolls: number
  /** Bereits abgehandelte Szenen-`onEnter` (idempotent). */
  entered: SceneId[]
  /** Bereits abgehandelte Seiten-Effekte. */
  pagesApplied: string[]
  /** Bereits ausgeloeste, nicht wiederholbare Interaktionen. */
  interactionsUsed: string[]
  playtimeMs: number
}

/** Was der Spieler ueber eine Szene weiss. Waechst monoton, rollt nie zurueck. */
export interface SceneKnowledge {
  /** Szene betreten → Titel, Zusammenfassung und Bild duerfen gezeigt werden. */
  reached: boolean
  /** Ausgang genommen → Ergebnis-Abzeichen bekannt. */
  outcome?: Outcome
  /** Welche Auswahl-IDs an diesem Ausgang schon genommen wurden. */
  taken: string[]
}

export interface MetaState {
  /** Wissen pro Szene. Fehlender Schluessel = nie erreicht = im Graph unsichtbar. */
  scenes: Record<SceneId, SceneKnowledge>
  codex: CodexId[]
  cards: CardId[]
  achievements: AchievementId[]
  endings: EndingId[]
  /** Wie oft ein Lauf zu Ende ging — "Kruppe beginnt von neuem". */
  gameOvers: number
  /** Insgesamt gelesene Seiten-IDs, fuer die Abdeckungsanzeige. */
  pagesRead: string[]
}

/** Der eingefrorene RunState beim ERSTEN Betreten einer Szene. */
export interface Snapshot {
  schema: number
  run: RunState
}

export interface ProfileSettings {
  lang: Lang
  fontScale: number
  lineWidth: 'narrow' | 'normal' | 'wide'
  serif: boolean
  dyslexic: boolean
  contrast: 'normal' | 'high'
  reduceMotion: boolean
  textSpeed: 'instant' | 'fast' | 'slow'
  autoAdvance: boolean
  muted: boolean
  volume: number
}

export interface Profile {
  id: string
  name: string
  /** Deck-Sigill als Wiedererkennung auf dem Startbildschirm. */
  sigil: string
  background: Background
  pronouns: 'she' | 'he' | 'they'
  createdAt: string
  playedAt: string
}

export interface SaveFile {
  schema: number
  profile: Profile
  settings: ProfileSettings
  meta: MetaState
  run: RunState
  checkpoints: Record<SceneId, Snapshot>
  updatedAt: string
}
