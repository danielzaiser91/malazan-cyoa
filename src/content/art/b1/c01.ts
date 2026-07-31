import type { ArtPrompt } from '../types.ts'

const C = 'b1.c01'

export const art01: ArtPrompt[] = [
  // ------------------------------------------------------------------- 1.1
  {
    id: `${C}.s01.p01`,
    subject: 'a recruiting table under an awning in a dusty coastal town square, a queue of ordinary people waiting to sign',
    detail: 'a clerk with a ledger, a bored sergeant, farm tools leaned against a wall, the sea a grey line beyond the roofs',
    mood: 'march', palette: 'bone-dust', tier: 'hero',
  },
  {
    id: `${C}.s01.p02`,
    subject: 'a sergeant looking up from a ledger at someone who has just given their name',
    detail: 'ink-stained fingers, a stack of imperial silver, a wax seal half pressed',
    mood: 'march', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s01.p03`,
    subject: 'a young woman standing perfectly still in a moving queue, everyone else shifting their weight, she does not',
    detail: 'plain fisher clothes, no bundle, no belongings at all, eyes on nothing',
    mood: 'march', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------ 1.1a
  {
    id: `${C}.s03.p01`,
    subject: 'a low quayside tavern at night, lamplight on wet stone, fishing boats knocking against the pier outside',
    mood: 'street-night', palette: 'blue-fire', tier: 'standard',
  },
  {
    id: `${C}.s03.p02`,
    subject: 'a plains trader laying painted cards face up on a barrel top for a small silent audience',
    detail: 'a bhederin-hide coat, braided hair, cards with hard-edged figures on them',
    mood: 'street-night', palette: 'blue-fire', tier: 'hero',
  },
  {
    id: `${C}.s03.p03`,
    subject: 'a two-faced coin lying on wet wood, both faces somehow visible at once',
    mood: 'street-night', palette: 'blue-fire', tier: 'standard',
  },

  // ------------------------------------------------------------------ 1.1b
  {
    id: `${C}.s04.p01`,
    subject: 'a recruit sitting down beside a silent young woman on a barracks bench, a hand-span of empty bench between them',
    mood: 'march', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s04.p02`,
    subject: 'a young woman looking directly at the viewer with no expression whatsoever, out of focus behind her a busy yard',
    detail: 'the stillness is the subject, nothing else in the frame moves either',
    mood: 'march', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s04.p03`,
    subject: 'two figures walking away from each other across a parade ground at dusk',
    mood: 'march', palette: 'hoods-grey', tier: 'filler',
  },

  // ------------------------------------------------------------------- 1.2
  {
    id: `${C}.s02.p01`,
    subject: 'a column of new recruits marching along a coastal road above cliffs, sea on one side, dry hills on the other',
    detail: 'ill-fitting kit, blisters, a supply cart, nobody talking',
    mood: 'march', palette: 'bone-dust', tier: 'hero',
  },
  {
    id: `${C}.s02.p02`,
    subject: 'the aftermath of a cavalry troop destroyed on an open road, horses and riders scattered, no enemy dead at all',
    detail: 'the ground churned in wide arcs, gear untouched, nothing looted',
    mood: 'aftermath', palette: 'ash-rust', tier: 'hero',
  },
  {
    id: `${C}.s02.p03`,
    subject: 'a single enormous paw print pressed into dry roadside earth, a helmet beside it for scale',
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s02.p04`,
    subject: 'officers standing apart from a halted column, talking too quietly to be heard',
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------ 1.2a
  {
    id: `${C}.s06.p01`,
    subject: 'recruits moving through a field of dead cavalry, lifting cloaks, checking, moving on',
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s06.p02`,
    subject: 'a wounded horse lying on its side in dust, a soldier kneeling at its head',
    mood: 'aftermath', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s06.p03`,
    subject: 'someone sitting in the dirt beside a body, doing nothing, waiting',
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------ 1.2b
  {
    id: `${C}.s08.p01`,
    subject: 'a broad trail of crushed dune grass leading inland away from a road, too wide for any animal',
    mood: 'aftermath', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s08.p02`,
    subject: 'a hollow between dunes where the light arrives from the wrong direction',
    detail: 'shadows pointing inward, the air standing still, no wind although the grass moves',
    mood: 'divine', palette: 'moons-spawn', tier: 'hero',
  },
  {
    id: `${C}.s08.p03`,
    subject: 'two indistinct figures standing on a dune ridge against a sky that is the wrong colour',
    detail: 'one leaning on a cane, one still; neither of them fully there',
    mood: 'divine', palette: 'moons-spawn', tier: 'standard',
  },
  {
    id: `${C}.s08.p04`,
    subject: 'an enormous hound seen from below, only shoulder and jaw in frame, the rest out of shot',
    detail: 'no gore, no snarl, just size and calm',
    mood: 'divine', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s08.p05`,
    subject: 'empty dune grass closing over a place where something was standing',
    mood: 'divine', palette: 'hoods-grey', tier: 'filler',
  },

  // ------------------------------------------------------------------- 1.3
  {
    id: `${C}.s07.p01`,
    subject: 'a composed woman in black imperial leathers walking a killing ground, cataloguing rather than mourning',
    characters: ['lorn'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s07.p02`,
    subject: 'a woman in black leathers and a young officer standing over the same body, looking at different things',
    characters: ['lorn'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s07.p03`,
    subject: 'a rust-red sword drawn a hand-span from its sheath, the air around the blade visibly duller',
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s07.p04`,
    subject: 'a woman standing alone on a cliff road at dusk with her back to the sea',
    characters: ['lorn'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------- 1.4
  {
    id: `${C}.s09.p01`,
    subject: 'a crowded imperial quay at dawn, transports loading, ranks of recruits waiting with their kit on the stone',
    detail: 'quartermasters shouting, gulls, a long grey swell beyond the harbour mouth',
    mood: 'march', palette: 'blue-fire', tier: 'hero',
  },
  {
    id: `${C}.s09.p02`,
    subject: 'a crowded troop deck below the waterline, hammocks slung too close together',
    mood: 'march', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s09.p03`,
    subject: 'recruits at a ship rail watching a coastline become a line and then nothing',
    mood: 'march', palette: 'blue-fire', tier: 'standard',
  },
  {
    id: `${C}.s09.p04`,
    subject: 'a hand closing around a worn metal token at a ship rail',
    mood: 'march', palette: 'bone-dust', tier: 'filler',
  },
  {
    id: `${C}.s09.p05`,
    subject: 'open ocean at night from a transport deck, no land in any direction, a lamp swinging',
    mood: 'march', palette: 'blue-fire', tier: 'hero',
  },
]
