/**
 * Alle Sprachpakete an einer Stelle. Ein Kapitel dazu heisst: zwei Zeilen hier,
 * eine Datei je Sprache. Die Paritaets-Pruefung in `tests/content/` faengt,
 * wenn eine der beiden vergessen wird.
 */

import type { Dict } from '../core/i18n.ts'
import type { Lang } from '../model/types.ts'
import { de_common } from './de/common.ts'
import { en_common } from './en/common.ts'
import { de_b1_c00 } from './de/b1/c00.ts'
import { en_b1_c00 } from './en/b1/c00.ts'

export const locales: Record<Lang, Dict> = {
  de: { ...de_common, ...de_b1_c00 },
  en: { ...en_common, ...en_b1_c00 },
}
