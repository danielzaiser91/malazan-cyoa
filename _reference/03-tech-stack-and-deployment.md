# Tech Stack, Architecture and Deployment

Binding. Chosen to match the rest of Daniel's ecosystem (`archmage-idle`,
`incremental-adventure-rewritten`) so the patterns are already proven here.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Build | **Vite 7** | Same as the other games; fast, hashed asset names for free |
| Language | **TypeScript 5.9, `strict: true`** | Content schema only pays off if it is type-checked |
| UI | **Vanilla TS + a tiny render layer of our own** (no React/Angular) | The app is a text renderer plus an SVG chart; a framework buys nothing and costs bundle |
| Tests | **Vitest** | Same as the other projects |
| Styling | Plain CSS with custom properties, one stylesheet per view | No build-time CSS deps |
| Chart | **Inline SVG**, hand-rolled layout (columns per chapter) | Predictable, exportable, accessible, no library |
| i18n | Own tiny module: flat key→string maps per locale, `t(key, vars)` | ~40 lines, no dependency |
| Persistence | `localStorage` behind one module | See the save spec |
| Deps | **Target: zero runtime dependencies** | Every dep must be justified in `CLAUDE.md` |

> Alternatives considered and rejected: **ink/inkjs** and **Twine/Harlowe** — excellent for pure
> branching prose, but they own the state model and fight the flowchart/checkpoint/i18n
> requirements. Our content is data, not a script language. Keep it.

## 2. Repository layout

```
malazan-cyoa/
  MASTER_PROMPT.md            the brief this project runs on
  CLAUDE.md                   project rules for every agent session
  status.md                   live task queue (see the global status.md rule)
  README.md
  TODO.md                     incl. the portfolio reminder
  _knowledgebase/             lore research (md)
  _reference/                 design + engineering specs (md)  ← this file
  tools/                      node scripts: art pipeline, validators, capture, wordcount
  public/
    illustrations/            <pageId>.webp  (+ .avif when it wins)
    ui/                       sigils, card backs, textures
  src/
    core/                     version.ts, rng.ts, conditions.ts, effects.ts, save.ts, i18n.ts
    model/                    types.ts (Scene/Page/Choice/Effect/Condition), registry.ts, graph.ts
    content/
      b1/                     structure: chapters + scenes + pages, no prose
      art/                    per-page art prompts (data, not images)
    locales/
      de/b1/*.ts              prose, titles, summaries, choice labels, codex
      en/b1/*.ts
    views/                    story.ts, flowchart.ts, profile.ts, codex.ts, sheet.ts, settings.ts
    style/
  tests/
    content/                  the 12 validation suites from the graph spec
    engine/                   conditions, effects, save migration
    fixtures/saves/           one save per historical schema version
```

**Hard architectural rule — headless core:** everything that decides *what happens*
(conditions, effects, graph traversal, save/rollback, coverage) lives in `core/` + `model/` and is
**pure, DOM-free and simulatable**. `views/` may only read state and dispatch intents. A headless
playthrough simulator must be able to play the entire game with no browser. This is what makes the
content validation suite possible.

## 3. Content authoring rules

- **Structure and prose are separate files.** `content/` holds ids, kinds, edges, conditions,
  effects, art prompts. `locales/<lang>/` holds every player-visible string. A content file that
  contains a German sentence is a bug.
- Content modules export plain objects typed by `model/types.ts`. No functions, no classes, no
  imports of engine code — content must stay serialisable.
- One file per chapter, e.g. `content/b1/c03.ts` and `locales/de/b1/c03.ts`. Keeps diffs and merge
  conflicts small and makes per-chapter progress visible.
- A `tools/new-scene.mjs` scaffolder writes the paired stubs in `content/`, `locales/de`,
  `locales/en` and `content/art/` so the four never drift apart.

## 4. Versioning, cache busting, update banner

Proven pattern from `archmage-idle` — reuse it as-is.

1. `src/core/version.ts` exports `GAME_VERSION` (semver). Bump on every deploy; the value is the
   single source of truth.
2. A Vite build plugin writes `dist/version.json` at `closeBundle`:
   ```js
   { "version": GAME_VERSION, "build": process.env.GITHUB_SHA?.slice(0,7) ?? "local" }
   ```
3. Vite's hashed filenames handle JS/CSS busting. `index.html` itself is served with
   `Cache-Control: no-cache` semantics by Pages; the poll below covers the rest.
4. The client polls `${import.meta.env.BASE_URL}version.json?t=${Date.now()}` with
   `{ cache: 'no-store' }` every 5 minutes and on `visibilitychange`. If `version` differs from
   `GAME_VERSION`, show a discreet update banner.
5. Clicking the banner: flush the save, `await Promise.all(caches.keys().then(ks => ks.map(k => caches.delete(k))))`,
   then reload with a cache-busting query. **Save first, always.**
6. A permanent, unobtrusive **version badge** (`v0.4.2 · a1b2c3d`) sits in the settings panel and
   in the corner of the title screen, so bug reports carry a build id.

⚠️ `Date.now()` is fine in app code. It is **forbidden in content and in any pure-core function**
that a test or the simulator replays — those take time as an argument.

## 5. Assets and performance budget

| Rule | Value |
|---|---|
| Illustration format | `webp` (quality ~82), `avif` additionally only if ≥ 25 % smaller |
| Illustration size | 1280×720 landscape master; ship 1280 and 640 variants via `srcset` |
| Per-image budget | ≤ 180 KB; hard fail the build over 300 KB |
| Loading | `loading="lazy"` + **prefetch the next page's image** on page render |
| Initial bundle | ≤ 200 KB gzipped JS |
| First chapter | must be playable in < 2 s on a mid phone over 4G |
| Repo size | keep an eye on it — hundreds of images; if the repo passes ~500 MB, move art to a separate `-assets` repo or a release artifact and fetch by URL |

An **offline/PWA layer is optional** and explicitly Phase E: a service worker that precaches the
shell and the current chapter's images. If built, the update banner must invalidate it correctly —
that interaction is the classic source of "player stuck on an old build".

## 6. Quality gate (run before every commit, and in CI)

```
npm run check      # tsc --noEmit
npm run test       # vitest run  (incl. the content validation suites)
npm run build      # vite build
```

Never commit with any of the three red. Content-only commits still run all three — the content
suite is where broken links get caught.

## 7. Deployment — GitHub Pages

- Repo `danielzaiser91/malazan-cyoa`, **public** (it is a portfolio piece; the content *is* the
  product and there is nothing to hide).
- `vite.config.ts`: `base: command === 'build' ? '/malazan-cyoa/' : '/'`.
- Workflow `.github/workflows/deploy.yml`, triggered on push to `main` (and `workflow_dispatch`):
  `checkout → setup-node 22 → npm ci → check → test → build → touch dist/.nojekyll →
  actions/upload-pages-artifact → actions/deploy-pages`.
- `concurrency: { group: deploy, cancel-in-progress: true }`.
- Live at `https://danielzaiser91.github.io/malazan-cyoa/`. Pages needs ~2–3 minutes after the
  push; when reporting a deploy, state the push time and the expected live time.
- **Deploy only when the gate is green.** A red build never reaches `main`.

## 8. Portfolio and Arcade integration (do this once the game is playable end-to-end)

Repo `danielzaiser91/Portfolio-daniel-zaiser.de`, local checkout `C:\code\ai\my website`.

**a) Projects page** — add an entry to `src/app/data/projects.ts`:
`name: 'malazan-cyoa'`, `category: 'fun'`, `tech: [...]`, bilingual `description` / `knowledge`
(`LText`), `commits`, `started`, `lastTouched`, `estHours`,
`demo: 'https://danielzaiser91.github.io/malazan-cyoa/'`, `preview: true`.
Also add the repo to the `LANGUAGES` map (`'malazan-cyoa': 'TypeScript'`).

**b) Arcade page** — add an entry to `src/app/data/games.ts` (`GAMES` array, German-only copy by
design):
```ts
{
  title: 'Malazan — Das Buch der Gefallenen',
  emoji: '🌑',
  url: `${PAGES}/malazan-cyoa/`,
  kind: 'game',
  categories: ['story'],
  players: '1',
  playtime: '…',
  situation: '…',      // for which mood this is the right pick
  description: '…',    // Daniel's voice: concrete, dry, no marketing
  tags: ['Story', 'Choose your own Adventure', 'Malazan', 'Browser & Handy'],
  preview: shot('malazan-cyoa'),
}
```
**c) Preview screenshot** — the projects page expects
`public/images/previews/projects/malazan-cyoa.webp`; it is produced by the portfolio's own
`tools/capture-previews.js`. Run it, don't hand-crop.

**d)** Portfolio changes are a **separate commit in a separate repo**, and per the global rule the
portfolio entry itself is a deliberate decision — put the reminder in `TODO.md` first and only add
it when the game is genuinely presentable.

## 9. Known traps (from `ai_agent_learnings.md` — read categories 1, 2, 3, 5, 6, 16, 17)

- GitHub Pages under a sub-path: any hard-coded `/foo` asset URL breaks. Always
  `import.meta.env.BASE_URL`.
- `localStorage` writes must be a single funnel or two views will race and clobber a save.
- Patch scripts via shell heredoc eat backslashes — write the script to a file, then run it.
- Externally sourced images: check licence *before* committing, record it in `public/CREDITS.md`.
- The Claude preview pane must stay silent: any `<audio>`/`<video>` muted, no auto-playing
  `AudioContext`. That rule is about the preview only — the shipped game may have sound.
</content>
