/**
 * Kern-Tests: Zustandstrennung, Schnappschuesse, Proben, Ereignisse.
 * Die Nicht-Verhandelbare Nr. 9 (Lauf rollt zurueck, Wissen nie) hat hier ihren
 * Regressionstest.
 */

import { describe, expect, it } from 'vitest'
import { freshEngine, reg } from '../helpers.ts'
import { applyEffects } from '../../src/core/effects.ts'
import { evaluate } from '../../src/core/conditions.ts'
import { roll01, rollDie, seedFrom } from '../../src/core/rng.ts'
import { emptyMeta } from '../../src/core/engine.ts'
import { XP_THRESHOLDS } from '../../src/core/constants.ts'

const ENTRY = 'b1.c00.s01'

describe('RNG', () => {
  it('ist deterministisch', () => {
    expect(roll01(1234, 7)).toBe(roll01(1234, 7))
    expect(roll01(1234, 7)).not.toBe(roll01(1234, 8))
  })

  it('liefert Werte in [0,1) und Wuerfel in 1..6', () => {
    for (let i = 0; i < 500; i++) {
      const v = roll01(99, i)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
      const d = rollDie(99, i, 6)
      expect(d).toBeGreaterThanOrEqual(1)
      expect(d).toBeLessThanOrEqual(6)
    }
  })

  it('macht aus einer Zeichenkette einen stabilen Seed', () => {
    expect(seedFrom('Kruppe')).toBe(seedFrom('Kruppe'))
    expect(seedFrom('Kruppe')).not.toBe(seedFrom('kruppe'))
  })
})

describe('Bedingungen', () => {
  const base = () => {
    const e = freshEngine()
    return e
  }

  it('wertet Werte gegen die AKTIVE Tafel aus, nicht gegen die des Spielers', () => {
    const e = base()
    // Der Prolog laeuft als Interlude: die Tafel des Kindes gilt, nicht die des Rekruten.
    expect(e.currentSheetId).toBe('paran-child')
    expect(evaluate({ stat: 'heart', gte: 3 }, e.ctx)).toBe(true)
    expect(evaluate({ stat: 'blade', gte: 1 }, e.ctx)).toBe(false)
  })

  it('kennt und/oder/nicht', () => {
    const e = base()
    expect(evaluate({ all: [{ stat: 'heart', gte: 1 }, { not: { flag: 'x' } }] }, e.ctx)).toBe(true)
    expect(evaluate({ any: [{ flag: 'x' }, { stat: 'heart', gte: 99 }] }, e.ctx)).toBe(false)
  })

  it('haelt eine unbekannte Bedingung fuer falsch statt fuer wahr', () => {
    const e = base()
    // Ein Tippfehler im Content darf keine gesperrte Tuer oeffnen.
    expect(evaluate({ unbekannt: true } as never, e.ctx)).toBe(false)
  })

  it('liest besuchte Szenen aus dem Meta-Wissen', () => {
    const e = base()
    expect(evaluate({ visited: ENTRY }, e.ctx)).toBe(true)
    expect(evaluate({ visited: 'b1.c00.s07' }, e.ctx)).toBe(false)
  })
})

describe('Effekte melden jede Aenderung', () => {
  it('gibt fuer jeden Effekt genau ein Ereignis zurueck', () => {
    const e = freshEngine()
    const events = applyEffects(
      [{ stat: 'heart', add: 2 }, { coin: -3 }, { flag: 'test', set: true }, { item: 'squad-token', add: 1 }],
      { run: e.run, meta: e.meta, stats: e.activeStats },
    )
    expect(events.map(x => x.kind)).toEqual(['stat', 'coin', 'flag', 'item'])
  })

  it('meldet einen Stufenaufstieg zusaetzlich zur Erfahrung', () => {
    const e = freshEngine()
    const events = applyEffects([{ xp: XP_THRESHOLDS[0] }], { run: e.run, meta: e.meta })
    expect(events.some(x => x.kind === 'levelup')).toBe(true)
    expect(e.run.level).toBe(2)
  })

  it('meldet eine schon vorhandene Karte NICHT erneut', () => {
    const e = freshEngine()
    const first = applyEffects([{ card: 'obelisk' }], { run: e.run, meta: e.meta })
    const second = applyEffects([{ card: 'obelisk' }], { run: e.run, meta: e.meta })
    expect(first).toHaveLength(1)
    expect(second).toHaveLength(0)
  })

  it('meldet das Ueberschreiten der Aufmerksamkeitsschwelle', () => {
    const e = freshEngine()
    const events = applyEffects([{ attention: 9 }], { run: e.run, meta: e.meta })
    expect(events[0]).toMatchObject({ kind: 'attention', threshold: 'noticed' })
  })

  it('schreibt Werte im Interlude in die Tafel der Figur, nicht in die des Spielers', () => {
    const e = freshEngine()
    const before = e.run.stats.heart
    applyEffects([{ stat: 'heart', add: 5 }], { run: e.run, meta: e.meta, stats: e.activeStats })
    expect(e.run.stats.heart).toBe(before)
    expect(e.run.sheets['paran-child'].heart).toBe(8)
  })
})

describe('Szenen, Seiten und Schnappschuesse', () => {
  it('startet auf der Eingangsszene, erste Seite', () => {
    const e = freshEngine()
    expect(e.run.scene).toBe(ENTRY)
    expect(e.run.page).toBe(0)
    expect(e.meta.scenes[ENTRY].reached).toBe(true)
  })

  it('legt beim ersten Betreten genau einen Schnappschuss an', () => {
    const e = freshEngine()
    expect(e.save.checkpoints[ENTRY]).toBeTruthy()
    const snap = e.save.checkpoints[ENTRY]
    e.next(); e.next()
    expect(e.save.checkpoints[ENTRY]).toBe(snap)
  })

  it('blaettert bis zum Szenenende und bleibt dann stehen', () => {
    const e = freshEngine()
    const total = e.scene.pages.length
    for (let i = 1; i < total; i++) e.next()
    expect(e.atExit).toBe(true)
    const events = e.next()
    expect(events).toEqual([{ kind: 'blocked', reason: 'not-at-exit' }])
  })

  it('zaehlt gelesene Seiten ins Meta-Wissen', () => {
    // Bewusst ueber die Content-Struktur statt ueber eine feste Seiten-ID: Seiten
    // werden geteilt, wenn sie zu lang sind, und ein Test, der an `p02` haengt,
    // meldet dann einen Fehler, wo keiner ist.
    const e = freshEngine()
    const second = reg.scene(e.run.scene)!.pages[1]!.id
    e.next()
    expect(e.meta.pagesRead).toContain(second)
  })

  it('wendet Seiteneffekte nur einmal pro Lauf an', () => {
    const e = freshEngine()
    e.next()
    const before = e.run.pagesApplied.length
    e.back()
    e.next()
    expect(e.run.pagesApplied.length).toBe(before)
  })
})

describe('Interaktionen', () => {
  it('brennen ab, wenn sie nicht wiederholbar sind', () => {
    const e = freshEngine()
    // Bis zu der Seite blaettern, die den Gespraechsknoten wirklich traegt —
    // eine feste Zahl von `next()` bricht, sobald eine Seite geteilt wird.
    const pages = reg.scene(e.run.scene)!.pages
    const at = pages.findIndex(p => p.interactions?.some(i => i.id === 'say-nothing'))
    expect(at).toBeGreaterThan(-1)
    for (let n = 0; n < at; n++) e.next()
    const first = e.interact('say-nothing')
    expect(first.some(x => x.kind === 'stat')).toBe(true)
    const second = e.interact('say-nothing')
    expect(second).toEqual([{ kind: 'blocked', reason: 'unknown' }])
  })

  it('melden eine unbekannte Interaktion, statt still nichts zu tun', () => {
    const e = freshEngine()
    expect(e.interact('gibt-es-nicht')).toEqual([{ kind: 'blocked', reason: 'unknown' }])
  })
})

describe('Auswahl und Proben', () => {
  const toExit = (e: ReturnType<typeof freshEngine>) => {
    while (!e.atExit) e.next()
    return e
  }

  it('erlaubt eine Wahl nur am Szenenende', () => {
    const e = freshEngine()
    expect(e.choose('talk')).toEqual([{ kind: 'blocked', reason: 'not-at-exit' }])
  })

  it('merkt sich die genommene Wahl und das Ergebnis der Szene', () => {
    const e = toExit(freshEngine())
    e.choose('talk')
    expect(e.meta.scenes[ENTRY].taken).toEqual(['talk'])
    expect(e.meta.scenes[ENTRY].outcome).toBe('progress')
    expect(e.run.scene).toBe('b1.c00.s02')
  })

  it('markiert eine bereits genommene Wahl als gespielt, entfernt sie aber nicht', () => {
    const e = toExit(freshEngine())
    e.choose('talk')
    e.jumpTo(ENTRY)
    toExit(e)
    const views = e.choices()
    expect(views).toHaveLength(3)
    expect(views.find(v => v.choice.id === 'talk')?.played).toBe(true)
  })

  it('wuerfelt eine Probe deterministisch und verzweigt bei Misserfolg', () => {
    const results: boolean[] = []
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const e = freshEngine('b1', seed)
      while (!e.atExit) e.next()
      e.choose('descend')
      while (!e.atExit) e.next()
      const events = e.choose('help')
      const check = events.find(x => x.kind === 'check')
      expect(check).toBeTruthy()
      results.push(e.run.scene === 'b1.c00.s06')
      // Misserfolg fuehrt in die Sackgasse, nie ins Nichts.
      expect(['b1.c00.s06', 'b1.c00.s07']).toContain(e.run.scene)
    }
    // Beide Ausgaenge kommen vor — die Probe ist keine Attrappe.
    expect(new Set(results).size).toBe(2)
  })

  it('wiederholt denselben Wurf nach einem Sprung', () => {
    const play = () => {
      const e = freshEngine('b1', 4242)
      while (!e.atExit) e.next()
      e.choose('descend')
      while (!e.atExit) e.next()
      e.choose('help')
      return e.run.scene
    }
    const a = play()
    const e = freshEngine('b1', 4242)
    while (!e.atExit) e.next()
    e.choose('descend')
    while (!e.atExit) e.next()
    e.choose('help')
    e.jumpTo('b1.c00.s03')
    while (!e.atExit) e.next()
    e.choose('help')
    expect(e.run.scene).toBe(a)
  })
})

describe('Sprung: Lauf rollt zurueck, Wissen bleibt', () => {
  const played = () => {
    const e = freshEngine()
    while (!e.atExit) e.next()
    e.choose('talk')
    while (!e.atExit) e.next()
    return e
  }

  it('stellt Werte, Muenzen und Flags des Eintritts wieder her', () => {
    const e = played()
    const heartBefore = e.run.sheets['paran-child'].heart
    e.run.coin = 999
    e.jumpTo(ENTRY)
    expect(e.run.coin).not.toBe(999)
    expect(e.run.scene).toBe(ENTRY)
    expect(e.run.sheets['paran-child']?.heart ?? heartBefore).toBeDefined()
  })

  it('behaelt besuchte Szenen, Codex, Karten und Erfolge', () => {
    const e = played()
    const codexBefore = [...e.meta.codex]
    const achievementsBefore = [...e.meta.achievements]
    const scenesBefore = Object.keys(e.meta.scenes)
    e.jumpTo(ENTRY)
    expect(e.meta.codex).toEqual(codexBefore)
    expect(e.meta.achievements).toEqual(achievementsBefore)
    expect(Object.keys(e.meta.scenes)).toEqual(scenesBefore)
    expect(e.meta.scenes['b1.c00.s02'].reached).toBe(true)
  })

  it('behaelt gelesene Seiten fuer die Abdeckung', () => {
    const e = played()
    const before = e.meta.pagesRead.length
    e.jumpTo(ENTRY)
    expect(e.meta.pagesRead.length).toBe(before)
  })

  it('nennt im Voraus, was der Sprung kostet', () => {
    const e = played()
    const diff = e.jumpDiff(ENTRY)
    expect(diff).toBeTruthy()
    // Jede Zeile nennt Von und Nach — nie nur eine nackte Differenz.
    expect(diff!.coin).toEqual({ from: e.run.coin, to: e.save.checkpoints[ENTRY].run.coin })
    expect(diff!.xp).toEqual({ from: e.run.xp, to: 0 })
    expect(diff!.level.from).toBeGreaterThanOrEqual(diff!.level.to)
    for (const d of Object.values(diff!.stats)) {
      expect(typeof d.from).toBe('number')
      expect(typeof d.to).toBe('number')
    }
  })

  // Gemeldet am 01.08.2026: frisch gestartet, sofort zum Startpunkt
  // zurueckgesprungen — der Dialog versprach vier Wertaenderungen, von denen
  // keine eintrat. Ursache: Der Vergleich nahm die Wertetafel der aktuellen
  // Szene und fiel, wenn sie im Schnappschuss fehlte, auf die Werte des
  // Spielcharakters zurueck. Damit standen die Werte einer Kanon-Figur gegen
  // die des Rekruten.
  it('verspricht keine Wertaenderung, wenn nichts geschehen ist', () => {
    const e = freshEngine()
    const diff = e.jumpDiff(e.run.scene)
    expect(diff?.stats ?? {}).toEqual({})
  })

  it('vergleicht nie ueber zwei verschiedene Wertetafeln hinweg', () => {
    const e = freshEngine()
    // Jede erreichte Szene gegen den Stand, in dem man gerade steckt: Wo Ziel
    // und Gegenwart verschiedene Tafeln benutzen, darf gar keine Wertzeile
    // erscheinen — ein Vergleich waere dort bedeutungslos.
    for (const id of Object.keys(e.save.checkpoints)) {
      const targetSheet = reg.scene(id)?.sheet
      if (targetSheet === e.currentSheetId) continue
      expect(e.jumpDiff(id)?.stats ?? {}).toEqual({})
    }
  })

  it('lehnt einen Sprung auf eine nie erreichte Szene ab', () => {
    const e = freshEngine()
    expect(e.jumpTo('b1.c00.s07')).toEqual([{ kind: 'blocked', reason: 'unknown' }])
  })
})

describe('Terminals', () => {
  it('eine Sackgasse endet mit Game Over und schlaegt nur erreichte Checkpoints vor', () => {
    const e = freshEngine('b1', 3)
    while (!e.atExit) e.next()
    e.choose('descend')
    while (!e.atExit) e.next()
    // Probe erzwingen, bis die Sackgasse getroffen wird
    let guard = 0
    while (e.run.scene !== 'b1.c00.s07' && guard++ < 20) {
      e.choose('help')
      if (e.run.scene === 'b1.c00.s06') { e.jumpTo('b1.c00.s03'); while (!e.atExit) e.next() }
    }
    if (e.run.scene !== 'b1.c00.s07') return
    while (!e.atExit) e.next()
    const events = e.next()
    const over = events.find(x => x.kind === 'gameover')
    expect(over).toBeTruthy()
    expect(e.finished).toBe('gameover')
    if (over && over.kind === 'gameover') {
      for (const s of over.suggest) expect(e.save.checkpoints[s]).toBeTruthy()
    }
  })

  it('ein Ende wird ins Meta-Wissen geschrieben und schaltet seine Karte frei', () => {
    // Laeuft die Hauptlinie durch, ohne den Weg fest zu verdrahten — sonst
    // bricht dieser Test bei jedem neuen Kapitel.
    const e = freshEngine()
    let guard = 0
    while (!e.finished && guard++ < 200) {
      if (e.atExit && e.scene.exit.type === 'choice') {
        const open = e.choices().filter(c => !c.locked && c.choice.risk !== 'lethal')
        expect(open.length).toBeGreaterThan(0)
        e.choose(open[0].choice.id)
      } else {
        e.next()
      }
    }
    expect(e.finished).toBe('ending')
    expect(e.meta.endings).toContain('wip')
    expect(e.meta.cards).toContain('ending-wip')
  })
})

describe('Registry und Graph', () => {
  it('findet Szenen, Seiten und das Buch einer Szene', () => {
    expect(reg.scene(ENTRY)?.code).toBe('0.1')
    expect(reg.page('b1.c00.s01.p01')).toBeTruthy()
    expect(reg.bookOf(ENTRY)).toBe('b1')
  })

  it('ein leeres Meta-Wissen enthaelt nichts', () => {
    const m = emptyMeta()
    expect(Object.keys(m.scenes)).toEqual([])
    expect(m.pagesRead).toEqual([])
  })
})
