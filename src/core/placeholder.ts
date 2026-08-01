/**
 * Deterministische Platzhalter-Illustration. Dieselbe Seiten-ID ergibt IMMER
 * dasselbe Bild — kein Zufall, keine Uhr, kein DOM. Damit ist ein unfertiges
 * Kapitel vorzeigbar statt kaputt, und Kunst blockiert nie das Schreiben.
 *
 * Erzeugt reines SVG-Markup als Zeichenkette. Der View steckt es in ein
 * `data:`-URI oder direkt ins Dokument; der Bild-Prozess kann dasselbe SVG
 * rastern, ohne den Browser zu brauchen.
 */

import type { ArtMood } from '../model/types.ts'
import { PALETTES, type PaletteId } from '../content/art/style.ts'
import { seedFrom, roll01 } from './rng.ts'

/** Ein Haus-Sigill aus dem Deck, als Pfad in einer 100x100-Box. */
const SIGILS: Record<string, string> = {
  // Leben: ein Halm, der sich biegt
  life: 'M50 88 C50 60 38 50 38 32 C38 18 50 12 50 12 C50 12 62 18 62 32 C62 50 50 60 50 88 Z',
  // Tod: ein Torbogen
  death: 'M26 88 L26 42 A24 24 0 0 1 74 42 L74 88 L60 88 L60 44 A10 10 0 0 0 40 44 L40 88 Z',
  // Licht: ein Stern mit ungleichen Strahlen
  light: 'M50 8 L57 40 L90 50 L57 60 L50 92 L43 60 L10 50 L43 40 Z',
  // Dunkelheit: ein Kreis, aus dem etwas fehlt
  dark: 'M50 10 A40 40 0 1 0 50 90 A26 26 0 1 1 50 10 Z',
  // Schatten: zwei versetzte Halbmonde
  shadow: 'M36 12 A38 38 0 1 0 36 88 A30 30 0 1 1 36 12 Z M64 24 A28 28 0 1 1 64 76 A22 22 0 1 0 64 24 Z',
  // Unaligned: die Muenze
  unaligned: 'M50 10 A40 40 0 1 1 49.9 10 Z M50 26 A24 24 0 1 0 50.1 26 Z',
}

const SIGIL_ORDER = ['life', 'death', 'light', 'dark', 'shadow', 'unaligned']

/** Formmotiv je Stimmung — der zweite Blick, der einen Platzhalter absichtlich wirken laesst. */
const MOTIF: Record<ArtMood, 'columns' | 'rain' | 'rings' | 'haze' | 'arc' | 'horizon' | 'shards' | 'cross' | 'burst' | 'stones' | 'beams'> = {
  siege: 'columns',
  'close-quarters': 'beams',
  'street-night': 'rain',
  warren: 'rings',
  dream: 'haze',
  council: 'arc',
  march: 'horizon',
  ruin: 'stones',
  duel: 'cross',
  divine: 'burst',
  aftermath: 'shards',
}

export interface PlaceholderInput {
  /** Seiten-ID — bestimmt alles Zufaellige. */
  id: string
  mood: ArtMood
  palette: PaletteId
  width?: number
  height?: number
}

export function placeholderSvg({ id, mood, palette, width = 1280, height = 720 }: PlaceholderInput): string {
  const seed = seedFrom(id)
  const p = PALETTES[palette].colours
  const r = (i: number) => roll01(seed, i)
  const sigil = SIGILS[SIGIL_ORDER[Math.floor(r(1) * SIGIL_ORDER.length)]]
  const motif = MOTIF[mood]
  const gradAngle = 90 + Math.round(r(2) * 60 - 30)
  const uid = seed.toString(36)

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">`,
    '<defs>',
    `<linearGradient id="g${uid}" gradientTransform="rotate(${gradAngle} .5 .5)">`,
    `<stop offset="0" stop-color="${p[0]}"/><stop offset=".55" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/>`,
    '</linearGradient>',
    `<radialGradient id="v${uid}" cx=".5" cy=".45" r=".75">`,
    `<stop offset=".4" stop-color="${p[3]}" stop-opacity=".18"/><stop offset="1" stop-color="${p[0]}" stop-opacity=".9"/>`,
    '</radialGradient>',
    `<filter id="n${uid}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed % 9999}"/>`,
    '<feColorMatrix type="saturate" values="0"/></filter>',
    '</defs>',
    `<rect width="${width}" height="${height}" fill="url(#g${uid})"/>`,
    motifMarkup(motif, width, height, p, r),
    `<rect width="${width}" height="${height}" fill="url(#v${uid})"/>`,
    `<g opacity=".28" transform="translate(${width / 2 - 90} ${height / 2 - 90}) scale(1.8)">`,
    `<path d="${sigil}" fill="${p[3]}" opacity=".55"/></g>`,
    `<rect width="${width}" height="${height}" filter="url(#n${uid})" opacity=".07"/>`,
    '</svg>',
  ].join('')
}

function motifMarkup(
  motif: string, w: number, h: number, p: readonly string[], r: (i: number) => number,
): string {
  const c = p[3]
  const out: string[] = []
  switch (motif) {
    case 'columns':
      for (let i = 0; i < 7; i++) {
        const x = (w / 8) * (i + 1) + (r(10 + i) - 0.5) * 40
        const top = h * (0.25 + r(20 + i) * 0.3)
        out.push(`<rect x="${x.toFixed(0)}" y="${top.toFixed(0)}" width="${(18 + r(30 + i) * 26).toFixed(0)}" height="${(h - top).toFixed(0)}" fill="${p[0]}" opacity=".5"/>`)
      }
      break
    case 'rain':
      for (let i = 0; i < 60; i++) {
        const x = r(10 + i) * w
        const y = r(80 + i) * h
        out.push(`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - 6).toFixed(0)}" y2="${(y + 26).toFixed(0)}" stroke="${c}" stroke-opacity=".18" stroke-width="2"/>`)
      }
      break
    case 'rings':
      for (let i = 1; i <= 6; i++) {
        out.push(`<circle cx="${(w * 0.5).toFixed(0)}" cy="${(h * 0.5).toFixed(0)}" r="${(i * h * 0.09).toFixed(0)}" fill="none" stroke="${c}" stroke-opacity="${(0.22 - i * 0.03).toFixed(2)}" stroke-width="3"/>`)
      }
      break
    case 'haze':
      for (let i = 0; i < 5; i++) {
        out.push(`<ellipse cx="${(r(10 + i) * w).toFixed(0)}" cy="${(r(40 + i) * h).toFixed(0)}" rx="${(w * 0.3).toFixed(0)}" ry="${(h * 0.12).toFixed(0)}" fill="${p[2]}" opacity=".10"/>`)
      }
      break
    case 'arc':
      out.push(`<path d="M0 ${(h * 0.72).toFixed(0)} Q ${(w / 2).toFixed(0)} ${(h * 0.42).toFixed(0)} ${w} ${(h * 0.72).toFixed(0)}" fill="none" stroke="${c}" stroke-opacity=".2" stroke-width="6"/>`)
      break
    case 'horizon':
      out.push(`<rect y="${(h * 0.68).toFixed(0)}" width="${w}" height="${(h * 0.32).toFixed(0)}" fill="${p[0]}" opacity=".55"/>`)
      for (let i = 0; i < 24; i++) {
        out.push(`<rect x="${(r(10 + i) * w).toFixed(0)}" y="${(h * 0.66 + r(60 + i) * 10).toFixed(0)}" width="4" height="10" fill="${p[3]}" opacity=".25"/>`)
      }
      break
    case 'stones':
      for (let i = 0; i < 9; i++) {
        const x = r(10 + i) * w
        out.push(`<rect x="${x.toFixed(0)}" y="${(h * 0.55 + r(50 + i) * h * 0.25).toFixed(0)}" width="${(30 + r(70 + i) * 40).toFixed(0)}" height="${(20 + r(90 + i) * 60).toFixed(0)}" fill="${p[0]}" opacity=".45" transform="rotate(${(r(30 + i) * 16 - 8).toFixed(1)} ${x.toFixed(0)} ${h.toFixed(0)})"/>`)
      }
      break
    case 'cross':
      out.push(`<line x1="${(w * 0.3).toFixed(0)}" y1="${(h * 0.2).toFixed(0)}" x2="${(w * 0.7).toFixed(0)}" y2="${(h * 0.85).toFixed(0)}" stroke="${c}" stroke-opacity=".25" stroke-width="5"/>`)
      out.push(`<line x1="${(w * 0.72).toFixed(0)}" y1="${(h * 0.18).toFixed(0)}" x2="${(w * 0.32).toFixed(0)}" y2="${(h * 0.88).toFixed(0)}" stroke="${c}" stroke-opacity=".18" stroke-width="4"/>`)
      break
    case 'burst':
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2
        out.push(`<line x1="${(w / 2).toFixed(0)}" y1="${(h / 2).toFixed(0)}" x2="${(w / 2 + Math.cos(a) * w).toFixed(0)}" y2="${(h / 2 + Math.sin(a) * w).toFixed(0)}" stroke="${c}" stroke-opacity=".08" stroke-width="10"/>`)
      }
      break
    case 'shards':
      for (let i = 0; i < 12; i++) {
        const x = r(10 + i) * w, y = h * 0.6 + r(50 + i) * h * 0.35
        out.push(`<polygon points="${x.toFixed(0)},${y.toFixed(0)} ${(x + 40).toFixed(0)},${(y + 8).toFixed(0)} ${(x + 14).toFixed(0)},${(y + 20).toFixed(0)}" fill="${p[0]}" opacity=".5"/>`)
      }
      break
  }
  return out.join('')
}

/** Fertiges `data:`-URI fuer ein `src`-Attribut. */
export function placeholderDataUri(input: PlaceholderInput): string {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(placeholderSvg(input))
}

/**
 * Pfade zur ausgelieferten Illustration einer Seite.
 *
 * Rein und testbar, weil der Rest der Bildlogik in der View sitzt und dort
 * nicht geprueft werden kann. `base` kommt aus `import.meta.env.BASE_URL` und
 * ist auf GitHub Pages ein Unterpfad (`/malazan-cyoa/`) — ein hartkodierter
 * absoluter Pfad waere dort tot.
 *
 * Die 640er-Variante erzeugt `tools/art-post.mjs` mit; ohne `srcset` waere sie
 * umsonst gebaut worden.
 */
export function illustration(pageId: string, base: string): { src: string; srcset: string } {
  const dir = `${base.endsWith('/') ? base : base + '/'}illustrations`
  return {
    src: `${dir}/${pageId}.webp`,
    srcset: `${dir}/${pageId}@640.webp 640w, ${dir}/${pageId}.webp 1280w`,
  }
}
