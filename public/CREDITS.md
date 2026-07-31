# Credits und Herkunft der Assets

## Illustrationen

Alle Illustrationen dieses Spiels sind **generiert**, nicht lizenziert.

| Anbieter | Modell | Verwendet für |
|---|---|---|
| Cloudflare Workers AI | `@cf/black-forest-labs/flux-1-schnell` | Standard- und Filler-Seiten, Testläufe |

Für jedes erzeugte Bild protokolliert `public/illustrations/manifest.json` Anbieter, Modell,
Prompt-Hash, Stufe, Auflösung und Zeitpunkt. Damit lässt sich jedes Bild identisch neu erzeugen.

Die Prompts selbst liegen als Daten im Repository (`src/content/art/`) und sind im Diff lesbar.
In keinem Prompt steht der Name einer lebenden Künstlerin oder eines lebenden Künstlers, und
kein Bild ahmt eine bestimmte kommerzielle Illustration nach.

Solange eine Seite kein erzeugtes Bild hat, rendert das Spiel einen **deterministischen
prozeduralen Platzhalter** (`src/core/placeholder.ts`) — reines SVG, aus der Seiten-ID berechnet,
ohne externe Datei.

## Schriften

Derzeit ausschließlich **Systemschriften**. Es wird keine Schrift von einem CDN geladen (weder
Google Fonts noch andere) — das Spiel funktioniert offline und schickt beim Laden nichts an Dritte.

Sobald eine eigene Schrift dazukommt, wird sie selbst gehostet, hat eine offene Lizenz, und ihre
Herkunft steht hier.

## Klang

Vollständig **synthetisiert** zur Laufzeit (`src/core/audio.ts`) — Oszillatoren und gefiltertes
Rauschen über die Web Audio API. Keine Audiodatei, keine Bibliothek, kein fremdes Material.

## Code

Keine Laufzeit-Dependencies. Entwicklungswerkzeuge: Vite (MIT), TypeScript (Apache-2.0),
Vitest (MIT).
