# _knowledgebase — Index

Curated lore base for **Malazan CYOA**. Written by the preparation agent (2026-07-31) from public
sources; every file names its sources at the bottom. This is a **seed**, not the finished base —
see `90-research-gaps.md` for what the implementing agent must still fill in.

## Rules for this folder

1. **Own words only.** No copying of Erikson's prose. Quotes ≤ 15 words, in quotation marks, with
   attribution — and at most one per file. This project is a transformative fan work; the
   knowledgebase must never become a substitute for the novels.
2. **Every file carries a spoiler scope** at the top: `#spoiler:none`, `#spoiler:gotm` (Book 1),
   `#spoiler:series`. Content written for a chapter may only use facts at or below that chapter's
   spoiler scope.
3. **Facts are sourced.** If a claim comes from fan speculation, mark it `[theory]`. The story
   content must never present a theory as canon.
4. **One topic per file**, kebab-case, numeric prefix for ordering. Split when a file passes ~400
   lines.

## Files

| File | Scope | Content |
|---|---|---|
| `10-series-overview.md` | `#spoiler:series` | The ten books, what each is about, the through-line, publication facts |
| `20-world-magic-warrens.md` | `#spoiler:gotm` | Warrens, Ascendancy, Deck of Dragons, Azath, Convergence |
| `30-races-and-factions.md` | `#spoiler:gotm` | Elder races, the Empire, the free cities, the armies |
| `40-characters-gotm.md` | `#spoiler:gotm` | Every character the game needs for Book 1, with voice notes |
| `50-gotm-chapter-map.md` | `#spoiler:gotm` | Beat-by-beat map of Gardens of the Moon — the game's spine |
| `60-themes-and-analysis.md` | `#spoiler:series` | Erikson's themes, critical reception, fan analysis, `[theory]` section |
| `70-style-and-voice.md` | `#spoiler:none` | How to write in this world without sounding like generic fantasy |
| `90-research-gaps.md` | — | Open research tasks for the implementing agent |

## Source hygiene (learned the hard way — read before researching)

- `malazan.fandom.com` returns **HTTP 402 to `WebFetch`**. Use `WebSearch` snippets, or open the
  page in the Browser pane (`mcp__Claude_Browser__preview_start {url}` → `get_page_text`).
- `malazanexplorer.com` fetches fine and is high quality — prefer it.
- `reactormag.com` hosts the *Malazan Reread of the Fallen* (Bill Capossere / Amanda Rutter),
  chapter-by-chapter with commentary — the single best structured source for adaptation work.
- Wikipedia is reliable for publication data and high-level plot, thin on detail.
- Study-guide sites (SuperSummary and similar) give clean chapter beats; cross-check names against
  the wiki, they misspell freely.
- ❌ **Never** source from, link to, or download pirated copies of the novels. See
  `../MASTER_PROMPT.md` § Legal.
</content>
