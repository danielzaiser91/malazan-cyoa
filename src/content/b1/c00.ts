/**
 * Prolog — "Die Maus brennt". Malaz-Stadt, 1154 Burns Schlaf.
 * Roman-Beats: `_knowledgebase/50-gotm-chapter-map.md`, Abschnitt Prolog.
 *
 * KEIN Anzeigetext in dieser Datei. Nur IDs, Kanten, Bedingungen, Effekte.
 * Die Prosa liegt in `src/locales/de|en/b1/c00.ts`.
 */

import type { Chapter } from '../../model/types.ts'

const C = 'b1.c00'

export const chapter00: Chapter = {
  id: C,
  code: '0',
  order: 0,
  titleKey: `${C}.title`,
  accent: '#8C5A3C',
  scenes: [
    // ---------------------------------------------------------------- 0.1
    {
      id: `${C}.s01`,
      code: '0.1',
      kind: 'spine',
      chapter: C,
      titleKey: `${C}.s01.title`,
      summaryKey: `${C}.s01.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'malaz-city' }],
      pages: [
        {
          id: `${C}.s01.p01`,
          bodyKey: `${C}.s01.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p01`, altKey: `${C}.s01.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s01.p01b`,
          bodyKey: `${C}.s01.p01b.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p01`, altKey: `${C}.s01.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s01.p02`,
          bodyKey: `${C}.s01.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s01.p02`, altKey: `${C}.s01.p02.alt`, mood: 'siege' },
          interactions: [
            {
              id: 'ask-smoke',
              labelKey: `${C}.s01.p02.i.smoke.label`,
              responseKey: `${C}.s01.p02.i.smoke.response`,
              effects: [{ codex: 'mouse-quarter' }, { flag: 'paran.asked.smoke', set: true }],
            },
            {
              id: 'ask-soldier',
              labelKey: `${C}.s01.p02.i.soldier.label`,
              responseKey: `${C}.s01.p02.i.soldier.response`,
              effects: [{ codex: 'bridgeburners' }, { flag: 'paran.noticed.soldier', set: true }],
            },
            {
              id: 'say-nothing',
              labelKey: `${C}.s01.p02.i.silence.label`,
              responseKey: `${C}.s01.p02.i.silence.response`,
              effects: [{ stat: 'cunning', add: 1 }],
            },
          ],
        },
        {
          id: `${C}.s01.p03`,
          bodyKey: `${C}.s01.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s01.p03`, altKey: `${C}.s01.p03.alt`, mood: 'siege' },
        },
      ],
      exit: {
        type: 'choice',
        choices: [
          {
            id: 'talk',
            labelKey: `${C}.s01.ch.talk`,
            to: `${C}.s02`,
            risk: 'safe',
            outcome: 'progress',
          },
          {
            id: 'descend',
            labelKey: `${C}.s01.ch.descend`,
            to: `${C}.s03`,
            risk: 'dangerous',
            outcome: 'progress',
          },
          {
            id: 'watch',
            labelKey: `${C}.s01.ch.watch`,
            to: `${C}.s04`,
            risk: 'safe',
            outcome: 'lore',
          },
        ],
      },
    },

    // --------------------------------------------------------------- 0.1a
    {
      id: `${C}.s02`,
      code: '0.1a',
      kind: 'branch',
      chapter: C,
      titleKey: `${C}.s02.title`,
      summaryKey: `${C}.s02.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'bridgeburners' }, { flag: 'paran.met.bridgeburner', set: true }],
      pages: [
        {
          id: `${C}.s02.p01`,
          bodyKey: `${C}.s02.p01.body`,
          band: 'long',
          art: { promptId: `${C}.s02.p01`, altKey: `${C}.s02.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s02.p02`,
          bodyKey: `${C}.s02.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s02.p02`, altKey: `${C}.s02.p02.alt`, mood: 'aftermath' },
          interactions: [
            {
              id: 'ask-gods',
              labelKey: `${C}.s02.p02.i.gods.label`,
              responseKey: `${C}.s02.p02.i.gods.response`,
              effects: [{ codex: 'ascendancy' }, { stat: 'will', add: 1 }],
            },
            {
              id: 'ask-name',
              labelKey: `${C}.s02.p02.i.name.label`,
              responseKey: `${C}.s02.p02.i.name.response`,
              effects: [{ codex: 'malazan-empire' }],
            },
          ],
        },
        {
          id: `${C}.s02.p02b`,
          bodyKey: `${C}.s02.p02b.body`,
          band: 'beat',
          art: { promptId: `${C}.s02.p02`, altKey: `${C}.s02.p02.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s02.p03`,
          bodyKey: `${C}.s02.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s02.p03`, altKey: `${C}.s02.p03.alt`, mood: 'aftermath' },
          effects: [{ stat: 'standing', add: 1 }, { achievement: 'warned' }],
        },
      ],
      exit: { type: 'goto', to: `${C}.s05` },
    },

    // --------------------------------------------------------------- 0.1b
    {
      id: `${C}.s03`,
      code: '0.1b',
      kind: 'branch',
      chapter: C,
      titleKey: `${C}.s03.title`,
      summaryKey: `${C}.s03.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'claw' }],
      pages: [
        {
          id: `${C}.s03.p01`,
          bodyKey: `${C}.s03.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s03.p01`, altKey: `${C}.s03.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s03.p02`,
          bodyKey: `${C}.s03.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s03.p02`, altKey: `${C}.s03.p02.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s03.p03`,
          bodyKey: `${C}.s03.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s03.p03`, altKey: `${C}.s03.p03.alt`, mood: 'siege' },
        },
      ],
      exit: {
        type: 'choice',
        choices: [
          {
            id: 'help',
            labelKey: `${C}.s03.ch.help`,
            to: `${C}.s06`,
            risk: 'dangerous',
            outcome: 'progress',
            check: { stat: 'heart', dc: 5, fail: `${C}.s07` },
          },
          {
            id: 'back',
            labelKey: `${C}.s03.ch.back`,
            to: `${C}.s05`,
            risk: 'safe',
            outcome: 'progress',
            costs: [{ flag: 'paran.turned.back', set: true }],
          },
        ],
      },
    },

    // --------------------------------------------------------------- 0.1c
    {
      id: `${C}.s04`,
      code: '0.1c',
      kind: 'side',
      chapter: C,
      titleKey: `${C}.s04.title`,
      summaryKey: `${C}.s04.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'wax-witches' }, { codex: 'laseen' }],
      pages: [
        {
          id: `${C}.s04.p01`,
          bodyKey: `${C}.s04.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s04.p01`, altKey: `${C}.s04.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s04.p01b`,
          bodyKey: `${C}.s04.p01b.body`,
          band: 'beat',
          art: { promptId: `${C}.s04.p01`, altKey: `${C}.s04.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s04.p02`,
          bodyKey: `${C}.s04.p02.body`,
          band: 'standard',
          interactions: [
            {
              id: 'count-again',
              labelKey: `${C}.s04.p02.i.count-again.label`,
              responseKey: `${C}.s04.p02.i.count-again.response`,
              effects: [{ stat: 'cunning', add: 1 }, { flag: 'paran.counted.pattern', set: true }],
            },
            {
              id: 'look-harbour',
              labelKey: `${C}.s04.p02.i.look-harbour.label`,
              responseKey: `${C}.s04.p02.i.look-harbour.response`,
              effects: [{ codex: 'malaz-city' }],
            },
          ],
          art: { promptId: `${C}.s04.p02`, altKey: `${C}.s04.p02.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s04.p03`,
          bodyKey: `${C}.s04.p03.body`,
          band: 'standard',
          art: { promptId: `${C}.s04.p03`, altKey: `${C}.s04.p03.alt`, mood: 'divine' },
          effects: [{ stat: 'cunning', add: 1 }, { card: 'obelisk' }, { xp: 20 }],
        },
      ],
      exit: { type: 'goto', to: `${C}.s05` },
    },

    // ------------------------------------------------------------- 0.1b.1
    {
      id: `${C}.s06`,
      code: '0.1b.1',
      kind: 'side',
      chapter: C,
      titleKey: `${C}.s06.title`,
      summaryKey: `${C}.s06.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      pages: [
        {
          id: `${C}.s06.p01`,
          bodyKey: `${C}.s06.p01.body`,
          band: 'beat',
          art: { promptId: `${C}.s06.p01`, altKey: `${C}.s06.p01.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s06.p02`,
          bodyKey: `${C}.s06.p02.body`,
          band: 'beat',
          interactions: [
            {
              id: 'give-water',
              labelKey: `${C}.s06.p02.i.give-water.label`,
              responseKey: `${C}.s06.p02.i.give-water.response`,
              effects: [{ stat: 'heart', add: 1 }, { flag: 'paran.gave.water', set: true }],
            },
            {
              id: 'keep-moving',
              labelKey: `${C}.s06.p02.i.keep-moving.label`,
              responseKey: `${C}.s06.p02.i.keep-moving.response`,
              effects: [{ stat: 'will', add: 1 }],
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
            { codex: 'mouse-quarter' },
            { achievement: 'first-mercy' },
            { flag: 'paran.helped.woman', set: true },
            { xp: 15 },
          ],
        },
      ],
      exit: { type: 'goto', to: `${C}.s05` },
    },

    // ------------------------------------------------------------- 0.1b.2
    {
      id: `${C}.s07`,
      code: '0.1b.2',
      kind: 'deadend',
      chapter: C,
      titleKey: `${C}.s07.title`,
      summaryKey: `${C}.s07.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'claw' }],
      pages: [
        {
          id: `${C}.s07.p01`,
          bodyKey: `${C}.s07.p01.body`,
          band: 'beat',
          art: { promptId: `${C}.s07.p01`, altKey: `${C}.s07.p01.alt`, mood: 'siege' },
        },
        {
          id: `${C}.s07.p02`,
          bodyKey: `${C}.s07.p02.body`,
          band: 'standard',
          art: { promptId: `${C}.s07.p02`, altKey: `${C}.s07.p02.alt`, mood: 'aftermath' },
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
          effects: [{ codex: 'claw' }, { flag: 'paran.saw.claw', set: true }],
        },
      ],
      exit: {
        type: 'gameover',
        reasonKey: `${C}.s07.gameover`,
        outcome: 'toolate',
        suggest: [`${C}.s03`, `${C}.s01`],
      },
    },

    // ---------------------------------------------------------------- 0.2
    {
      id: `${C}.s05`,
      code: '0.2',
      kind: 'convergence',
      chapter: C,
      titleKey: `${C}.s05.title`,
      summaryKey: `${C}.s05.summary`,
      pov: 'paran',
      spoilerScope: 'gotm',
      sheet: 'paran-child',
      onEnter: [{ codex: 'laseen' }, { codex: 'old-guard' }],
      pages: [
        {
          id: `${C}.s05.p01`,
          bodyKey: `${C}.s05.p01.body`,
          band: 'standard',
          art: { promptId: `${C}.s05.p01`, altKey: `${C}.s05.p01.alt`, mood: 'council' },
          inserts: [
            { when: { flag: 'paran.met.bridgeburner' }, bodyKey: `${C}.s05.p01.ins.soldier` },
            { when: { flag: 'paran.helped.woman' }, bodyKey: `${C}.s05.p01.ins.mercy` },
            { when: { flag: 'paran.turned.back' }, bodyKey: `${C}.s05.p01.ins.back` },
          ],
        },
        {
          id: `${C}.s05.p01b`,
          bodyKey: `${C}.s05.p01b.body`,
          band: 'beat',
          art: { promptId: `${C}.s05.p01`, altKey: `${C}.s05.p01.alt`, mood: 'council' },
        },
        {
          id: `${C}.s05.p02`,
          bodyKey: `${C}.s05.p02.body`,
          band: 'standard',
          // Drei Gespraechsknoten auf der Seite, auf der Paran zum ersten Mal
          // vor der neuen Kaiserin steht. Vorher lief die laengste Szene des
          // Prologs sieben Seiten ohne eine einzige Entscheidung durch.
          interactions: [
            {
              id: 'look-away',
              labelKey: `${C}.s05.p02.i.away.label`,
              responseKey: `${C}.s05.p02.i.away.response`,
              effects: [{ stat: 'will', add: 1 }, { flag: 'paran.looked.away', set: true }],
            },
            {
              id: 'hold-gaze',
              labelKey: `${C}.s05.p02.i.hold.label`,
              responseKey: `${C}.s05.p02.i.hold.response`,
              // Kostet Aufmerksamkeit und gibt Haltung: der teuer erkaufte
              // gute Pfad, der laut Vergleich bisher ganz fehlte.
              effects: [{ stat: 'standing', add: 1 }, { attention: 1 }, { flag: 'paran.held.gaze', set: true }],
            },
            {
              id: 'read-room',
              labelKey: `${C}.s05.p02.i.read.label`,
              responseKey: `${C}.s05.p02.i.read.response`,
              // Sichtbar gesperrt, wenn der Wert fehlt — mit in-fiction
              // Begruendung. So merkt man, dass die Herkunft etwas tut.
              requires: { stat: 'cunning', gte: 2 },
              lockHintKey: `${C}.s05.p02.i.read.lock`,
              effects: [{ codex: 'claw' }, { stat: 'cunning', add: 1 }],
            },
          ],
          art: { promptId: `${C}.s05.p02`, altKey: `${C}.s05.p02.alt`, mood: 'council' },
        },
        {
          id: `${C}.s05.p03`,
          bodyKey: `${C}.s05.p03.body`,
          band: 'beat',
          art: { promptId: `${C}.s05.p03`, altKey: `${C}.s05.p03.alt`, mood: 'council' },
        },
        {
          id: `${C}.s05.p04`,
          bodyKey: `${C}.s05.p04.body`,
          band: 'standard',
          art: { promptId: `${C}.s05.p04`, altKey: `${C}.s05.p04.alt`, mood: 'aftermath' },
          effects: [{ codex: 'mouse-quarter' }],
        },
        {
          id: `${C}.s05.p05`,
          bodyKey: `${C}.s05.p05.body`,
          band: 'beat',
          art: { promptId: `${C}.s05.p05`, altKey: `${C}.s05.p05.alt`, mood: 'aftermath' },
        },
        {
          id: `${C}.s05.p06`,
          bodyKey: `${C}.s05.p06.body`,
          band: 'standard',
          art: { promptId: `${C}.s05.p06`, altKey: `${C}.s05.p06.alt`, mood: 'march' },
          effects: [{ achievement: 'prologue-done' }],
        },
      ],
      exit: { type: 'goto', to: 'b1.c01.s01' },
    },
  ],
}
