import type { ArtPrompt } from '../types.ts'

const C = 'b1.c01'

export const art01: ArtPrompt[] = [
  // ------------------------------------------------------------------- 1.1
  {
    id: `${C}.s01.p01`,
    // Ohne `station`: Das Blatt haengt seine Ausruestung an JEDE Figur im Bild,
    // und dann wartet eine Schlange aus Bewaffneten darauf, sich zu melden.
    // Der eine Soldat gehoert ins Motiv, die Abgrenzung ausgeschrieben.
    subject: 'a trestle table under a canvas awning in a dusty coastal town square, a long queue of fishers and '
      + 'farm folk barefoot and in undyed wool, waiting to put a mark on a list',
    detail: 'a clerk with a bound ledger and a reed pen, and beside him the only armoured man in the square, '
      + 'in a short mail shirt with a round shield at his feet; nets and farm tools leaned against a stone wall, '
      + 'the sea a grey line beyond the tile roofs',
    mood: 'march', palette: 'bone-dust', tier: 'hero',
  },
  {
    id: `${C}.s01.p02`,
    subject: 'a soldier looking up from a bound ledger on a trestle table at someone who has just given their name',
    station: ['imperialRanks'],
    detail: 'ink-stained fingers, a small stack of imperial silver coin, a wax seal half pressed',
    mood: 'march', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s01.p03`,
    subject: 'a young woman standing perfectly still in a moving queue of barefoot fishers and farm folk in undyed wool, '
      + 'everyone else shifting their weight, she does not',
    detail: 'plain undyed fisher clothes, empty hands, eyes fixed on the middle distance; '
      + 'a single armoured soldier far off at the head of the queue',
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
    subject: 'a young soldier sitting down beside a silent young woman on a rough timber bench outside a low barrack hall '
      + 'of stone and thatch, a hand-span of empty bench between them',
    station: ['imperialRanks'],
    mood: 'march', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s04.p02`,
    subject: 'a young woman looking directly at the viewer with an absolutely level gaze, '
      + 'out of focus behind her a drill yard of packed earth',
    detail: 'the stillness is the subject; everything around her is held just as still',
    mood: 'march', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s04.p03`,
    subject: 'two figures walking away from each other across a drill yard of packed earth at dusk, '
      + 'timber barrack halls on either side',
    mood: 'march', palette: 'hoods-grey', tier: 'filler',
  },

  // ------------------------------------------------------------------- 1.2
  {
    id: `${C}.s02.p01`,
    subject: 'a column of new soldiers marching along a packed earth track above sea cliffs, water on one side, '
      + 'dry hills on the other',
    station: ['imperialRanks'],
    detail: 'blisters, a mule-drawn cart of provisions, the whole column silent',
    mood: 'march', palette: 'bone-dust', tier: 'hero',
  },
  {
    id: `${C}.s02.p02`,
    // "no enemy dead at all" war der Kern der Szene und zugleich eine
    // Verneinung. Positiv gesagt trifft es sogar besser: alle tragen dieselben
    // Farben — dann ist offensichtlich, dass hier nur eine Seite liegt.
    subject: 'an empty stretch of packed earth track at first light, the surface torn up in wide sweeping arcs, '
      + 'a riderless horse standing at the edge of it with its head down',
    detail: 'saddles, spears and shields scattered across the ground and left exactly where they came to rest, '
      + 'a single boot upright in the dirt, and the whole place absolutely quiet',
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
    station: ['imperialCommand'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------ 1.2a
  {
    id: `${C}.s06.p01`,
    subject: 'young soldiers walking a wide field in grey morning light, stopping at each shape on the ground '
      + 'to lift a cloak, look, and move on',
    station: ['imperialRanks'],
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s06.p02`,
    // Einziger `Content Moderated`-Fall des Blocks: geprueft wurde das fertige
    // BILD, nicht der Text. "wounded horse" plus knieender Soldat ergibt einen
    // Gnadenstoss — den zeigt die Szene gar nicht. Sie bleibt eine gute halbe
    // Stunde bei dem Tier und redet mit ihm. Genau das steht jetzt da.
    subject: 'a soldier sitting in the dust with his back to us, one arm around the neck of a horse that has its head '
      + 'in his lap, the two of them alone in a wide empty field',
    station: ['imperialRanks'],
    mood: 'aftermath', palette: 'bone-dust', tier: 'standard',
  },
  {
    id: `${C}.s06.p03`,
    subject: 'a young soldier sitting in the dirt beside a cloak-covered shape, hands loose in the lap, '
      + 'eyes on the horizon',
    station: ['imperialRanks'],
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
    // Der Hund ist ein Schattenhund und soll gewaltig sein — die Spur davor
    // ist "breit genug, dass man ihr wie einem Weg folgen konnte", und das
    // Geraeusch dahinter "kein Schritt, sondern ein Gewicht". Aber die Szene
    // arbeitet durchweg mit dem, was NICHT zu sehen ist, und der Alt-Text sagt
    // in beiden Sprachen woertlich "nur Schulter und Kiefer im Bild". Bild und
    // Alt-Text muessen zusammenpassen, sonst luegt die Bildbeschreibung.
    //
    // Der erste Versuch zeigte das ganze Tier ueber einer Mauer. Zwei Ursachen,
    // beide im Zuschnitt: `tier: 'hero'` bedeutet "wide establishing shot" und
    // arbeitet gegen jede Naheinstellung, und `architecture` im Stil-Anker hat
    // die Mauer geliefert, die im Motiv gar nicht steht. Deshalb `standard`
    // und ein Massstab, den das Modell im Bild selbst hat.
    subject: 'a view from ground level of one shoulder and one closed jaw of a hound so large that only those two '
      + 'parts of it fit inside the picture, its eye somewhere above the upper edge, dune grass along the bottom '
      + 'of the frame for scale',
    detail: 'coarse wet fur, the animal entirely calm and in no hurry, the sand under it pressed flat and wide',
    mood: 'divine', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s08.p05`,
    subject: 'empty dune grass closing over a place where something was standing',
    mood: 'divine', palette: 'hoods-grey', tier: 'filler',
  },

  // ------------------------------------------------------------------- 1.3
  {
    id: `${C}.s07.p01`,
    subject: 'a composed woman in black imperial leathers crouched down on open ground with one gloved hand flat '
      + 'in the churned earth, reading the marks in it like a page, the field around her out of focus and almost empty',
    characters: ['lorn'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'hero',
  },
  {
    id: `${C}.s07.p02`,
    // Zwei Figuren, nur eine mit Blatt: dieselbe Konstruktion hat in
    // `b1.c00.s05.p02` die zweite Person verschluckt. Deshalb hier die Anzahl
    // vorweg und je ein eindeutiges Merkmal.
    subject: 'two people stand over the same fallen rider, one on each side, looking at different things: '
      + 'a woman in black leathers, and a much younger officer a head taller than her',
    characters: ['lorn'],
    station: ['imperialCommand'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s07.p03`,
    subject: 'a rust-red sword drawn a hand-span from its sheath, the air around the blade visibly duller',
    mood: 'aftermath', palette: 'ash-rust', tier: 'standard',
  },
  {
    id: `${C}.s07.p04`,
    subject: 'a woman standing alone at dusk on a cliff track of packed earth and cut stone, her back to the sea',
    characters: ['lorn'],
    mood: 'aftermath', palette: 'hoods-grey', tier: 'standard',
  },

  // ------------------------------------------------------------------- 1.4
  {
    id: `${C}.s09.p01`,
    subject: 'a crowded imperial quay at dawn, wide-bellied sailing transports taking on stores, '
      + 'ranks of soldiers waiting on the stone with their packs at their feet',
    station: ['imperialRanks'],
    detail: 'gulls, rope and barrels, a long grey swell beyond the harbour mouth',
    mood: 'march', palette: 'blue-fire', tier: 'hero',
  },
  {
    id: `${C}.s09.p02`,
    // `march` brachte Tageslicht mit und machte aus dem Deck unter der
    // Wasserlinie eine Hafenszene im Freien. Der Text ist eindeutig: niedriger
    // als man einen Raum bauen sollte, ein Balken auf Stirnhoehe, zweihundert
    // Leute, Teer und Salz. Dafuer gab es keine passende Stimmung — jetzt gibt
    // es `close-quarters`.
    subject: 'the inside of a ship below the waterline, a ceiling of dark timber beams low enough to touch, '
      + 'rows of hammocks slung so close that they overlap, a lantern hanging from a beam',
    detail: 'sea chests and packs wedged under the hammocks, planking on every side, one ladder going up into '
      + 'the only daylight in the picture',
    mood: 'close-quarters', palette: 'hoods-grey', tier: 'standard',
  },
  {
    id: `${C}.s09.p03`,
    subject: 'recruits at a ship rail watching a coastline become a line and then nothing',
    mood: 'march', palette: 'blue-fire', tier: 'standard',
  },
  {
    id: `${C}.s09.p04`,
    subject: 'a soldier at a ship rail seen from behind and a little to one side, closing one hand around '
      + 'a worn metal token',
    mood: 'march', palette: 'bone-dust', tier: 'filler',
  },
  {
    id: `${C}.s09.p05`,
    subject: 'open ocean at night from the deck of a sailing transport, empty horizon all the way round, '
      + 'a single lamp swinging on its hook',
    mood: 'march', palette: 'blue-fire', tier: 'hero',
  },
]
