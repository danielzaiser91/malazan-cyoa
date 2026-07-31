/**
 * Klangschicht. Zwei Dinge sind hier wichtig genug fuer einen Test:
 * die Vollstaendigkeit (jede Stimmung, jedes Ereignis hat einen Klang) und der
 * Preview-Schutz (im Dev-Build entsteht ohne bewusste Freigabe kein Ton).
 */

import { describe, expect, it } from 'vitest'
import { AMBIENCE, AudioEngine } from '../../src/core/audio.ts'
import { ART_MOODS } from '../../src/model/types.ts'
import { toastFor, bareSfx } from '../../src/views/feedback.ts'
import { i18nFor } from '../helpers.ts'
import type { EngineEvent } from '../../src/core/engine.ts'

describe('Umgebungsklang', () => {
  it('jede Stimmung hat einen Klangteppich', () => {
    const missing = ART_MOODS.filter(m => !AMBIENCE[m])
    expect(missing).toEqual([])
  })

  it('kein Teppich ist lauter als ein Zehntel', () => {
    // Umgebung soll tragen, nicht dominieren.
    const loud = Object.entries(AMBIENCE).filter(([, b]) => b.level > 0.1).map(([k]) => k)
    expect(loud).toEqual([])
  })
})

describe('Preview-Schutz', () => {
  it('der Dev-Build startet stumm und bleibt stumm, egal was das Profil sagt', () => {
    const audio = new AudioEngine(true)
    expect(audio.blockedByDevGuard).toBe(true)
    audio.update({ muted: false, volume: 1 })
    // Kein AudioContext in dieser Umgebung — der Test prueft, dass der Aufruf
    // trotzdem nicht wirft und der Schutz bestehen bleibt.
    expect(() => audio.play('page')).not.toThrow()
    expect(() => audio.ambience('siege')).not.toThrow()
    expect(audio.blockedByDevGuard).toBe(true)
  })

  it('der ausgelieferte Build ist nicht blockiert', () => {
    expect(new AudioEngine(false).blockedByDevGuard).toBe(false)
  })
})

describe('Kein Ereignis bleibt still oder unsichtbar', () => {
  const t = i18nFor('de')
  const samples: EngineEvent[] = [
    { kind: 'stat', stat: 'heart', delta: 1, value: 2 },
    { kind: 'item', item: 'squad-token', delta: 1, value: 1 },
    { kind: 'flag', flag: 'paran.asked.smoke', value: true },
    { kind: 'coin', delta: -5, value: 5 },
    { kind: 'xp', delta: 8, value: 8 },
    { kind: 'levelup', level: 2 },
    { kind: 'card', card: 'obelisk' },
    { kind: 'codex', codex: 'claw' },
    { kind: 'achievement', achievement: 'warned' },
    { kind: 'attention', delta: 9, value: 9, threshold: 'noticed' },
    { kind: 'check', stat: 'heart', roll: 3, total: 6, dc: 5, passed: true, usedFortune: false },
    { kind: 'checkpoint', scene: 'b1.c00.s01' },
    { kind: 'jump', scene: 'b1.c00.s01' },
    { kind: 'page', page: 'b1.c00.s01.p01', scene: 'b1.c00.s01', index: 0 },
    { kind: 'scene', scene: 'b1.c00.s01', first: true },
    { kind: 'gameover', scene: 'b1.c00.s07', outcome: 'toolate', reasonKey: 'b1.c00.s07.gameover', suggest: [] },
    { kind: 'ending', ending: 'wip', scene: 'b1.c01.s99' },
  ]

  it('jedes Ereignis erzeugt entweder eine Einblendung oder einen eigenen Klang', () => {
    const silent = samples.filter(ev => !toastFor(ev, t) && !bareSfx(ev)).map(ev => ev.kind)
    expect(silent).toEqual([])
  })

  it('jede Einblendung traegt Glyph UND Text — nie nur Farbe', () => {
    for (const ev of samples) {
      const toast = toastFor(ev, t)
      if (!toast) continue
      expect(toast.icon.length).toBeGreaterThan(0)
      expect(toast.text.length).toBeGreaterThan(0)
      expect(toast.sfx.length).toBeGreaterThan(0)
    }
  })
})
