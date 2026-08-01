import type { ArtPrompt } from '../types.ts'

const C = 'b1.c00'

export const art00: ArtPrompt[] = [
  {
    id: `${C}.s01.p01`,
    subject: 'a boy alone on the parapet of a black stone fortress, looking down at a burning quarter of the city below',
    characters: ['paranChild'],
    place: 'malazCity',
    detail: 'three separate fires in one district, the rest of the city untouched and going about its evening',
    mood: 'siege', palette: 'ash-rust', tier: 'hero',
  },
  {
    id: `${C}.s01.p02`,
    subject: 'soldiers standing along a fortress wall watching a fire they have been told not to interfere with',
    characters: ['bridgeburner'],
    detail: 'helmets under arms, no weapons drawn, one man apart from the others',
    mood: 'siege', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s01.p03`,
    subject: 'a stairway cut into rock leading down from a fortress gate toward smoke',
    detail: 'the lower steps already lost in haze, a single lantern on a hook',
    mood: 'siege', palette: 'ash-rust', tier: 'standard',
  },

  {
    id: `${C}.s02.p01`,
    subject: 'a scarred soldier crouched to speak to a boy at eye level on a windy wall',
    characters: ['bridgeburner', 'paranChild'],
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s02.p02`,
    subject: 'a soldier and a boy sitting on a parapet with their backs to a burning city',
    characters: ['bridgeburner', 'paranChild'],
    detail: 'the fire only as light on their faces, the city itself out of frame',
    mood: 'aftermath', palette: 'ash-rust', tier: 'hero',
  },
  {
    id: `${C}.s02.p03`,
    subject: 'a soldier walking away along a wall, a boy left standing where he was',
    characters: ['bridgeburner', 'paranChild'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  {
    id: `${C}.s03.p01`,
    // Ohne `place`: Das Ortsblatt beschreibt die Stadt VON AUSSEN ("climbing
    // from a harbour, a round fortress on an island offshore") und erzwingt
    // damit eine Totale. Hier steht man mitten drin, zwischen zwei Wänden.
    // Ortsblaetter gehoeren an Establishing Shots, nicht an Naheinstellungen.
    subject: 'a very narrow stepped alley between tall windowless walls, seen from inside it at eye level, '
      + 'the steps dropping steeply away into thick smoke, every shutter closed and barred, barely any sky',
    detail: 'the walls close enough on both sides to touch, one lantern out of reach above',
    mood: 'siege', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s03.p02`,
    subject: 'figures in dark clothing moving through smoke with unhurried purpose, seen from behind a low wall',
    detail: 'no faces visible, no weapons visible, a door standing open behind them',
    mood: 'siege', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s03.p03`,
    subject: 'a woman carrying a small child crouched in a doorway while ash falls',
    mood: 'siege', palette: 'ash-rust', tier: 'standard',
  },

  {
    id: `${C}.s04.p01`,
    subject: 'a wide view of a coastal city at dusk with fires laid out in a deliberate line',
    place: 'malazCity',
    detail: 'the pattern only readable from above, boats leaving the harbour on the far side',
    mood: 'siege', palette: 'ash-rust', tier: 'hero',
  },
  {
    id: `${C}.s04.p02`,
    subject: 'a boy counting fires on his fingers against a railing',
    characters: ['paranChild'],
    mood: 'siege', palette: 'ash-rust', tier: 'filler',
  },
  {
    id: `${C}.s04.p03`,
    subject: 'smoke rising into a sky where something enormous and unlit seems to be paying attention',
    // Das Bild dazu ist gut geworden, obwohl hier eine Aufzaehlung verneinter
    // Requisiten stand ('no creature, no face'). Das war Glueck: Genau diese
    // Form liest das Modell als Einkaufsliste. Positiv gesagt trifft es die
    // Szene ohnehin besser — es soll ja NICHTS zu erkennen sein.
    detail: 'unbroken cloud and smoke where the mass of it would be, the wrongness of the scale the only '
      + 'definite thing in the picture',
    mood: 'divine', palette: 'moons-spawn', tier: 'hero',
  },

  {
    id: `${C}.s06.p01`,
    subject: 'a boy leading a woman and a child along a back alley away from smoke',
    characters: ['paranChild'],
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s06.p02`,
    subject: 'a stone cistern in a small courtyard, water black and still, ash floating on it',
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s06.p03`,
    subject: 'a woman looking at a boy without gratitude, already turning away',
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  {
    id: `${C}.s07.p01`,
    subject: 'an empty doorway with a cloth left on the step, smoke thicker than before',
    mood: 'siege', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s07.p02`,
    subject: 'a hand in a dark glove resting on a boy shoulder from behind',
    characters: ['paranChild'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s07.p03`,
    subject: 'a boy being walked back up a long stair by a servant, the city burning behind them',
    characters: ['paranChild'],
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s07.p04`,
    subject: 'a shuttered window from the inside, orange light in the cracks, a boy sitting against the wall below it',
    characters: ['paranChild'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  {
    id: `${C}.s05.p01`,
    subject: 'a bare stone battlement terrace at night above a burning city, one woman in plain undyed clothing standing alone '
      + 'at the parapet with her back turned, and a tight knot of court officials keeping their distance behind her',
    station: ['imperialCourt'],
    detail: 'bare flagstones and open night air, every heavy-coated figure watching the plain woman, '
      + 'and she is watching the fires below',
    mood: 'council', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s05.p02`,
    // Zwei Fassungen sind hier bezahlt worden, beide aus Formulierungsfehlern:
    //
    // 1. "wearing nothing at all" war als "traegt keinen Schmuck" gemeint und
    //    wurde als `Request Moderated` abgelehnt — im selben Prompt steht ein
    //    zwoelfjaehriger Junge. Was fuer einen Leser eindeutig ist, ist es fuer
    //    einen Klassifizierer nicht.
    // 2. "a woman ... looks at a boy" plus das Blatt `paranChild` ergab EINE
    //    Figur: Die Frau fehlte, der Junge trug ihr Kleid. Ein Blatt haengt als
    //    eigener Satz hinten dran und traegt keine Zuordnung — bei zwei Figuren
    //    muss der Satz selbst sagen, wie viele Personen im Bild stehen und
    //    woran man sie auseinanderhaelt.
    subject: 'two people stand facing each other on a bare stone terrace at night, several paces apart: '
      + 'a grown woman in plain undyed floor-length clothing with her back to the parapet, looking down at the second person, '
      + 'and a twelve-year-old boy in a short belted tunic and breeches, looking up at her',
    characters: ['paranChild'],
    station: ['imperialCourt'],
    detail: 'further back the court officials stand in a close group, every one of them looking away; '
      + 'the woman and the boy are the two plainest figures in the frame',
    mood: 'council', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s05.p03`,
    subject: 'an empty throne room with the doors open onto smoke',
    mood: 'council', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s05.p04`,
    subject: 'the morning after a fire, white smoke lying flat over harbour water, people hauling beams and stacking tiles',
    place: 'malazCity',
    mood: 'aftermath', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s05.p05`,
    subject: 'a fortress wall by daylight with an unfamiliar watch on it, a boy walking the parapet',
    characters: ['paranChild'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'filler',
  },
  {
    id: `${C}.s05.p06`,
    subject: 'a troop transport under sail leaving a harbour at dawn, seen from the stern',
    detail: 'the island fortress shrinking behind, a line of recruits along the rail',
    mood: 'march', palette: 'blue-fire', tier: 'hero',
  },
]

art00.push({
  id: 'b1.wip',
  subject: 'a small round man laying playing cards on a stained tavern table, one place in the layout still empty',
  characters: ['kruppe'],
  place: 'phoenixInn',
  mood: 'dream', palette: 'blue-fire', tier: 'standard',
})
