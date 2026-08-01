/**
 * Baut aus einem `ArtPrompt` die Zeichenkette, die an den Anbieter geht.
 * Rein und deterministisch — derselbe Prompt ergibt denselben Hash, und der
 * Hash entscheidet in `tools/art.mjs`, ob ein Bild neu erzeugt werden muss.
 *
 * Vorlage (`_reference/art-production-plan.md` § 3):
 *
 *     {STIL-ANKER}. {WELT-ANKER}. {SZENE}. {LICHT}. {KOMPOSITION}.
 *
 * Die beiden Anker stehen vorn. Das ist kein Geschmack: Die ersten Tokens
 * wiegen beim Modell am schwersten, und Look UND Epoche sind das, was ueber
 * 436 Bilder hinweg gleich bleiben muss.
 */

import type { ArtPrompt, ArtTier } from './types.ts'
import { CHARACTER_SHEETS, MOOD_PHRASE, PALETTES, PLACE_SHEETS, STATION_SHEETS, STYLE_ANCHOR, WORLD_ANCHOR, CLOSE_ANCHOR, CLOSE_COMPOSITION } from './style.ts'

/** Vierter Block der Vorlage, aus der Stufe abgeleitet. */
export const COMPOSITION: Record<ArtTier, string> = {
  hero: 'wide establishing shot, deep space, low horizon',
  standard: 'medium wide shot, one clear focal point, readable at thumbnail size',
  filler: 'tight simple shot, one object or gesture',
}

/** Szene: was zu sehen ist, wer darin vorkommt, wo es spielt. */
export function sceneBlock(p: ArtPrompt): string {
  const parts: string[] = [p.subject.trim()]
  // Charakterblaetter WORTGLEICH einsetzen — nie aus dem Gedaechtnis neu
  // beschreiben, sonst driftet die Figur ueber die Bilder hinweg.
  for (const c of p.characters ?? []) {
    const sheet = CHARACTER_SHEETS[c]
    if (sheet) parts.push(sheet)
  }
  // Standesblaetter direkt hinter die Figuren: Sie beschreiben Menschen, nicht
  // Kulisse, und stehen deshalb vor dem Ort.
  for (const s of p.station ?? []) {
    const sheet = STATION_SHEETS[s]
    if (sheet) parts.push(sheet)
  }
  if (p.place) {
    const sheet = PLACE_SHEETS[p.place]
    if (sheet) parts.push(sheet)
  }
  if (p.detail) parts.push(p.detail.trim())
  return parts.join('. ')
}

/** Licht: Stimmung und Palette. */
export function lightBlock(p: ArtPrompt): string {
  return `${MOOD_PHRASE[p.mood]}. ${PALETTES[p.palette].phrase}`
}

export function buildPrompt(p: ArtPrompt): string {
  // Stil, dann Welt, dann Szene. Der Weltanker steht vor der Szene, weil er
  // ihre Requisiten mitbestimmt — steht er hinten, hat das Modell die Epoche
  // laengst gewaehlt. (Warum es ihn gibt: `style.ts`, `WORLD_ANCHOR`.)
  const anchor = p.framing === 'close' ? CLOSE_ANCHOR : STYLE_ANCHOR
  const frame = p.framing === 'close' ? CLOSE_COMPOSITION : COMPOSITION[p.tier]
  return [anchor, WORLD_ANCHOR, sceneBlock(p) + '.', lightBlock(p) + '.', frame + '.']
    .join(' ')
    .replace(/\.\.+/g, '.')
}

/** Stabiler 32-Bit-Hash des fertigen Prompts (FNV-1a), hex, acht Stellen. */
export function promptHash(p: ArtPrompt): string {
  const text = buildPrompt(p)
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}
