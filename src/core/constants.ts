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

/** Wortbaender aus `_reference/01-…` § 4. Gilt fuer DE und EN getrennt. */
export const WORD_BANDS: Record<Band, { min: number; max: number }> = {
  beat: { min: 60, max: 110 },
  standard: { min: 120, max: 200 },
  long: { min: 220, max: 320 },
}

/** Harte Obergrenze: darueber wird die Seite geteilt, nicht diskutiert. */
export const WORD_HARD_CAP = 400

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
