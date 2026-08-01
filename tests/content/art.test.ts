/**
 * Bild-Prompts. Der Stil-Anker ist die teuerste Konstante des Projekts —
 * wenn er aus einem Prompt herausfaellt, faellt ein Bild aus der Reihe, und
 * das merkt man erst, wenn 436 nebeneinanderliegen.
 */

import { describe, expect, it } from 'vitest'
import { artPrompts } from '../../src/content/index.ts'
import { buildPrompt, promptHash, COMPOSITION } from '../../src/content/art/prompt.ts'
import { CHARACTER_SHEETS, FORBIDDEN_PERIOD_MARKERS, MODERATION_TRIGGERS, MOOD_PHRASE, PALETTES, PLACE_SHEETS, REFERENCE_ANCHOR, STATION_SHEETS, STYLE_ANCHOR } from '../../src/content/art/style.ts'
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
      'paint reaching to every edge of the picture',
    ]) expect(STYLE_ANCHOR).toContain(rule)
  })

  it('fordert nie wieder einen leeren Bildrand an', () => {
    // Regression zu einem gemessenen Befund (31.07.2026): Die Formulierung
    // `generous empty margin at the frame edge` hat die Signatur-Attrappen
    // ERZEUGT, gegen die sie schuetzen sollte — ein leerer Randstreifen sieht
    // aus wie die Stelle, an der ein Maler signiert. Nach dem Austausch gegen
    // die Gegenaussage trat sie in keinem Bild mehr auf.
    for (const anchor of [STYLE_ANCHOR, REFERENCE_ANCHOR]) {
      expect(anchor).not.toMatch(/empty margin|blank border|empty border/i)
    }
  })

  it('kein Charakterblatt traegt ein Reizwort der Content-Moderation', () => {
    // Gemessen: "a scarred human soldier … one long burn scar down the jaw"
    // wurde als Violence abgelehnt. Dieselbe Figur ohne die Reizwoerter kam
    // durch. Der Filter sieht das Wort, nicht die Absicht.
    const trigger = /(scar|scarred|wound|wounded|blood|bloody|mutilat\w*|corpse)/i
    const bad = Object.entries(CHARACTER_SHEETS)
      .filter(([, sheet]) => trigger.test(sheet))
      .map(([id]) => id)
    expect(bad).toEqual([])
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
      for (const s of p.station ?? []) {
        if (!STATION_SHEETS[s]) { problems.push(`${p.id}: unbekannter Stand "${s}"`); continue }
        if (!buildPrompt(p).includes(STATION_SHEETS[s])) problems.push(`${p.id}: Standesblatt "${s}" nicht wortgleich`)
      }
      if (p.place && !PLACE_SHEETS[p.place]) problems.push(`${p.id}: unbekannter Ort "${p.place}"`)
    }
    expect(problems).toEqual([])
  })

  // Gemessen am 01.08.2026 an `b1.c00.s05`: aus einem malazanischen Staatsakt
  // wurde ein Offiziersball von 1810, weil im Motiv "heavily ornamented
  // officers" stand. Das Modell fuellt abstrakte Statusbegriffe aus seinem
  // Trainingsschwerpunkt — und der ist bei Zierrat am Militaer napoleonisch.
  it('kein Prompt traegt einen Marker des 18./19. Jahrhunderts', () => {
    const bad: string[] = []
    for (const p of artPrompts) {
      const text = buildPrompt(p).toLowerCase()
      for (const m of FORBIDDEN_PERIOD_MARKERS) if (text.includes(m)) bad.push(`${p.id}: "${m}"`)
    }
    expect(bad).toEqual([])
  })

  // 6 von 26 Requests abgelehnt (01.08.2026, Kapitel 1). Ein Reizwort im
  // Motivtext kostet den Platz im Batch — und die Umformulierung ist fast
  // immer die bessere Prosa.
  it('kein Motivtext traegt ein Wort, an dem die Moderation schon abgebrochen ist', () => {
    // Wortanfang pruefen, nicht Teilstring: sonst meldet "body" das voellig
    // harmlose "nobody talking". Kein abschliessendes \b, damit "mutilat" auch
    // "mutilated" und "mutilation" fasst.
    const bad: string[] = []
    for (const p of artPrompts) {
      const text = `${p.subject} ${p.detail ?? ''}`
      for (const w of MODERATION_TRIGGERS) {
        if (new RegExp(`\\b${w}`, 'i').test(text)) bad.push(`${p.id}: "${w}"`)
      }
    }
    expect(bad).toEqual([])
  })

  // Rang wird als Material und Machart beschrieben, nie als Etikett. Wer
  // "ornamented officials" schreibt, laesst das Modell den Rest erfinden.
  //
  // Geprueft werden bewusst nur `subject` und `detail`, nicht die Blaetter:
  // `paranChild` beginnt mit "a twelve-year-old noble boy" und ist damit formal
  // ein Verstoss — aber der Rest des Blattes ist konkret, und die neun bereits
  // erzeugten Bilder mit dieser Figur sitzen. Das Blatt zu schaerfen wuerde
  // 11 Prompts und 9 bezahlte Bilder entwerten, um ein Problem zu beheben, das
  // nachweislich keines ist.
  it('kein Prompt benennt Rang abstrakt statt ihn zu beschreiben', () => {
    const vague = /\b(ornamented|richly dressed|finely dressed|in finery|nobles?|aristocrats?|dignitar\w+)\b/i
    const bad = artPrompts
      .filter(p => vague.test(`${p.subject} ${p.detail ?? ''}`))
      .map(p => p.id)
    expect(bad).toEqual([])
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
