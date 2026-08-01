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
  'ui.sheet': 'Character',
  'ui.reading': 'Map',
  'ui.settings': 'Settings',
  'ui.menu': 'Menu',
  'ui.coverage': 'Read: {read} of {total} pages',
  'ui.endingsFound': 'Endings found: {n} of {total}',
  'ui.cardsFound': 'Cards: {n} of {total}',
  'ui.codexFound': 'Marginalia: {n} of {total}',
  'ui.playtime': 'Time played',
  'ui.level': 'Level {n}',
  'ui.levelWord': 'Level',
  'ui.statsTab': 'Stats',
  'ui.cards': 'Cards',
  'ui.all': 'All',
  'ui.search': 'Search',
  'ui.noMatch': 'Nothing found.',
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
  'flag.paran.counted.pattern': 'Counted: seven fires, and not one of them by chance.',
  'flag.paran.gave.water': 'Gave water to a stranger in the smoke.',
  'flag.recruit.asked.name': 'Asked her name.',
  'flag.recruit.knows.squad': 'Knows the voices of their own corner below deck.',
  'flag.paran.looked.away': 'Looked down before the Empress — one second too late.',
  'flag.paran.held.gaze': 'Met the Empress\u2019s eyes. Someone behind her noticed.',
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


  // --- Chapter 1: Codex ----------------------------------------------------
  'codex.itko-kan.title': 'Itko Kan',
  'codex.itko-kan.body':
    'A province on the southern coast of Quon Tali, fishing and farming, two bad years in a row. The harbour of Kan is large enough for troop transports and small enough that everyone knows whose son has just signed. The empire likes to recruit here: the people are hard-wearing, and they do their arithmetic.',
  'codex.genabackis.title': 'Genabackis',
  'codex.genabackis.body':
    'A large, narrow continent beyond the Seeker’s Deep. Warm southern coast, cold northern one, wide plains between. The Free Cities lie there, and the empire is swallowing them one at a time — until Pale. Six weeks’ crossing if the weather holds.',
  'codex.rhivi.title': 'The Rhivi',
  'codex.rhivi.body':
    'Nomads of the plains of Genabackis. They move with the bhederin herds, the herds move with the grass, the grass moves with the rain. Allied with the warlord Caladan Brood, suspicious of anyone who builds walls. Their children are born on the move and buried on the move.',
  'codex.sorry.title': 'Sorry',
  'codex.sorry.body':
    'A fisher girl from a coastal village near Itko Kan who signs up with the same levy as you. She has no kit, no family and no name she carried before this one. She does not blink. Experienced soldiers step around her without being able to say why.',
  'codex.hounds-of-shadow.title': 'The Hounds of Shadow',
  'codex.hounds-of-shadow.body':
    'Not animals. Something older in the shape of something four-legged, bound to the House of Shadow and bigger than any horse. They are not set on a target, they are let go. What they do never looks like a fight afterwards, because it was not one.',
  'codex.shadowthrone-cotillion.title': 'Two on a Ridge',
  'codex.shadowthrone-cotillion.body':
    'Two figures who argue like old business partners and make stretches of country unusable while doing it. One walks with a cane, the other stands still. They have several names and use none of them within earshot. What is untidy work to them is a mass grave to everyone else.',
  'codex.lorn.title': 'Adjunct Lorn',
  'codex.lorn.body':
    'The Empress’s personal blade. She carries an otataral sword, so no sorcery touches her and none obeys her. She counts distances rather than the dead, she waits exactly long enough for you to notice, and she believes that outside her office there is nothing of her left.',
  'codex.adjunct.title': 'The Office of the Adjunct',
  'codex.adjunct.body':
    'Not a military rank but an instrument: one person permitted to act anywhere in the empire in the Empress’s name, and whom no magic can touch. There is only ever one. Taking the office does not cost you your name, but everything that was attached to it.',
  'codex.otataral.title': 'Otataral',
  'codex.otataral.body':
    'A rust-red ore out of Seven Cities near which sorcery dies — your own exactly as readily as an enemy’s. It cannot be switched on and off. Whoever carries an otataral blade is proof against all magic and excluded from all healing.',
  'codex.paran.title': 'Ganoes Paran',
  'codex.paran.body':
    'Lieutenant of the Eighth Cavalry, son of a landholder out of Unta, graduate of the officer training corps. He could have inherited an estate and decided against it. He wants to know what happened — a considerably less comfortable quality than wanting a story.',

  // --- Chapter 1: Cards ----------------------------------------------------
  'card.oponn.title': 'Oponn',
  'card.oponn.body':
    'Unaligned. The Twins of Chance: the Lady who Pulls and the Lord who Pushes. They stand back to back and they never agree. Whoever holds them sees two neighbouring cards of the reading — and is seen while looking.',
  'card.hound.title': 'Hound of Shadow',
  'card.hound.body':
    'House of Shadow. A piece of knowledge you cannot put down again: how large the print was, and how calm the voices above it. Whoever holds it recognises one more card in the reading — and sleeps worse afterwards.',

  // --- Chapter 1: Achievements --------------------------------------------
  'ach.no-lesson.title': 'No Lesson',
  'ach.no-lesson.body': 'You stayed with somebody there was nothing left to do for, and it achieved nothing. That was precisely the point.',
  'ach.shipped-out.title': 'Shipped Out',
  'ach.shipped-out.body': 'You have left Quon Tali. From here there is no way back shorter than six weeks.',

  'sheet.lorn.title': 'Adjunct Lorn',

  // --- Chapter 1: Flags in plain language ---------------------------------
  'flag.recruit.knows.destination': 'You know where the ship is going: Genabackis.',
  'flag.recruit.noticed.sorry': 'You noticed the girl who does not queue.',
  'flag.recruit.spoke.sorry': 'You talked to Sorry. She never asked your name.',
  'flag.recruit.stayed.with.dying': 'You stayed with a dying man you did not know.',
  'flag.recruit.saw.hound': 'You saw what was on the coast road.',
  'flag.lorn.measured.paran': 'Lorn has taken note of the young lieutenant.',
  'flag.lorn.admitted.screen': 'Lorn said out loud that the massacre was a screen.',

}
