/**
 * Kapitel 1 — "Die Küste von Itko Kan". 1161 Burns Schlaf, sieben Jahre nach
 * dem Prolog. Roman-Beats: `_knowledgebase/51-gotm-scene-detail.md`, Kapitel 1.
 *
 * Hier betritt der Rekrut des Spielers die Geschichte: dieselbe Aushebung, die
 * auch das Fischermädchen aufnimmt, das sich Sorry nennt. Parallel läuft das
 * Lorn-Interlude am Strand. Konvergenz: die Einschiffung nach Genabackis.
 *
 * KEIN Anzeigetext in dieser Datei.
 */

import type { Chapter } from '../../model/types.ts'

const C = 'b1.c01'

export const chapter01: Chapter = {
  id: C,
  code: '1',
  order: 1,
  titleKey: `${C}.title`,
  accent: '#2F7FA6',
  scenes: [
    // ---------------------------------------------------------------- 1.1
    {
      id: `${C}.s01`,
      code: '1.1',
      kind: 'spine',
      chapter: C,
      titleKey: `${C}.s01.title`,
      summaryKey: `${C}.s01.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      onEnter: [{ codex: 'itko-kan' }, { item: 'squad-token', add: 1 }],
      pages: [
        {
          id: `${C}.s01.p01`,
          bodyKey: `${C}.s01.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p01`, altKey: `${C}.s01.p01.alt`, mood: 'march' },
          inserts: [
            { when: { background: 'marine' }, bodyKey: `${C}.s01.p01.ins.marine` },
            { when: { background: 'sapper' }, bodyKey: `${C}.s01.p01.ins.sapper` },
            { when: { background: 'mage' }, bodyKey: `${C}.s01.p01.ins.mage` },
          ],
        },
        {
          id: `${C}.s01.p01b`,
          bodyKey: `${C}.s01.p01b.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p01`, altKey: `${C}.s01.p01.alt`, mood: 'march' },
        },
        {
          id: `${C}.s01.p02`,
          bodyKey: `${C}.s01.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p02`, altKey: `${C}.s01.p02.alt`, mood: 'march' },
          interactions: [
            {
              id: 'ask-pay',
              labelKey: `${C}.s01.p02.i.pay.label`,
              responseKey: `${C}.s01.p02.i.pay.response`,
              effects: [{ coin: 5 }, { codex: 'malazan-empire' }],
            },
            {
              id: 'ask-where',
              labelKey: `${C}.s01.p02.i.where.label`,
              responseKey: `${C}.s01.p02.i.where.response`,
              effects: [{ codex: 'genabackis' }, { flag: 'recruit.knows.destination', set: true }],
            },
            {
              id: 'ask-girl',
              labelKey: `${C}.s01.p02.i.girl.label`,
              responseKey: `${C}.s01.p02.i.girl.response`,
              effects: [{ flag: 'recruit.noticed.sorry', set: true }, { stat: 'cunning', add: 1 }],
            },
          ],
        },
        {
          id: `${C}.s01.p03`,
          bodyKey: `${C}.s01.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s01.p03`, altKey: `${C}.s01.p03.alt`, mood: 'march' },
        },
      ],
      exit: {
        type: 'choice',
        choices: [
          { id: 'road', labelKey: `${C}.s01.ch.road`, to: `${C}.s02`, risk: 'safe', outcome: 'progress' },
          { id: 'quay', labelKey: `${C}.s01.ch.quay`, to: `${C}.s03`, risk: 'costly',
          costs: [{ attention: 1 }], outcome: 'lore' },
          {
            id: 'girl',
            labelKey: `${C}.s01.ch.girl`,
            to: `${C}.s04`,
            risk: 'costly',
          costs: [{ attention: 1 }],
            outcome: 'progress',
            requires: { flag: 'recruit.noticed.sorry' },
            lockHintKey: `${C}.s01.ch.girl.lock`,
          },
        ],
      },
    },

    // --------------------------------------------------------------- 1.1a
    {
      id: `${C}.s03`,
      code: '1.1a',
      kind: 'side',
      chapter: C,
      titleKey: `${C}.s03.title`,
      summaryKey: `${C}.s03.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      pages: [
        {
          id: `${C}.s03.p01`,
          bodyKey: `${C}.s03.p01.body`,
          band: 'beat',
          art: { promptId: `${C}.s03.p01`, altKey: `${C}.s03.p01.alt`, mood: 'street-night' },
        },
        {
          id: `${C}.s03.p02`,
          bodyKey: `${C}.s03.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s03.p02`, altKey: `${C}.s03.p02.alt`, mood: 'street-night' },
          interactions: [
            {
              id: 'ask-deck',
              labelKey: `${C}.s03.p02.i.deck.label`,
              responseKey: `${C}.s03.p02.i.deck.response`,
              effects: [{ codex: 'deck-of-dragons' }, { card: 'oponn' }],
            },
            {
              id: 'ask-rhivi',
              labelKey: `${C}.s03.p02.i.rhivi.label`,
              responseKey: `${C}.s03.p02.i.rhivi.response`,
              effects: [{ codex: 'rhivi' }],
            },
          ],
        },
        {
          id: `${C}.s03.p03`,
          bodyKey: `${C}.s03.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s03.p03`, altKey: `${C}.s03.p03.alt`, mood: 'street-night' },
          effects: [{ coin: -5 }, { stat: 'cunning', add: 1 }, { xp: 20 }],
        },
      ],
      exit: { type: 'goto', to: `${C}.s02` },
    },

    // --------------------------------------------------------------- 1.1b
    {
      id: `${C}.s04`,
      code: '1.1b',
      kind: 'branch',
      chapter: C,
      titleKey: `${C}.s04.title`,
      summaryKey: `${C}.s04.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      onEnter: [{ codex: 'sorry' }],
      pages: [
        {
          id: `${C}.s04.p01`,
          bodyKey: `${C}.s04.p01.body`,
          band: 'beat',
          art: { promptId: `${C}.s04.p01`, altKey: `${C}.s04.p01.alt`, mood: 'march' },
        },
        {
          id: `${C}.s04.p02`,
          bodyKey: `${C}.s04.p02.body`,
          band: 'beat',
          interactions: [
            {
              id: 'ask-name',
              labelKey: `${C}.s04.p02.i.ask-name.label`,
              responseKey: `${C}.s04.p02.i.ask-name.response`,
              effects: [{ stat: 'heart', add: 1 }, { flag: 'recruit.asked.name', set: true }],
            },
            {
              id: 'say-nothing-bench',
              labelKey: `${C}.s04.p02.i.say-nothing-bench.label`,
              responseKey: `${C}.s04.p02.i.say-nothing-bench.response`,
              effects: [{ stat: 'will', add: 1 }],
            },
          ],
          art: { promptId: `${C}.s04.p02`, altKey: `${C}.s04.p02.alt`, mood: 'march' },
        },
        {
          id: `${C}.s04.p03`,
          bodyKey: `${C}.s04.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s04.p03`, altKey: `${C}.s04.p03.alt`, mood: 'march' },
          effects: [
            { flag: 'recruit.spoke.sorry', set: true },
            { stat: 'will', add: 1 },
            { attention: 2 },
          ],
        },
      ],
      exit: { type: 'goto', to: `${C}.s02` },
    },

    // ---------------------------------------------------------------- 1.2
    {
      id: `${C}.s02`,
      code: '1.2',
      kind: 'spine',
      chapter: C,
      titleKey: `${C}.s02.title`,
      summaryKey: `${C}.s02.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      pages: [
        {
          id: `${C}.s02.p01`,
          bodyKey: `${C}.s02.p01.body`,
          band: 'long',
          art: { promptId: `${C}.s02.p01`, altKey: `${C}.s02.p01.alt`, mood: 'march' },
        },
        {
          id: `${C}.s02.p02`,
          bodyKey: `${C}.s02.p02.body`,
          band: 'beat',
          // Die Ausbildung laesst etwas anderes SEHEN, nicht nur anders
          // urteilen — das ist der Unterschied zwischen Charakterisierung
          // und Kosmetik.
          inserts: [
            { when: { background: 'marine' }, bodyKey: `${C}.s02.p02.bg.marine` },
            { when: { background: 'sapper' }, bodyKey: `${C}.s02.p02.bg.sapper` },
            { when: { background: 'mage' }, bodyKey: `${C}.s02.p02.bg.mage` },
          ],
          art: { promptId: `${C}.s02.p02`, altKey: `${C}.s02.p02.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s02.p03`,
          bodyKey: `${C}.s02.p03.body`,
          band: 'standard',
          art: { promptId: `${C}.s02.p03`, altKey: `${C}.s02.p03.alt`, mood: 'aftermath' },
          effects: [{ codex: 'hounds-of-shadow' }],
        },
        {
          id: `${C}.s02.p04`,
          bodyKey: `${C}.s02.p04.body`,
          band: 'beat',
          art: { promptId: `${C}.s02.p04`, altKey: `${C}.s02.p04.alt`, mood: 'aftermath' },
        },
      ],
      exit: {
        type: 'choice',
        choices: [
          { id: 'search', labelKey: `${C}.s02.ch.search`, to: `${C}.s06`, risk: 'costly',
          costs: [{ attention: 1 }], outcome: 'progress' },
          { id: 'hold', labelKey: `${C}.s02.ch.hold`, to: `${C}.s07`, risk: 'safe', outcome: 'progress' },
          {
            id: 'tracks',
            labelKey: `${C}.s02.ch.tracks`,
            to: `${C}.s08`,
            risk: 'lethal',
            outcome: 'death',
            confirm: true,
            confirmKey: `${C}.s02.ch.tracks.confirm`,
          },
        ],
      },
    },

    // --------------------------------------------------------------- 1.2a
    {
      id: `${C}.s06`,
      code: '1.2a',
      kind: 'side',
      chapter: C,
      titleKey: `${C}.s06.title`,
      summaryKey: `${C}.s06.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      pages: [
        {
          id: `${C}.s06.p01`,
          bodyKey: `${C}.s06.p01.body`,
          band: 'beat',
          // Die Ausbildung laesst etwas anderes SEHEN, nicht nur anders
          // urteilen — das ist der Unterschied zwischen Charakterisierung
          // und Kosmetik.
          inserts: [
            { when: { background: 'marine' }, bodyKey: `${C}.s06.p01.bg.marine` },
            { when: { background: 'sapper' }, bodyKey: `${C}.s06.p01.bg.sapper` },
            { when: { background: 'mage' }, bodyKey: `${C}.s06.p01.bg.mage` },
          ],
          art: { promptId: `${C}.s06.p01`, altKey: `${C}.s06.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s06.p02`,
          bodyKey: `${C}.s06.p02.body`,
          band: 'beat',
          interactions: [
            {
              id: 'check-tack',
              labelKey: `${C}.s06.p02.i.check-tack.label`,
              responseKey: `${C}.s06.p02.i.check-tack.response`,
              requires: { stat: 'cunning', gte: 3 },
              lockHintKey: `${C}.s06.p02.i.check-tack.lock`,
              effects: [{ stat: 'cunning', add: 1 }, { codex: 'hounds-of-shadow' }],
            },
            {
              id: 'sit-with-it',
              labelKey: `${C}.s06.p02.i.sit-with-it.label`,
              responseKey: `${C}.s06.p02.i.sit-with-it.response`,
              effects: [{ stat: 'heart', add: 1 }, { attention: 1 }],
            },
          ],
          art: { promptId: `${C}.s06.p02`, altKey: `${C}.s06.p02.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s06.p03`,
          bodyKey: `${C}.s06.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s06.p03`, altKey: `${C}.s06.p03.alt`, mood: 'aftermath' },
          effects: [
            { stat: 'heart', add: 1 },
            { flag: 'recruit.stayed.with.dying', set: true },
            { achievement: 'no-lesson' },
            { xp: 15 },
          ],
        },
      ],
      exit: { type: 'goto', to: `${C}.s07` },
    },

    // --------------------------------------------------------------- 1.2b
    {
      id: `${C}.s08`,
      code: '1.2b',
      kind: 'deadend',
      chapter: C,
      titleKey: `${C}.s08.title`,
      summaryKey: `${C}.s08.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      pages: [
        {
          id: `${C}.s08.p01`,
          bodyKey: `${C}.s08.p01.body`,
          band: 'beat',
          art: { promptId: `${C}.s08.p01`, altKey: `${C}.s08.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s08.p02`,
          bodyKey: `${C}.s08.p02.body`,
          band: 'beat',
          // Die Ausbildung laesst etwas anderes SEHEN, nicht nur anders
          // urteilen — das ist der Unterschied zwischen Charakterisierung
          // und Kosmetik.
          inserts: [
            { when: { background: 'marine' }, bodyKey: `${C}.s08.p02.bg.marine` },
            { when: { background: 'sapper' }, bodyKey: `${C}.s08.p02.bg.sapper` },
            { when: { background: 'mage' }, bodyKey: `${C}.s08.p02.bg.mage` },
          ],
          art: { promptId: `${C}.s08.p02`, altKey: `${C}.s08.p02.alt`, mood: 'divine' },
        },
        {
          id: `${C}.s08.p03`,
          bodyKey: `${C}.s08.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s08.p03`, altKey: `${C}.s08.p03.alt`, mood: 'divine' },
        },
        {
          id: `${C}.s08.p04`,
          bodyKey: `${C}.s08.p04.body`,
          band: 'standard',
          art: { promptId: `${C}.s08.p04`, altKey: `${C}.s08.p04.alt`, mood: 'divine' },
          effects: [{ codex: 'shadowthrone-cotillion' }, { attention: 4 }],
        },
        {
          id: `${C}.s08.p05`,
          bodyKey: `${C}.s08.p05.body`,
          band: 'beat',
          art: { promptId: `${C}.s08.p05`, altKey: `${C}.s08.p05.alt`, mood: 'divine' },
          effects: [{ flag: 'recruit.saw.hound', set: true }, { card: 'hound' }],
        },
      ],
      exit: {
        type: 'gameover',
        reasonKey: `${C}.s08.gameover`,
        outcome: 'death',
        suggest: [`${C}.s02`, `${C}.s01`],
      },
    },

    // ---------------------------------------------------------------- 1.3
    {
      id: `${C}.s07`,
      code: '1.3',
      kind: 'branch',
      chapter: C,
      titleKey: `${C}.s07.title`,
      summaryKey: `${C}.s07.summary`,
      pov: 'lorn',
      spoilerScope: 'gotm',
      sheet: 'lorn',
      onEnter: [{ codex: 'lorn' }, { codex: 'adjunct' }],
      pages: [
        {
          id: `${C}.s07.p01`,
          bodyKey: `${C}.s07.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s07.p01`, altKey: `${C}.s07.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s07.p01b`,
          bodyKey: `${C}.s07.p01b.body`,
          band: 'standard',
          art: { promptId: `${C}.s07.p01`, altKey: `${C}.s07.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s07.p02`,
          bodyKey: `${C}.s07.p02.body`,
          band: 'beat',
          art: { promptId: `${C}.s07.p02`, altKey: `${C}.s07.p02.alt`, mood: 'aftermath' },
          interactions: [
            {
              id: 'otataral',
              labelKey: `${C}.s07.p02.i.otataral.label`,
              responseKey: `${C}.s07.p02.i.otataral.response`,
              effects: [{ codex: 'otataral' }],
            },
            {
              id: 'paran',
              labelKey: `${C}.s07.p02.i.paran.label`,
              responseKey: `${C}.s07.p02.i.paran.response`,
              effects: [{ codex: 'paran' }, { flag: 'lorn.measured.paran', set: true }],
            },
          ],
        },
        {
          id: `${C}.s07.p03`,
          bodyKey: `${C}.s07.p03.body`,
          band: 'standard',
          art: { promptId: `${C}.s07.p03`, altKey: `${C}.s07.p03.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s07.p04`,
          bodyKey: `${C}.s07.p04.body`,
          band: 'beat',
          art: { promptId: `${C}.s07.p04`, altKey: `${C}.s07.p04.alt`, mood: 'aftermath' },
          effects: [{ flag: 'lorn.admitted.screen', set: true }, { xp: 10 }],
        },
      ],
      exit: { type: 'goto', to: `${C}.s09` },
    },

    // ---------------------------------------------------------------- 1.4
    {
      id: `${C}.s09`,
      code: '1.4',
      kind: 'convergence',
      chapter: C,
      titleKey: `${C}.s09.title`,
      summaryKey: `${C}.s09.summary`,
      pov: 'recruit',
      spoilerScope: 'gotm',
      onEnter: [{ codex: 'bridgeburners' }],
      pages: [
        {
          id: `${C}.s09.p01`,
          bodyKey: `${C}.s09.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s09.p01`, altKey: `${C}.s09.p01.alt`, mood: 'march' },
          inserts: [
            { when: { flag: 'recruit.stayed.with.dying' }, bodyKey: `${C}.s09.p01.ins.mercy` },
            { when: { flag: 'recruit.spoke.sorry' }, bodyKey: `${C}.s09.p01.ins.sorry` },
            { when: { card: 'oponn' }, bodyKey: `${C}.s09.p01.ins.coin` },
            { when: { flag: 'recruit.saw.hound' }, bodyKey: `${C}.s09.p01.ins.hound` },
          ],
        },
        {
          id: `${C}.s09.p01b`,
          bodyKey: `${C}.s09.p01b.body`,
          band: 'standard',
          art: { promptId: `${C}.s09.p01`, altKey: `${C}.s09.p01.alt`, mood: 'march' },
        },
        {
          id: `${C}.s09.p02`,
          bodyKey: `${C}.s09.p02.body`,
          band: 'beat',
          // Die Ausbildung laesst etwas anderes SEHEN, nicht nur anders
          // urteilen — das ist der Unterschied zwischen Charakterisierung
          // und Kosmetik.
          inserts: [
            { when: { background: 'marine' }, bodyKey: `${C}.s09.p02.bg.marine` },
            { when: { background: 'sapper' }, bodyKey: `${C}.s09.p02.bg.sapper` },
            { when: { background: 'mage' }, bodyKey: `${C}.s09.p02.bg.mage` },
          ],
          interactions: [
            {
              id: 'learn-names',
              labelKey: `${C}.s09.p02.i.learn-names.label`,
              responseKey: `${C}.s09.p02.i.learn-names.response`,
              effects: [{ stat: 'standing', add: 1 }, { flag: 'recruit.knows.squad', set: true }],
            },
            {
              id: 'stay-quiet',
              labelKey: `${C}.s09.p02.i.stay-quiet.label`,
              responseKey: `${C}.s09.p02.i.stay-quiet.response`,
              effects: [{ stat: 'will', add: 1 }],
            },
          ],
          art: { promptId: `${C}.s09.p02`, altKey: `${C}.s09.p02.alt`, mood: 'march' },
        },
        {
          id: `${C}.s09.p03`,
          bodyKey: `${C}.s09.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s09.p03`, altKey: `${C}.s09.p03.alt`, mood: 'march' },
        },
        {
          id: `${C}.s09.p04`,
          bodyKey: `${C}.s09.p04.body`,
          band: 'beat',
          art: { promptId: `${C}.s09.p04`, altKey: `${C}.s09.p04.alt`, mood: 'march' },
        },
        {
          id: `${C}.s09.p05`,
          bodyKey: `${C}.s09.p05.body`,
          band: 'standard',
          art: { promptId: `${C}.s09.p05`, altKey: `${C}.s09.p05.alt`, mood: 'march' },
          effects: [{ achievement: 'shipped-out' }, { stat: 'standing', add: 1 }],
        },
      ],
      exit: { type: 'goto', to: `${C}.s99` },
    },

    // --------------------------------------------------------------- 1.E
    // TEMPORAERES ENTWICKLUNGS-ENDE — wandert mit jedem neuen Kapitel weiter.
    // Faellt endgueltig weg, sobald Kapitel 10 steht.
    {
      id: `${C}.s99`,
      code: '1.E',
      kind: 'ending',
      chapter: C,
      titleKey: 'b1.wip.title',
      summaryKey: 'b1.wip.summary',
      pov: 'kruppe',
      spoilerScope: 'gotm',
      pages: [
        {
          id: `${C}.s99.p01`,
          bodyKey: 'b1.wip.body',
          band: 'beat',
          art: { promptId: 'b1.wip', altKey: 'b1.wip.alt', mood: 'dream' },
        },
      ],
      exit: { type: 'ending', endingId: 'wip' },
    },
  ],
}
