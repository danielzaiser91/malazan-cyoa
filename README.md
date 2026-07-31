# Malazan CYOA

Ein zweisprachiges (DE/EN), illustriertes Choose-your-own-Adventure, das **Band 1** von *The
Malazan Book of the Fallen* von Steven Erikson nacherzählt: *Gardens of the Moon*.

**Fan-Werk, inoffiziell, kostenlos.** Nicht verbunden mit Steven Erikson, Ian C. Esslemont oder
ihren Verlagen und von diesen nicht autorisiert. Alle Rechte am Originalwerk liegen bei den
Rechteinhabern. Kein einziger Satz aus den Romanen steht in diesem Repository — die Prosa ist
vollständig eigen geschrieben. Siehe [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md).

Live: https://danielzaiser91.github.io/malazan-cyoa/

## Was es ist

- **Verzweigte Geschichte** nach dem Muster *branch and bottleneck*: Zweige laufen an
  Konvergenzen wieder zusammen, den Unterschied trägt der Zustand, nicht die Struktur.
- **Die Auslegung** — der Story-Graph, in-fiction eine Deck-of-Dragons-Legung von Kruppe. Man
  springt zu jeder erreichten Szene zurück und bekommt exakt den Zustand von damals. Was man
  *weiß*, bleibt; was man *ist*, rollt zurück.
- **Spoilerfrei by construction**: Eine nie erreichte Karte gibt weder Titel noch Zusammenfassung,
  Bild, POV oder Code preis. Dafür gibt es einen Test, und der bleibt grün.
- **Marginalien** — ein Codex, der sich beim Lesen von selbst füllt. Das ist das Feature, das
  Malazan für Neulinge zugänglich macht.
- **Sechs Werte** (Klinge, Wille, List, Herz, Ansehen, Fügung), Aufstiegsstufen, Talente, Münzen,
  Inventar, Deck-Karten, Beziehungs-Flags — alle sichtbar, alle mit Bild **und** Klang.
- **Zweisprachig**, mitten im Lauf umschaltbar.

## Entwickeln

```bash
npm install
npm run dev        # http://localhost:5176
```

Vor **jedem** Commit, ohne Ausnahme:

```bash
npm run check && npm run test && npm run build
```

Werkzeuge:

```bash
npm run sim                                   # headless durchspielen, Abdeckung, Wortverteilung
node tools/art.mjs plan                       # was an Illustrationen fehlt
node tools/art.mjs placeholder --chapter b1.c00
node tools/new-scene.mjs --chapter b1.c01 --code 1.2
node tools/check-budget.mjs                   # Bundle- und Bildbudget
```

## Aufbau

```
src/
  core/       Engine, Bedingungen, Effekte, Save, Auslegung, Zufall, i18n, Klang
  model/      Typen, Registry, Graph-Auswertung
  content/    IDs, Kanten, Bedingungen, Effekte, Bild-Prompts — KEIN Anzeigetext
  locales/    de/ und en/ — jeder sichtbare Satz
  views/      Story, Auslegung, Startbildschirm, Dialoge — lesen nur, entscheiden nichts
tests/
  content/    die zwölf Validierungen aus der Spezifikation
  engine/     Kern und Save-Migration
tools/        Simulator, Bild-Pipeline, Gerüst, Budget-Prüfung
```

**Harte Architekturregel:** Alles, was entscheidet *was passiert*, liegt DOM-frei in `core/` und
`model/` und ist headless simulierbar. Deshalb kann `npm run sim` das ganze Buch ohne Browser
durchspielen, und deshalb kann die Test-Suite jede Kante prüfen.

Die verbindlichen Spezifikationen liegen in [`_reference/`](_reference/), die Lore-Recherche in
[`_knowledgebase/`](_knowledgebase/), der Auftrag in [`MASTER_PROMPT.md`](MASTER_PROMPT.md), der
Arbeitsstand in [`status.md`](status.md).

## Lizenz

Code: MIT ([`LICENSE`](LICENSE)). Inhalte: siehe [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md) —
**nicht** MIT.
