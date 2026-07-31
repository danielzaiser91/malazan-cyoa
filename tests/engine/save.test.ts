/**
 * Validierung 12 — Save-Migration, plus Speicher-Robustheit.
 * Zu jeder historischen Schemaversion liegt eine Fixture-Datei; jede muss laden.
 */

import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { freshEngine, testSave } from '../helpers.ts'
import { SaveStore, migrate, reviveSave, serialise } from '../../src/core/save.ts'
import { SAVE_SCHEMA } from '../../src/model/state.ts'

const FIXTURES = join(import.meta.dirname, '..', 'fixtures', 'saves')

/** localStorage-Ersatz fuer den Test — und ein Speicher, der voll sein kann. */
class MemStorage {
  map = new Map<string, string>()
  full = false
  getItem(k: string) { return this.map.get(k) ?? null }
  setItem(k: string, v: string) {
    if (this.full) throw new Error('QuotaExceededError')
    this.map.set(k, v)
  }
  removeItem(k: string) { this.map.delete(k) }
}

describe('12 · Save-Migration', () => {
  const files = readdirSync(FIXTURES).filter(f => f.endsWith('.json'))

  it('es gibt zu jeder Schemaversion eine Fixture', () => {
    const versions = files.map(f => Number(f.match(/schema-(\d+)/)?.[1]))
    for (let v = 1; v <= SAVE_SCHEMA; v++) expect(versions).toContain(v)
  })

  it.each(files)('%s laedt und ergibt einen vollstaendigen Spielstand', file => {
    const raw = JSON.parse(readFileSync(join(FIXTURES, file), 'utf8')) as Record<string, unknown>
    const save = reviveSave(raw, testSave())
    expect(save.schema).toBe(SAVE_SCHEMA)
    expect(save.profile.id).toBeTruthy()
    expect(Object.keys(save.run.stats)).toContain('heart')
    expect(save.meta.scenes).toBeTruthy()
    expect(Array.isArray(save.meta.pagesRead)).toBe(true)
  })

  it('hebt eine unbekannt alte Version trotzdem auf die aktuelle', () => {
    expect(migrate({ schema: 0 }).schema).toBe(SAVE_SCHEMA)
  })
})

describe('Revive ist vorwaertskompatibel und nicht destruktiv', () => {
  it('ergaenzt fehlende Felder aus dem Template', () => {
    const partial = { schema: SAVE_SCHEMA, profile: { id: 'x', name: 'X' } }
    const save = reviveSave(partial, testSave())
    expect(save.profile.id).toBe('x')
    expect(save.profile.background).toBe('marine')
    expect(save.run.coin).toBeGreaterThan(0)
  })

  it('ignoriert unbekannte Felder, statt den Stand zu verwerfen', () => {
    const base = testSave()
    const raw = { ...JSON.parse(serialise(base)), voelligNeu: 42 }
    const save = reviveSave(raw, testSave())
    expect(save.run.scene).toBe(base.run.scene)
  })

  it('behaelt frei geformte Karten wie Flags und Checkpoints vollstaendig', () => {
    const e = freshEngine()
    e.run.flags['irgendwas'] = true
    const save = reviveSave(JSON.parse(serialise(e.save)), testSave())
    expect(save.run.flags['irgendwas']).toBe(true)
    expect(Object.keys(save.checkpoints).length).toBeGreaterThan(0)
  })
})

describe('SaveStore', () => {
  it('schreibt, liest und fuehrt einen Index', () => {
    const store = new SaveStore(new MemStorage())
    const save = testSave()
    expect(store.write(save, '2026-07-31T12:00:00.000Z')).toBe(true)
    expect(store.listIds()).toEqual(['test'])
    expect(store.load('test', testSave())?.profile.name).toBe('Testlauf')
  })

  it('meldet einen vollen Speicher, statt still zu scheitern', () => {
    const mem = new MemStorage()
    mem.full = true
    const store = new SaveStore(mem)
    expect(store.write(testSave(), '2026-07-31T12:00:00.000Z')).toBe(false)
    expect(store.lastError).toBe('quota')
  })

  it('loescht ein Profil vollstaendig und laesst die anderen in Ruhe', () => {
    const store = new SaveStore(new MemStorage())
    const a = testSave(); a.profile.id = 'a'
    const b = testSave(); b.profile.id = 'b'
    store.write(a, '2026-07-31T12:00:00.000Z')
    store.write(b, '2026-07-31T12:00:00.000Z')
    store.remove('a')
    expect(store.listIds()).toEqual(['b'])
    expect(store.load('a', testSave())).toBeUndefined()
    expect(store.load('b', testSave())).toBeTruthy()
  })

  it('Export und Import sind verlustfrei', () => {
    const store = new SaveStore(new MemStorage())
    const e = freshEngine()
    while (!e.atExit) e.next()
    e.choose('talk')
    const text = store.export(e.save)
    const back = store.import(text, testSave())
    expect(back.run).toEqual(e.save.run)
    expect(back.meta).toEqual(e.save.meta)
    expect(back.checkpoints).toEqual(e.save.checkpoints)
  })

  it('ein kaputter Eintrag liefert `undefined` statt zu werfen', () => {
    const mem = new MemStorage()
    mem.map.set('malazan-cyoa/profile/kaputt', '{nicht json')
    const store = new SaveStore(mem)
    expect(store.load('kaputt', testSave())).toBeUndefined()
  })
})
