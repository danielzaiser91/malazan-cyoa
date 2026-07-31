# MASTER PROMPT — Malazan CYOA

**This document is the complete brief. Read it end to end before touching anything.**
It is written for an implementing agent working in `C:\code\ai\malazan-cyoa` on Daniel's machine.
Preparation (research, knowledgebase seed, design specs) is **already done** and lives in
`_knowledgebase/` and `_reference/`. Your job starts at Phase A.

---

## 0 · Mission

Build **Malazan CYOA**: a bilingual (DE/EN), fully illustrated, browser-based
choose-your-own-adventure that retells **Book 1 of *The Malazan Book of the Fallen* by Steven
Erikson — *Gardens of the Moon*** — from the prologue to its endings. Short, digestible pages with
one illustration each; meaningful choices every few pages; branches that diverge and reconverge;
optional side arcs; dead ends that are worth playing; a spoiler-safe story graph the player can
jump back into with the exact state they had at that point; profiles; saves; a codex; hosted on
GitHub Pages and linked from the portfolio and the arcade.

### 🎯 Scope — read this twice

**This project implements Book 1 and nothing else.** *Gardens of the Moon*, complete, polished,
shipped. Books 2–10 are **not** part of this brief. Whether they ever get made is a decision the
user takes **after** seeing the finished Book 1 — based on how it turned out, what it cost, and
whether it is fun.

What that means concretely:

- **Finished means Book 1 finished**, not "the saga begun". Phase D ends the project.
- **Do not write, outline, research or design content for Books 2–10.** Not a teaser chapter, not a
  beat map, not a "while I'm here" knowledgebase file. `_knowledgebase/90-research-gaps.md` R13
  stays closed.
- **Do build the engine multi-book-*capable*** — profile, save, flowchart, codex and content all
  key by book id (`b1`, `b2`, …) from day one, as specified. That is cheap forward-compatibility,
  not a commitment. Never hardcode `b1`.
- **No cliffhanger the game cannot pay off.** The endings of Book 1 must work as endings. A single
  discreet "hier endet der erste Band" line is fine; a Book-2 teaser is not.
- When Book 1 is done: **report, hand it over, stop.** Then ask whether Book 2 should follow.

## 1 · How to read the repo

| Read when | File |
|---|---|
| Always, first | `CLAUDE.md` — project rules · `status.md` — what is actually in flight |
| Structure & choice design | `_reference/01-cyoa-best-practices.md` |
| Data model, saves, flowchart, validation | `_reference/02-story-graph-save-and-ui.md` |
| Stack, repo layout, versioning, deploy, portfolio | `_reference/03-tech-stack-and-deployment.md` |
| Images | `_reference/04-illustration-pipeline.md` |
| The actual game design | `_reference/05-game-design-plan.md` |
| Where to research | `_reference/06-sources.md` |
| Lore | `_knowledgebase/00-INDEX.md` and the files it lists |
| What still needs research | `_knowledgebase/90-research-gaps.md` |
| Machine-wide rules | `C:\code\ai\ai helper files\ai_agent_boot.md` |
| Known traps | `C:\code\ai\ai helper files\ai_agent_learnings.md` — categories **1, 2, 3, 5, 6, 16, 17** |
| Reference implementation | `C:\code\ai\archmage-idle\` (Vite/TS setup, version banner, deploy, status discipline) |

**Precedence when documents disagree:** `ai_agent_boot.md` → this file → `_reference/` → your own
judgement. If you find a genuine contradiction, say so and propose the fix; do not silently pick.

## 2 · Legal and ethical boundaries — read this before any research

The novels are in copyright. This project is a **transformative, non-commercial fan work**.

- ❌ **Do not download, torrent, scrape, or link to pirated copies of the books.** Do not seek out
  "free full text" sources. Never obtain a copy yourself.
- ✅ **Legally purchased copies supplied by the user** live in `C:\code\ai\_sources\malazan\`
  (outside every repo, never committed — see the README there). You may **read** them to check
  facts: names, spellings, order of events, who was in the room. You may **not** quote, copy,
  paraphrase closely, or lift any sentence into the game, the knowledgebase, a prompt or a commit
  message. If the folder is empty, work from the research sources instead and say so.
  Status 31.07.2026: the user has placed one legally purchased epub there. **Only Book 1 is in
  scope** — if the file turns out to contain more than *Gardens of the Moon*, read nothing beyond
  it; anything later is a spoiler you must not put into the game.
- ✅ Research from the wiki, the Reactor reread, Malazan Explorer, published summaries, interviews
  and fan analysis — all listed in `_reference/06-sources.md`.
- ✅ **Plot events are facts; sentences are property.** Retell events in entirely original prose.
- Quotes: at most one per file, ≤ 15 words, in quotation marks, attributed. Never song-length,
  never poems/epigraphs (Erikson's chapter epigraphs are original verse — do not reproduce them).
- No character-art that copies a specific commercial illustration or names a living artist in a
  prompt.
- Ship a visible **disclaimer**: fan work, unofficial, not affiliated with or endorsed by Steven
  Erikson, Ian C. Esslemont, or their publishers; all rights in the original work remain theirs;
  free, non-commercial, no ads, no monetisation, will be taken down on request. Put it on the title
  screen (link) and in a `LICENSE-CONTENT.md`. Code is MIT; **content is not**.

## 3 · Non-negotiables

1. **Chat responses to the user: German.** Always, including one-line status notes before tool
   calls. The game itself is DE **and** EN.
2. **No PowerShell.** Bash plus the dedicated tools (Read, Write, Edit, Grep, Glob).
3. **Timestamp** at the end of every reply: `🕐 DD.MM.YYYY, HH:MM Uhr`, from
   `date +"%d.%m.%Y %H:%M"`.
4. **Quality gate before every commit:** `npm run check` → `npm run test` → `npm run build`.
   All green or no commit. Content-only changes included.
5. **`status.md` is live.** Every new request goes in the moment it is uttered; finished work moves
   to the archive immediately; the ordering rule in that file is binding.
6. **Every page has an illustration** (real or the deterministic placeholder) and **alt text in
   both languages**.
7. **Branching only at scene ends.** Jump-back targets only scene entries, never mid-scene pages.
8. **The flowchart never spoils.** Unreached scenes leak nothing — no title, no summary, no art,
   no POV. There is a test for this; it must stay green.
9. **Run state rolls back on a jump; meta-knowledge never does.** (Visited scenes, discovered
   outcomes, codex, cards, achievements, coverage.)
10. **No dead end without payoff.** 3–6 pages of real content before any game over.
11. **Content files contain no display text.** All strings live in `src/locales/<lang>/`.
12. **The core is headless.** Everything that decides what happens must run without a DOM and be
    simulatable. No `Date.now()`/`Math.random()` inside pure core — pass time and a seeded RNG.
13. **No sound in the Claude preview pane.** Everything muted there. The shipped game may have
    sound; that rule protects the user from the agent, not the player from the game.
14. **Zero runtime dependencies is the target.** Every added dependency needs a justification line
    in `CLAUDE.md`.
15. **Never claim something works that you have not verified.** Show the check.

## 4 · Feedback and feel (Daniel's standing rules — they apply to this game too)

- **No invisible or silent mechanic.** Every outcome-relevant effect gets a **visual *and* an
  audible** signal: a stat change, an item gained, a flag set, a card unlocked, a lock opening, a
  branch being marked as explored. If the player cannot perceive it, it does not exist.
- **Every lock signposts its own key.** A locked choice shows, in-fiction, what would open it.
- **Animate what can be animated.** Page turns, card flips in the reading, stat ticks, the coin
  spinning, the codex entry sliding in. **One-off events get their own animation and their own
  sound effect** — this is meant even when not spelled out.
- **Make effect legibility scale.** An upgrade/talent must *name* its effect, stay visible
  permanently, and show its scaling.
- Audio is optional for Phase A–C and required by the end of Phase D; default volume modest, a
  mute toggle in settings, and **nothing auto-plays in the preview pane**.

## 5 · Kickoff — four decisions, then go

Open the work with **one short German message** to the user containing exactly these four questions
(they are also in `status.md` § Zu besprechen). **Do not block on them**: state the default you
will use, start Phase A immediately, and only pause where the answer actually gates work (B1 gates
the first chapter text, not the engine).

| # | Question | Default if no answer |
|---|---|---|
| B1 | Player character: own Bridgeburner recruit + POV interludes, or play Ganoes Paran throughout? | Recruit + interludes (see design plan § 3) |
| B2 | One public repo, or private source + public `-live` repo like archmage-idle? | One public repo |
| B3 | Image budget: which provider may cost what for ~400 images? | Free/bulk tier for standard pages, paid only for ~40 hero images, ask before any spend above the threshold |
| B4 | German terminology: official Blanvalet translations or keep original names? | Original names, glossed once in the codex |

## 6 · Phase A — Foundation (nothing is written until this stands)

**A1 · Repo and scaffold**
`git init`, `.gitignore` (node_modules, dist, `.env.local`, `public/illustrations/*.png` working
files), `npm init`, Vite + TypeScript strict + Vitest, the folder layout from
`_reference/03-…` § 2, `README.md`, `TODO.md` (including the portfolio reminder from the boot
file's rule), MIT `LICENSE` for code and `LICENSE-CONTENT.md` for content. Create the GitHub repo
(token is in `my_secrets.md`) — **ask before creating the remote**, it is outward-facing. First
commit: scaffold only.

**A2 · Close the research gaps**
Work `_knowledgebase/90-research-gaps.md` items R1–R9. Write new knowledgebase files following the
rules in `00-INDEX.md` (spoiler scope, sources, `[theory]` tags). Note: `malazan.fandom.com`
returns 402 to WebFetch — use WebSearch or the Browser pane. Update the index table in the same
commit. **This is the largest single research block; budget it properly and commit per topic.**

**A3 · Model and engine core**
`src/model/types.ts` exactly as specified in `_reference/02-…` § 4. Then `src/core/`:
seeded RNG, condition evaluator, effect applier, save/profile module with schema version and
migrations, snapshot/rollback, graph traversal, coverage calculation, i18n. Unit tests for each. **No DOM
anywhere in here.**

**A4 · Content validation suite + headless simulator**
All twelve checks from `_reference/02-…` § 8 as Vitest suites, plus `tools/simulate.mjs`: a
headless walker that plays N random and N greedy runs and reports coverage, unreachable scenes,
loops, and word-count distribution. **Build this before writing content, not after.** It is the
only thing that keeps a 400-page branching graph honest.

**A5 · Views**
Title/profile screen · story view (prose, illustration, choices, backlog) · flowchart view ·
codex · character sheet · settings · content-warning screen · game-over screen. Keyboard
navigation and screen-reader labels from the first commit, not retrofitted.

**A6 · Version banner and cache busting**
Copy the proven pattern from `archmage-idle` (`_reference/03-…` § 4): `GAME_VERSION`, the Vite
plugin writing `dist/version.json`, the 5-minute poll with `cache: 'no-store'`, the banner that
saves → clears caches → reloads, and a permanent version badge.

**A7 · Illustration pipeline and placeholder**
Build the deterministic procedural placeholder **first**, then `tools/art.mjs` with `plan / gen /
optimise / verify`, the manifest, and the style bible constant. Generate one test batch of 6
images across three moods and show them to the user before committing to a look.

**A8 · CI and deploy**
`.github/workflows/deploy.yml` per `_reference/03-…` § 7. Green pipeline, live URL, verified in a
browser — including a hard-reload test that the version banner appears when the version changes.

**A9 · Vertical slice**
Prologue + Chapter 1, **complete**: structure, DE and EN prose, real illustrations, at least one
spine choice, one mercy detour, one dead end, one lore arc, codex entries, a working jump-back, an
achievement, sound where the feel rules demand it. Hand it to the user for a test round
(§ 10 format). **Do not start Chapter 2 before this slice is accepted.**

## 7 · Phase B — Content, chapter by chapter

For each chapter in `_reference/05-…` § 6, in order, one chapter per working block:

1. **Outline** — from the beat map: which novel beats, which scenes, which POV, where the
   convergence sits, which side arcs, which dead ends, which stat checks. Draw the sub-graph in the
   chapter's outline file *before* writing prose. Budget words per branch here (path balance is a
   test).
2. **Structure** — `src/content/b1/cNN.ts`: scenes, pages, edges, conditions, effects, art prompt
   ids. Run the validation suite. It must be green with placeholder text.
3. **Prose DE** — inside the word bands, in the voice from `_knowledgebase/70-style-and-voice.md`.
4. **Prose EN** — a real translation, not a machine pass. Same beats, same bands, natural English.
5. **Art prompts + alt text** (both languages), then `tools/art.mjs gen --chapter`.
6. **Codex** — every new proper noun gets an entry, spoiler-scoped.
7. **Verify** — quality gate, simulator run, manual playthrough of every branch in the chapter
   including every dead end, in both languages.
8. **Commit, push, update `status.md`, report** (§ 10).

**Per-chapter Definition of Done:** every branch playable · every dead end pays off · both
languages complete and in band · every page illustrated with alt text · codex wired · flowchart
placement correct and spoiler-clean · all twelve validations green · playthrough simulated and
hand-checked · pushed and live.

**Do not batch chapters.** One chapter, verified, shipped, then the next. The user tests between
chapters.

## 8 · Phase C — Art at scale

Generate the full book's images in tiers (hero / standard / filler), QA every batch against the
checklist, optimise to webp with the size budget, keep the manifest complete, log reject rates,
and replace every remaining placeholder. The release build must fail on a missing image.

## 9 · Phase D — Polish and ship

- **Balancing:** simulator statistics — are stat checks passable on every background? Does a
  Heart-blind run still work? Are branch lengths within 3×? Is coverage on a single spine run
  ≥ 60 %?
- **Accessibility audit:** keyboard-only playthrough, screen-reader pass, contrast check,
  reduced-motion, font/size/width options, text-list fallback for the flowchart.
- **Performance:** bundle ≤ 200 KB gzipped, first chapter interactive < 2 s on a mid phone over 4G,
  image budget respected, prefetch of the next page's art.
- **Audio:** ambience per region, UI sounds, one-off SFX for one-off events. Muted in preview.
- **Save robustness:** migration fixtures, quota handling, export/import round-trip test.
- **Endings pass:** all five endings reachable and distinct; epilogue paragraphs per relationship
  flag.
- **Deploy** and verify live; **then** portfolio + arcade entries per `_reference/03-…` § 8
  (separate repo, separate commit, screenshot via the portfolio's own capture tool).

## 10 · Working rhythm and reporting

- **Commits:** small, one logical change, body explains cause and fix, auto-push after a verified
  change. Never `--no-verify`, never force-push `main`.
- **`status.md`** updated in the same commit as the work it describes.
- **Reports to the user are short.** One sentence on cause, what changed, how it was verified.
  Terse by default; full detail only when asked. **Exception: lists of findings are never
  shortened** — if you report what is missing or broken, every item goes in.
- **When you ask the user to test:**
  - Test instructions come **first**, before the change report.
  - Format per scenario: the handful of steps, then exactly one `→` expectation line. No "TESTEN:"
    header, no prose.
  - **Always include the URL** in the same message.
  - Number scenarios **1..N with no gaps**; renumber on every list change, because the user's
    feedback refers to the numbers in *their* build.
  - Variants of the same scenario are `a`/`b`/`c`.
  - Accepted debug saves/scenarios are deleted immediately and the list renumbered — never present
    an unchanged scenario for testing twice.
  - For visual changes, offer a **comparison pair**: the same state with and without the change.
- **When the user reports a problem:** take their diagnosis seriously, verify it, fix exactly that,
  add a regression test that reproduces the reported case.
- **Feedback rounds:** collect everything first, check it critically, build a *new* plan rather
  than continuing the old queue mechanically, name conflicts explicitly at the end, and give every
  task a story-point estimate.

## 11 · Project-level Definition of Done — this is the end of the project

- [ ] The whole of *Gardens of the Moon* is playable from the prologue to at least five distinct
      endings, in German and in English.
- [ ] ~95–110 scenes, ~380–430 pages, every page illustrated, alt text in both languages.
- [ ] Branch, reconverge, side arcs, mercy detours, dead ends with payoff — all present in every
      act.
- [ ] Flowchart: complete, spoiler-safe, jumpable, filterable, with outcome badges, coverage
      display, and a text fallback.
- [ ] Profiles with independent saves, checkpoints, export/import, and tested migrations.
- [ ] Stats, XP, levels, talents, coin, inventory, cards, relationship flags — all visible, all
      tested somewhere in the story, all with visual **and** audible feedback.
- [ ] Codex ~180 entries, spoiler-scoped, inline from the prose.
- [ ] Accessibility audit passed; performance budget met.
- [ ] Version banner and cache busting verified live.
- [ ] Deployed to GitHub Pages; entries in the portfolio and the arcade; screenshot captured.
- [ ] Disclaimer visible; no copyrighted prose anywhere in the repo.
- [ ] `npm run check`, `npm run test`, `npm run build` green; simulator reports no unreachable
      scene and no orphan.

When every box is ticked, the project is **done**. Write the handover: what was built, what it
cost (time, images, API spend), what you would do differently, and which parts of the engine would
carry a second book for free. Then ask the user whether *Deadhouse Gates* should follow — and wait.
**Do not start it on your own initiative.**

## 12 · Failure modes to avoid (each has killed a project like this)

| Trap | Guard |
|---|---|
| Writing content before the validator exists | Phase A4 is mandatory and comes first |
| Branch explosion — 40 hours of content nobody sees | Merge at convergences; state, not structure, carries difference; path balance test |
| The flowchart spoils the book | The spoiler test; unreached = nothing rendered |
| Save format changes and everyone loses their run | Schema version + migration + fixtures from day one |
| 400 images in 12 different styles | Locked style suffix, character sheets pasted verbatim, batch QA |
| German as an afterthought | Both languages are done in the same chapter block, or the chapter is not done |
| Prose drifting toward the original's wording | Write from the beat map, never with a passage open beside you |
| "It works" without proof | Verify in the browser; show the check |
| Silent mechanics | Rule 4: visual **and** audible, always |
| A chapter that quietly becomes 900 pages | Word budget in the outline step, checked by test |

## 13 · Glossary of our own terms

**Scene** — the jumpable unit, 2–8 pages. · **Page** — one screen, one illustration. ·
**Convergence** — a bottleneck node where all routes meet; also the in-world word for it. ·
**Reading** — the story graph, framed in-fiction as Kruppe's Deck of Dragons layout. ·
**Snapshot** — the run state captured on first entering a scene. · **Run state** — rolled back on
a jump. · **Meta state** — never rolled back. · **Mercy detour** — the optional side arc that costs
something and pays in Heart and lore. · **Hero image** — a chapter opener/convergence/ending
illustration that gets the expensive provider.

---

*Prepared 31.07.2026. Everything in `_knowledgebase/` and `_reference/` was researched and written
as preparation for this brief; treat it as a starting point that you extend, not as gospel — but if
you deviate from a binding spec, say why, in `status.md`, in the same commit.*
</content>
