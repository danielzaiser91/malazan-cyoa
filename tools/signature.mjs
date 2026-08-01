/**
 * Erkennung gefälschter Künstlersignaturen in generierten Bildern.
 *
 * FLUX setzt sie in Ecken, wenn das Motiv eine ruhige Fläche anbietet
 * (gemessen 31.07.2026). Negative Prompts gibt es nicht, also wird hier
 * repariert — aber nur, wenn die Fundstelle wirklich wie Schrift aussieht.
 *
 * **Der erste Versuch suchte „ruhige Ecke mit Kontrastausschlag" und lag in
 * BEIDE Richtungen falsch:** Fehlalarm auf einer dunklen Turmsilhouette,
 * gleichzeitig die echte Signatur verpasst, weil sie auf strukturiertem Stein
 * sass. Die Ruhe der Umgebung ist also kein brauchbares Merkmal.
 *
 * Was tatsaechlich unterscheidet: **Schrift besteht aus vielen kleinen,
 * getrennten Flecken, die in einer schmalen waagerechten Reihe liegen.**
 * Architektur liefert wenige grosse, zusammenhaengende Formen. Genau darauf
 * prueft dieser Detektor — und nur, wenn alle Bedingungen zugleich erfuellt
 * sind, wird ueberhaupt etwas angefasst.
 */

import sharp from 'sharp'

/** Nur in diesem Streifen an jeder Ecke wird gesucht. */
const REGION_W = 420
const REGION_H = 170

/** Ein Buchstabe ist klein. Alles Groessere ist Bildinhalt. */
const BLOB_MIN_PX = 6
const BLOB_MAX_PX = 320
/** Eine Signaturzeile besteht aus mindestens so vielen getrennten Flecken. */
const MIN_BLOBS = 5
/** Und liegt in einem Band von hoechstens dieser Hoehe. */
const MAX_BAND_H = 42
/** Breite der ganzen Zeile. */
const MIN_LINE_W = 45
const MAX_LINE_W = 320
/** Die Zeile muss deutlich mehr Struktur tragen als ihre Umgebung. */
const MIN_CONTRAST_RATIO = 2.0

function corners(w, h) {
  return [
    { name: 'unten links', x: 0, y: h - REGION_H },
    { name: 'unten rechts', x: w - REGION_W, y: h - REGION_H },
    { name: 'oben links', x: 0, y: 0 },
    { name: 'oben rechts', x: w - REGION_W, y: 0 },
  ]
}

/** Hochpass: Abweichung vom stark weichgezeichneten Bild. Betont Striche. */
async function highpass(buffer, region) {
  const base = sharp(buffer).extract({ left: region.x, top: region.y, width: REGION_W, height: REGION_H }).greyscale()
  const sharpBuf = await base.clone().raw().toBuffer()
  const blurBuf = await base.clone().blur(5).raw().toBuffer()
  const out = new Uint8Array(sharpBuf.length)
  for (let i = 0; i < sharpBuf.length; i++) out[i] = Math.abs(sharpBuf[i] - blurBuf[i])
  return out
}

function median(xs) {
  const s = Array.from(xs).sort((a, b) => a - b)
  return s.length ? s[Math.floor(s.length / 2)] : 0
}

/** Zusammenhaengende Flecken ueber der Schwelle, 4er-Nachbarschaft. */
function blobs(mask, w, h) {
  const seen = new Uint8Array(mask.length)
  const found = []
  const stack = []
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue
    stack.length = 0
    stack.push(start)
    seen[start] = 1
    let minX = w, maxX = 0, minY = h, maxY = 0, n = 0
    while (stack.length) {
      const p = stack.pop()
      const x = p % w, y = (p / w) | 0
      n++
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      if (x > 0 && mask[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack.push(p - 1) }
      if (x < w - 1 && mask[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack.push(p + 1) }
      if (y > 0 && mask[p - w] && !seen[p - w]) { seen[p - w] = 1; stack.push(p - w) }
      if (y < h - 1 && mask[p + w] && !seen[p + w]) { seen[p + w] = 1; stack.push(p + w) }
    }
    found.push({ minX, maxX, minY, maxY, n, cy: (minY + maxY) / 2 })
  }
  return found
}

/**
 * Sucht in einer Ecke eine Signaturzeile. Liefert die Box in Bildkoordinaten
 * oder `null`.
 */
export async function findSignature(buffer, w, h, region) {
  const hp = await highpass(buffer, region)
  const med = median(hp)
  const threshold = Math.max(14, med * 3.5)
  const mask = new Uint8Array(hp.length)
  for (let i = 0; i < hp.length; i++) mask[i] = hp[i] > threshold ? 1 : 0

  // Nur buchstabengrosse Flecken kommen in Frage.
  const letters = blobs(mask, REGION_W, REGION_H)
    .filter(b => b.n >= BLOB_MIN_PX && b.n <= BLOB_MAX_PX)
    .filter(b => (b.maxY - b.minY) <= MAX_BAND_H && (b.maxX - b.minX) <= 60)
  if (letters.length < MIN_BLOBS) return null

  // Die groesste Gruppe, die auf einer gemeinsamen Zeile liegt.
  let best = null
  for (const anchor of letters) {
    const line = letters.filter(b => Math.abs(b.cy - anchor.cy) <= MAX_BAND_H / 2)
    if (line.length < MIN_BLOBS) continue
    const minX = Math.min(...line.map(b => b.minX))
    const maxX = Math.max(...line.map(b => b.maxX))
    const minY = Math.min(...line.map(b => b.minY))
    const maxY = Math.max(...line.map(b => b.maxY))
    const lw = maxX - minX, lh = maxY - minY
    if (lw < MIN_LINE_W || lw > MAX_LINE_W) continue
    if (lh > MAX_BAND_H) continue
    if (lw / Math.max(1, lh) < 2.0) continue // Schrift ist breit, nicht hoch
    const score = line.length
    if (!best || score > best.score) best = { score, minX, maxX, minY, maxY, count: line.length }
  }
  if (!best) return null

  // Die Zeile muss deutlich mehr Struktur tragen als der Streifen darueber und
  // darunter — sonst ist sie Teil eines strukturierten Bildbereichs.
  const inside = energy(hp, REGION_W, best.minX, best.minY, best.maxX, best.maxY)
  const pad = 26
  const above = energy(hp, REGION_W, best.minX, Math.max(0, best.minY - pad), best.maxX, Math.max(1, best.minY - 2))
  const below = energy(hp, REGION_W, best.minX, Math.min(REGION_H - 2, best.maxY + 2), best.maxX, Math.min(REGION_H - 1, best.maxY + pad))
  const around = (above + below) / 2
  if (inside < around * MIN_CONTRAST_RATIO) return null

  return {
    x: region.x + best.minX - 6,
    y: region.y + best.minY - 6,
    w: best.maxX - best.minX + 12,
    h: best.maxY - best.minY + 12,
    corner: region.name,
    blobs: best.count,
    ratio: Number((inside / Math.max(0.01, around)).toFixed(1)),
  }
}

function energy(hp, w, x0, y0, x1, y1) {
  let sum = 0, n = 0
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) { sum += hp[y * w + x]; n++ }
  }
  return n ? sum / n : 0
}

/** Alle vier Ecken durchsuchen. */
export async function findAll(buffer, w, h) {
  const out = []
  for (const region of corners(w, h)) {
    const hit = await findSignature(buffer, w, h, region)
    if (hit) out.push(hit)
  }
  return out
}
