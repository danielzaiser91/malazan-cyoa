# Story Graph, Save System and Flowchart UI — Specification

Binding technical design. Derived from `01-cyoa-best-practices.md`. Where this file gives a schema,
implement that schema.

---

## 1. Content hierarchy — four levels, three that matter

```
Book        b1                 "Gardens of the Moon"          (a season of content)
 └ Chapter  b1.c03             "Der Rauch über Pale"          bounded by two convergences
    └ Scene b1.c03.s02         "Die Gasse"                    ← THE JUMPABLE UNIT
       └ Page b1.c03.s02.p04   one screen: prose + illustration
```

- **Page** — one screen. Prose in the length bands from the best-practices file, exactly one
  illustration, an optional set of in-scene interactions, and a link to the next page.
- **Scene** — an ordered run of 2–8 pages, the **smallest unit the player can jump back to**.
  A scene ends in a **choice set** (or a single continue link). This is the only place the story
  may branch.
- **Chapter** — a set of scenes between two convergences. Has an entry scene and one or more exit
  scenes that all lead to the next chapter's entry (bottleneck) — or to a terminal.
- **Book** — one novel. Books are added as seasons; the engine never assumes only one exists.

**Why branching only at scene ends:** it makes the checkpoint rule enforceable, keeps the flowchart
readable, and stops players from micro-optimising inside a scene. Mid-scene interactivity is still
allowed — it just may not change which scene comes next:

| In-scene interaction | Effect | Allowed |
|---|---|---|
| Flavour choice ("what do you say?") | sets flags / stats, next page unchanged | ✅ |
| Re-enterable topic node (ask about X, Y, Z, then move on) | unlocks codex, sets flags | ✅ |
| Scored stance (tally across the scene, resolved at the scene's end choice) | biases the exit choice | ✅ |
| Anything that changes the *next scene* | — | ❌ must be the scene's exit choice |

## 2. Node types

| `kind` | Meaning | Checkpoint? | Shown in graph |
|---|---|---|---|
| `convergence` | Chapter boundary. All roads meet. Always on the spine. | ✅ always | Large, on the spine column |
| `spine` | Main-path scene | ✅ | On the spine |
| `branch` | Optional / alternative route that rejoins the spine | ✅ | Offset from the spine |
| `side` | Optional arc (lore, character, mercy detour). Rejoins later. | ✅ | Offset, distinct colour |
| `deadend` | Terminal: death, capture, missed chance, wrong turn. 3–6 pages of real payoff, then game over. | ✅ (entry only) | Offset, terminal cap |
| `ending` | A real ending of the book | — | Terminal, gold |

## 3. Identity and display codes

```ts
/** Stable, never renumbered. Used by saves, images, i18n keys, tests. */
type SceneId = `b${number}.c${number}.s${number}` // e.g. "b1.c03.s02"
```

- **IDs are permanent.** Inserting content never renumbers an existing ID. Saves reference IDs.
- **Display codes** are a separate, author-controlled, human-readable label:
  `3.2` on the spine, `3.2a` / `3.2b` for branches off it, `3.2a.1` for a branch of a branch.
  Validated unique per book. This is what appears in the flowchart and in user feedback ("Szene
  3.2b hängt").
- Illustration path is derived from the ID: `/illustrations/b1.c03.s02.p04.webp`.
- i18n keys are derived from the ID: `b1.c03.s02.p04.body`.

## 4. Content schema (TypeScript, authored as data modules)

```ts
export interface Scene {
  id: SceneId
  code: string                    // "3.2b" — display only
  kind: 'convergence' | 'spine' | 'branch' | 'side' | 'deadend' | 'ending'
  chapter: ChapterId
  /** i18n keys, not text. Hidden in the graph until the scene is reached. */
  titleKey: string
  summaryKey: string              // 1–2 sentences, shown in the graph AFTER visiting
  pov: CharacterId                // whose eyes this scene is seen through
  spoilerScope: 'gotm' | 'series'
  pages: Page[]
  exit: Exit
  /** Entering this scene grants these once (idempotent, keyed by scene id). */
  onEnter?: Effect[]
  /** Prerequisites; if unmet the choice pointing here renders as locked with `lockHintKey`. */
  requires?: Condition
  lockHintKey?: string
}

export interface Page {
  id: PageId
  bodyKey: string                 // i18n key → prose
  /** Optional conditional inserts: extra paragraphs shown only when the condition holds. */
  inserts?: { when: Condition; bodyKey: string }[]
  art: { promptId: string; alt: string; mood: ArtMood }
  interactions?: Interaction[]    // in-scene only, never changes `exit`
  effects?: Effect[]
}

export type Exit =
  | { type: 'goto'; to: SceneId }
  | { type: 'choice'; choices: Choice[] }
  | { type: 'gameover'; reasonKey: string; /** which checkpoints to highlight */ suggest: SceneId[] }
  | { type: 'ending'; endingId: string }

export interface Choice {
  id: string
  labelKey: string                // ≤ 12 words, player voice, present tense
  to: SceneId
  requires?: Condition            // unmet → rendered locked, never hidden
  lockHintKey?: string            // why it is locked, in-fiction
  costs?: Effect[]                // applied on taking it
  /** Author-declared risk signal shown as an icon. Never lie with this. */
  risk?: 'safe' | 'costly' | 'dangerous' | 'lethal'
  /** Requires a second, in-fiction confirmation before committing. */
  confirm?: boolean
}
```

**Conditions and effects** are small declarative structures (no `eval`, no functions in content —
content must stay serialisable and testable):

```ts
type Condition =
  | { all: Condition[] } | { any: Condition[] } | { not: Condition }
  | { stat: StatId; gte: number } | { flag: string } | { item: ItemId; count?: number }
  | { visited: SceneId } | { card: CardId }

type Effect =
  | { stat: StatId; add: number } | { flag: string; set: boolean }
  | { item: ItemId; add: number } | { xp: number } | { coin: number }
  | { card: CardId } | { codex: CodexId } | { achievement: string }
```

## 5. Save system

### Profiles
- 4 profile slots, chosen on a start screen before anything else. Name + sigil + created/played
  timestamps + completion %.
- One profile owns: its checkpoints, its flowchart knowledge, its codex, its settings overrides,
  its language preference.
- Profiles are fully independent. Deleting one asks twice and touches nothing else.
- **Export / import a profile as a JSON file.** Non-negotiable — it is the only real protection
  against a localStorage wipe.

### The checkpoint model (this is the core mechanic)

- On **entering any scene for the first time**, take a `Snapshot` of the run state *as it was at
  entry* and store it against that scene id.
- A snapshot holds: stats, XP, level, coin, inventory, flags, cards, codex, playtime, the visited
  set, and the schema version.
- The flowchart lets the player **jump to any scene they have reached**. Jumping restores that
  scene's snapshot exactly. Progress made after that point is **not** deleted — knowledge of the
  graph (visited scenes, discovered outcomes, codex, achievements) is **meta-progress and
  persists across jumps**. Run state (stats/items/flags) is rolled back.
- Two layers, always:

| Layer | Contents | Rolled back on jump? |
|---|---|---|
| **Run state** | stats, XP, coin, items, flags, current scene | ✅ yes |
| **Meta state** | visited scenes, revealed titles/summaries, discovered outcomes, codex entries, cards, achievements, coverage %, endings found | ❌ never |

- **Autosave** on every page turn (run state + current position), debounced.
- Game over → the flowchart opens with the plausible checkpoints highlighted and the failed branch
  marked with its outcome icon.

### Storage

```ts
interface SaveFile {
  schema: 3                       // bump on every breaking change, migrate forward, never silently drop
  profileId: string
  meta: MetaState
  run: RunState
  checkpoints: Record<SceneId, Snapshot>
  updatedAt: string               // ISO
}
```

- `localStorage`, key `malazan-cyoa/profile/<id>`, one JSON per profile plus a small index key.
- Write through a single persistence module; nothing else touches `localStorage`.
- **Migrations are mandatory and tested**: a fixture save from every previous schema version lives
  in the test suite and must load.
- Guard against quota errors; if a write fails, tell the player and offer the export.

## 6. The flowchart ("Die Auslegung" — the Deck reading)

Diegetic framing: the flowchart is a **Deck of Dragons reading** laid out by Kruppe. Every scene is
a card. This is not decoration — it is what makes save-scumming feel like part of the fiction.

### Visual model
- **Columns = chapters**, left to right (vertical on mobile). Chapter headers are the convergence
  cards.
- Spine scenes sit on the centre line; branches offset above/below; side arcs in their own colour;
  dead ends terminate with a distinct cap.
- Edges are drawn; a taken edge is solid, an untaken but *known* edge is dashed, an unknown edge
  does not exist yet.

### Node states (spoiler rules — strict)

| State | Title | Summary | Art | Interaction |
|---|---|---|---|---|
| **Unknown** — never reached, not adjacent to anything reached | not rendered at all | — | — | — |
| **Rumoured** — an adjacent reached scene points here | face-down card, `???` | — | card back | not clickable |
| **Reached** | shown | shown | thumbnail | ✅ jump |
| **Completed** — reached and its exit taken | shown | shown + outcome badge | thumbnail | ✅ jump |
| **Exhausted dead end** | shown | shown + outcome badge (💀 / 🔍 / ⏳ / ⛓) | dimmed thumbnail | ✅ jump (re-read) |
| **Locked** — reachable but a condition is unmet | shown greyed | replaced by the in-fiction lock hint | dimmed | not clickable, hint on hover |

- **A card that has never been reached must not leak its title, summary, art, POV or code.** Only
  its existence as an adjacent unknown may show. This is the spoiler contract; there is a test for
  it (see § 8).
- **Already-played choices** are dimmed *in the story view too*, with their discovered outcome
  badge next to them — still selectable, visibly less attractive. Never removed.

### Outcome badges
`💀 Tod` · `⛓ Gefangen` · `⏳ Zu spät` · `🔍 Nur Wissen` (lore dead end) · `↩ Rückkehr` (loopback) ·
`★ Fortschritt` (advanced the spine) · `✦ Ende` (a real ending).

### Interaction
- Pan/zoom, click a card to see its detail panel, "Hierher springen" button with a confirm dialog
  that names exactly what will be rolled back.
- Filters: only-unvisited, only-dead-ends, only-side-arcs, current chapter.
- **Coverage bar**: scenes seen / total in this book, endings found, cards collected.
- Keyboard navigable; the whole chart has a textual list fallback (accessibility + it is genuinely
  the better view on a small phone).

## 7. Reading UI (the story view)

Required, all of it:

- Prose + illustration, illustration above on mobile / beside on wide screens.
- **Choice block** at the end of a scene: labels, risk icon, lock state, played-badge.
- **Backlog / history** of the last 50 pages, re-readable, never a way to un-choose.
- **Codex**: auto-fills as terms appear. Every proper noun in prose that has a codex entry is
  subtly marked and tappable — this is the feature that makes Malazan approachable.
- **Character sheet**: stats, XP/level, coin, inventory, cards, active flags in plain language
  ("Whiskeyjack traut dir"), playtime.
- **Settings**: language DE/EN (switchable mid-run, instantly), font size, line width, serif/sans,
  dyslexia-friendly font, contrast, reduce-motion, auto-advance, text-reveal speed, mute.
- **Content-warning screen** before the first chapter, re-readable from settings.
- Autosave indicator, version banner, cache-bust reload (see the tech-stack file).

## 8. Validation — build fails if any of these fail

These are unit tests over the content data, run in CI before every deploy:

1. **Referential integrity** — every `to`, `suggest`, `requires.visited` points at an existing id.
2. **No orphans** — every scene is reachable from the book's entry scene.
3. **No sinks** — every non-terminal scene has an exit; every branch eventually reaches a
   convergence or a terminal (no infinite loops without an exit).
4. **Unique** ids and unique display codes.
5. **i18n parity** — every key exists in both `de` and `en`; no key unused; no text left in the
   wrong language file (heuristic check).
6. **Word bands** — every page's word count in DE and EN sits inside its declared band; hard fail
   over 400.
7. **Art coverage** — every page has an illustration file (or an explicitly marked placeholder,
   which fails the *release* build but not the dev build).
8. **Spoiler contract** — a simulated fresh profile serialising the flowchart view must not contain
   any unreached scene's title, summary or art path.
9. **Choice sanity** — 2–4 choices per choice-exit; no duplicate labels; every choice reachable.
10. **Path balance** — sibling branches from one choice differ in total word count by ≤ 3×.
11. **Playthrough simulation** — a headless walker plays N random and N greedy runs, asserting no
    crash, no dead loop, every ending reachable, coverage ≥ 60 % on the spine run.
12. **Save migration** — every historical schema fixture loads.
</content>
