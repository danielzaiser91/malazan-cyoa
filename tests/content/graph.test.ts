/**
 * Validierungen 1–4 und 9–10 aus `_reference/02-story-graph-save-and-ui.md` § 8.
 * Referenzielle Integritaet, keine Waisen, keine Sackgassen ohne Ausgang,
 * eindeutige IDs und Codes, sinnvolle Auswahlmengen, Pfad-Balance.
 */

import { describe, expect, it } from 'vitest'
import { allScenes, i18nFor, reg } from '../helpers.ts'
import { danglingEdges, edgesOf, noExitScenes, orphans, subtreeWords } from '../../src/model/graph.ts'
import { leaves } from '../../src/core/conditions.ts'
import { PATH_BALANCE_RATIO } from '../../src/core/constants.ts'
import { wordCount } from '../../src/core/i18n.ts'

describe('1 · Referenzielle Integritaet', () => {
  it('jede Kante zeigt auf eine existierende Szene', () => {
    for (const book of reg.books) {
      expect(danglingEdges(reg, book.id).map(e => `${e.from} → ${e.to}`)).toEqual([])
    }
  })

  it('jedes Probe-Fehlschlagziel existiert', () => {
    const missing: string[] = []
    for (const scene of allScenes()) {
      if (scene.exit.type !== 'choice') continue
      for (const c of scene.exit.choices) {
        if (c.check && !reg.scene(c.check.fail)) missing.push(`${scene.id}/${c.id} → ${c.check.fail}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('jedes vorgeschlagene Game-Over-Ziel und jede visited-Bedingung existiert', () => {
    const missing: string[] = []
    for (const scene of allScenes()) {
      if (scene.exit.type === 'gameover') {
        for (const s of scene.exit.suggest) if (!reg.scene(s)) missing.push(`${scene.id}.suggest → ${s}`)
      }
      const conds = [scene.requires, ...scene.pages.flatMap(p => (p.inserts ?? []).map(i => i.when))]
      for (const c of conds.flatMap(x => leaves(x))) {
        if ('visited' in c && !reg.scene(c.visited)) missing.push(`${scene.id}.requires.visited → ${c.visited}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('jede Endkennung eines ending-Ausgangs ist im Buch registriert', () => {
    const missing: string[] = []
    for (const book of reg.books) {
      for (const scene of reg.scenesOf(book.id)) {
        if (scene.exit.type === 'ending' && !reg.ending(book.id, scene.exit.endingId)) {
          missing.push(`${scene.id} → ${scene.exit.endingId}`)
        }
      }
      for (const ending of book.endings) {
        if (!reg.card(ending.cardId)) missing.push(`ending ${ending.id} → Karte ${ending.cardId}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('jede in Effekten genannte Stammdaten-ID existiert', () => {
    const missing: string[] = []
    const effects = allScenes().flatMap(s => [
      ...(s.onEnter ?? []),
      ...s.pages.flatMap(p => [...(p.effects ?? []), ...(p.interactions ?? []).flatMap(i => i.effects ?? [])]),
      ...(s.exit.type === 'choice' ? s.exit.choices.flatMap(c => c.costs ?? []) : []),
    ])
    for (const e of effects) {
      if ('codex' in e && !reg.codex(e.codex)) missing.push(`codex:${e.codex}`)
      if ('card' in e && !reg.card(e.card)) missing.push(`card:${e.card}`)
      if ('achievement' in e && !reg.achievement(e.achievement)) missing.push(`ach:${e.achievement}`)
      if ('item' in e && !reg.item(e.item)) missing.push(`item:${e.item}`)
    }
    expect([...new Set(missing)]).toEqual([])
  })

  it('jede Interlude-Szene verweist auf eine existierende Wertetafel', () => {
    const missing = allScenes()
      .filter(s => s.sheet && !reg.sheet(s.sheet))
      .map(s => `${s.id} → ${s.sheet}`)
    expect(missing).toEqual([])
  })
})

describe('2 · Keine Waisen', () => {
  it('jede Szene ist vom Bucheingang aus erreichbar', () => {
    for (const book of reg.books) expect(orphans(reg, book.id)).toEqual([])
  })
})

describe('3 · Keine Senken', () => {
  it('von jeder Szene aus ist ein Terminal erreichbar', () => {
    for (const book of reg.books) expect(noExitScenes(reg, book.id)).toEqual([])
  })

  it('jede Szene hat mindestens eine Seite', () => {
    expect(allScenes().filter(s => s.pages.length === 0).map(s => s.id)).toEqual([])
  })

  it('keine Szene hat mehr als acht Seiten', () => {
    expect(allScenes().filter(s => s.pages.length > 8).map(s => s.id)).toEqual([])
  })

  it('jede Sackgasse traegt 3 bis 6 Seiten echten Inhalt vor dem Game Over', () => {
    const bad = allScenes()
      .filter(s => s.exit.type === 'gameover')
      .filter(s => s.pages.length < 3 || s.pages.length > 6)
      .map(s => `${s.id} (${s.pages.length} Seiten)`)
    expect(bad).toEqual([])
  })
})

describe('4 · Eindeutigkeit', () => {
  it('Szenen-IDs sind eindeutig', () => {
    const ids = allScenes().map(s => s.id)
    expect(ids.length).toBe(new Set(ids).size)
  })

  it('Seiten-IDs sind eindeutig', () => {
    const ids = allScenes().flatMap(s => s.pages.map(p => p.id))
    expect(ids.length).toBe(new Set(ids).size)
  })

  it('Anzeige-Codes sind pro Buch eindeutig', () => {
    for (const book of reg.books) {
      const codes = reg.scenesOf(book.id).map(s => s.code)
      const dupes = codes.filter((c, i) => codes.indexOf(c) !== i)
      expect([...new Set(dupes)]).toEqual([])
    }
  })

  it('Seiten-IDs beginnen mit der ID ihrer Szene', () => {
    const bad = allScenes().flatMap(s => s.pages.filter(p => !p.id.startsWith(s.id + '.')).map(p => p.id))
    expect(bad).toEqual([])
  })
})

describe('9 · Auswahl-Sanitaet', () => {
  it('ein Auswahl-Ausgang hat zwei bis vier Optionen', () => {
    const bad = allScenes()
      .filter(s => s.exit.type === 'choice')
      .filter(s => s.exit.type === 'choice' && (s.exit.choices.length < 2 || s.exit.choices.length > 4))
      .map(s => s.id)
    expect(bad).toEqual([])
  })

  it('Auswahl-IDs sind innerhalb einer Szene eindeutig', () => {
    const bad: string[] = []
    for (const s of allScenes()) {
      if (s.exit.type !== 'choice') continue
      const ids = s.exit.choices.map(c => c.id)
      if (ids.length !== new Set(ids).size) bad.push(s.id)
    }
    expect(bad).toEqual([])
  })

  it('keine zwei Optionen einer Szene tragen denselben Text', () => {
    const i18n = i18nFor('de')
    const bad: string[] = []
    for (const s of allScenes()) {
      if (s.exit.type !== 'choice') continue
      const labels = s.exit.choices.map(c => i18n.t(c.labelKey))
      if (labels.length !== new Set(labels).size) bad.push(s.id)
    }
    expect(bad).toEqual([])
  })

  it('jede bedingte Option traegt einen in-fiction Sperrhinweis', () => {
    const bad: string[] = []
    for (const s of allScenes()) {
      if (s.exit.type !== 'choice') continue
      for (const c of s.exit.choices) if (c.requires && !c.lockHintKey) bad.push(`${s.id}/${c.id}`)
      if (s.requires && !s.lockHintKey) bad.push(s.id)
    }
    expect(bad).toEqual([])
  })

  it('eine Option mit toedlichem Risiko verlangt eine Bestaetigung', () => {
    const bad: string[] = []
    for (const s of allScenes()) {
      if (s.exit.type !== 'choice') continue
      for (const c of s.exit.choices) if (c.risk === 'lethal' && !c.confirm) bad.push(`${s.id}/${c.id}`)
    }
    expect(bad).toEqual([])
  })

  // Gemessen wird in WOERTERN, nicht in Seiten. Die Regel meint "der Spieler
  // soll frueh entscheiden duerfen" — und als die Seiten am 01.08.2026 kuerzer
  // wurden, um das Scrollen abzuschaffen, stieg die Seitenzahl bis zur ersten
  // Wahl von 3 auf 4, waehrend die Woerter davor von rund 600 auf 520 SANKEN.
  // Eine Seitenzaehlung haette hier also einen Fortschritt als Rueckschritt
  // gemeldet. Was zaehlt, ist die Lesezeit bis zur ersten Entscheidung.
  it('die erste Wahlmoeglichkeit kommt nach hoechstens 600 Woertern', () => {
    const i18n = i18nFor('de')
    for (const book of reg.books) {
      const entry = reg.scene(book.entry)!
      const n = entry.pages.reduce((sum, p) => sum + i18n.t(p.bodyKey).trim().split(/\s+/).length, 0)
      expect(n).toBeLessThanOrEqual(600)
    }
  })

  // Eine Kennzeichnung, die nichts bedeutet, ist schlechter als keine: Der
  // Spieler lernt, dass sie nichts heisst, und liest sie danach nicht mehr.
  // Gefunden am 01.08.2026 — drei von elf Optionen trugen `costly` und kosteten
  // nichts.
  it('was als kostspielig gekennzeichnet ist, kostet auch etwas', () => {
    const bad: string[] = []
    for (const scene of allScenes()) {
      if (scene.exit.type !== 'choice') continue
      for (const c of scene.exit.choices) {
        if (c.risk === 'costly' && !c.costs?.length) bad.push(`${scene.id}/${c.id}`)
      }
    }
    expect(bad).toEqual([])
  })
})

describe('10 · Pfad-Balance', () => {
  it('Geschwister-Zweige unterscheiden sich hoechstens um Faktor 3 in der Wortzahl', () => {
    const i18n = i18nFor('de')
    const wordsOf = (sceneId: string): number => {
      const s = reg.scene(sceneId)
      if (!s) return 0
      return s.pages.reduce((n, p) => n + wordCount(i18n.t(p.bodyKey)), 0)
    }
    const problems: string[] = []
    for (const book of reg.books) {
      // Konvergenzen sind die Wiedervereinigungspunkte: dort hoert ein Zweig auf.
      const stop = new Set(reg.scenesOf(book.id).filter(s => s.kind === 'convergence').map(s => s.id))
      for (const scene of reg.scenesOf(book.id)) {
        if (scene.exit.type !== 'choice') continue
        const sizes = scene.exit.choices.map(c => Math.max(1, subtreeWords(reg, c.to, wordsOf, stop)))
        const min = Math.min(...sizes)
        const max = Math.max(...sizes)
        if (max / min > PATH_BALANCE_RATIO) {
          problems.push(`${scene.id}: ${sizes.join(' / ')} Woerter (Faktor ${(max / min).toFixed(1)})`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('jedes Buch hat mindestens eine Konvergenz und mindestens ein Ende', () => {
    for (const book of reg.books) {
      expect(edgesOf(reg, book.id).length).toBeGreaterThan(0)
      expect(book.endings.length).toBeGreaterThan(0)
    }
  })
})
