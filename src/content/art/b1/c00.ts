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
    subject: 'a narrow stepped street descending into smoke, shutters closed on every window',
    place: 'malazCity',
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
    detail: 'no creature, no face, only the sense of scale being wrong',
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
    subject: 'a terrace of a fortress at night, a small group of officials standing apart from one woman',
    detail: 'the woman plainly dressed, everyone else in ornament, the distance between them the whole point',
    mood: 'council', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s05.p02`,
    subject: 'a plainly dressed woman at a terrace railing turning to look at a boy who does not belong there',
    characters: ['paranChild'],
    detail: 'ornamented officials behind her, all of them looking somewhere else',
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
  id: 'b1.c00.s99.p01',
  subject: 'a small round man laying playing cards on a stained tavern table, one place in the layout still empty',
  characters: ['kruppe'],
  place: 'phoenixInn',
  mood: 'dream', palette: 'blue-fire', tier: 'standard',
})
