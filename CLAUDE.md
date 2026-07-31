# CLAUDE.md — Malazan CYOA

Projektregeln. Gilt zusätzlich zu `C:\code\ai\ai helper files\ai_agent_boot.md` (immer lesen).

## Was das hier ist

Ein zweisprachiges (DE/EN), illustriertes Choose-your-own-Adventure, das **Band 1** von „The Malazan
Book of the Fallen" (Steven Erikson) nacherzählt: *Gardens of the Moon*.
Der vollständige Auftrag steht in **`MASTER_PROMPT.md`** — der ist verbindlich.

> **Scope: ausschließlich Band 1.** Bände 2–10 sind nicht Teil des Projekts. Nichts dafür
> schreiben, planen oder recherchieren. Ob es weitergeht, entscheidet der User, wenn Band 1 fertig
> und gespielt ist. Die Engine bleibt trotzdem mehrbuch-fähig (alles nach Buch-ID gekeyt,
> `b1` nie hartkodiert) — das kostet nichts und ist kein Versprechen.

## Reihenfolge beim Einstieg in eine Session

1. `MASTER_PROMPT.md` (der Auftrag)
2. `status.md` (was gerade dran ist)
3. Die `_reference/`-Datei, die zur aktuellen Phase gehört
4. `_knowledgebase/`, wenn Inhalt geschrieben wird

## Harte Regeln

- **Sprache im Chat: Deutsch.** Immer, unabhängig von der Sprache der Anfrage. Auch kurze
  Statuszeilen vor Tool-Calls.
- **Kein PowerShell.** Bash + die dedizierten Tools (Read, Write, Edit, Grep, Glob).
- **Zeitstempel** am Ende jeder Antwort: `🕐 DD.MM.YYYY, HH:MM Uhr` (via `date +"%d.%m.%Y %H:%M"`).
- **Qualitätskette vor JEDEM Commit:** `npm run check` → `npm run test` → `npm run build`.
  Nichts committen, solange eins davon rot ist. Gilt auch für reine Content-Commits — genau da
  fängt die Content-Validierung kaputte Links.
- **Auto-Commit & Push** nach jeder abgeschlossenen, verifizierten Änderung. Kleine, fokussierte
  Commits; Body erklärt Ursache + Fix.
- **`status.md` ist live.** Jeder neue Wunsch landet sofort in der Task Queue, Erledigtes sofort ins
  Archiv. Reihenfolge: In Arbeit · Queue · Zu besprechen · Warten auf Feedback.
- **Kein Ton im Claude-Preview.** Im Browser-Pane/Preview-Server alles stumm. Das fertige Spiel darf
  Ton haben — die Regel schützt den User vor dem Agenten, nicht den Spieler vor dem Spiel.
- **Keine Raubkopien.** Weder herunterladen noch verlinken noch zitieren. Siehe
  `MASTER_PROMPT.md` § Legal.
- **Eigene Prosa.** Kein Satz aus den Romanen wird übernommen. Zitate höchstens 15 Wörter, in
  Anführungszeichen, mit Quelle, maximal eins pro Datei.

## Dependencies — jede braucht hier eine Zeile

Ziel: **null Laufzeit-Dependencies**. Stand heute erfüllt — `package.json` hat keinen
`dependencies`-Block. Entwicklungs-Abhängigkeiten:

| Paket | Warum |
|---|---|
| `vite` | Build und Dev-Server. Gehashte Assetnamen, sonst müsste Cache-Busting von Hand. |
| `typescript` | Das Content-Schema zahlt sich nur aus, wenn es typgeprüft wird. |
| `vitest` | Test-Runner; dieselbe Auflösung wie Vite, also laufen Tests gegen exakt den Code, der gebaut wird. |
| `@types/node` | Nur Typen, landet in keinem Bundle. Nötig, weil `tools/` und `tests/` Node-APIs benutzen. |

**Konvention, die daran hängt:** Jeder relative Import trägt seine `.ts`-Endung
(`allowImportingTsExtensions` + `verbatimModuleSyntax`). Das kostet nichts und erlaubt Node 24,
die Quellen ohne Build direkt auszuführen — genau davon lebt `tools/simulate.mjs`.

## Architektur in einem Absatz

Vite + TypeScript (strict), kein Framework, null Runtime-Dependencies als Ziel. Alles, was
entscheidet *was passiert*, liegt DOM-frei in `src/core/` + `src/model/` und ist headless
simulierbar; `src/views/` liest nur und schickt Intents. Content (`src/content/`) enthält IDs,
Kanten, Bedingungen, Effekte, Art-Prompts — **keinen einzigen Anzeigetext**. Alle Texte liegen in
`src/locales/de|en/`. Details: `_reference/03-tech-stack-and-deployment.md`.

## Content-Regeln in einem Absatz

Verzweigt wird **nur am Szenenende**. Eine Szene ist die kleinste Einheit, zu der zurückgesprungen
werden darf. Innerhalb einer Szene sind Interaktionen erlaubt, solange sie die nächste Szene nicht
ändern. Jede Sackgasse trägt 3–6 Seiten echten Inhalt, bevor der Game-Over-Screen kommt. Jede Seite
hat genau eine Illustration. Details: `_reference/02-story-graph-save-and-ui.md`.

## Definition of Done für eine Szene

Struktur in `content/` · Prosa in `locales/de` **und** `locales/en` in den Wortbändern ·
Art-Prompt je Seite · Alt-Text zweisprachig · Codex-Einträge verdrahtet · Kanten validiert ·
Wortzahl geprüft · Test-Suite grün · im Flowchart korrekt platziert und spoilerfrei.
</content>
