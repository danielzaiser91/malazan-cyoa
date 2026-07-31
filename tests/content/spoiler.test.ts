/**
 * Validierung 8 — der Spoiler-Vertrag. Diese Suite ist der Grund, warum das
 * Flowchart-Ansichtsmodell in `core/reading.ts` liegt und nicht im View: Sie
 * serialisiert die Auslegung eines frischen Profils und sucht darin nach allem,
 * was der Spieler noch nicht wissen darf.
 */

import { describe, expect, it } from 'vitest'
import { allScenes, freshEngine, i18nFor, LANGS, locales, reg } from '../helpers.ts'
import { buildReading, readingAsList } from '../../src/core/reading.ts'
import { emptyMeta } from '../../src/core/engine.ts'

function readingFor(engine: ReturnType<typeof freshEngine>) {
  return buildReading({ reg, book: engine.run.book, meta: engine.meta, ctx: engine.ctx })
}

describe('8 · Spoiler-Vertrag', () => {
  it('ein frisches Profil sieht keinen Titel, keine Zusammenfassung und kein Bild einer unerreichten Szene', () => {
    const engine = freshEngine()
    const reading = readingFor(engine)
    const serialised = JSON.stringify(reading)
    const leaks: string[] = []

    for (const scene of allScenes()) {
      if (engine.meta.scenes[scene.id]?.reached) continue
      // Titel, Zusammenfassung, Bild und Code sind je Szene eindeutig — taucht so
      // ein Schluessel irgendwo in der Auslegung auf, ist er geleakt.
      for (const key of [scene.titleKey, scene.summaryKey]) {
        if (serialised.includes(key)) leaks.push(`${scene.id}: ${key}`)
      }
      // Der POV-Schluessel ist geteilt (mehrere Szenen, dieselbe Figur) und wird
      // deshalb pro Karte geprueft statt ueber die ganze Zeichenkette.
      const card = reading.cards.find(c => c.id === scene.id)
      if (card?.povKey) leaks.push(`${scene.id}: POV auf der Karte`)
      for (const page of scene.pages) {
        if (serialised.includes(page.art.promptId)) leaks.push(`${scene.id}: Bild ${page.art.promptId}`)
        if (serialised.includes(page.bodyKey)) leaks.push(`${scene.id}: Prosa ${page.bodyKey}`)
      }
      if (serialised.includes(`"${scene.code}"`)) leaks.push(`${scene.id}: Code ${scene.code}`)
    }
    expect(leaks).toEqual([])
  })

  it('unerreichte Nachbarkarten erscheinen ohne jeden Inhalt, nur als Ruecken', () => {
    const engine = freshEngine()
    const reading = readingFor(engine)
    const hidden = reading.cards.filter(c => c.state === 'rumoured' || (c.state === 'locked' && !c.code))
    expect(hidden.length).toBeGreaterThan(0)
    for (const card of hidden) {
      expect(card.titleKey).toBeUndefined()
      expect(card.summaryKey).toBeUndefined()
      expect(card.artId).toBeUndefined()
      expect(card.povKey).toBeUndefined()
      expect(card.code).toBeUndefined()
      expect(card.kind).toBeUndefined()
      expect(card.jumpable).toBe(false)
    }
  })

  it('Szenen ohne Verbindung zu Erreichtem tauchen ueberhaupt nicht auf', () => {
    const engine = freshEngine()
    const reading = readingFor(engine)
    const visible = new Set(reading.cards.map(c => c.id))
    // Nach dem ersten Betreten sind nur die Eingangsszene und ihre direkten
    // Nachbarn bekannt. Alles dahinter existiert fuer den Spieler noch nicht.
    const entry = reg.book('b1')!.entry
    const allowed = new Set<string>([entry, ...reg.targetsOf(reg.scene(entry)!)])
    expect([...visible].filter(id => !allowed.has(id))).toEqual([])
  })

  it('eine erreichte Szene zeigt Titel, Zusammenfassung und Bild', () => {
    const engine = freshEngine()
    const reading = readingFor(engine)
    const entry = reading.cards.find(c => c.id === engine.run.book + '.c00.s01')
    expect(entry?.titleKey).toBeTruthy()
    expect(entry?.summaryKey).toBeTruthy()
    expect(entry?.artId).toBeTruthy()
    expect(entry?.jumpable).toBe(true)
  })

  it('die Textfassung der Auslegung leakt genauso wenig', () => {
    const engine = freshEngine()
    const list = JSON.stringify(readingAsList(readingFor(engine)))
    const unreached = allScenes().filter(s => !engine.meta.scenes[s.id]?.reached)
    const leaks = unreached.filter(s => list.includes(s.titleKey)).map(s => s.id)
    expect(leaks).toEqual([])
  })

  it('kein Sperrhinweis nennt einen Namen aus dem Codex, den der Spieler noch nicht hat', () => {
    // Ein Sperrhinweis darf den Weg zeigen, nicht das Ziel. Heuristik: er darf
    // keinen Codex-Titel woertlich enthalten.
    const problems: string[] = []
    for (const lang of LANGS) {
      const i18n = i18nFor(lang)
      const codexTitles = reg.pack.codex.map(c => locales[lang][c.titleKey])
      for (const scene of allScenes()) {
        const hints = [scene.lockHintKey, ...(scene.exit.type === 'choice' ? scene.exit.choices.map(c => c.lockHintKey) : [])]
        for (const h of hints) {
          if (!h) continue
          const text = i18n.t(h)
          for (const title of codexTitles) {
            if (title && title.length > 4 && text.includes(title)) problems.push(`${lang} ${scene.id}: "${title}"`)
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('ein leeres Meta-Wissen ergibt eine leere Auslegung', () => {
    const reading = buildReading({
      reg,
      book: 'b1',
      meta: emptyMeta(),
      ctx: { run: freshEngine().run, meta: emptyMeta(), background: 'marine', stats: {} },
    })
    expect(reading.cards).toEqual([])
    expect(reading.edges).toEqual([])
  })
})
