# Status — Malazan CYOA

Laufender Arbeitsstand. Wird bei **jeder** Statusänderung aktualisiert.

> **Scope: nur Band 1** (*Gardens of the Moon*). Bände 2–10 sind nicht Teil des Projekts —
> darüber entscheidet der User erst, wenn Band 1 fertig und gespielt ist.

## Task Queue

**Verbindliche Regeln:**
- Der Bereich heißt **„Task Queue"** — alles hier drin wird abgearbeitet, nicht diskutiert.
- **Jeder neue Wunsch landet SOFORT beim Nennen hier**, auch mitten in einem Turn.
- **Erledigtes wandert SOFORT ins Archiv** unten.
- **Sortierung immer:** 1. In Arbeit · 2. Queue · 3. Zu besprechen · 4. Warten auf User-Feedback.
- Story Points (SP) je Task: 1 = < 1 h · 2 = halber Tag · 3 = Tag · 5 = mehrere Tage · 8 = Woche+.

### 1 · In Arbeit

| # | Task | SP | Stand |
|---|---|---|---|
| U8 | **Wahldichte: 4 Wahlpunkte auf 63 Seiten sind zu wenig.** Ziel laut `verbesserungsvorschlaege.md` § 1: eine Wahl alle 3–5 Seiten, also 13–20 statt 4. Kleine Wahlen innerhalb einer Szene (`Interaction`, bisher 5× im ganzen Buch) tragen die Strecke, die Verzweigung am Szenenende bleibt für die Wegänderungen. Dazu: sichtbare Kosten, Risiko und Folgen — und je Szene ein Pfad, der etwas kostet und trotzdem gut ist. | 8 | Offen |
| U9 | **Werte und Herkunft wirksam machen.** Im ganzen Slice entscheiden sie über EINE Probe. Ziel: je Szene eine wertabhängige Option (sichtbar gesperrt oder leichter) und ein Einschub je Herkunft. Beide Strukturen existieren und werden kaum genutzt. | 5 | Offen |
| U13 | **DOM-Tests für die drei Dialoge.** Alle 122 Tests liegen auf Core und Content; die Darstellungsschicht ist ungetestet — und genau dort lagen die Regressionen dieser Runde. Günstigste Absicherung im Projekt. | 2 | Offen |
| T6b | **Rest aus `_reference/ux-befunde.md`:** M12 Bild und Text teilen sich die Höhe, M13 Zustandszeile in der Kopfleiste, M14 Zeilenlänge im Zweispalter gegenprüfen. | 3 | Offen |
| — | — | — | Kapitel 2 bleibt durch `MASTER_PROMPT.md` § A9 gesperrt: *„Do not start Chapter 2 before this slice is accepted."* |

### 2 · Queue

| # | Task | SP | Phase |
|---|---|---|---|
| Q8.2 | Kapitel 2 „Die Asche von Pale" — Outline steht, Struktur + DE/EN + Bilder + Codex | 3 | B |
| Q8.3 | Kapitel 3 „Die Gasse" | 3 | B |
| Q8.4 | Kapitel 4 „Stadt des blauen Feuers" | 3 | B |
| Q8.5 | Kapitel 5 „Der Auftrag" | 3 | B |
| Q8.6 | Kapitel 6 „Meuchler" | 3 | B |
| Q8.7 | Kapitel 7 „Die Gadrobi-Hügel" | 3 | B |
| Q8.8 | Kapitel 8 „Die Glocke von K'rul" | 3 | B |
| Q8.9 | Kapitel 9 „Das Fest" | 3 | B |
| Q8.10 | Kapitel 10 „Konvergenz" inkl. der fünf Enden und der Epilog-Absätze | 5 | B |
| Q9 | Alle ~436 Illustrationen erzeugen, QA, nach webp optimieren | 8 | C |
| Q10 | Politur: Balancing über den Simulator, Save-Fixtures je Schema, Endings-Pass | 5 | D |
| Q12 | Portfolio- + Arcade-Eintrag, Preview-Screenshot | 2 | D |
| Q13 | Übergabe: Bericht (Aufwand, Kosten, Learnings) + Frage, ob Band 2 folgen soll | 1 | D |

### 3 · Zu besprechen

| # | Thema | Standard, falls keine Antwort |
|---|---|---|
| B1 | **Spielfigur:** Rekrut mit POV-Interludes vs. durchgehend Paran. **Faktisch entschieden** — Kapitel 1 ist mit dem Rekruten geschrieben, Umbau wäre jetzt teuer. | Rekrut + Interludes |

### 4 · Warten auf User-Feedback

| # | Thema |
|---|---|
| **F2** | **Testrunde Vertical Slice** (Prolog + Kapitel 1) auf http://localhost:5176 — die Abnahme, an der § A9 Kapitel 2 aufhängt. |

---

## Bewusste Abweichungen und aufgelöste Widersprüche

1. **Karten und Codex sind Meta-Wissen, nicht Teil des Schnappschusses.**
   `_reference/02-…` § 5 zählt sie in der Snapshot-Liste auf und erklärt sie zwei Absätze weiter
   zum Meta-Wissen; `MASTER_PROMPT.md` § 3.9 nennt sie als Nicht-Verhandelbares ebenfalls Meta.
   → Umgesetzt als Meta. Damit ein Sprung nicht zur Kartenfarm wird, wirkt eine Deck-Karte
   ausschließlich in der Auslegung, nie als Kampfbonus. Vermerkt in `src/model/state.ts`.

2. **Eine gesperrte Karte zeigt ihren Titel nur, wenn sie schon erreicht war.**
   → Erreicht **und** gesperrt zeigt den Titel; nie erreicht zeigt nur den in-fiction Sperrhinweis.
   `src/core/reading.ts`, geprüft in `tests/content/spoiler.test.ts`.

3. **Kanon-Korrektur:** Zwischen Prolog (1154 Burns Schlaf) und Kapitel 1 (1161) liegen **sieben**
   Jahre, nicht zwei. `50-gotm-chapter-map.md` behauptete zwei. Berichtigt, Prosa nachgezogen,
   Begründung in `11-timeline.md`.

4. **Der Erzähltext nennt den Spielcharakter mit `{name}`, nicht mit Pronomen** — dritte Person
   ist Vorgabe. ~~Und Pronomen wären zu teuer.~~ **Korrigiert am 01.08.2026:** Der genannte Preis
   („vier Fassungen jeder Seite") entfällt, wenn die Pronomen Platzhalter sind, genau wie `{name}`.
   Es gibt jetzt `{they}`, `{them}`, `{themDat}`, `{their}` sowie `{isAre}` und `{hasHave}` — die
   letzten beiden, weil englisches „they" den Plural verlangt und ein Satz sonst für eine der drei
   Anreden falsch ist, ohne dass es je jemandem auffällt. Eingesetzt wird sparsam: dort, wo jemand
   **über** den Rekruten spricht statt zu ihm. Damit tut die Anrede endlich etwas — vorher wurde
   sie abgefragt, gespeichert und nie gelesen.

5. **Proben laufen als eigene Kante.** `Choice.check` würfelt `Wert + W6` gegen eine Schwierigkeit
   und verzweigt bei Misserfolg — ein Fehlschlag blockiert nie. Wert und Schwierigkeit stehen
   **vor** dem Wurf an der Option.

6. **Interludes haben eigene Wertetafeln** (`Scene.sheet`). Werte und Proben einer Kanon-Figur
   laufen über deren Tafel; XP, Flags, Codex, Karten und Erfolge gehören dem Spieler.

7. **„no text" im Bild-Prompt erzeugt Text.** Gemessen: vier von sechs Testbildern trugen
   erfundene Beschriftungen. Die Stil-Endung nennt jetzt positiv leere Flächen statt zu verneinen.
   Begründung steht in `src/content/art/style.ts`.

8. **Temporäres Entwicklungs-Ende `1.E`.** Kruppe sagt in-fiction, dass die nächsten Karten noch
   nicht liegen. Wandert mit jedem neuen Kapitel weiter und fällt mit Kapitel 10 weg.

9. **Rang wird beschrieben, nie benannt.** `STATION_SHEETS` in `src/content/art/style.ts` ist ein
   drittes Blatt-Register neben Figuren und Orten. Grund: „heavily ornamented officers" hat aus
   einem malazanischen Staatsakt einen Offiziersball von 1810 gemacht — abstrakte Statusbegriffe
   füllt das Modell aus seinem Trainingsschwerpunkt. Zwei Tests halten das fest: eine Liste von
   Markern des 18./19. Jahrhunderts und ein Verbot vager Rangwörter in Motiv und Detail.

10. **Zwei bekannte Regelverstöße bleiben absichtlich stehen.** Die Palette `hoods-grey` enthält
    die Verneinung „no warmth at all", und `paranChild` beginnt mit „noble boy". Beides verstößt
    gegen eigene Regeln — und beides ist durch fertige Bilder widerlegt (12 bzw. 9 Stück, alle
    korrekt). Eine Änderung würde 22 bzw. 11 Prompts entwerten. Beleg schlägt Regel; Kommentare
    an beiden Stellen verhindern das versehentliche „Aufräumen".

11. **Bei zwei Figuren steht die Anzahl am Satzanfang.** Ein Figurenblatt hängt als eigener Satz
    hinten dran und trägt keine Zuordnung — „a woman … looks at a boy" plus das Blatt des Jungen
    ergab eine einzige Figur. Regel: Anzahl vorweg, je ein ausschließendes Merkmal, räumliche
    Beziehung ausgeschrieben.

12. **Der Stil-Anker macht Naheinstellungen unmöglich — deshalb gibt es einen zweiten.**
    `figures small against architecture and sky` ist eine Projektregel und für jede Szene richtig;
    bei einem angeschnittenen Motiv liefert sie zuverlässig Kulisse, gegen die das Motiv nicht
    ankommt (der Schattenhund kam zweimal ganzfigurig zurück, einmal über einer Mauer, einmal über
    einem Militärlager). `framing: 'close'` tauscht Anker und Komposition. Derselbe Befund und
    dieselbe Lösung wie beim `REFERENCE_ANCHOR`, den es aus genau diesem Grund schon gab.

13. **`close-quarters` als elfte Stimmung.** Keine der zehn ließ einen Innenraum zu — `march`
    bringt Tageslicht mit, `street-night` eine Straße. Das Truppendeck unter der Wasserlinie kam
    deshalb als Hafenszene im Freien zurück. Über elf Kapitel folgen noch Tavernen, Kajüten,
    Keller und Kasematten.

13b. **Zwei meiner Regeln waren Richtlinien, keine Gesetze — korrigiert am 01.08.2026.**
    (a) „Mindestens ein Marginalien-Begriff je Seite" hat der Nutzer nie verlangt; gemeint war das
    Gegenteil, nämlich dass ein Wort **nicht mehrfach** markiert wird. Das ist umgesetzt; ein
    Content-Ausbau nur zum Erfüllen einer erfundenen Quote entfällt.
    (b) „Eine Wahl spätestens auf Seite 3" war eine Faustregel für die **Häufigkeit** von
    Entscheidungen, keine Grenze. Die eigentliche Anforderung ist stärker: In einem CYOA sollen
    Wahlen oft kommen und spürbare Folgen haben — siehe U8.

14. **Bestandsschutz für bezahlte Bilder.** „Fertig" hieß bisher: Datei da **und** Prompt
    unverändert — ein geänderter Baustein machte damit den gesamten Bestand wieder zu Arbeit.
    Jetzt getrennt: *fehlt* wird ungefragt erzeugt, *veraltet* nur auf Ansage (`gen --stale`,
    `--ids`, `--id`). Damit kostet eine Prompt-Verbesserung erst einmal nichts, und die
    Entscheidung fällt vor dem Lauf statt danach.

---

## Archiv

| Datum | Was |
|---|---|
| 01.08.2026 | **Erste Testrunde ausgewertet, sechs Punkte abgearbeitet.** T1 Sprung-Dialog verglich zwei verschiedene Wertetafeln (Parans Werte gegen die des Rekruten) — behoben, zwei Regressionstests. T2 Sprachwahl wurde beim Fortsetzen still überschrieben — jetzt gewinnt die aktive Wahl. T3 Wortbänder gesenkt und sieben Eröffnungsseiten geteilt (56 → 63 Seiten, keine über 195 Wörter, Grenze aus dem Höhenbudget gerechnet). T4 Kopfzeile trennt Inhalt von Verwaltung, Verwaltung als Symbole. T5 Marginalien-Begriffe nur noch einmal je Seite, mit Kurzhinweis. T6 Befunde und Plan in `_reference/ux-befunde.md`. Dazu: die Story-Ansicht zeigte nie die echten Illustrationen — 56 bezahlte Bilder lagen ungenutzt im Build. |
| 01.08.2026 | **Portfolio- und Arcade-Eintrag** (Q12). `projects.ts` als Fun-Eintrag mit Live-Demo, `games.ts` in der Kategorie „Story" mit `wip`-Kennzeichnung — Prolog und Kapitel 1 von elf werden nicht als fertiges Buch verkauft. Vorschaubild automatisiert. |
| 01.08.2026 | **Live.** Repo `danielzaiser91/malazan-cyoa` öffentlich angelegt, 30 Commits gepusht, Pages über den Actions-Workflow deployt. https://danielzaiser91.github.io/malazan-cyoa/ antwortet mit 200, Assets und Illustrationen laden unter dem Sub-Pfad, Startbildschirm rendert, keine Konsolenfehler. |
| 01.08.2026 | **Kapitel 1 vollständig bebildert** (31 Bilder), Prolog ebenso (25). Dabei drei strukturelle Lücken der Pipeline geschlossen: Weltanker gegen Epochen-Drift, Standesblätter statt abstrakter Rangwörter, eigener Anker für Naheinstellungen. Dazu Bestandsschutz (`fehlt` vs. `veraltet`), Kontaktbogen-Werkzeug und die Stimmung `close-quarters`. Rund 170 Credits. |
| 31.07.2026 | **Outline für Band 1 komplett.** `_reference/outline-b1.md`: alle elf Kapitel als Teilgraph mit Szenen, Kanten, POV, Konvergenzen, Nebenwegen, Sackgassen, Proben und Wortbudget (115 Szenen, 436 Seiten, ~72 000 Wörter je Sprache). Die fünf Enden mit ihren Bedingungsstrukturen entworfen, bevor der Weg dorthin geschrieben wird. Epilog-Absatz je Beziehungs-Flag statt fünf getrennter Enden. |
| 31.07.2026 | **Bild-Testlauf, Umgebungsklang, Barrierefreiheits-Nachweis.** Sechs Bilder über Cloudflare (0 €); drei Anbieter-Fallen gefunden und behoben (1:1 statt 16:9, JPEG statt PNG, Verneinung erzeugt Text). Klangteppich je Stimmung, synthetisiert. Im Browser nachgewiesen: 0 AudioContexts im Dev-Build, Kontrast 12,9:1 bis 5,4:1 (über WCAG AA), Tastaturbedienung vollständig, kein Knopf ohne zugänglichen Namen. `public/CREDITS.md`. |
| 31.07.2026 | **Kapitel 1 „Die Küste von Itko Kan"** vollständig in DE und EN. Neun Szenen, 30 Seiten: Spine-Wahl mit drei Wegen, Lore-Nebenweg mit der Oponn-Karte, Gnadenumweg ohne Belohnung außer Herz, tödliche Sackgasse mit fünf Seiten Auszahlung, Lorn-Interlude mit eigener Tafel, Konvergenz mit vier zustandsabhängigen Einschüben. |
| 31.07.2026 | **Recherche R1–R9 geschlossen.** Sechs neue Knowledgebase-Dateien (Zeitrechnung, Deck-Karten, Genabackis/Darujhistan, Trupp und Munition, Szenen-Detail aller 24 Kapitel, Aussprache) plus `_reference/terminology-de.md` als verbindliches Glossar — Blanvalet-Begriffe wo etabliert. |
| 31.07.2026 | **Phase A.** Vite 7 + TS strict + Vitest, null Laufzeit-Dependencies. Engine mit gesätem RNG, deklarativen Bedingungen und Effekten, Schnappschuss/Sprung, Save mit Migration und Export/Import. Alle zwölf Content-Validierungen als Tests. Headless-Simulator. Views: Startbildschirm, Story, Auslegung als SVG und Liste, Marginalien, Blatt, Rückschau, Einstellungen. Klangschicht. Versionsbanner. Bild-Pipeline mit deterministischem Platzhalter. CI-Workflow. Prolog vollständig in beiden Sprachen. |
| 31.07.2026 | Vorbereitung abgeschlossen: `_knowledgebase` (Seed, 8 Dateien), `_reference` (6 Specs), `MASTER_PROMPT.md`, `CLAUDE.md`, `status.md` angelegt. |
