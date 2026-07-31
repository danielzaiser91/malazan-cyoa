/** Oberfläche, Codex, Karten, Talente, Erfolge — deutsch. */

export const de_common: Record<string, string> = {
  // --- Buch, POV, Enden ----------------------------------------------------
  'b1.title': 'Die Gärten des Mondes',
  'pov.paran': 'Ganoes Paran',
  'pov.kruppe': 'Kruppe',
  'pov.recruit': 'Du',
  'pov.lorn': 'Adjunktin Lorn',
  'sheet.paran-child.title': 'Ganoes Paran, zwölf Jahre',

  'ending.wip.title': 'Die Auslegung bricht ab',
  'ending.wip.summary':
    'Kein Ende, sondern der Rand der bisher gelegten Karten. Das Spiel wird Kapitel für Kapitel weitergebaut.',

  // --- Werte ---------------------------------------------------------------
  'stat.blade': 'Klinge',
  'stat.will': 'Wille',
  'stat.cunning': 'List',
  'stat.heart': 'Herz',
  'stat.standing': 'Ansehen',
  'stat.fortune': 'Fügung',
  'stat.blade.hint': 'Gewalt, Ausdauer, eine Linie halten.',
  'stat.will.hint': 'Was du an Gewirr trägst und was dich nicht übernimmt.',
  'stat.cunning.hint': 'Täuschung, Taktik, einen Raum lesen.',
  'stat.heart.hint': 'Mitgefühl. Öffnet Wege, die sonst zubleiben.',
  'stat.standing.hint': 'Was die Truppe von dir hält.',
  'stat.fortune.hint': 'Oponns Aufmerksamkeit. Schneidet in beide Richtungen.',
  'stat.attention': 'Göttliche Aufmerksamkeit',
  'stat.attention.hint': 'Wie genau man dir zusieht. Steigt, wenn du auf Fügung setzt.',

  // --- Hintergründe --------------------------------------------------------
  'bg.marine': 'Marine',
  'bg.marine.desc': 'Linientruppe. Kampfwege, Rückhalt in der Truppe, Leute schützen.',
  'bg.sapper': 'Sappeur',
  'bg.sapper.desc': 'Munition, Sabotage, und die Kunst, im richtigen Moment zu graben.',
  'bg.mage': 'Kadermagier',
  'bg.mage.desc': 'Ein Gewirr, wenig Geduld dafür, und Leute, die dich deswegen mustern.',

  // --- Oberfläche ----------------------------------------------------------
  'ui.title': 'Malazan — Das Buch der Gefallenen',
  'ui.subtitle': 'Eine Auslegung in Karten',
  'ui.start': 'Auslegung beginnen',
  'ui.continue': 'Weiterlesen',
  'ui.newProfile': 'Neues Profil',
  'ui.profile': 'Profil',
  'ui.profiles': 'Profile',
  'ui.deleteProfile': 'Profil löschen',
  'ui.deleteConfirm': 'Dieses Profil und alles darin wirklich löschen?',
  'ui.deleteConfirm2': 'Endgültig. Es gibt kein Zurück.',
  'ui.export': 'Profil exportieren',
  'ui.import': 'Profil einlesen',
  'ui.name': 'Name',
  'ui.pronouns': 'Anrede',
  'ui.pronouns.she': 'sie',
  'ui.pronouns.he': 'er',
  'ui.pronouns.they': 'sie (neutral)',
  'ui.background': 'Herkunft',
  'ui.sigil': 'Zeichen',

  'ui.next': 'Weiter',
  'ui.back': 'Zurück',
  'ui.close': 'Schließen',
  'ui.cancel': 'Abbrechen',
  'ui.confirm': 'Bestätigen',
  'ui.page': 'Seite {n} von {total}',
  'ui.backlog': 'Rückschau',
  'ui.codex': 'Marginalien',
  'ui.sheet': 'Blatt',
  'ui.reading': 'Die Auslegung',
  'ui.settings': 'Einstellungen',
  'ui.menu': 'Menü',
  'ui.coverage': 'Gelesen: {read} von {total} Seiten',
  'ui.endingsFound': 'Enden gefunden: {n} von {total}',
  'ui.cardsFound': 'Karten: {n} von {total}',
  'ui.codexFound': 'Marginalien: {n} von {total}',
  'ui.playtime': 'Spielzeit',
  'ui.level': 'Stufe {n}',
  'ui.xp': 'Erfahrung',
  'ui.coin': 'Münzen',
  'ui.items': 'Bei dir',
  'ui.flags': 'Was gilt',
  'ui.noItems': 'Nichts, was der Rede wert wäre.',
  'ui.noFlags': 'Noch nichts, was jemand über dich sagen würde.',
  'ui.talents': 'Talente',
  'ui.playing': 'Du spielst gerade',

  'ui.locked': 'Verschlossen',
  'ui.played': 'Schon gelegt',
  'ui.jump': 'Hierher springen',
  'ui.jumpTitle': 'Die Karten neu legen',
  'ui.jumpWarn':
    'Kruppe legt ab dieser Karte neu. Was du seitdem geworden bist, verfällt — was du weißt, bleibt.',
  'ui.jumpLoses': 'Zurückgenommen wird:',
  'ui.jumpKeeps': 'Behalten wird: alles, was du gesehen und gelernt hast.',
  'ui.jumpNothing': 'Nichts — du stündest genau so da wie jetzt.',

  'ui.gameover': 'Kruppe verlegt sich',
  'ui.gameoverHint': 'Wähle eine Karte, ab der neu gelegt wird.',
  'ui.ending': 'Ein Ende',
  'ui.contentWarning': 'Hinweis zum Inhalt',
  'ui.contentWarningBody':
    'Diese Geschichte erzählt von Krieg, von einem Massaker an Zivilisten, von Folter und von Kindern in Gefahr. Sie zeigt weniger, als die Romane zeigen, und nimmt es trotzdem ernst. Du kannst diesen Hinweis jederzeit in den Einstellungen nachlesen.',
  'ui.understood': 'Verstanden',

  'ui.risk.safe': 'ohne Risiko',
  'ui.risk.costly': 'kostet etwas',
  'ui.risk.dangerous': 'gefährlich',
  'ui.risk.lethal': 'tödlich',
  'ui.check': 'Probe: {stat} {value} + W6 gegen {dc}',
  'ui.checkPassed': 'Gelungen: {total} gegen {dc}',
  'ui.checkFailed': 'Misslungen: {total} gegen {dc}',
  'ui.useFortune': 'Fügung einsetzen (+{n}) — sie sehen dann hin',

  'ui.outcome.death': 'Tod',
  'ui.outcome.captured': 'Gefangen',
  'ui.outcome.toolate': 'Zu spät',
  'ui.outcome.lore': 'Nur Wissen',
  'ui.outcome.loop': 'Rückkehr',
  'ui.outcome.progress': 'Fortschritt',
  'ui.outcome.ending': 'Ende',

  'ui.card.unknown': 'Eine Karte, deren Namen du noch nicht kennst',
  'ui.card.locked': 'Verschlossen',
  'ui.filter.all': 'Alle',
  'ui.filter.unvisited': 'Nur ungelesene',
  'ui.filter.deadends': 'Nur Sackgassen',
  'ui.filter.side': 'Nur Nebenwege',
  'ui.filter.chapter': 'Nur dieses Kapitel',
  'ui.listView': 'Als Liste',
  'ui.chartView': 'Als Auslegung',

  'ui.settings.lang': 'Sprache',
  'ui.settings.fontScale': 'Schriftgröße',
  'ui.settings.lineWidth': 'Zeilenbreite',
  'ui.settings.serif': 'Serifenschrift',
  'ui.settings.dyslexic': 'Legasthenie-freundliche Schrift',
  'ui.settings.contrast': 'Hoher Kontrast',
  'ui.settings.reduceMotion': 'Bewegung reduzieren',
  'ui.settings.textSpeed': 'Textaufbau',
  'ui.settings.autoAdvance': 'Automatisch weiterblättern',
  'ui.settings.mute': 'Ton aus',
  'ui.settings.volume': 'Lautstärke',
  'ui.settings.version': 'Fassung',
  'ui.settings.disclaimer': 'Rechtliches und Fan-Werk-Hinweis',

  'ui.update.title': 'Neue Fassung verfügbar',
  'ui.update.action': 'Speichern und neu laden',
  'ui.saveError':
    'Der Spielstand konnte nicht gespeichert werden. Exportiere ihn jetzt, bevor etwas verloren geht.',
  'ui.autosaved': 'Gespeichert',

  'ui.disclaimer':
    'Fan-Werk, inoffiziell. Nicht verbunden mit Steven Erikson, Ian C. Esslemont oder ihren Verlagen und von diesen nicht autorisiert. Alle Rechte am Originalwerk liegen bei den Rechteinhabern. Kostenlos, nicht kommerziell, ohne Werbung; auf Anfrage wird das Spiel offline genommen.',

  // --- Codex ---------------------------------------------------------------
  'codex.malaz-city.title': 'Malaz-Stadt',
  'codex.malaz-city.body':
    'Hafenstadt auf einer Insel vor dem Festland von Quon Tali, Ursprung des Reichs, das sie benannt hat. Über der Stadt liegt Mocks Feste auf einem Felsen; unter ihr liegen Viertel, in denen es billiger ist zu wohnen als zu sterben. Die Hauptstadt ist längst woanders. Die Stadt hat es nie ganz eingesehen.',
  'codex.mouse-quarter.title': 'Das Mausviertel',
  'codex.mouse-quarter.body':
    'Das ärmste Viertel von Malaz-Stadt, dicht bebaut, unten am Wasser. Wer hier wohnt, kommt ohne Heiler aus und ohne Fürsprecher. In der Nacht, in der das Reich den Besitzer wechselte, brannte es — nicht durch Zufall und nicht vollständig, sondern nach einer Liste.',
  'codex.malazan-empire.title': 'Das Malazanische Reich',
  'codex.malazan-empire.body':
    'Von Kaiser Kellanved und seinem Gefährten Tanzer aus einer Inselstadt heraus aufgebaut und in weniger als einem Menschenleben über Kontinente getrieben. Es lebt von seinen Armeen, misstraut seinen Helden und schreibt seine Geschichte im Nachhinein um. Wer darin dient, dient selten dem, was auf der Fahne steht.',
  'codex.bridgeburners.title': 'Die Brückenverbrenner',
  'codex.bridgeburners.body':
    'Eine Einheit aus der ersten Aushebung des Kaisers, berühmt für Tunnel, Sprengungen und dafür, dass es sie noch gibt. Ihr Ruf ist inzwischen größer als ihre Zahl und wird ihnen mehr und mehr zum Verhängnis: Eine Legende, die dem Kaiser gehörte, ist unter der neuen Herrschaft kein Besitz, sondern eine offene Rechnung.',
  'codex.claw.title': 'Die Klaue',
  'codex.claw.body':
    'Der Meuchel- und Geheimdienst des Reichs, aus Attentätern und Magiern zusammengesetzt, dem Thron unmittelbar unterstellt. Die Armee verachtet sie, fürchtet sie und arbeitet mit ihr. Man erkennt ihre Arbeit nicht daran, dass etwas laut geschieht, sondern daran, dass danach ordentlich aufgeräumt ist.',
  'codex.laseen.title': 'Laseen',
  'codex.laseen.body':
    'Zuvor Surly, Befehlshaberin der Klaue. In der Nacht, in der Kaiser und Tanzer in Malaz-Stadt starben, wurde sie Kaiserin. Sie trägt nichts, was sie ausweist, und braucht es nicht. Was sie tut, tut sie in der Reihenfolge, die am wenigsten auffällt — zuerst die Zauberkundigen, dann die Alte Garde.',
  'codex.old-guard.title': 'Die Alte Garde',
  'codex.old-guard.body':
    'Die Veteranen aus Kellanveds Zeit: Kommandeure, die zu bekannt sind, um versetzt zu werden, und zu beliebt, um verurteilt zu werden. Genau deshalb verschwinden sie einzeln, jeweils mit einer plausiblen Begründung.',
  'codex.wax-witches.title': 'Wachskerzen-Weiber',
  'codex.wax-witches.body':
    'Volksmagierinnen in den armen Vierteln: Fieber ziehen, Wunden schließen, ein Wachsbild in den Ofen legen und hoffen. Kleine, ungelernte, ungeprüfte Zauberei — und aus Sicht eines Throns, der jede Macht registriert haben will, ein unbezahltes Register.',
  'codex.ascendancy.title': 'Aufstieg',
  'codex.ascendancy.body':
    'Es gibt keine Grenze zwischen Sterblichen und Göttern, nur eine Leiter. Wer weit genug hinaufkommt, wird von der Welt bemerkt und hört nicht mehr auf, bemerkt zu werden. Ein Aufgestiegener ist noch kein Gott — dafür braucht es Gläubige —, aber er ist etwas, das man nicht mehr übersieht. Das ist der Punkt, und es ist keine gute Nachricht.',
  'codex.deck-of-dragons.title': 'Das Deck der Drachen',
  'codex.deck-of-dragons.body':
    'Ein Kartenspiel mit Häusern und Rollen, das keine Zukunft vorhersagt, sondern zeigt, wer sich gerade bewegt und worauf alles zuläuft. Die Karten ändern sich, wenn sich die Mächte ändern. Wer eine Legung liest, sieht keine Antwort, sondern ein Kräftefeld — und wird von ihm gesehen.',

  // --- Karten --------------------------------------------------------------
  'card.obelisk.title': 'Obelisk',
  'card.obelisk.body':
    'Unverbündet. Die Karte der Zeit, die nicht vergeht: was vergraben wurde, liegt noch da. Wer sie hält, sieht in der Auslegung eine benachbarte Karte, die er sonst nicht sähe.',
  'card.ending-wip.title': 'Der leere Platz',
  'card.ending-wip.body':
    'Unverbündet. Kein Ende, sondern der Rand des Gelegten. Kruppe versichert, das sei vorübergehend.',

  // --- Talente -------------------------------------------------------------
  'talent.sappers-ear.title': 'Sappeurs Ohr',
  'talent.sappers-ear.effect': 'Fallen und Sprengladungen erscheinen als eigene Wahlmöglichkeit, statt dich zu treffen.',
  'talent.warren-touched.title': 'Gewirr-berührt',
  'talent.warren-touched.effect': 'In manchen Szenen steht dir ein Weg durch ein Gewirr offen. Er ist nie leise.',
  'talent.old-guards-nod.title': 'Nicken der Alten Garde',
  'talent.old-guards-nod.effect': 'Ansehen zählt bei Veteranen um 2 höher.',
  'talent.reader.title': 'Kartenleser',
  'talent.reader.effect': 'Jede Karte in der Auslegung zeigt einen Hinweis mehr.',

  // --- Gegenstände ---------------------------------------------------------
  'item.squad-token.title': 'Truppzeichen',
  'item.squad-token.body': 'Ein abgegriffenes Stück Metall. Es beweist nichts und öffnet trotzdem Türen.',

  // --- Erfolge -------------------------------------------------------------
  'ach.warned.title': 'Gewarnt',
  'ach.warned.body': 'Du hast dir angehört, was ein gutes Leben ist, und dich dagegen entschieden.',
  'ach.first-mercy.title': 'Erste Gnade',
  'ach.first-mercy.body': 'Du bist stehen geblieben, als alle anderen weitergingen.',
  'ach.prologue-done.title': 'Der Rauch legt sich',
  'ach.prologue-done.body': 'Du hast den Abend überstanden, an dem das Reich den Besitzer wechselte.',

  // --- Flags im Klartext (Blatt + Einblendung) -----------------------------
  'flag.paran.asked.smoke': 'Du hast gefragt, warum niemand löscht.',
  'flag.paran.noticed.soldier': 'Dir ist der Mann am Ende der Mauer aufgefallen.',
  'flag.paran.met.bridgeburner': 'Ein Brückenverbrenner hat mit dir geredet.',
  'flag.paran.turned.back': 'Du bist umgekehrt, bevor dich jemand ansprach.',
  'flag.paran.helped.woman': 'Du hast zwei Menschen aus dem Rauch gebracht.',
  'flag.paran.saw.claw': 'Du weißt jetzt, wie die Klaue arbeitet.',

  'ui.attention.noticed': 'Etwas hat dich bemerkt.',
  'ui.attention.hunted': 'Etwas sucht jetzt gezielt nach dir.',
  'ui.checkpointSet': 'Eine neue Karte liegt in der Auslegung.',


  // --- Codex-Kategorien ----------------------------------------------------
  'codex.cat.people': 'Personen',
  'codex.cat.peoples': 'Völker & Verbände',
  'codex.cat.places': 'Orte',
  'codex.cat.magic': 'Gewirre & Magie',
  'codex.cat.deck': 'Das Deck',
  'codex.cat.history': 'Geschichte',
  'codex.cat.words': 'Begriffe',

}
