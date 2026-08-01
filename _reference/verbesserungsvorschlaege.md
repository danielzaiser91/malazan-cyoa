# Verbesserungsvorschläge

Stand **01.08.2026**, nach der ersten Testrunde. Zwei Quellen: ein Durchgang durch den eigenen
Code, und ein Vergleich mit Spielen, die dasselbe versuchen und dabei erfolgreich sind.

Sortiert nach Wirkung, nicht nach Aufwand. Die ersten drei Punkte sind die, bei denen das Spiel
gegen den Vergleich am deutlichsten verliert.

---

## Der Ist-Zustand in Zahlen

| | |
|---|---|
| Szenen · Seiten | 16 · 63 |
| Wörter | 6 397 (DE) · 6 763 (EN) |
| **Wahlpunkte** | **4** |
| Optionen insgesamt | 11 |
| **Seiten je Entscheidung** | **15,8** |
| Sackgassen · Enden | 2 · 1 (das vorläufige) |
| Abdeckung im Simulator | 68,3 % bei 200 Läufen |
| Abstürze | 0 |

Die fett gesetzte Zeile ist der Befund. Alles andere ist in Ordnung.

---

## 1 · Zu wenige Entscheidungen — mit Abstand das Wichtigste

**Alle 15,8 Seiten eine Wahl.** Das ist die Taktung eines Romans mit gelegentlicher Abzweigung,
nicht die eines Choose-your-own-Adventure. Wer zwölf Bildschirme liest, ohne etwas zu entscheiden,
liest — er spielt nicht.

Zum Vergleich: In *80 Days* bieten **die meisten Knoten** mehrere Optionen, und es gibt kaum
Pflicht-Engstellen. Die Analyse dazu bringt es auf den Punkt: Der Rhythmus entsteht daraus, dass
Zweige sich wieder treffen — nicht daraus, dass es lange keine gibt.

**Vorschlag, in dieser Reihenfolge:**

1. **Zielwert: eine Wahl alle 3 bis 5 Seiten.** Bei 63 Seiten wären das 13 bis 20 Wahlpunkte statt
   4. Das ist kein Umbau der Geschichte, sondern das Auffüllen der Strecken dazwischen.
2. **Kleine Wahlen zählen auch.** Nicht jede Entscheidung muss den Graphen verzweigen. Eine Wahl,
   die nur einen Wert, ein Merkmal oder eine Beziehung ändert und auf derselben Szene bleibt, ist
   billig zu schreiben und wirkt trotzdem — die Struktur dafür (`Interaction`) existiert bereits
   und wird bisher **fünf Mal im ganzen Buch** benutzt.
3. **Die Verzweigung am Szenenende bleibt die teure Form.** Sie ist richtig für die Momente, die
   den Weg ändern. Dazwischen tragen die kleinen Wahlen.

## 2 · Entscheidungen ohne spürbare Folgen

Von 11 Optionen tragen die meisten dieselbe Art von Konsequenz: es geht anders weiter. Was fehlt,
ist die **Rückmeldung, dass etwas passiert ist** — und der Unterschied zwischen gut, schlecht und
teuer erkauft.

Aus dem Vergleich, und das ist die schärfste Beobachtung überhaupt: *„Die Aufgabe des Autors ist
es, den Spieler zu schlechten Entscheidungen zu verführen, weil eine schlechte strategische
Entscheidung zur interessanteren Geschichte führt. Es sind die Beinahe-Katastrophen, an die sich
Spieler erinnern."* (Meg Jayanth, 80 Days)

**Vorschlag:**

1. **Jede Wahl trägt eine sichtbare Signatur:** was sie kostet, was sie einbringt, was sie
   verschließt. Die Datenstruktur hat `costs` und `risk` — genutzt wird beides selten.
2. **Folgen sofort zeigen.** Ein Wert, der sich ändert, gehört als kurze Einblendung an die Stelle,
   an der er sich ändert. Die Ereignis-Schicht (`EffectEvent`) liefert das bereits, die Ansicht
   nutzt es nur für Klang.
3. **Mindestens ein Pfad je Szene, der etwas kostet und trotzdem gut ist.** Ohne diese Kategorie
   gibt es keine interessanten Fehler, sondern nur richtige und falsche Knöpfe.

## 3 · Werte, Talente und Gegenstände sind Dekoration

Sechs Werte, ein Talentbaum, ein Gegenstandssystem — und im gesamten Vertical Slice entscheidet
das über **eine einzige Probe**. Ein Spieler, der sich für Sappeur statt Marine entscheidet, merkt
davon bis zum vorläufigen Ende nichts außer anderen Zahlen im Blatt.

**Vorschlag:**

1. **Jede Szene bietet mindestens eine Option, die an einem Wert hängt** — sichtbar gesperrt oder
   sichtbar leichter. Der Sperrhinweis existiert bereits als Pflichtfeld; er wird nur kaum genutzt.
2. **Herkunft muss sich lesen lassen, nicht nur rechnen.** Ein Sappeur sieht an einer Mauer etwas
   anderes als ein Kadermagier. Ein Einschub (`Insert`) pro Herkunft und Szene reicht — die
   Struktur ist da und wird bisher an vier Stellen benutzt.
3. **Gegenstände mit genau einer Verwendung sind besser als Gegenstände mit keiner.** Lieber drei
   Dinge, die je einmal eine Tür öffnen, als zwölf, die im Inventar liegen.

## 4 · Es fehlt die Karte als Werkzeug, nicht als Rückschau

Die Auslegung (jetzt „Karte") zeigt, wo man **war**. In *80 Days* zeigt die Karte, wohin man
**kann** — und genau das nimmt die Angst vor der Entscheidung, ohne sie vorhersagbar zu machen:
Man sieht die Verbindungen, aber Kosten und Dauer erst bei der Ankunft.

**Vorschlag:** Die Karte zeigt neben den erreichten Szenen auch die **unmittelbar erreichbaren** —
als verdeckte Knoten ohne Titel, aber mit Richtung. Das verletzt die Spoiler-Regel nicht (kein
Titel, keine Zusammenfassung, kein Bild) und macht aus einer Chronik ein Navigationsmittel.

## 5 · Wiederspielen wird nicht belohnt

Es gibt keinen Grund, einen zweiten Durchgang zu beginnen. Die Abdeckung liegt bei 68 % — ein
Drittel des geschriebenen Textes sieht ein Spieler nie, und nichts weist ihn darauf hin.

**Vorschlag:**

1. **Sichtbare Abdeckung:** „Du hast 41 von 63 Seiten gesehen." Das ist bereits gemessen
   (`meta.pagesRead`) und wird nirgends angezeigt.
2. **Was du verpasst hast, ohne zu verraten was es war.** *80 Days* macht den Verlust
   greifbar — „diesmal sehe ich Port-au-Prince nicht" — und genau das treibt den nächsten Lauf.
3. **Der Sprung ist bereits das bessere Wiederspielen.** Er wird nur nirgends angeboten, wenn eine
   Szene endet. Ein Hinweis nach einer Sackgasse („zurück zur letzten Gabelung") kostet nichts.

---

## Schwächen im Code

Gefunden beim Durchgang, ohne Bezug zum Vergleich.

### Substanziell

- **Die Anrede bewirkt nichts.** Sie wird abgefragt, gespeichert und nie gelesen — der
  Spielcharakter wird bewusst nie mit einem Pronomen bezeichnet. Eine Option, die etwas verspricht
  und nichts einlöst, ist schlechter als keine. Entweder wirksam machen (NPCs sprechen den Spieler
  an) oder streichen.
- **Kein Test deckt die Ansichten ab.** 122 Tests, alle auf Core und Content. Die gesamte
  Darstellungsschicht — Kopfzeile, Dialoge, Reiter, Fokusfallen — ist ungetestet, und die
  Regressionen der letzten Runde lagen genau dort. Ein leichtgewichtiger DOM-Test (jsdom) für die
  drei Dialoge wäre die günstigste Absicherung im ganzen Projekt.
- **Die Wortband-Prüfung kennt die Auswahl nicht.** Die Höhenrechnung sagt: Eine Seite am
  Szenenende mit drei Optionen hat 40 Wörter weniger Platz. Der Test prüft aber nur das Band, egal
  ob danach ein „Weiter" oder drei Optionen mit Risiko-Zeile kommen.

### Kleiner

- **`buildSheet` und `buildCodex` bauen ihr DOM bei jedem Öffnen neu**, inklusive aller Karten und
  Einträge. Bei 60+ Codex-Einträgen wird das spürbar. Nur den sichtbaren Reiter bauen.
- **Der Klangteppich hängt an der Stimmung, nicht an der Szene.** Zwei aufeinanderfolgende Seiten
  mit derselben Stimmung setzen ihn zweimal neu.
- **`markCodex` läuft in einer Schleife mit Guard-Zähler 400** über jeden Absatz. Bei einem
  Codex mit 60 Einträgen ist das je Seite ein Vielfaches an `indexOf`-Aufrufen. Ein vorbereiteter
  Suchindex wäre einmal Arbeit statt bei jedem Rendern.
- **Die Begriffssuche findet keine Beugung.** `indexOf('Adjunktin')` findet „der Adjunktin", aber
  `indexOf('Gewirr')` findet „Gewirre" nicht. Ein optionales `aliases`-Feld je Codex-Eintrag löst
  das ohne Sprachlogik.

---

## Priorität

| # | Was | Wirkung | Aufwand |
|---|---|---|---|
| 1 | Wahldichte auf 3–5 Seiten bringen | sehr hoch | hoch |
| 2 | Folgen sichtbar machen (Werte, Kosten, Risiko) | sehr hoch | mittel |
| 3 | Werte und Herkunft im Text wirksam | hoch | mittel |
| 4 | DOM-Tests für die drei Dialoge | hoch | klein |
| 5 | Anrede: wirksam machen oder streichen | mittel | klein |
| 6 | Abdeckung anzeigen, Wiederspielen anbieten | mittel | klein |
| 7 | Karte zeigt erreichbare Nachbarn | mittel | mittel |
| 8 | Codex-Suchindex und Aliase | klein | klein |

---

## Quellen des Vergleichs

- [80 Days: The Map Is The Territory](https://heterogenoustasks.wordpress.com/2014/08/24/80-days-the-map-is-the-territory/) — Karte als Werkzeug, Wahldichte, Wiederspielanreiz
- [Narrative and design insights from 80 Days' writing lead](https://www.gamedeveloper.com/design/narrative-and-design-insights-from-i-80-days-i-writing-lead) — der Autor verführt zu schlechten Entscheidungen
- [Ink: The Narrative Scripting Language](https://www.gamedeveloper.com/design/open-sourcing-80-days-narrative-scripting-language-ink) — autorenfreundliche Werkzeuge als Voraussetzung für Wahldichte
- [Emily Short zu IF-Oberflächen](https://emshort.blog/category/user-interface/) — Regeln sichtbar machen statt stillschweigend ablehnen
