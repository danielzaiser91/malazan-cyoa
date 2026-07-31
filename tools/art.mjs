/**
 * Bild-Pipeline.
 *
 *   node tools/art.mjs plan                          # was fehlt / ist veraltet
 *   node tools/art.mjs gen --chapter b1.c00          # fehlende erzeugen
 *   node tools/art.mjs gen --id b1.c00.s01.p01 --provider openai --n 4
 *   node tools/art.mjs optimise                      # webp 1280 + 640, Budget
 *   node tools/art.mjs verify                        # Abdeckung, Groessen, Manifest
 *   node tools/art.mjs placeholder --chapter b1.c00  # SVG-Platzhalter schreiben
 *
 * Grundsaetze (`_reference/04-illustration-pipeline.md` § 6):
 *  - wiederaufsetzbar: erzeugt nie neu, was es gibt, ausser mit `--force`
 *  - jede Datei wird im Manifest protokolliert (Anbieter, Modell, Seed, Prompt-Hash)
 *  - vor einem Lauf steht eine Kostenschaetzung und eine Rueckfrage
 *  - Schluessel kommen aus der Umgebung, nie aus dem Repo
 */

import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync, statSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { content, artById } from '../src/content/index.ts'
import { Registry } from '../src/model/registry.ts'
import { buildPrompt, promptHash } from '../src/content/art/prompt.ts'
import { placeholderSvg } from '../src/core/placeholder.ts'

const ROOT = join(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'illustrations')
const RAW = join(OUT, '_raw')
const MANIFEST = join(OUT, 'manifest.json')

const argv = process.argv.slice(2)
const cmd = argv[0] ?? 'plan'
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback
}
const flag = name => argv.includes(`--${name}`)

const reg = new Registry(content)

/** Master-Aufloesung. 16:9 ist in der Stil-Bibel gesperrt. */
const MASTER_W = 1280
const MASTER_H = 720

/**
 * Endung aus den Magic Bytes bestimmen. Anbieter liefern nicht das, was ihre
 * Dokumentation behauptet — Cloudflare gibt JPEG zurueck, obwohl nichts davon
 * die Rede war. Eine `.png`, die ein JPEG ist, faellt erst beim Optimieren auf.
 */
function extensionOf(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'png'
  if (bytes.slice(8, 12).toString('latin1') === 'WEBP') return 'webp'
  return 'bin'
}

/** Kostenschaetzung je Anbieter in Euro pro Bild — grob, aber ehrlich. */
const COST = { hf: 0, cloudflare: 0, replicate: 0.003, gemini: 0.04, leonardo: 0.02, openai: 0.19 }
/** Ab dieser Summe wird gefragt, statt loszulegen. */
const ASK_ABOVE_EUR = 1.0

function loadManifest() {
  if (!existsSync(MANIFEST)) return { version: 1, images: {} }
  try { return JSON.parse(readFileSync(MANIFEST, 'utf8')) } catch { return { version: 1, images: {} } }
}

function saveManifest(m) {
  mkdirSync(dirname(MANIFEST), { recursive: true })
  // Atomar: erst daneben schreiben, dann umbenennen — ein abgebrochener Lauf
  // darf das Manifest nie halb beschrieben zuruecklassen. `rename` ist auf
  // demselben Dateisystem atomar; die Zwischendatei darf NICHT liegen bleiben,
  // sonst landet sie im naechsten `git add -A`.
  const tmp = MANIFEST + '.tmp'
  writeFileSync(tmp, JSON.stringify(m, null, 2) + '\n')
  renameSync(tmp, MANIFEST)
}

/** Alle Seiten mit ihrem Prompt, gefiltert nach --chapter / --id. */
function targets() {
  const chapter = arg('chapter')
  const id = arg('id')
  const out = []
  for (const book of reg.books) {
    for (const scene of reg.scenesOf(book.id)) {
      if (chapter && scene.chapter !== chapter) continue
      for (const page of scene.pages) {
        if (id && page.id !== id) continue
        const prompt = artById.get(page.art.promptId)
        if (!prompt) { console.warn(`  ! kein Prompt fuer ${page.id}`); continue }
        out.push({ page, scene, prompt })
      }
    }
  }
  return out
}

function statusOf(entry, prompt) {
  const file = join(OUT, `${prompt.id}.webp`)
  if (!existsSync(file)) return 'fehlt'
  if (!entry) return 'nicht protokolliert'
  if (entry.promptHash !== promptHash(prompt)) return 'veraltet'
  return 'ok'
}

// --------------------------------------------------------------------------

async function plan() {
  const m = loadManifest()
  const rows = targets().map(({ page, prompt }) => ({
    id: page.id,
    tier: prompt.tier,
    status: statusOf(m.images[prompt.id], prompt),
  }))
  const byStatus = {}
  for (const r of rows) (byStatus[r.status] ??= []).push(r)
  console.log(`\n  ${rows.length} Seiten\n`)
  for (const [status, list] of Object.entries(byStatus)) {
    console.log(`  ${status.padEnd(18)} ${list.length}`)
    if (status !== 'ok') for (const r of list.slice(0, 40)) console.log(`      ${r.id}  (${r.tier})`)
  }
  const missing = rows.filter(r => r.status !== 'ok')
  const byTier = {}
  for (const r of missing) byTier[r.tier] = (byTier[r.tier] ?? 0) + 1
  console.log(`\n  Zu erzeugen: ${missing.length}  ${JSON.stringify(byTier)}\n`)
}

async function placeholders() {
  mkdirSync(OUT, { recursive: true })
  let n = 0
  for (const { page, prompt } of targets()) {
    const file = join(OUT, `${page.id}.svg`)
    writeFileSync(file, placeholderSvg({ id: page.id, mood: page.art.mood, palette: prompt.palette }))
    n++
  }
  console.log(`  ${n} Platzhalter geschrieben nach public/illustrations/`)
}

async function gen() {
  const provider = arg('provider', 'cloudflare')
  const m = loadManifest()
  const todo = targets().filter(({ prompt }) => flag('force') || statusOf(m.images[prompt.id], prompt) !== 'ok')
  if (!todo.length) { console.log('  Nichts zu tun.'); return }

  const perImage = COST[provider] ?? 0
  const total = perImage * todo.length
  console.log(`\n  ${todo.length} Bilder ueber "${provider}" — geschaetzt ${total.toFixed(2)} €`)
  if (total > ASK_ABOVE_EUR && !flag('yes')) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const answer = await rl.question('  Fortfahren? [j/N] ')
    rl.close()
    if (!/^j/i.test(answer)) { console.log('  Abgebrochen.'); return }
  }

  mkdirSync(RAW, { recursive: true })
  const key = providerKey(provider)
  if (!key) {
    console.error(`\n  Kein Schluessel fuer "${provider}". Setze ihn in .env.local oder der Umgebung:`)
    console.error(`  ${ENV_VAR[provider] ?? 'API_KEY'}=...\n`)
    process.exitCode = 1
    return
  }

  let done = 0, failed = 0
  for (const { page, prompt } of todo) {
    const text = buildPrompt(prompt)
    try {
      const bytes = await callProvider(provider, key, text, Number(arg('n', '1')))
      const ext = extensionOf(bytes)
      writeFileSync(join(RAW, `${page.id}.${ext}`), bytes)
      m.images[prompt.id] = {
        provider, model: MODEL[provider], promptHash: promptHash(prompt),
        tier: prompt.tier, generatedAt: new Date().toISOString(),
        raw: `_raw/${page.id}.${ext}`, size: `${MASTER_W}x${MASTER_H}`,
      }
      saveManifest(m)
      done++
      console.log(`  ✓ ${page.id}`)
    } catch (err) {
      failed++
      console.warn(`  ✗ ${page.id}: ${err instanceof Error ? err.message : String(err)}`)
      // Rate-Limit: exponentiell zurueckziehen statt stur weiterhaemmern.
      await new Promise(r => setTimeout(r, Math.min(30_000, 1000 * 2 ** Math.min(failed, 5))))
    }
  }
  console.log(`\n  fertig: ${done} · fehlgeschlagen: ${failed}`)
  console.log('  Naechster Schritt: node tools/art.mjs optimise')
}

const ENV_VAR = {
  hf: 'HF_TOKEN', cloudflare: 'CF_API_TOKEN', replicate: 'REPLICATE_API_TOKEN',
  gemini: 'GEMINI_API_KEY', leonardo: 'LEONARDO_API_KEY', openai: 'OPENAI_API_KEY',
}
const MODEL = {
  hf: 'black-forest-labs/FLUX.1-schnell',
  cloudflare: '@cf/black-forest-labs/flux-1-schnell',
  replicate: 'black-forest-labs/flux-dev',
  gemini: 'gemini-2.5-flash-image',
  leonardo: 'leonardo-phoenix',
  openai: 'gpt-image-1',
}

function providerKey(provider) {
  loadEnvLocal()
  return process.env[ENV_VAR[provider] ?? '']
}

/** `.env.local` ist git-ignoriert; Schluessel liegen NIE im Repo. */
function loadEnvLocal() {
  const file = join(ROOT, '.env.local')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim()
  }
}

async function callProvider(provider, key, prompt) {
  if (provider === 'cloudflare') {
    const account = process.env.CF_ACCOUNT_ID
    if (!account) throw new Error('CF_ACCOUNT_ID fehlt')
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL.cloudflare}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        // 1280x720 ist Pflicht: die Stil-Bibel schreibt 16:9 vor, und ohne
        // width/height liefert der Anbieter stillschweigend 1:1 zurueck.
        body: JSON.stringify({ prompt, steps: 8, width: MASTER_W, height: MASTER_H }),
      },
    )
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`)
    const data = await res.json()
    return Buffer.from(data.result.image, 'base64')
  }
  if (provider === 'hf') {
    const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL.hf}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`)
    return Buffer.from(await res.arrayBuffer())
  }
  throw new Error(`Anbieter "${provider}" ist noch nicht verdrahtet`)
}

async function optimise() {
  // Bewusst ohne Bild-Dependency: `sharp` waere eine Laufzeit-fremde, aber
  // schwere Build-Abhaengigkeit. Solange keine Rohbilder existieren, ist hier
  // nichts zu tun; sobald welche da sind, uebernimmt das System-Werkzeug.
  if (!existsSync(RAW)) { console.log('  Keine Rohbilder — nichts zu optimieren.'); return }
  const files = readdirSync(RAW).filter(f => /\.(png|jpg|webp)$/.test(f))
  console.log(`  ${files.length} Rohbilder gefunden.`)
  console.log('  Umwandlung nach webp erfolgt ueber das System-Werkzeug (cwebp).')
  console.log('  Beispiel: cwebp -q 82 -resize 1280 0 in.png -o out.webp')
}

async function verify() {
  const m = loadManifest()
  const rows = targets()
  const missing = []
  const oversized = []
  for (const { page, prompt } of rows) {
    const file = join(OUT, `${prompt.id}.webp`)
    if (!existsSync(file)) { missing.push(page.id); continue }
    const size = statSync(file).size
    if (size > 300 * 1024) oversized.push(`${page.id} (${Math.round(size / 1024)} KB)`)
  }
  const unlogged = rows.filter(({ prompt }) => existsSync(join(OUT, `${prompt.id}.webp`)) && !m.images[prompt.id])
  console.log(`\n  Seiten:            ${rows.length}`)
  console.log(`  ohne Bild:         ${missing.length}`)
  console.log(`  ueber 300 KB:      ${oversized.length}`)
  console.log(`  nicht im Manifest: ${unlogged.length}\n`)
  for (const x of oversized) console.log(`    ! ${x}`)
  // Der RELEASE-Build faellt auf fehlende Bilder; der Entwicklungsstand nicht.
  if (flag('release') && (missing.length || oversized.length)) process.exitCode = 1
}

const commands = { plan, gen, optimise, verify, placeholder: placeholders }
const run = commands[cmd]
if (!run) {
  console.error(`Unbekannter Befehl: ${cmd}\nBekannt: ${Object.keys(commands).join(', ')}`)
  process.exit(1)
}
await run()
