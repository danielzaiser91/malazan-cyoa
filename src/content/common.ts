/**
 * Stammdaten, die kein Kapitel besitzt: Codex, Deck-Karten, Talente,
 * Gegenstaende, Erfolge, Wertetafeln der Interlude-Figuren.
 * Wie ueberall in `content/`: keine Anzeigetexte, nur Schluessel.
 */

import type {
  AchievementDef, CardDef, CodexEntry, ItemDef, SheetDef, TalentDef,
} from '../model/types.ts'

export const codex: CodexEntry[] = [
  { id: 'malaz-city', category: 'places', titleKey: 'codex.malaz-city.title', bodyKey: 'codex.malaz-city.body', spoilerScope: 'gotm' },
  { id: 'mouse-quarter', category: 'places', titleKey: 'codex.mouse-quarter.title', bodyKey: 'codex.mouse-quarter.body', spoilerScope: 'gotm', see: ['malaz-city', 'wax-witches'] },
  { id: 'malazan-empire', category: 'history', titleKey: 'codex.malazan-empire.title', bodyKey: 'codex.malazan-empire.body', spoilerScope: 'gotm', see: ['laseen', 'old-guard'] },
  { id: 'bridgeburners', category: 'peoples', titleKey: 'codex.bridgeburners.title', bodyKey: 'codex.bridgeburners.body', spoilerScope: 'gotm', see: ['malazan-empire', 'old-guard'] },
  { id: 'claw', category: 'peoples', titleKey: 'codex.claw.title', bodyKey: 'codex.claw.body', spoilerScope: 'gotm', see: ['laseen'] },
  { id: 'laseen', category: 'people', titleKey: 'codex.laseen.title', bodyKey: 'codex.laseen.body', spoilerScope: 'gotm', see: ['claw', 'old-guard'] },
  { id: 'old-guard', category: 'peoples', titleKey: 'codex.old-guard.title', bodyKey: 'codex.old-guard.body', spoilerScope: 'gotm' },
  { id: 'wax-witches', category: 'magic', titleKey: 'codex.wax-witches.title', bodyKey: 'codex.wax-witches.body', spoilerScope: 'gotm' },
  { id: 'ascendancy', category: 'magic', titleKey: 'codex.ascendancy.title', bodyKey: 'codex.ascendancy.body', spoilerScope: 'gotm', see: ['deck-of-dragons'] },
  { id: 'deck-of-dragons', category: 'deck', titleKey: 'codex.deck-of-dragons.title', bodyKey: 'codex.deck-of-dragons.body', spoilerScope: 'gotm', see: ['ascendancy'] },
]

export const cards: CardDef[] = [
  { id: 'obelisk', house: 'unaligned', titleKey: 'card.obelisk.title', bodyKey: 'card.obelisk.body', reveals: 1 },
  { id: 'ending-wip', house: 'unaligned', titleKey: 'card.ending-wip.title', bodyKey: 'card.ending-wip.body' },
]

export const talents: TalentDef[] = [
  { id: 'sappers-ear', titleKey: 'talent.sappers-ear.title', effectKey: 'talent.sappers-ear.effect' },
  { id: 'warren-touched', titleKey: 'talent.warren-touched.title', effectKey: 'talent.warren-touched.effect' },
  { id: 'old-guards-nod', titleKey: 'talent.old-guards-nod.title', effectKey: 'talent.old-guards-nod.effect' },
  { id: 'reader', titleKey: 'talent.reader.title', effectKey: 'talent.reader.effect' },
]

export const items: ItemDef[] = [
  { id: 'squad-token', kind: 'key', titleKey: 'item.squad-token.title', bodyKey: 'item.squad-token.body' },
]

export const achievements: AchievementDef[] = [
  { id: 'warned', titleKey: 'ach.warned.title', bodyKey: 'ach.warned.body' },
  { id: 'first-mercy', titleKey: 'ach.first-mercy.title', bodyKey: 'ach.first-mercy.body' },
  { id: 'prologue-done', titleKey: 'ach.prologue-done.title', bodyKey: 'ach.prologue-done.body' },
]

/**
 * Wertetafeln der Interlude-Figuren. Sie gehoeren der Figur, nicht dem Spieler —
 * ein Interlude kann den Rekruten weder staerken noch schwaechen.
 */
export const sheets: SheetDef[] = [
  {
    id: 'paran-child',
    titleKey: 'sheet.paran-child.title',
    // Ein Zwoelfjaehriger: kaum Klinge, viel Herz, und mehr Wille, als ihm guttut.
    stats: { blade: 0, will: 2, cunning: 1, heart: 3, standing: 1, fortune: 1 },
  },
]
