/**
 * Bild-Prompts. Der Stil-Anker ist die teuerste Konstante des Projekts —
 * wenn er aus einem Prompt herausfaellt, faellt ein Bild aus der Reihe, und
 * das merkt man erst, wenn 436 nebeneinanderliegen.
 */

import { describe, expect, it } from 'vitest'
import { artPrompts } from '../../src/content/index.ts'
import { buildPrompt, promptHash, COMPOSITION } from '../../src/content/art/prompt.ts'
import { CHARACTER_SHEETS, MOOD_PHRASE, PALETTES, PLACE_SHEETS, STYLE_ANCHOR } from '../../src/content/art/style.ts'
import { ART_MOODS } from '../../src/model/types.ts'

describe('Stil-Anker', () => {
  it('steht wortgleich am Anfang JEDES Prompts', () => {
    const bad = artPrompts.filter(p => !buildPrompt(p).startsWith(STYLE_ANCHOR)).map(p => p.id)
    expect(bad).toEqual([])
  })

  it('enthaelt keine Verneinung', () => {
    // FLUX.2 hat keine Negative Prompts. "no text" erzeugt Text — gemessen.
    const forbidden = /\b(no|not|without|avoid|never|free of)\b/i
    expect(forbidden.test(STYLE_ANCHOR)).toBe(false)
  })

  it('traegt die drei Projektregeln, die kein Geschmack sind', () => {
    for (const rule of [
      'figures small against architecture and sky',
      'plain unmarked surfaces and bare stone',
      'generous empty margin at the frame edge',
    ]) expect(STYLE_ANCHOR).toContain(rule)
  })
})

describe('Prompt-Vorlage', () => {
  it('jeder Prompt traegt alle vier Bloecke', () => {
    const problems: string[] = []
    for (const p of artPrompts) {
      const text = buildPrompt(p)
      if (!text.includes(p.subject.trim())) problems.push(`${p.id}: Szene fehlt`)
      if (!text.includes(MOOD_PHRASE[p.mood])) problems.push(`${p.id}: Licht fehlt`)
      if (!text.includes(PALETTES[p.palette].phrase)) problems.push(`${p.id}: Palette fehlt`)
      if (!text.includes(COMPOSITION[p.tier])) problems.push(`${p.id}: Komposition fehlt`)
    }
    expect(problems).toEqual([])
  })

  it('jedes Charakterblatt steht WORTGLEICH im Prompt', () => {
    const problems: string[] = []
    for (const p of artPrompts) {
      for (const c of p.characters ?? []) {
        if (!CHARACTER_SHEETS[c]) { problems.push(`${p.id}: unbekannte Figur "${c}"`); continue }
        if (!buildPrompt(p).includes(CHARACTER_SHEETS[c])) problems.push(`${p.id}: Blatt "${c}" nicht wortgleich`)
      }
      if (p.place && !PLACE_SHEETS[p.place]) problems.push(`${p.id}: unbekannter Ort "${p.place}"`)
    }
    expect(problems).toEqual([])
  })

  it('kein Prompt enthaelt eine Verneinung', () => {
    const forbidden = /\b(no text|no watermark|no signature|without any|avoid)\b/i
    const bad = artPrompts.filter(p => forbidden.test(buildPrompt(p))).map(p => p.id)
    expect(bad).toEqual([])
  })

  it('jede Stimmung und jede Stufe hat ihre Formulierung', () => {
    for (const m of ART_MOODS) expect(MOOD_PHRASE[m]).toBeTruthy()
    for (const t of ['hero', 'standard', 'filler'] as const) expect(COMPOSITION[t]).toBeTruthy()
  })
})

describe('Reproduzierbarkeit', () => {
  it('der Prompt-Hash ist stabil und je Prompt eindeutig', () => {
    const hashes = artPrompts.map(promptHash)
    expect(hashes).toEqual(artPrompts.map(promptHash))
    // Zwei Seiten mit identischem Prompt waeren ein Content-Fehler: dann
    // erzeugt die Pipeline zweimal dasselbe Bild fuer zwei Szenen.
    const dupes = hashes.filter((h, i) => hashes.indexOf(h) !== i)
    expect([...new Set(dupes)]).toEqual([])
  })
})
