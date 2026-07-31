# CYOA / Choice-Based Narrative — Best Practices

Research distillation, 2026-07-31. Sources at the bottom. **This file is binding**: where it
conflicts with an ad-hoc idea during implementation, this file wins unless the design plan
overrides it explicitly.

---

## 1. Macro-structure: pick a shape on purpose

Sam Kabo Ashwell's taxonomy is the standard vocabulary. Seven shapes:

| Shape | What it is | Costs | Fits us? |
|---|---|---|---|
| **Time Cave** | Branch, branch, never merge. Dozens of endings. | Content explodes; the player sees ~5 % of it | ❌ as a whole, ✅ for the final act |
| **Gauntlet** | One anointed path, side branches die fast (deadly) or rejoin fast (friendly) | Player feels the rails; can feel punishing | ✅ as a component |
| **Branch and Bottleneck** | Branches rejoin at fixed story beats; **state carries the difference** | Needs real state-tracking; needs length before choices visibly pay off | ✅ **the backbone** |
| **Quest** | Geographic clusters of nodes, multiple routes to the same objective, limited backtracking | Big; complexity grows fast | ✅ for optional side-arcs |
| **Open Map** | Free reversible movement in a static world | Story stalls; needs enormous content | ❌ |
| **Loop and Grow** | The same sequence repeats, state opens and closes options | Needs an in-fiction reason for repetition | ⚠️ only as an in-fiction framing for replay |
| **Floating Modules** | No spine; encounters unlock by state (quality-based narrative) | Hard to author; collapses to linearity without volume | ❌ |

**Our shape: Branch-and-Bottleneck spine + Gauntlet-ish deadly side branches + Quest-shaped
optional arcs.** The novel already works this way — Erikson's *convergences* are bottlenecks with
better PR.

Sub-patterns worth naming, because we use all of them:
- **Bottleneck** — many branches, one door. Our chapter boundaries.
- **Loopback** — a branch that returns you to the node you left, minus time/resources/an option.
- **Death-dead-end** — a terminal node. Cheap to write, and cheap-feeling if overused.
- **Hub-and-spoke** — one node offering several optional excursions that all return.

## 2. The exponential problem, and the four honest answers

Full binary branching for 20 chapters is a million endings. Real games use:

1. **Merge aggressively, differentiate by state.** Same node, different text fragments depending on
   what the player did. This is the workhorse — 80 % of perceived branching should come from here.
2. **Delayed consequence.** A choice sets a flag; the payoff is two chapters later. Feels enormous,
   costs one conditional paragraph.
3. **Deferred branching / false branching.** Several choices reach the same next beat by different
   routes. Legitimate and standard — *provided* the routes differ in texture, not just wording.
4. **Bounded true branching.** Reserve real, expensive, multi-node divergence for a handful of
   marked decisions per act. Announce them with weight (music, framing, an illustration change).

> If a decision has no effect on anything, why make it a decision? Effect ≠ branch: effect can be a
> stat, a flag, a line of dialogue, a door that opens in the last chapter.

## 3. Writing choices that are worth making

- **3–4 options is the sweet spot.** Two feels binary, five feels like a menu.
- Every option must be **plausibly appealing to somebody**. No obvious trap options; no option that
  is clearly the "right" one.
- **Choices differ in kind, not degree.** Fight / sneak / talk beats "attack hard / attack harder".
- **Never hide the stakes to create difficulty.** Hide the *outcome*, show the *nature of the risk*.
  "Draw on the warren — they will feel it" is fair. "Do the thing" is not.
- Label choices in the player's voice, short, present tense, no more than ~12 words.
- **Character-expressive choices** (what kind of person am I) engage as strongly as tactical ones,
  and cost far less to implement — they set flags, not branches.
- **Escalating / confirmation choices** for genuinely fatal moves: ask again, in-fiction, so a death
  is always something the player opted into twice.
- **Scored choices**: instead of branching per decision, tally a stance across a scene and branch
  once on the aggregate. Cheap, and reads as very responsive.
- **Re-enterable conversation nodes**: let the player exhaust several topics before advancing.
  Turns exposition into agency at almost no structural cost. (This is *Fallen London*'s trick.)

## 4. Pacing, length, and the page

- Interactive prose is read **slower** than a novel; screens must be shorter than book pages.
- **Choice frequency**: something interactive every 2–4 pages. Even a low-stakes choice breaks a
  wall of text and resets attention.
- **Page length bands** (target, prose words, DE and EN each):

| Band | Words | Use |
|---|---|---|
| Beat | 60–110 | Action, violence, a single reveal, cliffhanger before a choice |
| Standard | 120–200 | Default scene page |
| Long | 220–320 | Lore, atmosphere, quiet character scenes, chapter openers |
| Hard cap | 400 | Never exceed; split instead |

- **Keep path lengths comparable.** A branch that is three pages against a sibling of fifteen feels
  like a punishment for choosing it.
- **Beware bushiness.** Content only 5 % of players see is where projects die. Budget it: aim for
  every player seeing ≥ 60 % of the words on a single playthrough of the main spine.
- Line length 45–75 characters desktop, 30–50 mobile; ≥ 16 px body text; line-height ≥ 1.5 for long
  reading.

## 5. State, stats and fairness

- Stats must **match the theme**. A stat that never changes the story is decoration; a stat the
  player cannot influence is a trap.
- **Show the stat before it is tested**, or make failure interesting. Never fail a player for a
  number they had no way to grow.
- **Failure should branch, not block.** A failed check opens a different, worse-but-alive route far
  more often than it kills.
- Design **endings first**, then work backwards to the choices that reach them. Prevents the
  classic "all branches funnel into one hastily written ending".
- Keep a **visible stat screen**. Hidden stats are fine as flavour, but at least one honest surface
  must exist or players stop believing the system.

## 6. Death, restart and the flowchart (the Zero Escape lesson)

The single most successful implementation of "branch, die, come back and take the other path" is
*Zero Escape: Virtue's Last Reward*'s **FLOW chart**, and *Detroit: Become Human*'s post-chapter
flowchart is the mainstream version. What they get right:

- The chart is **built into the design from the start**, not bolted on. It *is* the save system.
- The player can **jump to any reached branching point** and keep the state that belonged to it.
  No linear rewind, no lost progress, no replaying prose they have already read.
- **Reached nodes show title + summary. Unreached nodes show nothing** — a shape and a lock. This
  is what makes the chart a map instead of a spoiler sheet.
- **Explored branches are visibly marked** (dimmed, checkmarked, outcome icon), so the player can
  see at a glance what is left. Detroit goes further and shows *what you missed*, which is what
  drives its replay numbers.
- **Locked nodes are legible as locked**, and the lock itself hints at what unlocks it — "you do
  not yet know the name". A wall the player cannot read is a bug, not mystery.
- Dead ends are **content, not punishment**: a good death branch is 3–6 pages that pay off with
  lore or characterisation before the game-over screen.

Corollaries we adopt:
- Jumping is allowed **only to bottleneck/checkpoint nodes**, not to arbitrary pages. Mid-scene
  re-entry destroys pacing and lets players micro-optimise a scene into meaninglessness.
- Every jump restores the **exact snapshot** taken when that node was first reached.
- After a game over, the chart opens automatically with the relevant checkpoints highlighted.

## 7. Replay, discovery and completion

- Give **first-chapter variation** (the "sorting hat"): an early, cheap divergence that makes a
  second playthrough feel different immediately.
- Track and display **coverage**: pages seen / total, endings found, cards collected. Completion
  metrics are the main replay driver in this genre.
- Reward re-treading with **new text, not skipped text**: a page revisited on another route can
  carry one extra paragraph the first pass did not.
- Offer **skip-read-text** and **auto-advance** as reader comforts, plus a **history/back-log** of
  the last N pages.

## 8. Anti-patterns (each one has sunk a real project)

| Anti-pattern | Fix |
|---|---|
| Fake choices that all print the same next page verbatim | Vary the texture or set a flag; never nothing |
| Instant unforeshadowed death | Foreshadow, or make death a branch with 3+ pages of payoff |
| Guess-the-author's-mind puzzles | State the nature of the risk in the choice label |
| Stat checks the player cannot see coming | Surface the stat, or make failure a route |
| Branch lengths wildly unequal | Budget words per branch during outlining, not after |
| Bottleneck that erases the last hour | Acknowledge the difference in text at the merge — one sentence is enough |
| Story graph that spoils the plot | Titles and summaries hidden until reached; shape visible, content not |
| Save system that loses the run | Versioned schema + migration + export/import from day one |
| Endless prologue before first choice | First real choice inside the first three pages |

---

**Sources**
[Ashwell — Standard Patterns in Choice-Based Games](https://heterogenoustasks.wordpress.com/2015/01/26/standard-patterns-in-choice-based-games/) ·
[Emily Short — Small-Scale Structures in CYOA](https://emshort.blog/2016/11/05/small-scale-structures-in-cyoa/) ·
[Choice of Games — 5 Rules for Writing Interesting Choices](https://www.choiceofgames.com/2010/03/5-rules-for-writing-interesting-choices-in-multiple-choice-games/) ·
[Choice of Games — How We Judge a Good Game, Part 3](https://www.choiceofgames.com/2017/04/how-we-judge-a-good-game-part-3/) ·
[Choice of Games — Length and Coding Efficiency](https://www.choiceofgames.com/2017/07/length-and-coding-efficiency/) ·
[Zero Escape Wiki — FLOW Chart](https://zeroescape.fandom.com/wiki/FLOW_Chart) ·
[VN Paths — Flowcharts in Visual Novels Explained](https://vnpaths.com/flowcharts-in-visual-novels-explained/) ·
[PlayStation LifeStyle — Detroit's narrative flowchart and replayability](https://www.playstationlifestyle.net/2019/07/15/detroit-become-human-flowchart/) ·
[Christy Tucker — Branch and Bottleneck Scenario Structure](https://christytuckerlearning.com/branch-and-bottleneck-scenario-structure/) ·
[UXPin — Optimal Line Length for Readability](https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/) ·
[IntFiction forum — Word count for games of various length](https://intfiction.org/t/word-count-for-games-of-various-length/5254)
</content>
