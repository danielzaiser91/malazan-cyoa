/**
 * Kapitel 1 — deutsche Prosa. Eigene Formulierungen, keine Zeile aus dem Roman.
 *
 * Der Rekrut wird ausschliesslich beim Namen genannt (`{name}`), nie mit einem
 * Pronomen — dritte Person Präteritum laut Stilvorgabe, und drei Anreden mal
 * zwei Sprachen wären vier Fassungen jeder Seite.
 */

export const de_b1_c01: Record<string, string> = {
  'b1.c01.title': 'Kapitel 1 · Die Küste von Itko Kan',

  // ------------------------------------------------------------------ 1.1
  'b1.c01.s01.title': 'Der Anwerbetisch',
  'b1.c01.s01.summary':
    'In Kan schreibt ein Schreiber Namen in ein Buch. Wer unterschreibt, bekommt Sold, Stiefel und ein Schiff.',

  'b1.c01.s01.p01.body':
    'Der Tisch stand seit acht Tagen unter demselben Sonnensegel am Rand des Marktes, und die Schlange davor war an keinem dieser Tage kürzer geworden.\n\n' +
    'In Itko Kan war kein Krieg. Es war etwas Langsameres: zwei Missernten hintereinander, ein Fischzug, der ausgeblieben war, und ein Reich, das Soldaten brauchte und pünktlich zahlte. Die Leute in der Schlange trugen keine Waffen und sahen nicht aus, als hätten sie je welche gewollt. Sie sahen aus wie Leute, die rechnen konnten.\n\n' +
    'Vorn saß ein Schreiber mit einem Buch, daneben ein Sergeant, der schon lange nichts mehr fragte, was ihn selbst interessierte. Auf dem Tisch lag ein Stapel silberner Kreszente, und daneben stand ein Kasten mit Wachs und einem Siegel, das durch viele Hände gegangen war und aussah, als hätte es davon gelernt.',
  'b1.c01.s01.p01b.body':
    '{name} stand seit dem Vormittag in dieser Schlange. Zwei Plätze vor dem Tisch war Schluss mit den zurechtgelegten Sätzen; es fragte ohnehin niemand nach Gründen. Ein Mann vorn wurde abgewiesen, weil er zu alt war, und ging weg, ohne zu streiten. Eine Frau bekam ihr Silber, zählte es an Ort und Stelle nach und war damit Soldatin.\n\n' +
    'Vorn wurde gestritten, weil einer behauptete, es gebe eine Prämie für Leute mit eigenem Pferd, und der Sergeant sagte, das habe es vor elf Jahren gegeben und auch damals nur auf dem Papier. Der Mann ging trotzdem nicht.\n\n' +
    'Über den Dächern stand die Sonne so hoch, dass die Schatten unter dem Sonnensegel klein und hart waren, und dahinter, hinter den letzten Häusern, lag das Meer als graue Linie da, die den ganzen Tag über nicht die Farbe wechselte.\n\n' +
    'Der Schreiber tauchte die Feder ein.\n\n' +
    '„Name."',
  'b1.c01.s01.p01.alt':
    'Ein Anwerbetisch unter einem Sonnensegel am Rand eines staubigen Marktplatzes. Eine Schlange gewöhnlicher Leute wartet, ein Schreiber führt ein Buch, ein Sergeant sitzt daneben.',
  'b1.c01.s01.p01.ins.marine':
    'Der Sergeant sah auf die Schultern und dann auf die Hände, in dieser Reihenfolge, und nickte einmal. Es war die erste wohlwollende Regung, die {name} an diesem Tisch beobachtet hatte.',
  'b1.c01.s01.p01.ins.sapper':
    'Auf die Frage nach dem bisherigen Handwerk sagte {name} „Steinbruch", und der Sergeant hob den Kopf. „Sprengen oder Schleppen?" — „Beides." Der Schreiber machte ein zweites Zeichen neben den Namen.',
  'b1.c01.s01.p01.ins.mage':
    'Bei der Frage nach besonderen Fähigkeiten wurde es kurz still. Der Sergeant sagte nichts, der Schreiber schrieb ein Zeichen an den Rand, und eine Frau in grauem Kittel, die bis dahin nur dagestanden hatte, kam einen Schritt näher und sah {name} an, als prüfe sie eine Naht.',

  'b1.c01.s01.p02.body':
    'Es ging schneller, als es hätte gehen dürfen.\n\n' +
    'Name, Herkunft, Alter. Kein Wort darüber, wohin. Der Schreiber drehte das Buch herum, deutete auf eine Zeile und wartete, und {name} setzte ein Zeichen darunter, während der Sergeant schon nach dem nächsten in der Schlange sah.\n\n' +
    'Dann Silber auf die Hand, ein Zettel mit einer Nummer, und der Satz, den er an diesem Tag vermutlich zum vierzigsten Mal sagte: „Morgen früh am Osttor. Wer nicht da ist, ist Deserteur, und Deserteure sucht man nicht lange, man streicht sie."\n\n' +
    'Das Silber war warm von der Sonne.',
  'b1.c01.s01.p02.alt':
    'Ein Sergeant sieht von einem Buch auf, in das gerade ein Name eingetragen wurde. Auf dem Tisch liegen Silbermünzen und ein Wachssiegel.',

  'b1.c01.s01.p02.i.pay.label': 'Was springt dabei heraus?',
  'b1.c01.s01.p02.i.pay.response':
    '„Fünf Kreszente jetzt, den Rest nach der Ausbildung, Verpflegung und Stiefel dazu." Der Sergeant sagte es, ohne aufzublicken. „Und wenn du fällst, kriegt deine Familie ein halbes Jahr weitergezahlt, vorausgesetzt, sie kann beweisen, dass sie deine Familie ist." Er schob {name} den Stapel hin. „Zähl nach. Alle zählen nach. Ich nehm es keinem übel."',
  'b1.c01.s01.p02.i.where.label': 'Wohin geht es?',
  'b1.c01.s01.p02.i.where.response':
    '„Genabackis." Zum ersten Mal hob der Sergeant den Kopf. „Weit. Andere Seite vom Wasser. Es gibt dort Städte, die noch keiner von uns von innen gesehen hat, und eine davon steht auf einem See, und über einer anderen hängt angeblich ein Berg." Er zuckte mit den Schultern. „Ich glaub das mit dem Berg nicht."',
  'b1.c01.s01.p02.i.girl.label': 'Wer ist das Mädchen, das nicht ansteht?',
  'b1.c01.s01.p02.i.girl.response':
    'Sie stand in der Schlange und stand doch nicht darin. Alle anderen verlagerten das Gewicht, kratzten sich, redeten. Sie tat nichts davon. Sie hatte kein Bündel dabei, nicht einmal einen Beutel, und ihre Kleider waren die einer Fischerstochter und trocken bis zum Saum, obwohl es am Morgen geregnet hatte.\n\n' +
    'Als sie an den Tisch trat, fragte der Schreiber nach dem Namen, und die Antwort kam ohne jede Pause.\n\n' +
    '„Sorry."',

  'b1.c01.s01.p03.body':
    'Am Osttor war für die Nacht ein Lager aus Planen und geliehenen Karren aufgebaut, und niemand kümmerte sich darum, wer wo schlief.\n\n' +
    'Von hier ging es morgen die Küstenstraße hinauf zum Hafen von Kan. Zwei Tage Marsch, hieß es, drei bei Regen.\n\n' +
    'Irgendwo wurde gewürfelt, irgendwo weinte jemand leise und wollte nicht getröstet werden, und beides gehörte zusammen.\n\n' +
    'Es war der letzte Abend, an dem {name} etwas entscheiden konnte, das nur {name} betraf.',
  'b1.c01.s01.p03.alt':
    'Eine junge Frau steht völlig regungslos in einer Schlange, während alle anderen ihr Gewicht verlagern. Sie hat kein Gepäck dabei.',

  'b1.c01.s01.ch.road': 'Früh schlafen. Morgen wird marschiert.',
  'b1.c01.s01.ch.quay': 'Noch einmal in die Schenke am Kai',
  'b1.c01.s01.ch.girl': 'Sich zu dem Mädchen setzen, das nicht schläft',
  'b1.c01.s01.ch.girl.lock':
    'Da war jemand, dem etwas fehlte — aber der Blick ist schon weitergegangen, und der Abend hat es zugedeckt.',

  // ----------------------------------------------------------------- 1.1a
  'b1.c01.s03.title': 'Die Schenke am Kai',
  'b1.c01.s03.summary':
    'Eine Rhivi-Händlerin legt Karten auf ein Fass. Nichts davon ist Wahrsagerei, sagt sie, und legt trotzdem weiter.',

  'b1.c01.s03.p01.body':
    'Die Schenke lag so nah am Wasser, dass die Boote gegen den Steg schlugen, wenn eine Welle unter ihnen durchging, und niemand drinnen hob deswegen den Kopf.\n\n' +
    'Es war die letzte Nacht mit fremdem Bier, und die halbe Aushebung wusste das. Es wurde geredet und nicht zugehört. Ein Mann erklärte lautstark, wie man einen Belagerungsturm baut, und hatte offensichtlich nie einen gesehen.\n\n' +
    'Hinten, an einem Fass statt an einem Tisch, saß eine Frau in einem Mantel aus Bhederin-Fell und legte Karten aus.',
  'b1.c01.s03.p01.alt':
    'Eine niedrige Hafenschenke bei Nacht. Lampenlicht auf nassem Stein, draußen schlagen Fischerboote gegen den Steg.',

  'b1.c01.s03.p02.body':
    'Sie war keine Wahrsagerin, sagte sie sofort und ungefragt, und wer eine suche, solle zwei Straßen weitergehen und sich betrügen lassen.\n\n' +
    'Sie handelte mit Fellen und legte die Karten, weil man in Kan mehr über die Lage erfahre, indem man Leuten beim Zusehen zusehe, als indem man sie frage. Die Karten selbst waren aus dünnem Holz, abgegriffen, und die Figuren darauf hatten harte Kanten und keine Gesichter.\n\n' +
    'Sie legte drei aus, sah sie an, legte eine vierte quer darüber und ließ sie liegen.\n\n' +
    '„Das da", sagte sie und tippte auf die querliegende, „ist keine Person. Das ist eine Münze."',
  'b1.c01.s03.p02.alt':
    'Eine Händlerin aus den Ebenen legt bemalte Karten auf einen Fassdeckel, umringt von einem kleinen, schweigenden Publikum.',

  'b1.c01.s03.p02.i.deck.label': 'Was ist das für ein Spiel?',
  'b1.c01.s03.p02.i.deck.response':
    '„Kein Spiel. Ein Deck." Sie sammelte die Karten ein, ohne sie zu mischen. „Häuser, Rollen, ein paar, die zu keinem Haus gehören. Es sagt dir nicht, was passieren wird — es zeigt dir, wer sich gerade bewegt und worauf alles zuläuft." Sie hielt eine Karte hoch, auf der zwei Figuren Rücken an Rücken standen. „Und wer eine Legung liest, wird von ihr gelesen. Vergiss das nicht, wenn dir mal jemand eine anbietet."',
  'b1.c01.s03.p02.i.rhivi.label': 'Ihr seid nicht von hier.',
  'b1.c01.s03.p02.i.rhivi.response':
    '„Rhivi. Von der Ebene, weit im Osten, hinter dem Wasser." Sie sagte es, wie man eine Wegbeschreibung sagt. „Wir ziehen mit den Bhederin, die Bhederin ziehen mit dem Gras, und das Gras zieht mit dem Regen. Am Ende zieht keiner von uns freiwillig." Sie sah {name} an. „Ihr geht dorthin, wo ich herkomme. Ihr wisst es nur noch nicht."',

  'b1.c01.s03.p03.body':
    'Am Ende kaufte {name} ihr etwas ab, weil sich das so gehörte, wenn man den halben Abend an ihrem Fass gestanden hatte.\n\n' +
    'Es war eine einzelne Karte, kein Fell. Sie kostete fünf Kreszente, also genau das, was am Tisch ausgezahlt worden war, und die Frau nahm das Geld ohne jede Bemerkung.\n\n' +
    'Auf der Karte standen zwei Figuren Rücken an Rücken. Die eine zog, die andere schob.',
  'b1.c01.s03.p03.alt':
    'Eine zweiseitige Münze liegt auf nassem Holz, und beide Seiten scheinen zugleich sichtbar zu sein.',

  // ----------------------------------------------------------------- 1.1b
  'b1.c01.s04.title': 'Das Mädchen, das nicht schläft',
  'b1.c01.s04.summary':
    'Ein Gespräch mit Sorry, das keines ist. Danach ist etwas anders, und es lässt sich nicht sagen, was.',

  'b1.c01.s04.p01.body':
    'Sie saß am Rand des Lagers auf einem umgedrehten Eimer und sah in die Richtung, aus der man morgen abmarschieren würde.\n\n' +
    'Es war kein Feuer in der Nähe. Es war auch nichts zu sehen, wohin sie sah. {name} setzte sich in einem Abstand hin, den man später als höflich hätte verteidigen können, und sagte eine Weile nichts, weil ihr Schweigen ansteckend war.\n\n' +
    'Nach einiger Zeit sagte sie: „Du solltest schlafen."\n\n' +
    'Es klang nicht besorgt. Es klang wie eine Auskunft über den Zustand der Welt.',
  'b1.c01.s04.p01.alt':
    'Ein Rekrut setzt sich neben eine schweigende junge Frau auf eine Bank, eine Handbreit Abstand zwischen ihnen.',

  'b1.c01.s04.p02.body':
    'Sie beantwortete alles, was gefragt wurde, und keine Antwort führte irgendwohin.\n\n' +
    'Woher: aus einem Dorf an der Küste. Warum: es gab keinen Grund mehr zu bleiben. Familie: nicht mehr. Und ob sie Angst habe vor dem, was komme — darauf drehte sie zum ersten Mal den Kopf und sah {name} an, und der Blick war der ruhigste, den {name} je ausgehalten hatte.\n\n' +
    '„Nein", sagte sie.\n\n' +
    'Und dann, nach einer Pause, als sei ihr ein zweiter Teil der Antwort eingefallen, den man aus Höflichkeit dazusagt: „Du solltest welche haben."',
  'b1.c01.s04.p02.alt':
    'Eine junge Frau sieht ohne jeden Ausdruck direkt in die Kamera. Hinter ihr, unscharf, ein belebter Hof.',

  'b1.c01.s04.p03.body':
    'Später, auf der Plane, ging {name} das Gespräch noch einmal durch und fand nichts darin, was falsch gewesen wäre.\n\n' +
    'Nur, dass sie in der ganzen Zeit nicht ein einziges Mal geblinzelt hatte. Und dass sie nicht gefragt hatte, wie {name} hieß, obwohl das die erste Frage ist, die jeder stellt.\n\n' +
    'Am Rand des Lagers saß sie immer noch auf dem Eimer, als der Mond schon hinter den Hügeln stand.\n\n' +
    'Der Schlaf kam spät und war dünn.',
  'b1.c01.s04.p03.alt':
    'Zwei Gestalten gehen in der Dämmerung über einen Exerzierplatz in entgegengesetzte Richtungen davon.',

  // ------------------------------------------------------------------ 1.2
  'b1.c01.s02.title': 'Die Küstenstraße',
  'b1.c01.s02.summary':
    'Zwei Tage Marsch nach Norden. Am zweiten liegt etwas auf der Straße, das niemand erklären kann.',

  'b1.c01.s02.p01.body':
    'Marschieren war nichts, was man erklärt bekam. Man tat es, bis man es konnte, und danach tat man es weiter.\n\n' +
    'Die Küstenstraße lief oberhalb der Klippen entlang, das Meer auf der einen Seite, trockene Hügel auf der anderen, und beide Seiten sahen den ganzen Tag gleich aus. Die Ausrüstung saß bei niemandem richtig. Am ersten Abend gab es mehr Blasen als Abendessen, und der Sergeant, der die Kolonne führte, sagte dazu genau einen Satz: dass Blasen aufhören, wenn man aufhört, sich für sie zu interessieren.\n\n' +
    'Geredet wurde wenig. Wer neu ist und Angst hat, redet viel; wer neu ist und müde ist, redet gar nicht. Am zweiten Tag waren alle müde.\n\n' +
    'Der Karren vorn quietschte in einem Takt, der sich nach zwei Stunden ins Denken hineinlegte. {name} zählte eine Weile mit und hörte damit auf, als das Zählen die Blasen nicht kleiner machte.\n\n' +
    'Gegen Mittag blieb die Kolonne stehen, und niemand hatte einen Befehl dazu gegeben.',
  'b1.c01.s02.p01.alt':
    'Eine Kolonne neuer Rekruten marschiert auf einer Küstenstraße oberhalb von Klippen. Meer auf der einen Seite, trockene Hügel auf der anderen.',

  'b1.c01.s02.p02.body':
    'Auf der Straße vor ihnen lag eine Abteilung Kavallerie.\n\n' +
    'Pferde und Reiter, über eine Weite von zweihundert Schritten verteilt, in keiner Ordnung, die etwas mit einem Gefecht zu tun gehabt hätte. Nichts brannte. Nichts war weggeschleppt worden. Die Sattelgurte waren zu, die Taschen zu, das Geld noch drin.\n\n' +
    'Und es lag kein einziger Feind dabei.\n\n' +
    'Das war es, was die Kolonne stehen ließ, noch bevor jemand den Geruch bemerkte. Bei einem Gefecht liegen beide Seiten. Hier lag eine.',
  'b1.c01.s02.p02.alt':
    'Die Folgen einer vernichteten Kavallerie-Abteilung auf offener Straße. Pferde und Reiter verstreut, kein einziger gefallener Feind.',

  'b1.c01.s02.p03.body':
    'Der Boden war in weiten Bögen aufgerissen, so wie Erde aufreißt, wenn etwas Schweres schnell die Richtung wechselt.\n\n' +
    'Am Straßenrand, halb im Staub, stand ein Abdruck. Eine Pfote, vier Zehen, und der Abstand vom vordersten Ballen zum hintersten war länger als ein Unterarm. Jemand legte einen Helm daneben, damit man es glauben konnte, und danach wollte es niemand mehr glauben.\n\n' +
    'Es gab mehrere davon. Sie kamen von der Straße und gingen zur Straße zurück, und dazwischen lag alles, was von der Abteilung übrig war.\n\n' +
    'Kein Hund wird so groß. Das sagte jemand laut, und niemand widersprach, und das war schlimmer, als wenn jemand widersprochen hätte.\n\n' +
    'Ein Korporal, der zwölf Jahre gedient hatte, ging in die Hocke, legte die eigene Hand flach in einen der Abdrücke und ließ sie dort liegen, bis ihn jemand ansprach. Danach sagte er den ganzen Tag nichts mehr.',
  'b1.c01.s02.p03.alt':
    'Ein einzelner riesiger Pfotenabdruck in trockener Erde am Straßenrand, daneben ein Helm als Größenvergleich.',

  'b1.c01.s02.p04.body':
    'Die Offiziere standen abseits und sprachen zu leise, um verstanden zu werden.\n\n' +
    'Dann kam der Befehl, in Formation zu bleiben und zu warten. Aus der Richtung des Hafens kamen Reiter, und einer davon trug Schwarz und ritt vorn.\n\n' +
    'Ein Korporal ging die Reihen ab und sagte jedem einzeln, er solle sich hinsetzen, und niemand setzte sich hin.\n\n' +
    'Bis die Reiter da waren, blieb Zeit. Nicht viel. Aber genug, um etwas zu tun, was hinterher niemandem auffallen würde.',
  'b1.c01.s02.p04.alt':
    'Offiziere stehen abseits einer angehaltenen Kolonne und sprechen zu leise, um verstanden zu werden.',

  'b1.c01.s02.ch.search': 'Nachsehen, ob noch jemand lebt',
  'b1.c01.s02.ch.hold': 'In der Formation bleiben und warten',
  'b1.c01.s02.ch.tracks': 'Der Spur folgen, die von der Straße wegführt',
  'b1.c01.s02.ch.tracks.confirm':
    'Die Spur geht landeinwärts, ins Dünengras, weg von zweihundert Leuten mit Waffen. Was sie gemacht hat, hat eine Abteilung Kavallerie gemacht, ohne einen Kratzer davonzutragen. Trotzdem gehen?',

  // ----------------------------------------------------------------- 1.2a
  'b1.c01.s06.title': 'Was der Sand zurückgibt',
  'b1.c01.s06.summary':
    'Suchen kostet nichts als Zeit. Gefunden wird trotzdem etwas, und es hilft niemandem.',

  'b1.c01.s06.p01.body':
    'Zu dritt gingen sie die Reihe ab, weil zu dritt niemand Fragen stellt.\n\n' +
    'Es war nicht so, wie man es sich vorgestellt hätte. Man hebt einen Umhang an, sieht hin, legt ihn zurück, geht weiter. Nach dem vierten wird es eine Tätigkeit. Nach dem zehnten ertappt man sich dabei, ordentlich zu arbeiten, und schämt sich dafür, und arbeitet weiter ordentlich, weil es keine bessere Art gibt.\n\n' +
    'Die meisten waren an einem einzigen Biss gestorben. Kein Kampf, kein zweiter Versuch. Etwas war sehr schnell gewesen und hatte keine Zeit verschwendet.',
  'b1.c01.s06.p01.alt':
    'Rekruten gehen durch ein Feld gefallener Kavalleristen, heben Umhänge an, sehen nach, gehen weiter.',

  'b1.c01.s06.p02.body':
    'Das Pferd lebte noch.\n\n' +
    'Es lag auf der Seite, atmete flach und schnell und hatte aufgehört, es zu versuchen. Einer der drei kniete sich an den Kopf und legte eine Hand darauf, mehr, um selbst etwas zu tun zu haben, und sagte, es müsse jemand.\n\n' +
    'Niemand hatte je erklärt, wie man das macht. Es steht auch in keiner Ausbildung, weil es angeblich zu offensichtlich ist.\n\n' +
    'Es wurde gemacht. Es dauerte länger, als es sollte, und alle drei hatten hinterher denselben Ausdruck.',
  'b1.c01.s06.p02.alt':
    'Ein verwundetes Pferd liegt auf der Seite im Staub, ein Soldat kniet an seinem Kopf.',

  'b1.c01.s06.p03.body':
    'Der junge Reiter am Ende der Reihe lebte auch noch, und für ihn gab es nichts.\n\n' +
    'Er wollte nichts gesagt bekommen und nichts erklärt haben. Er wollte, dass jemand dabei blieb.\n\n' +
    '{name} blieb dabei. Es dauerte eine gute halbe Stunde. Er redete über ein Pferd, das er als Kind gehabt hatte, und dann über gar nichts mehr.\n\n' +
    'Am Ende war er tot und die Welt genauso wie vorher.',
  'b1.c01.s06.p03.alt':
    'Jemand sitzt im Staub neben einem Körper, tut nichts, wartet.',

  // ----------------------------------------------------------------- 1.2b
  'b1.c01.s08.title': 'Die Spur im Dünengras',
  'b1.c01.s08.summary':
    'Landeinwärts wird das Licht falsch. Was dort steht, hat es nicht eilig.',

  'b1.c01.s08.p01.body':
    'Die Spur war breit genug, dass man ihr wie einem Weg folgen konnte.\n\n' +
    'Sie ging von der Straße weg, landeinwärts, durch Dünengras, das flach lag und flach blieb — es hatte sich nicht wieder aufgerichtet, obwohl das Gras ringsum im Wind stand. Nach dreißig Schritten hörte man die Kolonne nicht mehr. Nach fünfzig hörte man auch das Meer nicht mehr, und das ging eigentlich nicht.\n\n' +
    'Umkehren wäre an jeder Stelle möglich gewesen. Genau das machte jeden weiteren Schritt zu einer eigenen Entscheidung.',
  'b1.c01.s08.p01.alt':
    'Eine breite Spur aus niedergedrücktem Dünengras führt landeinwärts von einer Straße weg, zu breit für ein Tier.',

  'b1.c01.s08.p02.body':
    'In der Senke zwischen zwei Dünen kam das Licht aus der falschen Richtung.\n\n' +
    'Nicht viel. Nur so weit, dass die Schatten nach innen zeigten statt nach außen, und dass der eigene Schatten kürzer war als der des Grases daneben. Die Luft stand. Das Gras bewegte sich trotzdem.\n\n' +
    'Es roch nach nichts. Nicht nach Salz, nicht nach Staub, nicht nach dem, was auf der Straße lag. Nach nichts.\n\n' +
    'Das war der Punkt, an dem alle Vernunft dafür sprach, stehen zu bleiben, und an dem {name} weiterging, weil Stehenbleiben sich anfühlte wie Aufgeben.',
  'b1.c01.s08.p02.alt':
    'Eine Senke zwischen Dünen, in der das Licht aus der falschen Richtung kommt. Schatten zeigen nach innen, die Luft steht still.',

  'b1.c01.s08.p03.body':
    'Auf dem Kamm standen zwei.\n\n' +
    'Der eine stützte sich auf einen Stock und stand krumm, als sei ihm etwas dauerhaft unangenehm. Der andere stand einfach. Beide waren nicht ganz da — man sah sie, und im selben Moment war man sich nicht sicher, ob man sie gesehen hatte.\n\n' +
    'Sie unterhielten sich, und zwar nicht über das, was auf der Straße lag, sondern über etwas ganz anderes, so wie zwei Handwerker auf dem Heimweg über den Auftrag von übermorgen reden.',
  'b1.c01.s08.p03.alt':
    'Zwei undeutliche Gestalten stehen auf einem Dünenkamm vor einem Himmel in der falschen Farbe.',

  'b1.c01.s08.p04.body':
    'Der Krumme sagte, es sei unordentlich gewesen, und das ärgere ihn mehr als der Aufwand.\n\n' +
    'Der andere sagte, unordentlich sei der Sinn der Sache; wenn es sauber aussähe, würde jemand nachrechnen. Der Krumme fand das eine billige Ausrede und sagte es auch. Dann stritten sie kurz darüber, ob man das Ganze hätte kleiner machen können, und einigten sich darauf, dass man es hätte, es aber nicht getan habe.\n\n' +
    'Keiner der beiden sah zu {name} hin.\n\n' +
    'Sie einigten sich, dass es beim nächsten Mal weiter im Landesinneren stattfinden solle, wo weniger Leute nachrechnen. Der Krumme sagte, das habe er von Anfang an vorgeschlagen. Der andere sagte, das habe er nicht.\n\n' +
    'Dann sagte der Krumme, ohne die Richtung zu wechseln oder die Stimme zu heben: „Da steht eins."\n\n' +
    'Und der andere, milde, fast bedauernd: „Ja."\n\n' +
    'Es klang nicht nach Bedrohung. Es klang nach einer Kleinigkeit, die man noch erledigt, bevor man geht.',
  'b1.c01.s08.p04.alt':
    'Ein riesiger Hund von unten gesehen, nur Schulter und Kiefer im Bild, alles andere außerhalb des Ausschnitts.',

  'b1.c01.s08.p05.body':
    'Das Geräusch kam von hinten und war kein Schritt, sondern ein Gewicht.\n\n' +
    'Zeit für Angst war nicht mehr, und das ist die einzige Freundlichkeit an dieser Art zu sterben.\n\n' +
    'Auf dem Kamm redeten die beiden weiter. Der eine sagte, so gehe das immer, wenn man die Sache Leuten überlasse, die nicht aufräumen könnten. Der andere widersprach nicht, weil ihm das Thema inzwischen zu langweilig geworden war.\n\n' +
    'Auf der Straße wartete eine Kolonne, in der ab dem Abend ein Name durchgestrichen sein würde.',
  'b1.c01.s08.p05.alt':
    'Leeres Dünengras schließt sich über einer Stelle, an der eben noch etwas stand.',

  'b1.c01.s08.gameover':
    'Kruppe legt diese Karte rasch wieder um und behauptet, sie sei versehentlich hineingeraten. Behalten darfst du trotzdem, was du gesehen hast: es waren zwei, sie streiten viel, und einer von ihnen geht am Stock.',

  // ------------------------------------------------------------------ 1.3
  'b1.c01.s07.title': 'Die Adjunktin',
  'b1.c01.s07.summary':
    'Lorn geht die Reihe der Toten ab und zählt. Der junge Leutnant neben ihr zählt etwas anderes.',

  'b1.c01.s07.p01.body':
    'Adjunktin Lorn ging die Reihe zweimal ab, einmal in jede Richtung, und blieb kein einziges Mal aus Erschütterung stehen.\n\n' +
    'Sie zählte. Nicht die Toten — die Zahl stand in einem Bericht, den sie am Morgen gelesen hatte. Sie zählte die Abstände: wie weit ein Pferd geschleudert worden war, wie viele Schritte zwischen zwei Bögen im Boden lagen, wie viele Tiere sich in dieselbe Richtung gedreht hatten, bevor es sie erwischte. Aus diesen Zahlen ließ sich ableiten, wie viele es gewesen waren und wie schnell.\n\n' +
    'Es waren mehrere gewesen. Sie waren sehr schnell gewesen. Und sie hatten in einem einzigen Durchgang aufgehört, was sehr wenige Dinge tun, wenn sie einmal angefangen haben.\n\n' +
    'Neben ihr ging ein Leutnant der Achten Kavallerie, der seit einer Stunde versuchte, nicht auf die Gesichter zu sehen, und dabei genau das tat.',
  'b1.c01.s07.p01b.body':
    'Lorn hielt ihn nicht davon ab. Es war ihr aufgefallen, und sie hatte beschlossen, es sich zu merken statt es zu unterbinden.\n\n' +
    'Es gab eine Art, so etwas anzusehen, die sie sich vor Jahren beigebracht hatte, und sie funktionierte zuverlässig: Man nimmt das Ganze auseinander, bis es nur noch aus Einzelheiten besteht, und Einzelheiten kann man betrachten. Ein Riemen. Ein Winkel. Ein Abstand. Solange man bei den Einzelheiten bleibt, bleibt man auch bei sich.\n\n' +
    'Wo sie das gelernt hatte, stand in keinem Bericht, und sie hätte es auch niemandem erzählt, der danach fragte. Es hatte in einer Stadt angefangen, deren ärmstes Viertel eine Nacht lang gebrannt hatte, und sie war damals eine von denen gewesen, die die Liste abarbeiteten.',
  'b1.c01.s07.p01.alt':
    'Eine gefasste Frau in schwarzem Reichsleder geht ein Schlachtfeld ab und nimmt auf, statt zu trauern.',

  'b1.c01.s07.p02.body':
    '„Was fällt Euch auf, Leutnant?"\n\n' +
    'Er brauchte zu lange, und sie ließ ihn ausreden, als er endlich anfing. Er sagte: dass nichts genommen worden sei. Kein Geld, keine Waffen, keine Pferde.\n\n' +
    '„Weiter."\n\n' +
    'Er sagte: dass es dann kein Überfall gewesen sei.\n\n' +
    '„Weiter."\n\n' +
    'Da hörte er auf, weil das Nächste eine Frage gewesen wäre, und Fragen stellt man einer Adjunktin nicht ungefragt.\n\n' +
    'Lorn wartete gerade so lange, dass er es merkte.',
  'b1.c01.s07.p02.alt':
    'Eine Frau in schwarzem Leder und ein junger Offizier stehen über derselben Leiche und sehen auf verschiedene Dinge.',

  'b1.c01.s07.p02.i.otataral.label': 'Warum spürt hier niemand Zauberei?',
  'b1.c01.s07.p02.i.otataral.response':
    'Lorn zog die Klinge eine Handbreit aus der Scheide und schob sie wieder zurück. Das Metall war stumpf rot, wie Rost, der nie zu Rost geworden ist.\n\n' +
    '„Otataral", sagte sie. „Erz aus Sieben Städte. In seiner Nähe stirbt Zauberei, und zwar meine genauso wie die eines Feindes." Sie sah ihn an. „Man kann es nicht abnehmen und nachher wieder anlegen, Leutnant. Wer es trägt, trägt es."',
  'b1.c01.s07.p02.i.paran.label': 'Wen habe ich da eigentlich vor mir?',
  'b1.c01.s07.p02.i.paran.response':
    'Ganoes Stabro Paran, Leutnant der Achten, Sohn eines Gutsbesitzers aus Unta, Absolvent der Offiziersausbildung. Er hätte auf einem Gut sitzen können und hatte sich ausdrücklich dagegen entschieden, was in seiner Akte stand und dort wie ein Fehler aussah.\n\n' +
    'Lorn hatte im Reich viele Adelssöhne in Uniform gesehen. Die meisten wollten eine Geschichte. Dieser hier sah aus, als wolle er wissen, was passiert war, und das ist eine erheblich unbequemere Eigenschaft.',

  'b1.c01.s07.p03.body':
    '„Es war eine Verdeckung", sagte sie schließlich.\n\n' +
    'Er sagte nichts, und sie rechnete ihm das an.\n\n' +
    '„Jemand wollte etwas erledigen, das man nicht sehen sollte, und hat dafür zweihundert Meter Straße unbrauchbar gemacht. Wer so viel Aufwand betreibt, um eine Sache zu verstecken, sagt uns damit, wie groß die Sache ist." Sie sah aufs Wasser hinaus. „Und wir werden nie erfahren, was es war. Damit müsst Ihr sich abfinden. Ich habe es getan."\n\n' +
    'Das Wort, das er nicht sagte, hing trotzdem zwischen ihnen: *Warum dann?*\n\n' +
    '„Weil es beim nächsten Mal wieder passiert", sagte Lorn, „und weil ich dann wissen will, wie es aussieht."\n\n' +
    'Sie ging weiter, und nach vier Schritten sagte sie, ohne sich umzudrehen, er solle sich den Abstand zwischen den Bögen im Boden merken, nicht die Gesichter. Die Gesichter stünden ohnehin in keinem Bericht.',
  'b1.c01.s07.p03.alt':
    'Eine rostrote Klinge ist eine Handbreit aus der Scheide gezogen; die Luft um sie herum wirkt sichtbar matter.',

  'b1.c01.s07.p04.body':
    'Am Abend ließ sie die Straße räumen und die Toten verbrennen, ohne die Angehörigen abzuwarten, weil Warten nichts geändert hätte und Gerüchte schneller sind als Karren.\n\n' +
    'Dann stand sie eine Weile allein auf der Klippenstraße, mit dem Rücken zum Meer, und dachte an eine Liste, die sie einmal ordentlich abgearbeitet hatte.\n\n' +
    'Sie war sehr gut darin, an so etwas zu denken, ohne dass es ihr etwas ausmachte. Das war der Teil, der ihr manchmal auffiel.',
  'b1.c01.s07.p04.alt':
    'Eine Frau steht bei Dämmerung allein auf einer Klippenstraße, mit dem Rücken zum Meer.',

  // ------------------------------------------------------------------ 1.4
  'b1.c01.s09.title': 'Einschiffung',
  'b1.c01.s09.summary':
    'Der Hafen von Kan bei Tagesanbruch. Was zurückbleibt, bleibt vollständig zurück.',

  'b1.c01.s09.p01.body':
    'Der Kai war voller als der Markt in Kan an einem Festtag, und niemand feierte.\n\n' +
    'Vier Transporter lagen an den Steinpieren, dazu ein Getreidesegler, den man kurzfristig verpflichtet hatte und dem man es ansah. Quartiermeister brüllten Nummern über die Köpfe hinweg. Ein Kran hob Fässer, die niemand gezählt hatte, in einen Laderaum, den niemand gemessen hatte. Möwen nahmen alles mit, was fiel.\n\n' +
    'Die Aushebung saß in Reihen auf dem Stein, das Gepäck zwischen den Knien, und wartete seit vier Stunden. Es gab nichts zu tun. Es gab auch nichts mehr zu entscheiden, und das war die eigentliche Neuigkeit dieses Morgens.\n\n' +
    '{name} saß mit dem Rücken an einem Poller und sah zu, wie eine Stadt, die man sein Leben lang gekannt hatte, ohne einen von hinten weitermachte: Fischer luden aus, ein Kind wurde geschimpft, jemand strich eine Tür.',
  'b1.c01.s09.p01b.body':
    'Ein Kaplan ging die Reihen ab und segnete, wen er erwischte, und wurde dabei von den meisten geduldet wie schlechtes Wetter. Ein Junge, kaum sechzehn, fragte laut, ob man von der Reling aus noch winken könne, und bekam keine Antwort, weil niemand es wusste.\n\n' +
    'Draußen vor der Hafenmauer lag eine lange graue Dünung, an der man ablesen konnte, wie das Wasser dahinter aussehen würde.\n\n' +
    'Dann kam die Nummer auf dem Zettel an die Reihe, und danach ging alles sehr schnell: aufstehen, aufnehmen, gehen, über eine Planke, die federte, in einen Schatten, der nach Teer roch.',
  'b1.c01.s09.p01.alt':
    'Ein voller Kaianlage bei Tagesanbruch. Transportschiffe werden beladen, Reihen von Rekruten warten mit ihrem Gepäck auf dem Stein.',
  'b1.c01.s09.p01.ins.mercy':
    'Zwei Reihen weiter saß einer von den dreien, mit denen {name} die Reihe abgegangen war. Er nickte einmal herüber. Sie hatten seither kein Wort gewechselt und würden auch keines brauchen.',
  'b1.c01.s09.p01.ins.sorry':
    'Sorry saß am Rand des Piers, wo die Reihen aufhörten, und sah aufs Wasser. Sie hatte kein Gepäck zwischen den Knien, weil sie keines besaß, und niemand hatte sie deswegen angesprochen.',
  'b1.c01.s09.p01.ins.coin':
    'Die Karte aus der Schenke steckte flach im Stiefelschaft und drückte bei jedem Schritt an derselben Stelle. Herausnehmen und wegwerfen wäre einfach gewesen. Es geschah nicht.',
  'b1.c01.s09.p01.ins.hound':
    'Von der Küstenstraße wurde nicht mehr geredet. Der Befehl dazu war nie ausgesprochen worden; es hatte einfach aufgehört, und alle machten mit.',

  'b1.c01.s09.p02.body':
    'Unter Deck war es niedriger, als man einen Raum bauen sollte, in dem Menschen wochenlang leben.\n\n' +
    'Die Hängematten hingen so dicht, dass man den Nachbarn im Schlaf anstieß, und über den Köpfen lief der Kiel eines Ganges, an dem sich alle die Stirn stießen, bis sie es gelernt hatten. Es roch nach Teer, Salz und zweihundert Leuten.\n\n' +
    'Jemand nannte es schon am ersten Tag „die Kiste", und es hieß danach nie wieder anders.',
  'b1.c01.s09.p02.alt':
    'Ein enges Truppendeck unter der Wasserlinie, Hängematten zu dicht nebeneinander gespannt.',

  'b1.c01.s09.p03.body':
    'An der Reling wurde nicht viel geredet, während die Küste kleiner wurde.\n\n' +
    'Zuerst waren es Häuser, dann eine Linie, dann eine andere Farbe am Rand des Wassers, dann nichts. Es ging schneller, als alle erwartet hatten, und genau das war es, was einigen die Fassung nahm — nicht der Abschied, sondern die Geschwindigkeit.\n\n' +
    'Ein älterer Mann neben {name} sagte, er sei zweimal in seinem Leben aus Kan weggegangen und beide Male zurückgekommen. Dann rechnete er kurz nach und sagte nichts mehr.',
  'b1.c01.s09.p03.alt':
    'Rekruten an einer Schiffsreling sehen zu, wie eine Küste zu einer Linie und dann zu nichts wird.',

  'b1.c01.s09.p04.body':
    'Das Truppzeichen war ein abgegriffenes Stück Metall mit einer Nummer und sonst nichts.\n\n' +
    'Es beweist nichts. Es sagt nur, dass jemand deinen Namen in ein Buch geschrieben hat, und dass es dieses Buch gibt.\n\n' +
    'An der Reling wurde es fest in die Hand genommen, weil es das Einzige an Bord war, das einem gehörte.\n\n' +
    'Später, viel später, wird es Leute geben, die ihres wegwerfen, und Leute, die es aufheben, und beide werden gute Gründe haben.',
  'b1.c01.s09.p04.alt':
    'Eine Hand schließt sich an einer Schiffsreling um ein abgegriffenes Metallzeichen.',

  'b1.c01.s09.p05.body':
    'In der zweiten Nacht war in keiner Richtung mehr Land.\n\n' +
    'Eine Lampe schwang an einem Haken über dem Achterdeck und warf einen Lichtkreis, der ging und kam, ging und kam. Wer nicht schlafen konnte, kam hoch, stellte sich an die Reling und sagte nichts, und irgendwann standen dort acht oder neun Leute schweigend nebeneinander, und keiner ging als Erster wieder hinunter.\n\n' +
    'Genabackis lag irgendwo vor dem Bug, ungefähr sechs Wochen weit.\n\n' +
    'Was dort auf sie wartete, hatte zu diesem Zeitpunkt bereits angefangen, ohne sie: eine Stadt namens Pale, ein Berg, der am Himmel hing, und eine Einheit, die nach dieser Sache nur noch aus vierzig Leuten bestehen würde.\n\n' +
    'Davon wusste an diesem Abend niemand an dieser Reling etwas, und das war vermutlich der letzte Vorteil, den sie hatten.',
  'b1.c01.s09.p05.alt':
    'Offenes Meer bei Nacht vom Deck eines Transporters. In keiner Richtung Land, eine Lampe schwingt.',
}
