# Bildproduktion — Plan

Stand 31.07.2026. **Vor jeder Generierung zu genehmigen.** Grundlagen: Skill
`flux-bildgenerierung`, Notiz `ai-bildgeneratoren-vergleich-spiel-450-bilder.md`,
Stil-Bibel `04-illustration-pipeline.md` § 2.

Guthaben beim Erstellen dieses Plans: **2979 Credits ($29,79)**, geprüft über `/v1/credits`.

---

## 1 · Was das Spiel an Bildern braucht (gezählt, nicht geschätzt)

`node tools/art-audit.mjs` — reine Auswertung, generiert nichts.

| | Jetzt geschrieben | Ganzes Buch 1 (Outline) |
|---|---|---|
| Seiten = Bilder | **56** | **436** |
| davon hero | 16 | ~60 |
| davon standard | 35 | ~340 |
| davon filler | 5 | ~36 |

**Stimmungen (56 Seiten):** aftermath 22 · march 13 · siege 9 · divine 5 · council 3 ·
street-night 3 · dream 1
**Paletten:** hoods-grey 22 · ash-rust 16 · blue-fire 8 · bone-dust 7 · moons-spawn 3

**Figuren in Prompts — und das ist die wichtigste Zahl:**

| Figur | Bilder | Referenz nötig? |
|---|---|---|
| `paranChild` (Ganoes, 12 Jahre) | **11** | ja, klar |
| `bridgeburner` (der vernarbte Soldat) | 4 | ja |
| `lorn` (Adjunktin) | 3 | ja |
| `kruppe` | 1 | nein, noch nicht |

**40 von 56 Bildern zeigen überhaupt keine Figur** — reine Szenerie. Der Identity-Lock ist also
nur bei rund einem Viertel der Bilder ein Thema. Das drückt Aufwand und Risiko erheblich.

**Orte:** malazCity 4× · phoenixInn 1×. Für spätere Kapitel liegen Blätter für Mondbrut,
Darujhistan und den Grabhügel bereit, werden aber noch nicht gebraucht.

**Später wiederkehrend** (Blätter existieren als Text, Bilder noch nicht nötig): Whiskeyjack,
Quick Ben, Kalam, Fiddler, Tattersail, Crokus, Rake, Tool — dazu Paran als Erwachsener,
Sorry/Apsalar, Mallet, Hedge, Coll, Rallick, Baruk.

---

## 2 · Stil-Anker

Ein Satz, **wortgleich am Anfang jedes Prompts**. Er steht vorn, nicht hinten: FLUX gewichtet die
ersten Tokens am stärksten für den Look.

Fünf Kandidaten für die Stilfindung (Schritt 4). Alle bewusst **ohne jede Verneinung** — FLUX.2
hat keine Negative Prompts, und „no text" erzeugt nachweislich Text.

| # | Richtung | Anker |
|---|---|---|
| **A** | Öl auf Leinwand (Stil-Bibel wörtlich) | `Painted in thick oil on rough canvas, visible brush strokes and palette-knife texture, desaturated and high-contrast, volumetric haze, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.` |
| **B** | Gouache-Buchillustration | `Painted in matte gouache for a printed book plate, flat shapes and soft edges, limited desaturated palette, drawn rather than rendered, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.` |
| **C** | Kohle und Lavierung | `Drawn in charcoal and ink wash with a single muted colour on top, heavy blacks, grainy paper texture, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.` |
| **D** | Filmisches Matte Painting | `Painted as a cinematic matte painting, soft atmospheric depth, desaturated and high-contrast, volumetric haze, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.` |
| **E** | Kolorierte Radierung | `Etched in aquatint and hand-coloured in washes, hard bitten lines, plate grain, restrained palette, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.` |

Gemeinsam in allen fünf, weil es Projektregeln sind, nicht Geschmack:
`figures small against architecture and sky` (Stil-Bibel: „this world is old and the people in it
are not the biggest thing in the frame") · `plain unmarked surfaces and bare stone` (gegen
Text-Artefakte, positiv formuliert) · `generous empty margin at the frame edge` (für den
Sicherheitsschnitt, siehe § 5).

---

## 3 · Prompt-Vorlage

```
{STIL-ANKER}. {SZENE}. {LICHT}. {KOMPOSITION}.
```

| Block | Woher | Beispiel |
|---|---|---|
| **Stil-Anker** | gewählte Variante, wortgleich | siehe oben |
| **Szene** | `ArtPrompt.subject` + Charakterblätter wortgleich + Ortsblatt + `detail` | „a boy alone on the parapet of a black stone fortress … a twelve-year-old noble boy, dark hair cut short, …" |
| **Licht** | `MOOD_PHRASE[mood]` + `PALETTES[palette].phrase` | „siege light, smoke columns, distant fire glow. palette of ash, soot brown and rust orange" |
| **Komposition** | aus der Stufe abgeleitet | hero: `wide establishing shot, deep space, low horizon` · standard: `medium wide shot, one clear focal point, readable at thumbnail size` · filler: `tight simple shot, one object or gesture` |

Das ist eine Umstellung gegenüber jetzt: `buildPrompt()` hängt den Stil hinten an. Wird nach der
Freigabe umgebaut, samt Test, dass jeder erzeugte Prompt mit dem Anker beginnt.

---

## 4 · Referenz-Sheets

**Nur für Figuren, die mehrfach vorkommen.** Alles andere wäre verbrannte Zeit und Credits.

| Figur | Ansichten | Credits | Begründung |
|---|---|---|---|
| `paranChild` | 3 (Dreiviertel, Profil, Ganzfigur) | 9 | 11 Bilder — die einzige Figur, bei der Drift wirklich auffällt |
| `bridgeburner` | 2 (Dreiviertel, Ganzfigur) | 6 | 4 Bilder, davon zwei in Nahdistanz |
| `lorn` | 2 | 6 | 3 Bilder, aber sie kommt in jedem weiteren Kapitel wieder |
| **Summe** | **7 Bilder** | **21 Credits ($0,21)** | |

Erzeugt mit `flux-2-pro`, neutraler Hintergrund, danach in **jedem** Request der Figur als
`input_image` … `input_image_3` mitgeschickt — das kostet keine zusätzlichen Credits.

Ablage: `public/illustrations/_refs/<figur>-<n>.png` + gleichnamige `.json`. **Committet** — wer
die Referenzen verliert, verliert den Look.

`kruppe` bekommt vorerst keins (ein einziges Bild). Sobald Kapitel 4 kommt, ändert sich das.

---

## 5 · Technik

| Was | Wert | Warum |
|---|---|---|
| Modell | `flux-2-pro` | 3 Credits bis 1 MP. `klein-4b` spart bei 5 Filler-Bildern 8 Credits und kostet Konsistenz — nicht wert. |
| **Generiert** | **1344×768** | 0,98 MP, beide Kanten durch 16 teilbar, verifiziert 3 Credits |
| **Ausgeliefert** | **1280×720** (Mittelschnitt) | exaktes 16:9. Der Schnitt entfernt 32 px seitlich und 24 px oben/unten — **genau die Ecken, in denen FLUX Signaturen und Buchstabensalat ablegt.** Kostet nichts, weil beide Auflösungen in derselben Preisstufe liegen. |
| `disable_pup` | `true` | sonst schreibt ein LLM jeden Prompt um |
| `aspect_ratio` | **nie mitschicken** | existiert nicht, wird stumm ignoriert |
| `negative_prompt` | **nie mitschicken** | existiert nicht, wird stumm ignoriert |
| `output_format` | `png` | verlustfreier Master, kein Aufpreis |
| `seed` | `seedFrom(pageId)` | FNV-1a über die Seiten-ID, liegt schon in `src/core/rng.ts`. Deterministisch **und ableitbar** — kein Buchführen nötig. Neuwurf: `seedFrom(pageId + '#2')`, im JSON vermerkt. |
| Parallel | max. 8 gleichzeitig | Limit ist 24; 8 lässt Luft und macht 429er unwahrscheinlich |

**Dateinamen und Ablage:**

```
public/illustrations/_raw/<pageId>.png     Master 1344×768   git-ignoriert (zu groß)
public/illustrations/_raw/<pageId>.json    Request            COMMITTET
public/illustrations/<pageId>.webp         1280×720, ≤180 KB  COMMITTET (ausgeliefert)
public/illustrations/<pageId>@640.webp     640×360            COMMITTET (srcset)
public/illustrations/_refs/<figur>-<n>.png Referenz           COMMITTET
public/illustrations/manifest.json         Protokoll          COMMITTET
```

Der `.gitignore` wird von `_raw/` auf `_raw/*.png` verengt, damit die Request-JSONs im Repo
bleiben. **Was existiert, wird nie neu generiert** — `art.mjs` prüft Datei + Prompt-Hash und
überspringt.

**Eine neue Entwicklungs-Abhängigkeit:** `sharp` für Schnitt, webp-Umwandlung und die
640er-Variante. Dev-only, landet in keinem Bundle, ersetzt den bisherigen Handzettel „mach das mit
cwebp". Kommt in die Dependency-Tabelle in `CLAUDE.md`.

---

## 6 · Kosten nach Phasen

**Für den heutigen Stand (56 Seiten):**

| Phase | Was | Modell | Bilder | Credits | Euro¹ |
|---|---|---|---|---|---|
| 0 | Vorbereitung, Code-Umbau, Guthaben-Check | — | 0 | **0** | 0,00 € |
| 1 | Stilfindung, 5 Varianten eines Motivs | `klein-4b` | 5 | **7** | 0,07 € |
| 2 | Referenz-Sheets | `flux-2-pro` | 7 | **21** | 0,20 € |
| 3 | Ein Einzelbild zur Freigabe | `flux-2-pro` | 1 | **3** | 0,03 € |
| 4 | Batch, Block 1 | `flux-2-pro` | 25 | **75** | 0,71 € |
| 4 | Batch, Block 2 | `flux-2-pro` | 25 | **75** | 0,71 € |
| 4 | Batch, Block 3 | `flux-2-pro` | 5 | **15** | 0,14 € |
| 5 | Nachbesserung, geschätzt 15 % Ablehnungen | `flux-2-pro` | ~9 | **27** | 0,26 € |
| | **Summe** | | **77** | **≈ 223** | **≈ 2,12 €** |

**Hochrechnung auf ganz Band 1 (436 Seiten):**

| Posten | Credits | Euro¹ |
|---|---|---|
| 436 Seitenbilder | 1 308 | 12,42 € |
| Referenz-Sheets für ~12 weitere Figuren + 3 Orte, je 2 Ansichten | ~90 | 0,85 € |
| Nachbesserung 15 % | ~200 | 1,90 € |
| Stilfindung (einmalig, bereits enthalten) | 7 | 0,07 € |
| **Summe** | **≈ 1 605** | **≈ 15,24 €** |

Guthaben 2979 Credits deckt das **mit knapp doppeltem Puffer**. Ein zweites Buch wäre ebenfalls
gedeckt — falls es je dazu kommt.

¹ 1 Credit = $0,01, gerechnet mit 1 USD ≈ 0,95 EUR. Maßgeblich ist immer das Feld `cost` in der
Submit-Antwort; die Tabelle ist eine Schätzung, keine Rechnung.

---

## 7 · Ablauf und Bremsen

1. Guthaben prüfen (kostenlos), Zahl nennen — **vor jedem Block**.
2. Stilfindung: 5 Varianten, **ein** Motiv (`b1.c00.s01.p01` — Figur, Architektur, Himmel, Feuer,
   also alles auf einmal). Vorlegen, Auswahl abwarten.
3. Referenz-Sheets im gewählten Stil. Vorlegen.
4. **Ein** Bild mit `flux-2-pro`. Vorlegen. Erst hier zeigt sich, ob der auf `klein-4b` gewählte
   Stil auf `pro` trägt — das ist der eigentliche Zweck dieses Schritts.
5. Batch in Blöcken zu höchstens 25. Nach jedem Block vorlegen und warten.
6. Jedes Bild sofort herunterladen (URLs verfallen nach 10 Minuten), Request-JSON danebenlegen,
   Manifest fortschreiben.
7. Bei Unsicherheit über ein Motiv: **fragen statt generieren.**

**Die sechs Cloudflare-Testbilder von vorhin werden verworfen** — anderes Modell, anderer Stil,
1:1 statt 16:9 bei dreien. Sie waren die Vorstudie, die diesen Plan möglich gemacht hat, und mehr
nicht.
