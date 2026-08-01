/**
 * Bild-Prompts. Der Stil-Anker ist die teuerste Konstante des Projekts —
 * wenn er aus einem Prompt herausfaellt, faellt ein Bild aus der Reihe, und
 * das merkt man erst, wenn 436 nebeneinanderliegen.
 */

import { describe, expect, it } from 'vitest'
import { artPrompts, content } from '../../src/content/index.ts'
import { buildPrompt, promptHash, COMPOSITION } from '../../src/content/art/prompt.ts'
import { CHARACTER_SHEETS, CLOSE_ANCHOR, CLOSE_COMPOSITION, FORBIDDEN_PERIOD_MARKERS, MODERATION_TRIGGERS, MOOD_PHRASE, PALETTES, PLACE_SHEETS, REFERENCE_ANCHOR, STATION_SHEETS, STYLE_ANCHOR, WORLD_ANCHOR } from '../../src/content/art/style.ts'
import { ART_MOODS } from '../../src/model/types.ts'
import { illustration } from '../../src/core/placeholder.ts'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

describe('Stil-Anker', () => {
  it('steht wortgleich am Anfang JEDES Prompts', () => {
    const bad = artPrompts.filter(p => !buildPrompt(p).startsWith(p.framing === 'close' ? CLOSE_ANCHOR : STYLE_ANCHOR)).map(p => p.id)
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

  it('der Weltanker steht in JEDEM Prompt und verneint nichts', () => {
    // Gemessen am 01.08.2026 an Kapitel 1: Ohne Epochen-Angabe waehlt das
    // Modell die am besten belegte — "graue Kolonne im flachen Tageslicht"
    // wurde zum Ersten Weltkrieg, in einem Bild samt asphaltierter Strasse
    // mit Mittelstreifen. Der Prolog kam nur durch, weil Feuer, Nacht und
    // Festungsmauer die Epoche selbst mitbringen.
    const bad = artPrompts.filter(p => !buildPrompt(p).includes(WORLD_ANCHOR)).map(p => p.id)
    expect(bad).toEqual([])
    expect(/\b(no|not|without|avoid|never|free of)\b/i.test(WORLD_ANCHOR)).toBe(false)
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
      // Eine Naheinstellung traegt statt der Stufen-Komposition ihre eigene:
      // `wide establishing shot` und `only shoulder and jaw in frame` sind
      // nicht beide gleichzeitig erfuellbar, und der Anker gewinnt.
      const frame = p.framing === 'close' ? CLOSE_COMPOSITION : COMPOSITION[p.tier]
      if (!text.includes(frame)) problems.push(`${p.id}: Komposition fehlt`)
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

  // Bewusst eng: NICHT jede Verneinung ist schaedlich. "ohne Dankbarkeit",
  // "kein Wind, obwohl das Gras sich bewegt", "keiner von beiden ganz da" —
  // alle drei haben tadellose Bilder ergeben, weil sie eine Haltung, einen
  // Zustand oder einen Vorgang beschreiben, fuer den es keine positive Fassung
  // gibt. Ein pauschales Verbot wuerde sie mitreissen.
  //
  // Schaedlich ist die AUFZAEHLUNG verneinter Requisiten — die liest das Modell
  // als Einkaufsliste. "no text, no watermark" erzeugte in vier von sechs
  // Bildern Text; "no gore, no snarl" stand in dem einen Motiv des Kapitels,
  // das seinen Bildausschnitt verfehlt hat.
  it('kein Motivtext zaehlt verneinte Requisiten auf', () => {
    const list = /\bno\s+\w+\s*,\s*no\s+\w+/i
    const bad = artPrompts
      .filter(p => list.test(`${p.subject} ${p.detail ?? ''}`))
      .map(p => p.id)
    expect(bad).toEqual([])
  })

  it('jede Stimmung und jede Stufe hat ihre Formulierung', () => {
    for (const m of ART_MOODS) expect(MOOD_PHRASE[m]).toBeTruthy()
    for (const t of ['hero', 'standard', 'filler'] as const) expect(COMPOSITION[t]).toBeTruthy()
  })

  // Dreimal derselbe Konstruktionsfehler, dreimal teuer: `council` enthielt
  // `candlelit interior` und zwang jede Ratsszene nach drinnen, `march` eine
  // `wide plain` und machte aus einer Musterung auf dem Stadtplatz eine
  // Marschkolonne in der Steppe, `aftermath` ein `still bodies` und liess
  // einen Prompt zweimal an der Moderation scheitern, in dessen MOTIV kein
  // Reizwort mehr stand.
  //
  // Ein Stimmungsbaustein beschreibt Licht und Bildgeometrie. Ort, Motiv und
  // Requisiten gehoeren ins Motiv, sonst kann das Motiv sie nicht ueberschreiben
  // — und niemand sucht die Ursache dort, wo sie steht.
  //
  // Ausgenommen sind die drei Stimmungen, die ihren Ort im NAMEN tragen: bei
  // `street-night`, `siege` und `ruin` ist er die Stimmung.
  it('kein Stimmungsbaustein schreibt einen Ort vor', () => {
    const place = /\b(interior|indoors|plain|field|room|hall|street|chamber|courtyard|tavern)\b/i
    const bad = ART_MOODS
      .filter(m => !['street-night', 'siege', 'ruin'].includes(m))
      .filter(m => place.test(MOOD_PHRASE[m]))
    expect(bad).toEqual([])
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

describe('Auslieferung', () => {
  // Bis zum 01.08.2026 hat die Story-Ansicht IMMER den deterministischen
  // Platzhalter gesetzt und die echten Dateien nie angefasst — 56 bezahlte
  // Illustrationen lagen im Build und waren nirgends zu sehen. Aufgefallen ist
  // es erst, als ein Vorschaubild fuers Portfolio den Platzhalter zeigte.
  it('der Bildpfad haengt am base-Pfad und nutzt beide Groessen', () => {
    const a = illustration('b1.c00.s01.p01', '/malazan-cyoa/')
    expect(a.src).toBe('/malazan-cyoa/illustrations/b1.c00.s01.p01.webp')
    expect(a.srcset).toContain('b1.c00.s01.p01@640.webp 640w')
    expect(a.srcset).toContain('b1.c00.s01.p01.webp 1280w')
    // Ein absoluter Pfad ohne base waere auf GitHub Pages tot.
    expect(illustration('x', '/').src).toBe('/illustrations/x.webp')
  })

  // Gemeldet am 01.08.2026: "viele Platzhalter existieren noch, warum?" — genau
  // deshalb. Der Pfad hing an der Seiten-ID, und eine geteilte Seite heisst
  // `…p01b`, waehrend ihr Bild `…p01.webp` heisst.
  it('jede Seite findet ihr Bild, auch die zweite Haelfte einer geteilten', () => {
    const dir = join(import.meta.dirname, '..', '..', 'public', 'illustrations')
    if (!existsSync(dir)) return
    const missing: string[] = []
    for (const book of content.books)
      for (const chapter of book.chapters)
        for (const scene of chapter.scenes)
          for (const page of scene.pages) {
            const file = illustration(page.art.promptId, '/').src.replace('/illustrations/', '')
            if (!existsSync(join(dir, file))) missing.push(`${page.id} -> ${file}`)
          }
    expect(missing).toEqual([])
  })

  it('jedes erzeugte Bild liegt in beiden Groessen vor', () => {
    const dir = join(import.meta.dirname, '..', '..', 'public', 'illustrations')
    if (!existsSync(dir)) return
    const big = readdirSync(dir).filter(f => f.endsWith('.webp') && !f.includes('@640'))
    const missing = big.filter(f => !existsSync(join(dir, f.replace('.webp', '@640.webp'))))
    expect(missing).toEqual([])
  })
})
