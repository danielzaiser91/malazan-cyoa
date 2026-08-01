/**
 * Validierungen 5 (i18n-Paritaet), 6 (Wortbaender) und 7 (Bild-Abdeckung).
 */

import { describe, expect, it } from 'vitest'
import { pronounVars } from '../../src/core/i18n.ts'
import { allPages, allScenes, artById, i18nFor, LANGS, locales, reg } from '../helpers.ts'
import { wordCount } from '../../src/core/i18n.ts'
import { WORD_BANDS, WORD_HARD_CAP } from '../../src/core/constants.ts'
import { ART_MOODS } from '../../src/model/types.ts'

/** Jeder Schluessel, den der Content erwaehnt. */
function requiredKeys(): string[] {
  const keys: string[] = []
  for (const book of reg.books) {
    keys.push(book.titleKey)
    for (const e of book.endings) keys.push(e.titleKey, e.summaryKey)
    for (const chapter of reg.chaptersOf(book.id)) {
      keys.push(chapter.titleKey)
      for (const s of chapter.scenes) {
        keys.push(s.titleKey, s.summaryKey, `pov.${s.pov}`)
        if (s.lockHintKey) keys.push(s.lockHintKey)
        if (s.sheet) keys.push(`sheet.${s.sheet}.title`)
        for (const p of s.pages) {
          keys.push(p.bodyKey, p.art.altKey)
          for (const i of p.inserts ?? []) keys.push(i.bodyKey)
          for (const it of p.interactions ?? []) {
            keys.push(it.labelKey, it.responseKey)
            if (it.lockHintKey) keys.push(it.lockHintKey)
          }
        }
        if (s.exit.type === 'choice') {
          for (const c of s.exit.choices) {
            keys.push(c.labelKey)
            if (c.lockHintKey) keys.push(c.lockHintKey)
            if (c.confirmKey) keys.push(c.confirmKey)
          }
        }
        if (s.exit.type === 'gameover') keys.push(s.exit.reasonKey)
      }
    }
  }
  for (const c of reg.pack.codex) keys.push(c.titleKey, c.bodyKey)
  for (const c of reg.pack.cards) keys.push(c.titleKey, c.bodyKey)
  for (const t of reg.pack.talents) keys.push(t.titleKey, t.effectKey)
  for (const i of reg.pack.items) keys.push(i.titleKey, i.bodyKey)
  for (const a of reg.pack.achievements) keys.push(a.titleKey, a.bodyKey)
  for (const s of reg.pack.sheets) keys.push(s.titleKey)
  return [...new Set(keys)]
}

describe('5 · i18n-Paritaet', () => {
  it('jeder vom Content genannte Schluessel existiert in jeder Sprache', () => {
    const required = requiredKeys()
    for (const lang of LANGS) {
      const missing = required.filter(k => locales[lang][k] === undefined)
      expect({ lang, missing }).toEqual({ lang, missing: [] })
    }
  })

  it('de und en haben denselben Schluesselvorrat', () => {
    const de = new Set(Object.keys(locales.de))
    const en = new Set(Object.keys(locales.en))
    expect([...de].filter(k => !en.has(k))).toEqual([])
    expect([...en].filter(k => !de.has(k))).toEqual([])
  })

  it('kein Schluessel ist unbenutzt', () => {
    // UI-Schluessel werden im Code verwendet, nicht im Content — die sind hier ausgenommen.
    const required = new Set(requiredKeys())
    const orphaned = Object.keys(locales.de).filter(
      k => !required.has(k) && !k.startsWith('ui.') && !k.startsWith('stat.')
        && !k.startsWith('bg.') && !k.startsWith('pov.') && !k.startsWith('flag.') && !k.startsWith('codex.cat.'),
    )
    expect(orphaned).toEqual([])
  })

  it('jedes im Content gesetzte Flag hat einen Klartext in beiden Sprachen', () => {
    // Ein Flag ohne Klartext waere eine stille Mechanik — genau das, was die
    // Feel-Regeln verbieten. Es taucht im Blatt und in der Einblendung auf.
    const flags = new Set<string>()
    for (const s of allScenes()) {
      const effects = [
        ...(s.onEnter ?? []),
        ...s.pages.flatMap(p => [...(p.effects ?? []), ...(p.interactions ?? []).flatMap(i => i.effects ?? [])]),
        ...(s.exit.type === 'choice' ? s.exit.choices.flatMap(c => c.costs ?? []) : []),
      ]
      for (const e of effects) if ('flag' in e) flags.add(e.flag)
    }
    const missing: string[] = []
    for (const lang of LANGS) {
      for (const f of flags) if (!locales[lang][`flag.${f}`]) missing.push(`${lang}: flag.${f}`)
    }
    expect(missing).toEqual([])
  })

  it('jedes Flag mit Klartext wird auch irgendwo gesetzt', () => {
    const declared = Object.keys(locales.de).filter(k => k.startsWith('flag.')).map(k => k.slice(5))
    const used = new Set<string>()
    for (const s of allScenes()) {
      const effects = [
        ...(s.onEnter ?? []),
        ...s.pages.flatMap(p => [...(p.effects ?? []), ...(p.interactions ?? []).flatMap(i => i.effects ?? [])]),
        ...(s.exit.type === 'choice' ? s.exit.choices.flatMap(c => c.costs ?? []) : []),
      ]
      for (const e of effects) if ('flag' in e) used.add(e.flag)
    }
    expect(declared.filter(f => !used.has(f))).toEqual([])
  })

  it('kein Anzeigetext steckt in einer Content-Datei', () => {
    // Heuristik: ein Schluessel besteht aus Punkt-getrennten Wortteilen ohne Leerzeichen.
    const suspicious: string[] = []
    for (const s of allScenes()) {
      const keys = [s.titleKey, s.summaryKey, ...s.pages.flatMap(p => [p.bodyKey, p.art.altKey])]
      for (const k of keys) if (/\s/.test(k)) suspicious.push(`${s.id}: "${k}"`)
    }
    expect(suspicious).toEqual([])
  })

  it('deutsche und englische Fassung sind nicht identisch', () => {
    // Faengt eine vergessene Uebersetzung (kopierte Datei) bei den Prosa-Schluesseln.
    const bodies = allPages().map(({ page }) => page.bodyKey)
    const identical = bodies.filter(k => locales.de[k] === locales.en[k])
    expect(identical).toEqual([])
  })
})

describe('6 · Wortbaender', () => {
  it('jede Seite liegt in jeder Sprache in ihrem Band', () => {
    const problems: string[] = []
    for (const lang of LANGS) {
      const i18n = i18nFor(lang)
      for (const { page } of allPages()) {
        const band = WORD_BANDS[page.band]
        const n = wordCount(i18n.t(page.bodyKey))
        if (n < band.min || n > band.max) {
          problems.push(`${lang} ${page.id}: ${n} Woerter, Band ${page.band} (${band.min}–${band.max})`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('keine Seite ueberschreitet die harte Obergrenze', () => {
    const problems: string[] = []
    for (const lang of LANGS) {
      const i18n = i18nFor(lang)
      for (const { page } of allPages()) {
        const n = wordCount(i18n.t(page.bodyKey))
        if (n > WORD_HARD_CAP) problems.push(`${lang} ${page.id}: ${n}`)
      }
    }
    expect(problems).toEqual([])
  })

  it('Auswahltexte bleiben unter zwoelf Woertern', () => {
    const problems: string[] = []
    for (const lang of LANGS) {
      const i18n = i18nFor(lang)
      for (const s of allScenes()) {
        if (s.exit.type !== 'choice') continue
        for (const c of s.exit.choices) {
          const n = wordCount(i18n.t(c.labelKey))
          if (n > 12) problems.push(`${lang} ${s.id}/${c.id}: ${n} Woerter`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('die Laengen beider Sprachen liegen nicht weiter als 40 % auseinander', () => {
    const de = i18nFor('de')
    const en = i18nFor('en')
    const problems: string[] = []
    for (const { page } of allPages()) {
      const a = wordCount(de.t(page.bodyKey))
      const b = wordCount(en.t(page.bodyKey))
      const ratio = Math.max(a, b) / Math.max(1, Math.min(a, b))
      if (ratio > 1.4) problems.push(`${page.id}: de ${a} / en ${b}`)
    }
    expect(problems).toEqual([])
  })
})

describe('7 · Bild-Abdeckung', () => {
  it('jede Seite hat genau eine Illustration mit Alt-Text in beiden Sprachen', () => {
    const problems: string[] = []
    for (const { page } of allPages()) {
      if (!page.art?.promptId) problems.push(`${page.id}: kein Bild`)
      for (const lang of LANGS) {
        const alt = locales[lang][page.art.altKey]
        if (!alt || alt.trim().length < 20) problems.push(`${lang} ${page.id}: Alt-Text fehlt oder ist zu knapp`)
      }
    }
    expect(problems).toEqual([])
  })

  it('zu jeder Seite existiert ein Bild-Prompt', () => {
    const missing = allPages().filter(({ page }) => !artById.has(page.art.promptId)).map(({ page }) => page.id)
    expect(missing).toEqual([])
  })

  it('kein Bild-Prompt ist verwaist', () => {
    const used = new Set(allPages().map(({ page }) => page.art.promptId))
    expect([...artById.keys()].filter(id => !used.has(id))).toEqual([])
  })

  it('jede Stimmung ist ein bekannter Wert', () => {
    const bad = allPages()
      .filter(({ page }) => !ART_MOODS.includes(page.art.mood))
      .map(({ page }) => page.id)
    expect(bad).toEqual([])
  })
})

describe('Anrede', () => {
  // Bis zum 01.08.2026 wurde die Anrede abgefragt, gespeichert und nie gelesen:
  // Der Erzaehltext nennt den Spielcharakter nur mit {name}, weil Pronomen
  // sonst drei Fassungen jeder Seite verlangt haetten. Als Platzhalter kosten
  // sie nichts — und dann muss auch geprueft werden, dass sie aufgehen.
  const FORMS = ['she', 'he', 'they'] as const

  it('kennt jede Form in jeder Sprache', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const form of FORMS) {
        const v = pronounVars(lang, form)
        for (const key of ['they', 'them', 'themDat', 'their', 'isAre', 'hasHave']) {
          expect(v[key], `${lang}/${form}/${key}`).toBeTruthy()
        }
      }
    }
  })

  it('englisches "they" verlangt den Plural', () => {
    // Die Falle, die man sonst nie bemerkt: Man spielt selbst nur eine Anrede.
    expect(pronounVars('en', 'they').isAre).toBe('are')
    expect(pronounVars('en', 'they').hasHave).toBe('have')
    expect(pronounVars('en', 'she').isAre).toBe('is')
  })

  it('kein Text laesst einen Pronomen-Platzhalter ungefuellt', () => {
    const bad: string[] = []
    for (const lang of ['de', 'en'] as const) {
      const i18n = i18nFor(lang)
      for (const key of i18n.keys(lang)) {
        if (!key.endsWith('.body')) continue
        for (const form of FORMS) {
          const out = i18n.t(key, { name: 'Tesk', ...pronounVars(lang, form) })
          const left = out.match(/\{(they|them|themDat|their|isAre|hasHave)\}/g)
          if (left) bad.push(`${lang} ${key} (${form}): ${left.join(', ')}`)
        }
      }
    }
    expect(bad).toEqual([])
  })
})
