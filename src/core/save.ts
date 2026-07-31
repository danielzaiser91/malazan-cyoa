/**
 * Persistenz. EINE Schleuse zum `localStorage` — kein anderes Modul fasst ihn an.
 * (Learnings Kat. 5: zwei Views, die parallel schreiben, ueberschreiben einander.)
 *
 * Der Speicher-Teil ist bewusst von der Reise-Logik getrennt: `migrate`,
 * `reviveSave` und `serialise` sind rein und werden in Tests gegen Fixtures aus
 * jeder historischen Schemaversion gefahren. Der Browser-Teil ganz unten ist der
 * einzige Ort mit `localStorage`.
 */

import type { Profile, ProfileSettings, SaveFile } from '../model/state.ts'
import { SAVE_SCHEMA } from '../model/state.ts'
import { emptyMeta } from './engine.ts'
import { START_COIN, START_STATS } from './constants.ts'
import type { Background, Lang } from '../model/types.ts'

const PREFIX = 'malazan-cyoa/profile/'
const INDEX_KEY = 'malazan-cyoa/index'

export function defaultSettings(lang: Lang): ProfileSettings {
  return {
    lang,
    fontScale: 1,
    lineWidth: 'normal',
    serif: true,
    dyslexic: false,
    contrast: 'normal',
    reduceMotion: false,
    textSpeed: 'fast',
    autoAdvance: false,
    muted: false,
    volume: 0.5,
  }
}

export interface NewProfileInput {
  id: string
  name: string
  sigil: string
  background: Background
  pronouns: Profile['pronouns']
  lang: Lang
  bookId: string
  entry: string
  seed: number
  createdAt: string
}

export function createSave(input: NewProfileInput): SaveFile {
  return {
    schema: SAVE_SCHEMA,
    profile: {
      id: input.id,
      name: input.name,
      sigil: input.sigil,
      background: input.background,
      pronouns: input.pronouns,
      createdAt: input.createdAt,
      playedAt: input.createdAt,
    },
    settings: defaultSettings(input.lang),
    meta: emptyMeta(),
    run: {
      book: input.bookId,
      scene: input.entry,
      page: 0,
      stats: { ...START_STATS[input.background] },
      sheets: {},
      xp: 0,
      level: 1,
      coin: START_COIN,
      items: {},
      flags: {},
      talents: [],
      attention: 0,
      seed: input.seed,
      rolls: 0,
      entered: [],
      pagesApplied: [],
      interactionsUsed: [],
      playtimeMs: 0,
    },
    checkpoints: {},
    updatedAt: input.createdAt,
  }
}

// ---------------------------------------------------------------------------
// Migration und Revive
// ---------------------------------------------------------------------------

type RawSave = Record<string, unknown>

/**
 * Migrationskette auf ROHDATEN-Ebene, vor dem Revive. `migrations[n]` hebt einen
 * Save von Version n auf n+1. Neue Felder brauchen KEINE Migration — die fuellt
 * das template-basierte Revive unten. Nur semantische Aenderungen kommen hierher.
 */
const migrations: Record<number, (raw: RawSave) => RawSave> = {
  // Beispiel fuer die naechste Version:
  // 1: raw => ({ ...raw, schema: 2 }),
}

export function migrate(raw: RawSave): RawSave {
  let out = raw
  let version = typeof out.schema === 'number' ? out.schema : 0
  while (version < SAVE_SCHEMA) {
    const step = migrations[version]
    if (!step) break
    out = step(out)
    version = typeof out.schema === 'number' ? out.schema : version + 1
  }
  out.schema = SAVE_SCHEMA
  return out
}

/**
 * Fuellt fehlende Felder aus einem frischen Save auf. Vorwaertskompatibel und
 * bewusst NICHT destruktiv: ein unbekanntes Feld wird ignoriert, ein fehlendes
 * ergaenzt — nie wird der ganze Stand verworfen, nur weil eine Zahl abweicht.
 */
export function reviveSave(raw: RawSave, fallback: SaveFile): SaveFile {
  const migrated = migrate({ ...raw })
  return mergeInto(fallback, migrated) as SaveFile
}

function mergeInto(template: unknown, raw: unknown): unknown {
  if (Array.isArray(template)) return Array.isArray(raw) ? raw : template
  if (template && typeof template === 'object') {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return template
    const out: Record<string, unknown> = {}
    const t = template as Record<string, unknown>
    const r = raw as Record<string, unknown>
    // Frei geformte Karten (Flags, Items, Checkpoints) uebernehmen wir ganz —
    // ihre Schluessel stehen nicht im Template.
    if (Object.keys(t).length === 0) return r
    for (const key of Object.keys(t)) out[key] = mergeInto(t[key], r[key])
    return out
  }
  if (raw === undefined || raw === null) return template
  if (typeof raw !== typeof template) return template
  return raw
}

export function serialise(save: SaveFile): string {
  return JSON.stringify(save)
}

// ---------------------------------------------------------------------------
// Browser-Schleuse — der EINZIGE Ort mit localStorage
// ---------------------------------------------------------------------------

export interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export class SaveStore {
  private readonly storage: Storage
  /** Wird gesetzt, wenn ein Schreibversuch am Speicherplatz scheitert. */
  lastError: 'quota' | 'blocked' | undefined

  constructor(storage: Storage) {
    this.storage = storage
  }

  listIds(): string[] {
    const raw = this.storage.getItem(INDEX_KEY)
    if (!raw) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
    } catch {
      return []
    }
  }

  load(id: string, fallback: SaveFile): SaveFile | undefined {
    const raw = this.storage.getItem(PREFIX + id)
    if (!raw) return undefined
    try {
      return reviveSave(JSON.parse(raw) as RawSave, fallback)
    } catch {
      return undefined
    }
  }

  write(save: SaveFile, now: string): boolean {
    save.updatedAt = now
    save.profile.playedAt = now
    try {
      this.storage.setItem(PREFIX + save.profile.id, serialise(save))
      const ids = this.listIds()
      if (!ids.includes(save.profile.id)) {
        ids.push(save.profile.id)
        this.storage.setItem(INDEX_KEY, JSON.stringify(ids))
      }
      this.lastError = undefined
      return true
    } catch (err) {
      this.lastError = String(err).includes('uota') ? 'quota' : 'blocked'
      return false
    }
  }

  remove(id: string): void {
    this.storage.removeItem(PREFIX + id)
    this.storage.setItem(INDEX_KEY, JSON.stringify(this.listIds().filter(x => x !== id)))
  }

  /** Export als Datei-Inhalt — der einzige echte Schutz gegen einen Storage-Wipe. */
  export(save: SaveFile): string {
    return JSON.stringify(save, null, 2)
  }

  import(text: string, fallback: SaveFile): SaveFile {
    return reviveSave(JSON.parse(text) as RawSave, fallback)
  }
}
