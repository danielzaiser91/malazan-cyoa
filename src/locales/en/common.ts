/** Interface, codex, cards, talents, achievements — English. */

export const en_common: Record<string, string> = {
  // --- Book, POV, endings --------------------------------------------------
  'b1.title': 'Gardens of the Moon',
  'pov.paran': 'Ganoes Paran',
  'pov.kruppe': 'Kruppe',
  'pov.recruit': 'You',
  'pov.lorn': 'Adjunct Lorn',
  'sheet.paran-child.title': 'Ganoes Paran, aged twelve',

  'ending.wip.title': 'The Reading Breaks Off',
  'ending.wip.summary':
    'Not an ending — the edge of the cards laid so far. The game is being built chapter by chapter.',

  // --- Stats ---------------------------------------------------------------
  'stat.blade': 'Blade',
  'stat.will': 'Will',
  'stat.cunning': 'Cunning',
  'stat.heart': 'Heart',
  'stat.standing': 'Standing',
  'stat.fortune': 'Fortune',
  'stat.blade.hint': 'Violence, endurance, holding a line.',
  'stat.will.hint': 'What you can carry of a warren, and what fails to take you.',
  'stat.cunning.hint': 'Deception, tactics, reading a room.',
  'stat.heart.hint': 'Compassion. Opens roads that otherwise stay shut.',
  'stat.standing.hint': 'What the squad thinks of you.',
  'stat.fortune.hint': "Oponn's attention. It cuts both ways.",
  'stat.attention': 'Divine attention',
  'stat.attention.hint': 'How closely you are being watched. It rises when you lean on Fortune.',

  // --- Backgrounds ---------------------------------------------------------
  'bg.marine': 'Marine',
  'bg.marine.desc': 'Line soldier. Fighting routes, squad trust, keeping people alive.',
  'bg.sapper': 'Sapper',
  'bg.sapper.desc': 'Munitions, sabotage, and knowing exactly when to dig.',
  'bg.mage': 'Cadre mage',
  'bg.mage.desc': 'One warren, not much patience for it, and people who look at you sideways.',

  // --- Interface -----------------------------------------------------------
  'ui.title': 'Malazan — Book of the Fallen',
  'ui.subtitle': 'A reading, laid in cards',
  'ui.start': 'Begin the reading',
  'ui.continue': 'Continue',
  'ui.newProfile': 'New profile',
  'ui.profile': 'Profile',
  'ui.profiles': 'Profiles',
  'ui.deleteProfile': 'Delete profile',
  'ui.deleteConfirm': 'Really delete this profile and everything in it?',
  'ui.deleteConfirm2': 'Final. There is no way back.',
  'ui.export': 'Export profile',
  'ui.import': 'Import profile',
  'ui.name': 'Name',
  'ui.pronouns': 'Pronouns',
  'ui.pronouns.she': 'she',
  'ui.pronouns.he': 'he',
  'ui.pronouns.they': 'they',
  'ui.background': 'Background',
  'ui.sigil': 'Sigil',

  'ui.next': 'Continue',
  'ui.back': 'Back',
  'ui.close': 'Close',
  'ui.cancel': 'Cancel',
  'ui.confirm': 'Confirm',
  'ui.page': 'Page {n} of {total}',
  'ui.backlog': 'History',
  'ui.codex': 'Marginalia',
  'ui.sheet': 'Sheet',
  'ui.reading': 'The Reading',
  'ui.settings': 'Settings',
  'ui.menu': 'Menu',
  'ui.coverage': 'Read: {read} of {total} pages',
  'ui.endingsFound': 'Endings found: {n} of {total}',
  'ui.cardsFound': 'Cards: {n} of {total}',
  'ui.codexFound': 'Marginalia: {n} of {total}',
  'ui.playtime': 'Time played',
  'ui.level': 'Level {n}',
  'ui.xp': 'Experience',
  'ui.coin': 'Coin',
  'ui.items': 'Carried',
  'ui.flags': 'What holds true',
  'ui.noItems': 'Nothing worth mentioning.',
  'ui.noFlags': 'Nothing anyone would yet say about you.',
  'ui.talents': 'Talents',
  'ui.playing': 'You are playing as',

  'ui.locked': 'Closed',
  'ui.played': 'Already laid',
  'ui.jump': 'Jump here',
  'ui.jumpTitle': 'Lay the cards again',
  'ui.jumpWarn':
    'Kruppe lays again from this card. What you have become since then is undone — what you know stays.',
  'ui.jumpLoses': 'Given back:',
  'ui.jumpKeeps': 'Kept: everything you have seen and learned.',
  'ui.jumpNothing': 'Nothing — you would stand exactly where you stand now.',

  'ui.gameover': 'Kruppe misremembers',
  'ui.gameoverHint': 'Choose a card to lay again from.',
  'ui.ending': 'An ending',
  'ui.contentWarning': 'A note on content',
  'ui.contentWarningBody':
    'This story deals with war, with a massacre of civilians, with torture and with children in danger. It shows less than the novels show, and still takes it seriously. You can read this note again at any time from the settings.',
  'ui.understood': 'Understood',

  'ui.risk.safe': 'no risk',
  'ui.risk.costly': 'costs something',
  'ui.risk.dangerous': 'dangerous',
  'ui.risk.lethal': 'lethal',
  'ui.check': 'Check: {stat} {value} + d6 against {dc}',
  'ui.checkPassed': 'Passed: {total} against {dc}',
  'ui.checkFailed': 'Failed: {total} against {dc}',
  'ui.useFortune': 'Spend Fortune (+{n}) — and they will look',

  'ui.outcome.death': 'Death',
  'ui.outcome.captured': 'Taken',
  'ui.outcome.toolate': 'Too late',
  'ui.outcome.lore': 'Knowledge only',
  'ui.outcome.loop': 'Returned',
  'ui.outcome.progress': 'Advanced',
  'ui.outcome.ending': 'Ending',

  'ui.card.unknown': 'A card whose name you do not yet know',
  'ui.card.locked': 'Closed',
  'ui.filter.all': 'All',
  'ui.filter.unvisited': 'Unread only',
  'ui.filter.deadends': 'Dead ends only',
  'ui.filter.side': 'Side paths only',
  'ui.filter.chapter': 'This chapter only',
  'ui.listView': 'As a list',
  'ui.chartView': 'As a reading',

  'ui.settings.lang': 'Language',
  'ui.settings.fontScale': 'Text size',
  'ui.settings.lineWidth': 'Line width',
  'ui.settings.serif': 'Serif typeface',
  'ui.settings.dyslexic': 'Dyslexia-friendly typeface',
  'ui.settings.contrast': 'High contrast',
  'ui.settings.reduceMotion': 'Reduce motion',
  'ui.settings.textSpeed': 'Text reveal',
  'ui.settings.autoAdvance': 'Auto-advance',
  'ui.settings.mute': 'Mute',
  'ui.settings.volume': 'Volume',
  'ui.settings.version': 'Build',
  'ui.settings.disclaimer': 'Legal and fan-work notice',

  'ui.update.title': 'A new build is available',
  'ui.update.action': 'Save and reload',
  'ui.saveError':
    'Your progress could not be saved. Export it now, before anything is lost.',
  'ui.autosaved': 'Saved',

  'ui.disclaimer':
    'A fan work, unofficial. Not affiliated with or endorsed by Steven Erikson, Ian C. Esslemont or their publishers. All rights in the original work remain with their holders. Free, non-commercial, no advertising; it will be taken down on request.',

  // --- Codex ---------------------------------------------------------------
  'codex.malaz-city.title': 'Malaz City',
  'codex.malaz-city.body':
    'A harbour city on an island off the Quon Tali mainland, and the origin of the empire that took its name. Mock\'s Hold sits on the rock above it; below it lie quarters where living is cheaper than dying. The capital moved elsewhere long ago. The city has never entirely accepted this.',
  'codex.mouse-quarter.title': 'The Mouse Quarter',
  'codex.mouse-quarter.body':
    'The poorest district of Malaz City, densely built, down by the water. People here manage without healers and without anyone to speak for them. On the night the empire changed hands it burned — not by accident and not completely, but according to a list.',
  'codex.malazan-empire.title': 'The Malazan Empire',
  'codex.malazan-empire.body':
    'Built out of one island city by Emperor Kellanved and his partner Dancer, and driven across continents in less than a lifetime. It lives off its armies, distrusts its heroes, and rewrites its history afterwards. Those who serve in it rarely serve what is printed on the banner.',
  'codex.bridgeburners.title': 'The Bridgeburners',
  'codex.bridgeburners.body':
    'A unit from the Emperor\'s first levy, famous for tunnels, demolitions, and for still existing. Their reputation now outweighs their numbers, and it is turning on them: a legend that belonged to the Emperor is not an asset under the new reign but an outstanding account.',
  'codex.claw.title': 'The Claw',
  'codex.claw.body':
    'The empire\'s corps of assassins and mages, answering directly to the throne. The army despises it, fears it, and works with it. You do not recognise their work because something happened loudly. You recognise it because afterwards everything has been tidied up.',
  'codex.laseen.title': 'Laseen',
  'codex.laseen.body':
    'Formerly Surly, commander of the Claw. On the night the Emperor and Dancer died in Malaz City she became Empress. She wears nothing that identifies her and does not need to. What she does, she does in the order that draws least attention — the sorcerers first, then the Old Guard.',
  'codex.old-guard.title': 'The Old Guard',
  'codex.old-guard.body':
    'The veterans from Kellanved\'s time: commanders too well known to be quietly reassigned and too well loved to be tried. Which is exactly why they disappear one at a time, each with a plausible reason attached.',
  'codex.wax-witches.title': 'Wax-witches',
  'codex.wax-witches.body':
    'Folk magicians of the poor quarters: drawing fever, closing wounds, putting a wax figure in the oven and hoping. Small, untrained, unregistered sorcery — and from the point of view of a throne that wants every power on a list, an unpaid ledger.',
  'codex.ascendancy.title': 'Ascendancy',
  'codex.ascendancy.body':
    'There is no border between mortals and gods, only a ladder. Climb far enough and the world notices you, and then it does not stop noticing you. An Ascendant is not yet a god — that takes worshippers — but is something that can no longer be overlooked. That is the point of it, and it is not good news.',
  'codex.deck-of-dragons.title': 'The Deck of Dragons',
  'codex.deck-of-dragons.body':
    'A deck of Houses and roles that predicts no future but shows who is moving and what everything is running toward. The cards change when the powers change. Anyone who reads a layout sees not an answer but a field of force — and is seen by it.',

  // --- Cards ---------------------------------------------------------------
  'card.obelisk.title': 'Obelisk',
  'card.obelisk.body':
    'Unaligned. The card of time that does not pass: what was buried is still there. Whoever holds it sees one neighbouring card in the reading that they would not otherwise see.',
  'card.ending-wip.title': 'The Empty Place',
  'card.ending-wip.body':
    'Unaligned. Not an ending, but the edge of what has been laid. Kruppe assures you this is temporary.',

  // --- Talents -------------------------------------------------------------
  'talent.sappers-ear.title': "Sapper's Ear",
  'talent.sappers-ear.effect': 'Traps and charges appear as a choice of their own instead of going off on you.',
  'talent.warren-touched.title': 'Warren-Touched',
  'talent.warren-touched.effect': 'In some scenes a way through a warren opens to you. It is never quiet.',
  'talent.old-guards-nod.title': "Old Guard's Nod",
  'talent.old-guards-nod.effect': 'Standing counts 2 higher with veterans.',
  'talent.reader.title': 'Reader',
  'talent.reader.effect': 'Every card in the reading shows one more hint.',

  // --- Items ---------------------------------------------------------------
  'item.squad-token.title': 'Squad token',
  'item.squad-token.body': 'A worn piece of metal. It proves nothing and opens doors anyway.',

  // --- Achievements --------------------------------------------------------
  'ach.warned.title': 'Warned',
  'ach.warned.body': 'You heard what a good life is, and decided against it.',
  'ach.first-mercy.title': 'First Mercy',
  'ach.first-mercy.body': 'You stopped when everybody else walked on.',
  'ach.prologue-done.title': 'The Smoke Settles',
  'ach.prologue-done.body': 'You came through the evening on which the empire changed hands.',

  // --- Flags in plain language (sheet + toast) -----------------------------
  'flag.paran.asked.smoke': 'You asked why nobody was putting it out.',
  'flag.paran.noticed.soldier': 'You noticed the man at the end of the wall.',
  'flag.paran.met.bridgeburner': 'A Bridgeburner spoke to you.',
  'flag.paran.turned.back': 'You turned back before anybody spoke to you.',
  'flag.paran.helped.woman': 'You got two people out of the smoke.',
  'flag.paran.saw.claw': 'You now know how the Claw works.',

  'ui.attention.noticed': 'Something has noticed you.',
  'ui.attention.hunted': 'Something is now looking for you on purpose.',
  'ui.checkpointSet': 'A new card lies in the reading.',


  // --- Codex categories ----------------------------------------------------
  'codex.cat.people': 'People',
  'codex.cat.peoples': 'Peoples & bodies',
  'codex.cat.places': 'Places',
  'codex.cat.magic': 'Warrens & magic',
  'codex.cat.deck': 'The Deck',
  'codex.cat.history': 'History',
  'codex.cat.words': 'Words',

}
