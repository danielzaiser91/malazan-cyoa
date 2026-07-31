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
  { id: 'itko-kan', category: 'places', titleKey: 'codex.itko-kan.title', bodyKey: 'codex.itko-kan.body', spoilerScope: 'gotm' },
  { id: 'genabackis', category: 'places', titleKey: 'codex.genabackis.title', bodyKey: 'codex.genabackis.body', spoilerScope: 'gotm' },
  { id: 'rhivi', category: 'peoples', titleKey: 'codex.rhivi.title', bodyKey: 'codex.rhivi.body', spoilerScope: 'gotm' },
  { id: 'sorry', category: 'people', titleKey: 'codex.sorry.title', bodyKey: 'codex.sorry.body', spoilerScope: 'gotm' },
  { id: 'hounds-of-shadow', category: 'peoples', titleKey: 'codex.hounds-of-shadow.title', bodyKey: 'codex.hounds-of-shadow.body', spoilerScope: 'gotm', see: ['shadowthrone-cotillion'] },
  { id: 'shadowthrone-cotillion', category: 'people', titleKey: 'codex.shadowthrone-cotillion.title', bodyKey: 'codex.shadowthrone-cotillion.body', spoilerScope: 'gotm', see: ['hounds-of-shadow', 'ascendancy'] },
  { id: 'lorn', category: 'people', titleKey: 'codex.lorn.title', bodyKey: 'codex.lorn.body', spoilerScope: 'gotm', see: ['adjunct', 'otataral'] },
  { id: 'adjunct', category: 'history', titleKey: 'codex.adjunct.title', bodyKey: 'codex.adjunct.body', spoilerScope: 'gotm', see: ['laseen', 'otataral'] },
  { id: 'otataral', category: 'magic', titleKey: 'codex.otataral.title', bodyKey: 'codex.otataral.body', spoilerScope: 'gotm' },
  { id: 'paran', category: 'people', titleKey: 'codex.paran.title', bodyKey: 'codex.paran.body', spoilerScope: 'gotm' },
]

export const cards: CardDef[] = [
  { id: 'obelisk', house: 'unaligned', titleKey: 'card.obelisk.title', bodyKey: 'card.obelisk.body', reveals: 1 },
  { id: 'oponn', house: 'unaligned', titleKey: 'card.oponn.title', bodyKey: 'card.oponn.body', reveals: 2 },
  { id: 'hound', house: 'shadow', titleKey: 'card.hound.title', bodyKey: 'card.hound.body', reveals: 1 },
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
  { id: 'no-lesson', titleKey: 'ach.no-lesson.title', bodyKey: 'ach.no-lesson.body' },
  { id: 'shipped-out', titleKey: 'ach.shipped-out.title', bodyKey: 'ach.shipped-out.body' },
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
  {
    id: 'lorn',
    titleKey: 'sheet.lorn.title',
    // Die Adjunktin: Klinge und Wille hoch, Herz bewusst niedrig — nicht weil
    // sie kalt waere, sondern weil sie sich das Mitgefuehl abtrainiert hat.
    stats: { blade: 4, will: 5, cunning: 4, heart: 1, standing: 5, fortune: 0 },
  },
]
