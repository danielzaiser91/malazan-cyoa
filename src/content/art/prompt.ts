/**
 * Baut aus einem `ArtPrompt` die Zeichenkette, die an den Anbieter geht.
 * Rein und deterministisch — derselbe Prompt ergibt denselben Hash, und der
 * Hash entscheidet in `tools/art.mjs`, ob ein Bild neu erzeugt werden muss.
 */

import type { ArtPrompt } from './types.ts'
import { CHARACTER_SHEETS, MOOD_PHRASE, PALETTES, PLACE_SHEETS, STYLE_SUFFIX } from './style.ts'

export function buildPrompt(p: ArtPrompt): string {
  const parts: string[] = [p.subject.trim()]
  for (const c of p.characters ?? []) {
    const sheet = CHARACTER_SHEETS[c]
    if (sheet) parts.push(sheet)
  }
  if (p.place) {
    const sheet = PLACE_SHEETS[p.place]
    if (sheet) parts.push(sheet)
  }
  if (p.detail) parts.push(p.detail.trim())
  parts.push(MOOD_PHRASE[p.mood])
  parts.push(PALETTES[p.palette].phrase)
  return parts.join('. ').replace(/\.\.+/g, '.') + '. ' + STYLE_SUFFIX
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
