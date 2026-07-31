/**
 * Deterministischer Zufall. `Math.random()` ist im Core verboten — sonst laesst
 * sich ein Lauf weder simulieren noch nach einem Sprung identisch wiederholen.
 *
 * Das Verfahren ist mulberry32: ein Seed plus ein Zaehler ergeben denselben Wurf.
 * Der Zaehler liegt im RunState und rollt mit einem Sprung zurueck — Neuladen
 * kann einen misslungenen Wurf deshalb NICHT neu wuerfeln.
 */

/** Ein Wurf aus [0,1), rein aus (seed, index) berechnet. */
export function roll01(seed: number, index: number): number {
  let t = (seed + 0x6d2b79f5 * (index + 1)) >>> 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Ganzzahl aus [0, max). */
export function rollInt(seed: number, index: number, max: number): number {
  return Math.floor(roll01(seed, index) * max)
}

/** Ein Wuerfel mit `sides` Seiten, Ergebnis 1..sides. */
export function rollDie(seed: number, index: number, sides = 6): number {
  return rollInt(seed, index, sides) + 1
}

/**
 * Wandelt eine beliebige Zeichenkette in einen Seed. Damit kann ein Profil einen
 * merkbaren Seed tragen ("Kruppes Auslegung Nr. …") statt einer nackten Zahl.
 */
export function seedFrom(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
