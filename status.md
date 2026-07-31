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
| A9 | Vertical Slice: Prolog **fertig**, Kapitel 1 fehlt noch | 5 | Prolog vollständig (8 Szenen, 26 Seiten, DE+EN, Platzhalter-Bilder, Codex, Erfolge, Sprung, Sackgasse). Kapitel 1 ist der nächste Block. |

### 2 · Queue

| # | Task | SP | Phase |
|---|---|---|---|
| Q2 | Recherche-Lücken R1–R9 schließen, `_knowledgebase` ausbauen | 5 | A |
| Q7b | Kapitel 1 „Die Küste von Itko Kan": Struktur, DE+EN, Bilder, Codex | 5 | A |
| Q6b | Echte Bilder erzeugen: Testbatch von 6 über drei Stimmungen, dem User vorlegen | 2 | A |
| Q8 | Kapitel 2–10 Band 1, Kapitel für Kapitel | 8 | B |
| Q9 | Alle ~400 Illustrationen generieren, QA, optimieren | 8 | C |
| Q10 | Politur: Accessibility-Audit, Performance-Budget, Balancing, Endings | 5 | D |
| Q11b | Ambient-Klang je Region; Ereignis-Klänge stehen bereits | 2 | D |
| Q12 | Portfolio- + Arcade-Eintrag, Preview-Screenshot | 2 | D |
| Q13 | Übergabe: Bericht (Aufwand, Kosten, Learnings) + Frage, ob Band 2 folgen soll | 1 | D |

### 3 · Zu besprechen

| # | Thema | Standard, falls keine Antwort |
|---|---|---|
| B1 | **Spielfigur:** eigener Brückenverbrenner-Rekrut mit POV-Interludes vs. durchgehend Ganoes Paran. Gilt ab Kapitel 1 — der Prolog ist ohnehin ein Paran-Interlude. | Rekrut + Interludes (bereits im Modell umgesetzt: `Scene.sheet`) |
| B2 | **Repo öffentlich oder privat + Live-Repo** (wie archmage-idle)? | Ein öffentliches Repo |
| B3 | **Bild-Budget:** ~400 Bilder. Welcher Anbieter darf wie viel kosten? | Cloudflare/HF-Free-Tier für Standard, bezahlt nur für ~40 Hero-Bilder, Rückfrage ab 1 € pro Lauf (bereits so in `tools/art.mjs`) |
| B4 | **Deutsche Terminologie:** Blanvalet-Begriffe oder Originalnamen? | Originalnamen, einmal im Codex glossiert. Bereits benutzt: Brückenverbrenner, Mausviertel, Gewirr, Mocks Feste, Klaue |

### 4 · Warten auf User-Feedback

| # | Thema |
|---|---|
| F1 | GitHub-Repo anlegen und pushen — **nach außen gerichtet, deshalb Rückfrage** (MASTER_PROMPT § A1). Lokal ist alles committet. |
| F2 | Testrunde Prolog: läuft lokal auf http://localhost:5176 |

---

## Bewusste Abweichungen und aufgelöste Widersprüche

Beides ist in der Vorlage widersprüchlich; die Auflösung steht jeweils im Quelltext daneben.

1. **Karten und Codex sind Meta-Wissen, nicht Teil des Schnappschusses.**
   `_reference/02-…` § 5 zählt sie in der Snapshot-Liste auf und erklärt sie zwei Absätze weiter
   zum Meta-Wissen; `MASTER_PROMPT.md` § 3.9 nennt sie als Nicht-Verhandelbares ebenfalls Meta.
   → Umgesetzt als Meta. Damit ein Sprung nicht zur Kartenfarm wird, wirkt eine Deck-Karte
   ausschließlich in der Auslegung (eine Nachbarkarte aufdecken), nie als Kampfbonus.
   Vermerkt in `src/model/state.ts`.

2. **Eine gesperrte Karte zeigt ihren Titel nur, wenn sie schon erreicht war.**
   `_reference/02-…` § 6 verlangt einerseits „gesperrt zeigt Titel ausgegraut", andererseits
   „nie erreicht verrät nichts". → Erreicht **und** gesperrt zeigt den Titel; nie erreicht zeigt
   nur den in-fiction Sperrhinweis. Vermerkt in `src/core/reading.ts`, geprüft in
   `tests/content/spoiler.test.ts`.

3. **Temporäres Entwicklungs-Ende `0.E`.** Solange Kapitel 1 fehlt, endet die Konvergenz `0.2`
   auf einer Kruppe-Szene, die in-fiction sagt, dass die nächsten Karten noch nicht liegen.
   Das hält den Graphen validierbar, ohne ein Ende vorzutäuschen. **Fällt weg, sobald Kapitel 1
   steht** — dann zeigt `0.2` wieder auf `b1.c01.s01`, und das Ende `wip` samt Karte
   `ending-wip` wird gelöscht.

4. **Abdeckungsziel 60 % ist erfüllt, aber knapp** (61,5 % auf einem gierigen Lauf). Ursache:
   der Prolog besteht überwiegend aus sich ausschließenden Zweigen. Ab Kapitel 1 muss die
   Hauptlinie mehr Gewicht tragen, sonst kippt die Zahl. Gemessen von `npm run sim`.

5. **Proben laufen als eigene Kante.** `Choice.check` würfelt `Wert + W6` gegen eine
   Schwierigkeit und verzweigt bei Misserfolg auf ein eigenes Ziel — ein Fehlschlag blockiert nie.
   Wert und Schwierigkeit stehen **vor** dem Wurf an der Option. Nicht in der Vorlage
   spezifiziert, aber vom Design-Plan § 4 verlangt.

6. **Interludes haben eigene Wertetafeln** (`Scene.sheet` + `ContentPack.sheets`). Werte-Effekte
   und Proben einer Kanon-Figur laufen über deren Tafel; XP, Flags, Codex, Karten und Erfolge
   gehören weiterhin dem Spieler. Damit verheddern sich die beiden Erzählspuren nie mechanisch.

---

## Archiv

| Datum | Was |
|---|---|
| 31.07.2026 | **Phase A weitgehend fertig.** Repo + Scaffold (Vite 7, TS strict, Vitest, null Laufzeit-Dependencies). Datenmodell und Engine-Core: gesätes RNG, Bedingungen, Effekte mit Ereignisliste, Save mit Schema + Migration + Export/Import, Schnappschüsse und Sprung, Graph-Auswertung, Abdeckung, i18n. Validierungs-Suite: alle zwölf Prüfungen als Vitest-Suiten, 95 Tests grün. Headless-Simulator (`tools/simulate.mjs`, 400 Läufe, 0 Abstürze). Views: Startbildschirm mit vier Profilen, Story-View, Auslegung als SVG **und** Textliste, Marginalien, Blatt, Rückschau, Einstellungen, Inhaltswarnung, Game-Over, Ende. Klangschicht (synthetisiert, im Dev-Build stumm). Versionsbanner + Cache-Busting. Illustrations-Pipeline mit deterministischem Platzhalter, Stil-Bibel, Charakterblättern, Kostenrückfrage. CI-Workflow. Prolog vollständig in DE und EN. |
| 31.07.2026 | Vorbereitung abgeschlossen: `_knowledgebase` (Seed, 8 Dateien), `_reference` (6 Specs), `MASTER_PROMPT.md`, `CLAUDE.md`, `status.md` angelegt. Recherche zu CYOA-Struktur-Patterns, Flowchart-Systemen, Malazan-Lore und Band-1-Beat-Map erledigt. |
