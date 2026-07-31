/**
 * Gemeinsame Schicht fuer die Black-Forest-Labs-API.
 *
 * Alles, was in `art-style.mjs` und `art.mjs` sonst doppelt stuende, und alle
 * verbindlichen Regeln aus dem Skill `flux-bildgenerierung` an einer Stelle:
 *
 *  - `disable_pup: true` ist Pflicht, sonst schreibt ein Sprachmodell den Prompt um
 *  - `aspect_ratio` und `negative_prompt` existieren NICHT und werden stumm
 *    verschluckt — sie duerfen hier nirgends auftauchen
 *  - Ergebnis-URLs verfallen nach 10 Minuten: sofort herunterladen
 *  - immer die zurueckgegebene `polling_url` benutzen, nie selbst gebaut
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

/** Generiert wird groesser als ausgeliefert — siehe `_reference/art-production-plan.md` § 5. */
export const GEN_W = 1344
export const GEN_H = 768
export const OUT_W = 1280
export const OUT_H = 720

/**
 * Kompositionsvorgabe je Stufe. Der vierte Block der Prompt-Vorlage.
 */
export const COMPOSITION = {
  hero: 'wide establishing shot, deep space, low horizon',
  standard: 'medium wide shot, one clear focal point, readable at thumbnail size',
  filler: 'tight simple shot, one object or gesture',
}

/**
 * Die fuenf Stil-Anker der Stilfindung. Nach der Entscheidung bleibt genau
 * einer uebrig und wandert als Konstante nach `src/content/art/style.ts`.
 *
 * Drei Bausteine stehen in allen fuenf, weil sie Projektregeln sind:
 * `figures small against architecture and sky` (Stil-Bibel), `plain unmarked
 * surfaces and bare stone` (gegen Text-Artefakte, positiv formuliert),
 * `generous empty margin at the frame edge` (fuer den Sicherheitsschnitt).
 *
 * Keine einzige Verneinung — FLUX.2 hat keine Negative Prompts, und "no text"
 * erzeugt nachweislich Text.
 */
export const STYLE_ANCHORS = {
  A: 'Painted in thick oil on rough canvas, visible brush strokes and palette-knife texture, desaturated and high-contrast, volumetric haze, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.',
  B: 'Painted in matte gouache for a printed book plate, flat shapes and soft edges, limited desaturated palette, drawn rather than rendered, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.',
  C: 'Drawn in charcoal and ink wash with a single muted colour on top, heavy blacks, grainy paper texture, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.',
  D: 'Painted as a cinematic matte painting, soft atmospheric depth, desaturated and high-contrast, volumetric haze, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.',
  E: 'Etched in aquatint and hand-coloured in washes, hard bitten lines, plate grain, restrained palette, figures small against architecture and sky, plain unmarked surfaces and bare stone, generous empty margin at the frame edge.',
}

/** Schluessel aus `.env.local` — nie aus dem Repo, nie im Klartext im Code. */
export function loadKey() {
  const file = join(ROOT, '.env.local')
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
    }
  }
  const key = process.env.BFL_KEY
  if (!key) {
    console.error('\n  BFL_KEY fehlt. In .env.local eintragen (die Datei ist git-ignoriert).\n')
    process.exit(1)
  }
  return key
}

/** Guthaben abfragen. Kostet nichts und gehoert vor jeden Block. */
export async function credits(key) {
  const res = await fetch('https://api.bfl.ai/v1/credits', { headers: { 'x-key': key } })
  if (!res.ok) throw new Error(`Guthaben-Abfrage fehlgeschlagen: HTTP ${res.status}`)
  return (await res.json()).credits
}

export async function submit(key, model, request) {
  // Sicherung gegen die beiden stillen Fallen: beide Parameter existieren nicht
  // und wuerden kommentarlos verschluckt — das Bild kaeme trotzdem und kostete
  // trotzdem. Lieber hier hart abbrechen als still 1024x1024 bezahlen.
  for (const forbidden of ['aspect_ratio', 'negative_prompt']) {
    if (forbidden in request) throw new Error(`\`${forbidden}\` gibt es bei FLUX.2 nicht — Request abgelehnt`)
  }
  if (request.disable_pup !== true) throw new Error('`disable_pup: true` ist Pflicht')
  if (typeof request.seed !== 'number') throw new Error('`seed` muss gesetzt sein')

  const res = await fetch(`https://api.bfl.ai/v1/${model}`, {
    method: 'POST',
    headers: { 'x-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = await res.json()
  if (!res.ok || !data.polling_url) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data).slice(0, 300)}`)
  return data
}

/** Pollt bis `Ready` und liefert die Ergebnis-URL. Bricht bei Fehlerstatus ab. */
export async function awaitResult(key, pollingUrl, timeoutMs = 300_000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    const res = await fetch(pollingUrl, { headers: { 'x-key': key } })
    const data = await res.json()
    if (data.status === 'Ready') return data.result.sample
    if (['Error', 'Failed', 'Content Moderated', 'Request Moderated'].includes(data.status)) {
      throw new Error(`Abbruch: ${data.status} — ${JSON.stringify(data).slice(0, 300)}`)
    }
    await new Promise(r => setTimeout(r, 2000))
  }
  throw new Error('Zeitueberschreitung beim Polling')
}

/** Sofort herunterladen — die URL verfaellt nach 10 Minuten. */
export async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download fehlgeschlagen: HTTP ${res.status}`)
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
}
