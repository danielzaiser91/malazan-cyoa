/**
 * Prompts sind Content, nicht Werkzeugkonfiguration: sie liegen versioniert im
 * Repo, sind im Diff lesbar, und das ganze Buch laesst sich mit einem Befehl neu
 * erzeugen. (`_reference/04-illustration-pipeline.md` § 1.2)
 */

import type { ArtMood, ArtPromptId } from '../../model/types.ts'
import type { PaletteId } from './style.ts'

/**
 * `hero`   — Kapitel-Auftakte, Konvergenzen, Enden. Bester Anbieter, mehrere
 *            Kandidaten, Auswahl von Hand. Rund 40 Bilder im ganzen Buch.
 * `standard` — der Normalfall. Bulk-Anbieter, ein Versuch, QA entscheidet.
 * `filler` — kurze Uebergaenge. Bulk mit weniger Schritten, oder der Platzhalter,
 *            wenn der besser liest.
 */
export type ArtTier = 'hero' | 'standard' | 'filler'

export interface ArtPrompt {
  id: ArtPromptId
  /** Was zu sehen ist — ein Satz, Bildsprache, kein Prosa-Zitat. */
  subject: string
  /** Schluessel in `CHARACTER_SHEETS`; werden wortwoertlich eingesetzt. */
  characters?: string[]
  /**
   * Schluessel in `STATION_SHEETS` — fuer namenlose Figurengruppen, die durch
   * ihren Stand da sind (Hofstaat, Offiziere). Nie `ornamented officials` o. Ae.
   * frei in `subject` schreiben: das Modell fuellt solche Luecken napoleonisch.
   */
  station?: string[]
  /** Schluessel in `PLACE_SHEETS`. */
  place?: string
  /** Zusaetzliches Detail zur Umgebung. */
  detail?: string
  mood: ArtMood
  palette: PaletteId
  tier: ArtTier
  /**
   * Naheinstellung. Tauscht den Stil-Anker gegen `CLOSE_ANCHOR` und die
   * Stufen-Komposition gegen `CLOSE_COMPOSITION`.
   *
   * Nicht kosmetisch: Der normale Anker verlangt `figures small against
   * architecture and sky` und liefert damit zuverlaessig Kulisse, gegen die
   * ein angeschnittenes Motiv nicht ankommt. Zweimal bezahlt gelernt.
   */
  framing?: 'close'
}
