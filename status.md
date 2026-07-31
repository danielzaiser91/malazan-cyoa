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
| — | — | — | Nichts. Der nächste Schritt (Kapitel 2) ist durch die eigene Regel aus `MASTER_PROMPT.md` § A9 gesperrt: *„Do not start Chapter 2 before this slice is accepted."* |

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
| B3 | **Bild-Budget.** Der Testlauf lief über Cloudflare zum Nulltarif und in brauchbarer Qualität. Offen bleibt, ob die ~40 Hero-Bilder einen bezahlten Anbieter bekommen. | Cloudflare für alles, bezahlt nur auf Ansage |

### 4 · Warten auf User-Feedback

| # | Thema |
|---|---|
| **F1** | **GitHub-Repo anlegen und pushen.** Nach außen gerichtet, deshalb Rückfrage (`MASTER_PROMPT.md` § A1). Lokal ist alles committet, der CI-Workflow liegt bereit. Ohne Remote kein Deploy, kein Live-Test des Versionsbanners, kein Portfolio-Eintrag. |
| **F2** | **Testrunde Vertical Slice** (Prolog + Kapitel 1) auf http://localhost:5176 — die Abnahme, an der § A9 Kapitel 2 aufhängt. |
| **F3** | **Bild-Look abnehmen.** Sechs Testbilder liegen in `public/illustrations/_raw/`. Der Look ist eher fotorealistisch als malerisch; wenn das nicht passt, ändert sich die Stil-Endung, bevor 436 Bilder entstehen. |

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

4. **Der Spielcharakter wird nie mit einem Pronomen bezeichnet**, nur mit `{name}`. Dritte Person
   ist Vorgabe, deutsche Neutral-Pronomen gibt es nicht brauchbar, und vier Fassungen jeder Seite
   wären der Preis. Festgehalten in `70-style-and-voice.md`.

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

---

## Archiv

| Datum | Was |
|---|---|
| 31.07.2026 | **Outline für Band 1 komplett.** `_reference/outline-b1.md`: alle elf Kapitel als Teilgraph mit Szenen, Kanten, POV, Konvergenzen, Nebenwegen, Sackgassen, Proben und Wortbudget (115 Szenen, 436 Seiten, ~72 000 Wörter je Sprache). Die fünf Enden mit ihren Bedingungsstrukturen entworfen, bevor der Weg dorthin geschrieben wird. Epilog-Absatz je Beziehungs-Flag statt fünf getrennter Enden. |
| 31.07.2026 | **Bild-Testlauf, Umgebungsklang, Barrierefreiheits-Nachweis.** Sechs Bilder über Cloudflare (0 €); drei Anbieter-Fallen gefunden und behoben (1:1 statt 16:9, JPEG statt PNG, Verneinung erzeugt Text). Klangteppich je Stimmung, synthetisiert. Im Browser nachgewiesen: 0 AudioContexts im Dev-Build, Kontrast 12,9:1 bis 5,4:1 (über WCAG AA), Tastaturbedienung vollständig, kein Knopf ohne zugänglichen Namen. `public/CREDITS.md`. |
| 31.07.2026 | **Kapitel 1 „Die Küste von Itko Kan"** vollständig in DE und EN. Neun Szenen, 30 Seiten: Spine-Wahl mit drei Wegen, Lore-Nebenweg mit der Oponn-Karte, Gnadenumweg ohne Belohnung außer Herz, tödliche Sackgasse mit fünf Seiten Auszahlung, Lorn-Interlude mit eigener Tafel, Konvergenz mit vier zustandsabhängigen Einschüben. |
| 31.07.2026 | **Recherche R1–R9 geschlossen.** Sechs neue Knowledgebase-Dateien (Zeitrechnung, Deck-Karten, Genabackis/Darujhistan, Trupp und Munition, Szenen-Detail aller 24 Kapitel, Aussprache) plus `_reference/terminology-de.md` als verbindliches Glossar — Blanvalet-Begriffe wo etabliert. |
| 31.07.2026 | **Phase A.** Vite 7 + TS strict + Vitest, null Laufzeit-Dependencies. Engine mit gesätem RNG, deklarativen Bedingungen und Effekten, Schnappschuss/Sprung, Save mit Migration und Export/Import. Alle zwölf Content-Validierungen als Tests. Headless-Simulator. Views: Startbildschirm, Story, Auslegung als SVG und Liste, Marginalien, Blatt, Rückschau, Einstellungen. Klangschicht. Versionsbanner. Bild-Pipeline mit deterministischem Platzhalter. CI-Workflow. Prolog vollständig in beiden Sprachen. |
| 31.07.2026 | Vorbereitung abgeschlossen: `_knowledgebase` (Seed, 8 Dateien), `_reference` (6 Specs), `MASTER_PROMPT.md`, `CLAUDE.md`, `status.md` angelegt. |
