/**
 * Die Stil-Bibel. Gesperrt, bevor ein einziges Bild erzeugt wird.
 *
 * `STYLE_ANCHOR` steht wortgleich am Anfang JEDES Prompts.
 * (`_reference/04-illustration-pipeline.md` § 4, `art-production-plan.md` § 2)
 */

import type { ArtMood } from '../../model/types.ts'

/**
 * Der Stil-Anker. Steht **wortgleich am Anfang** jedes Prompts — vorn, nicht
 * hinten: Diffusionsmodelle gewichten die ersten Tokens am staerksten fuer den
 * Look.
 *
 * Gewaehlt am 31.07.2026 aus fuenf Varianten (Oel, Gouache, Kohle, Matte
 * Painting, Radierung), erzeugt mit identischem Seed auf `flux-2-pro`, damit
 * nur der Stil variiert. Die Belege liegen in `public/illustrations/_style/`.
 *
 * ⚠️ **Keine einzige Verneinung.** FLUX.2 hat keine Negative Prompts, und
 * "no text" erzeugt nachweislich Text — vier von sechs Bildern der Vorstudie
 * trugen erfundene Beschriftungen. Deshalb steht hier positiv, was leer sein
 * soll: `plain unmarked surfaces and bare stone`.
 *
 * Drei Bausteine sind Projektregeln, nicht Geschmack, und bleiben stehen:
 *  - `figures small against architecture and sky` — Stil-Bibel: die Menschen
 *    sind nicht das Groesste im Bild
 *  - `plain unmarked surfaces and bare stone` — gegen Text-Artefakte
 *  - `paint reaching to every edge of the picture` — gegen Signaturen. Die
 *    urspruengliche Fassung sagte `generous empty margin at the frame edge`
 *    und hat damit GENAU das Artefakt erzeugt, gegen das der Anker schuetzen
 *    sollte: Ein leerer Randstreifen sieht aus wie die Stelle, an der ein
 *    Maler signiert, und das Modell hat pflichtschuldig signiert. Gemessen am
 *    31.07.2026 an sieben Bildern; nach dem Austausch in keinem mehr
 *
 * Ihn zu aendern ist eine projektweite Entscheidung mit Neu-Render-Budget,
 * kein stiller Edit.
 */
export const STYLE_ANCHOR =
  'Painted in thick oil on rough canvas, visible brush strokes and ' +
  'palette-knife texture, desaturated and high-contrast, volumetric haze, ' +
  'figures small against architecture and sky, plain unmarked surfaces and ' +
  'bare stone, paint reaching to every edge of the picture.'

/**
 * Anker fuer Referenzbilder: derselbe Malstil, aber ohne die
 * Kompositionsregeln des Szenen-Ankers.
 *
 * `figures small against architecture and sky` ist fuer eine Szene richtig und
 * fuer ein Portraet falsch — es zog im ersten Lauf Mauern in einen
 * Hintergrund, der einfarbig sein sollte.
 */
export const REFERENCE_ANCHOR =
  'Painted in thick oil on rough canvas, visible brush strokes and ' +
  'palette-knife texture, desaturated and high-contrast.'

export type PaletteId = 'ash-rust' | 'blue-fire' | 'moons-spawn' | 'bone-dust' | 'hoods-grey'

export interface Palette {
  id: PaletteId
  /** Von dunkel nach hell. Treibt auch die Platzhalter-Grafik und die Kapitel-Akzente. */
  colours: [string, string, string, string]
  /** Prompt-Fragment, das dem Modell die Palette beschreibt. */
  phrase: string
}

export const PALETTES: Record<PaletteId, Palette> = {
  'ash-rust': {
    id: 'ash-rust',
    colours: ['#2A2622', '#4A3B31', '#8C5A3C', '#C9743A'],
    phrase: 'palette of ash, soot brown and rust orange',
  },
  'blue-fire': {
    id: 'blue-fire',
    colours: ['#0B1622', '#1B3A57', '#2F7FA6', '#7FD4E8'],
    phrase: 'palette of deep night blue lit by pale gaslight cyan',
  },
  'moons-spawn': {
    id: 'moons-spawn',
    colours: ['#12121A', '#2B2A45', '#4C4A78', '#B9B4D6'],
    phrase: 'palette of black violet and cold silver-lilac',
  },
  'bone-dust': {
    id: 'bone-dust',
    colours: ['#3A362E', '#7A7160', '#B8AC93', '#E4DCC6'],
    phrase: 'palette of bone, dust and dry grass',
  },
  'hoods-grey': {
    id: 'hoods-grey',
    colours: ['#191B1D', '#3C4245', '#6E7679', '#9BA2A4'],
    phrase: 'palette of flat grey, no warmth at all',
  },
}

/** Licht- und Kompositionsfragment je Stimmung. */
export const MOOD_PHRASE: Record<ArtMood, string> = {
  siege: 'siege light, smoke columns, distant fire glow, figures small against ruined walls',
  'street-night': 'narrow lamplit street at night, wet stone, long shadows',
  warren: 'impossible geometry, light from the wrong direction, air like standing water',
  dream: 'soft edges, dissolving horizon, objects half-remembered',
  council: 'candlelit interior, heavy furniture, faces turned away from the light',
  march: 'wide plain under an enormous sky, a column of figures reduced to specks',
  ruin: 'collapsed stone, grass growing through, weather doing the work of centuries',
  duel: 'two figures, cleared ground, hard rim light, everything else out of focus',
  divine: 'scale wrong on purpose, a presence too large for the frame, light with no source',
  aftermath: 'flat grey daylight, still bodies, someone kneeling, nothing being said',
}

/**
 * Charakterblaetter. Werden WORTWOERTLICH in jeden Prompt kopiert, in dem die
 * Figur vorkommt — nie aus dem Gedaechtnis neu beschrieben. Das ist der einzige
 * Grund, warum 400 Bilder dieselbe Person zeigen koennen.
 */
export const CHARACTER_SHEETS: Record<string, string> = {
  paranChild:
    'a twelve-year-old noble boy, dark hair cut short, fine but travel-worn tunic, ' +
    'thin shoulders, standing very straight because he has decided to',
  // "scarred" und "burn scar" haben die Content-Moderation ausgeloest
  // (Violence, 31.07.2026). Dieselbe Figur, ohne die Reizwoerter: eine alte,
  // laengst verheilte Stelle ist genauso sichtbar und beschreibt keine Tat.
  bridgeburner:
    'a weathered human soldier in plain dark-grey Malazan leather and mail, no insignia, ' +
    'grey-shot beard, an old healed mark along one side of the jaw, helmet under the arm',
  whiskeyjack:
    'a grey-bearded human man in his fifties, cropped grey hair, weathered face, hands marked by work, ' +
    'plain dark-grey Malazan leather and mail, no insignia, longsword at the hip, ' +
    'stands like someone who has been standing a long time',
  quickben:
    'a lean dark-skinned human mage in his thirties, close-cropped hair, ' +
    'layered travel-worn robes over soldier leathers, quick amused eyes, empty hands',
  kalam:
    'an enormous calm dark-skinned human man, shaved head, plain leathers, ' +
    'two long knives crossed at the small of his back',
  fiddler:
    'a wiry ginger-bearded human sapper, mud-coloured surcoat, crossbow slung, ' +
    'a battered fiddle case strapped over the pack',
  tattersail:
    'a heavyset middle-aged human sorceress, red hair coiled up, ' +
    'faded military robes over a cadre uniform, a wooden card case in one hand',
  lorn:
    'a composed human woman in black imperial leathers, hair bound tight, ' +
    'a plain rust-red sword sheathed at her side, no ornament of any kind',
  kruppe:
    'a small round man in an ochre waistcoat too tight for him, ' +
    'greasy hair, delighted expression, sleeves that could hide anything',
  crokus:
    'a teenage human thief, dark curls, patched dark clothes, soft boots, ' +
    'a coil of thin rope at the belt',
  rake:
    'an extremely tall figure, black skin, long silver-white hair, ' +
    'a plain black chain shirt, a two-handed sword on his back that the eye slides off',
  tool:
    'an undead warrior of dust and bone in cured hide, a flint sword, ' +
    'the skull of a great cat worn as a helm, nothing alive about him',
}

/** Wiederkehrende Orte — dieselbe Regel wie bei den Figuren. */
export const PLACE_SHEETS: Record<string, string> = {
  malazCity:
    'a crowded coastal imperial city of black stone and tile roofs climbing from a harbour, ' +
    'a round fortress on an island offshore',
  moonsSpawn:
    'a mountain of dark basalt floating in the sky, upside-down peak, ' +
    'lightless windows cut into its flanks, rain falling off its underside',
  phoenixInn:
    'a low smoky tavern room, blue gaslight through thick glass, ' +
    'long scarred tables, a stair to a back room',
  darujhistan:
    'a city of domes and copper roofs on hills above a lake, ' +
    'streets lit blue by gas lamps on iron posts',
  barrow:
    'a low grass-covered mound on a dry plain, standing stones half fallen, ' +
    'the grass around it dead in a perfect circle',
}
