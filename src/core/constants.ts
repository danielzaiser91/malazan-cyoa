/**
 * Alle Balance-Zahlen an EINEM Ort. Aendern heisst: hier anfassen, dann Simulator
 * laufen lassen. Nirgends sonst darf eine dieser Zahlen erneut auftauchen.
 */

import type { Background, Band, StatId } from '../model/types.ts'

/** Startwerte je Hintergrund (Design-Plan § 3). Basis 1 auf allem. */
export const START_STATS: Record<Background, Record<StatId, number>> = {
  marine: { blade: 3, will: 1, cunning: 1, heart: 2, standing: 1, fortune: 1 },
  sapper: { blade: 2, will: 1, cunning: 3, heart: 1, standing: 1, fortune: 1 },
  mage:   { blade: 1, will: 3, cunning: 2, heart: 1, standing: 1, fortune: 1 },
}

export const START_COIN = 10

/**
 * Wortbaender. Gilt fuer DE und EN getrennt.
 *
 * Am 01.08.2026 gesenkt (vorher 60–110 / 120–200 / 220–320). Grund ist kein
 * Geschmack, sondern eine gerechnete Grenze: **Ab 800 px Fensterhoehe darf eine
 * Seite nicht scrollen.** Wer scrollt, sieht die Auswahlmoeglichkeiten nicht,
 * waehrend er den Text liest, und entscheidet damit blind.
 *
 * Das Budget (Herleitung in `_reference/ux-befunde.md` § 1): Von 800 px gehen
 * Kopfzeile, Meta-Zeile, POV-Zeile, Abstand und Auswahl ab. Es bleiben 600 px
 * fuer eine Seite mit "Weiter" und 480 px am Szenenende mit drei Optionen —
 * bei 27 px Zeilenhoehe und ~10 Woertern je Zeile also rund 200 beziehungsweise
 * 160 Woerter.
 */
export const WORD_BANDS: Record<Band, { min: number; max: number }> = {
  beat: { min: 50, max: 90 },
  standard: { min: 90, max: 150 },
  long: { min: 150, max: 190 },
}

/**
 * Obergrenze fuer die LETZTE Seite einer Szene, an der mehr als eine Option
 * haengt. Dort ist das Hoehenbudget am kleinsten und die Entscheidung am
 * wichtigsten — genau die Seite darf also nicht die laengste sein.
 */
export const WORD_CAP_AT_CHOICE = 150

/** Harte Obergrenze: darueber wird die Seite geteilt, nicht diskutiert. */
export const WORD_HARD_CAP = 200

/**
 * XP-Schwellen fuer die Ascendancy-Stufen 1–10. Index 0 = Aufstieg auf Stufe 2.
 * Jede Stufe gibt +1 Wertpunkt und eine Talentwahl aus dreien.
 */
export const XP_THRESHOLDS = [40, 100, 180, 280, 400, 540, 700, 880, 1080, 1300]

export const MAX_LEVEL = 10

/** XP-Vergabe — an einer Stelle, damit die Kurve pruefbar bleibt. */
export const XP = {
  scene: 8,
  convergence: 25,
  deadendSurvivedAsKnowledge: 12,
  codexEntry: 3,
  sideArc: 20,
  mercy: 15,
} as const

/**
 * Probe: Wert + W6 gegen eine Schwierigkeit. Fuegung schiebt zusaetzlich, kostet
 * aber goettliche Aufmerksamkeit — die Muenze schneidet in beide Richtungen.
 */
export const CHECK = {
  die: 6,
  /** Jeder Punkt Fuegung gibt diesen Bonus auf zufallsgetriebene Proben. */
  fortuneBonus: 1,
  /** …und erhoeht bei jeder solchen Probe die Aufmerksamkeit um diesen Wert. */
  attentionPerFortuneUse: 1,
} as const

/** Ab dieser Aufmerksamkeit sehen die Goetter zu — schaltet toedlichere Zweige frei. */
export const ATTENTION_NOTICED = 8
export const ATTENTION_HUNTED = 16

/** Groesse der Rueckschau im Story-View. */
export const BACKLOG_SIZE = 50

/** Anzahl der Profil-Plaetze auf dem Startbildschirm. */
export const PROFILE_SLOTS = 4

/** Abdeckungs-Ziel eines einzelnen Durchlaufs auf der Hauptlinie. */
export const SPINE_COVERAGE_TARGET = 0.6

/** Maximal zulaessiges Wortzahl-Verhaeltnis zwischen Geschwister-Zweigen. */
export const PATH_BALANCE_RATIO = 3
