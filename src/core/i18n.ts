/**
 * Winzige i18n-Schicht: flache Schluessel-Karten pro Sprache, `t(key, vars)`.
 * Keine Dependency, keine Pluralregeln (brauchen wir nicht — die Prosa ist
 * ausgeschrieben, nicht generiert).
 *
 * Ein fehlender Schluessel wird NICHT still zu leerem Text: Er liefert den
 * Schluessel selbst zurueck und meldet sich in `missing`. Die Validierungs-Suite
 * prueft ohnehin Parität zwischen `de` und `en`, aber im Zweifel soll ein Loch
 * im Text sichtbar sein statt unsichtbar.
 */

import type { Lang } from '../model/types.ts'

export type Dict = Record<string, string>

export class I18n {
  private dicts: Record<string, Dict> = {}
  lang: Lang
  readonly missing = new Set<string>()

  constructor(lang: Lang) {
    this.lang = lang
  }

  register(lang: Lang, dict: Dict): void {
    this.dicts[lang] = { ...(this.dicts[lang] ?? {}), ...dict }
  }

  has(key: string, lang: Lang = this.lang): boolean {
    return this.dicts[lang]?.[key] !== undefined
  }

  t(key: string, vars?: Record<string, string | number>): string {
    const raw = this.dicts[this.lang]?.[key]
    if (raw === undefined) {
      this.missing.add(`${this.lang}:${key}`)
      return key
    }
    return vars ? interpolate(raw, vars) : raw
  }

  /** Alle Schluessel einer Sprache — fuer die Paritaets-Pruefung. */
  keys(lang: Lang): string[] {
    return Object.keys(this.dicts[lang] ?? {})
  }
}

/** `{name}` wird ersetzt; unbekannte Platzhalter bleiben stehen (sichtbarer Fehler). */
export function interpolate(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (all, name: string) =>
    name in vars ? String(vars[name]) : all)
}

/** Wortzahl fuer die Band-Pruefung. Zaehlt Wortgruppen, keine Satzzeichen. */
export function wordCount(text: string): number {
  const cleaned = text.replace(/\{[^}]*\}/g, ' ').trim()
  if (!cleaned) return 0
  return cleaned.split(/\s+/).length
}
