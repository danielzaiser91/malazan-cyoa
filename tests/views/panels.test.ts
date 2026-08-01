/**
 * @vitest-environment jsdom
 *
 * Die Darstellungsschicht.
 *
 * Bis zum 01.08.2026 lagen alle 125 Tests auf Core und Content — und genau in
 * den Ansichten lagen die Regressionen der ersten Testrunde: ein Sprung-Dialog,
 * der Werte gegeneinander stellte, die nicht zusammengehoerten; eine
 * Sprachwahl, die still ueberschrieben wurde; eine Auswahl, die man nicht sah.
 * Keiner dieser Fehler haette einen der bestehenden Tests rot gemacht.
 *
 * Diese Datei prueft nicht das Aussehen — sie prueft die Zusicherungen, die
 * eine Ansicht gibt: dass ein Bedienelement einen Namen hat, dass ein Zustand
 * genau einmal dargestellt wird, dass nichts sichtbar ist, was verdeckt
 * gehoert.
 */

import { describe, expect, it, beforeEach } from 'vitest'
import { buildSheet, buildCodex } from '../../src/views/panels.ts'
import { freshEngine, reg } from '../helpers.ts'
import { i18nFor } from '../helpers.ts'

function host(): HTMLElement {
  const el = document.createElement('div')
  document.body.append(el)
  return el
}

beforeEach(() => { document.body.innerHTML = '' })

describe('Figur-Ansicht', () => {
  it('zeigt genau einen Reiter und blendet die anderen aus', () => {
    const body = host()
    buildSheet(body, reg, freshEngine(), i18nFor('de'))
    const panes = [...body.querySelectorAll('.tabs__pane')]
    expect(panes.length).toBeGreaterThan(1)
    expect(panes.filter(p => !(p as HTMLElement).hidden)).toHaveLength(1)
  })

  it('genau ein Reiter ist als gewaehlt markiert', () => {
    const body = host()
    buildSheet(body, reg, freshEngine(), i18nFor('de'))
    const tabs = [...body.querySelectorAll('[role=tab]')]
    expect(tabs.filter(t => t.getAttribute('aria-selected') === 'true')).toHaveLength(1)
  })

  it('der gewaehlte Reiter und der sichtbare Bereich sind derselbe', () => {
    // Der Fehler, den diese Zusicherung ausschliesst: Zustand und Darstellung
    // getrennt zu pflegen. Genau daran ist die Auswahl in der Profil-Anlage
    // gescheitert — `aria-checked` stimmte, sichtbar war nichts.
    const body = host()
    buildSheet(body, reg, freshEngine(), i18nFor('de'))
    const tab = body.querySelector('[role=tab][aria-selected=true]')!
    const pane = document.getElementById(tab.getAttribute('aria-controls')!) as HTMLElement
    expect(pane.hidden).toBe(false)
  })

  it('kein Bedienelement ohne zugaenglichen Namen', () => {
    const body = host()
    buildSheet(body, reg, freshEngine(), i18nFor('de'))
    const nameless = [...body.querySelectorAll('button')]
      .filter(b => !b.textContent?.trim() && !b.getAttribute('aria-label'))
    expect(nameless).toHaveLength(0)
  })
})

describe('Marginalien-Ansicht', () => {
  it('zeigt nichts, solange nichts freigeschaltet ist', () => {
    const engine = freshEngine()
    // Ausdruecklich leeren: Die Startszene schaltet ueber `onEnter` bereits
    // einen Eintrag frei. Das ist richtig so — nur laesst sich der leere
    // Zustand dann nicht mit einer frischen Engine pruefen.
    engine.meta.codex.length = 0
    const body = host()
    buildCodex(body, reg, engine, i18nFor('de'))
    // Spoilerfrei by construction: ein leerer Codex zeigt keine Titel, keine
    // Kategorien, keine Anzahl — sonst waere allein die Liste der Kategorien
    // schon eine Auskunft darueber, was es zu finden gibt.
    expect(body.querySelectorAll('.codex__entry')).toHaveLength(0)
    expect(body.querySelectorAll('.chip--filter')).toHaveLength(0)
  })

  it('zeigt nach dem Freischalten Filter und Eintrag — und nur den einen', () => {
    const engine = freshEngine()
    const first = reg.pack.codex[0]!
    engine.meta.codex.push(first.id)
    const body = host()
    buildCodex(body, reg, engine, i18nFor('de'))
    expect(body.querySelectorAll('.codex__entry')).toHaveLength(1)
    // "Alle" plus genau die eine Kategorie, die es gibt.
    expect(body.querySelectorAll('.chip--filter')).toHaveLength(2)
  })

  it('genau ein Filter ist gewaehlt', () => {
    const engine = freshEngine()
    engine.meta.codex.push(reg.pack.codex[0]!.id)
    const body = host()
    buildCodex(body, reg, engine, i18nFor('de'))
    const on = [...body.querySelectorAll('.chip--filter')].filter(c => c.getAttribute('aria-checked') === 'true')
    expect(on).toHaveLength(1)
  })
})
