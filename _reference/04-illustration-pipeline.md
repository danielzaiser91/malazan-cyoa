# Illustration Pipeline

Every page carries one illustration. For Book 1 that is on the order of **350–450 images**. That
scale is only survivable with a pipeline, a style bible and a placeholder that is never ugly.

---

## 1. Non-negotiables

1. **Art never blocks writing.** A page without a finished illustration renders a deterministic
   procedural placeholder and the game stays shippable. The *release* build fails on missing art;
   the dev build does not.
2. **Prompts are content.** Each page has an art prompt stored as data
   (`src/content/art/b1/c03.ts`), versioned in git, reviewable in a diff. Regenerating the whole
   book must be one command.
3. **Style consistency beats individual image quality.** 400 images in one coherent look beat 400
   individually gorgeous images in 12 different looks.
4. **No living artist's name in a prompt.** Describe the look, don't invoke a person.
5. **Every generated file is logged** — provider, model, seed, prompt hash, date — in
   `public/illustrations/manifest.json`, so any image can be regenerated identically.

## 2. Style bible (lock before generating anything)

**Look:** painterly, desaturated, high-contrast; oil-and-ash palette. Weight and weather over
detail. Figures are often small against architecture, sky or ruin — this world is old and the
people in it are not the biggest thing in the frame.

**Palette anchors** (also drive the placeholder art and the chapter accent colours):

| Set | Colours | Used for |
|---|---|---|
| Ash & Rust | `#2A2622` `#4A3B31` `#8C5A3C` `#C9743A` | Malazan army, sieges, Pale |
| Blue Fire | `#0B1622` `#1B3A57` `#2F7FA6` `#7FD4E8` | Darujhistan at night |
| Moon's Spawn | `#12121A` `#2B2A45` `#4C4A78` `#B9B4D6` | Rake, Tiste Andii, Kurald Galain |
| Bone & Dust | `#3A362E` `#7A7160` `#B8AC93` `#E4DCC6` | T'lan Imass, the plain, barrows |
| Hood's Grey | `#191B1D` `#3C4245` `#6E7679` | death, gates, endings |

**Composition rules:** 16:9. One clear focal read at thumbnail size (the flowchart shows these
small). No text in the image, ever. No modern objects. Faces are rarely close-up — the novels
withhold, so should the art.

**Mood tags** (`ArtMood` in the schema) map to lighting and palette:
`siege · street-night · warren · dream · council · march · ruin · duel · divine · aftermath`.

## 3. Character consistency

Create `_reference/art-character-sheets.md`: for every recurring character, a fixed 25–40 word
appearance description that is **pasted verbatim** into every prompt featuring them. Example shape:

> **Whiskeyjack** — grey-bearded human man in his fifties, cropped grey hair, weathered face,
> scarred hands, plain dark-grey Malazan leather and mail, no insignia, carries a longsword,
> stands like someone who has been standing a long time.

Same treatment for the recurring places (Moon's Spawn, the Phoenix Inn, Majesty Hill, the barrow).
Never re-describe a character from memory mid-project — always paste the sheet.

## 4. Prompt template

```
{SCENE}. {SUBJECT_AND_ACTION}. {CHARACTER_SHEETS}. {SETTING_DETAIL}.
{MOOD_LIGHTING}. {PALETTE_ANCHOR}.
--- fixed style suffix (identical for every image in the project) ---
painterly digital oil, desaturated high-contrast, textured brushwork, cinematic wide shot,
volumetric haze, grim epic fantasy, no text, no watermark, no modern objects, 16:9
```

Keep the suffix in one constant. Changing it is a project-wide decision and forces a re-render
budget discussion, not a quiet edit.

## 5. Providers

Keys live in `C:\code\ai\ai helper files\my_secrets.md` (§ Image Generation APIs). **Never commit a
key; read it from the environment or a git-ignored `.env.local`.**

| Order | Provider | Notes (as of 2026-07) |
|---|---|---|
| 1 | **Hugging Face Inference — FLUX.1-schnell** | Fast, cheap/free tier, good enough for bulk. Verify availability first; FLUX.1-dev and SD3.5 were unavailable on the `hf-inference` provider. |
| 2 | **Gemini image ("nano banana", `gemini-2.5-flash-image`)** | Strong prompt adherence. Prepay credits only — the stored key was **out of credits (HTTP 429) on 17.07.2026**; re-check before relying on it. |
| 3 | **Leonardo AI** | Good for consistent character work. |
| 4 | **OpenAI GPT Image** | Highest fidelity, highest cost — reserve for hero images. |
| 5 | **Pixazo** | Fallback. |

**Tiering** — do not spend hero-image money on a corridor:
- *Hero* (chapter openers, convergences, endings — ~40 images): best provider, several candidates,
  manual pick.
- *Standard* (most pages): bulk provider, one shot, auto-accept unless the QA pass rejects it.
- *Filler* (short transitional beats): bulk provider at lower steps, or a hand-tuned procedural
  placeholder if it reads better.

## 6. `tools/art.mjs` — the pipeline script

```
node tools/art.mjs plan                    # what is missing / stale (prompt hash changed)
node tools/art.mjs gen --chapter b1.c03    # generate the missing ones
node tools/art.mjs gen --id b1.c03.s02.p04 --provider openai --n 4   # hero, pick manually
node tools/art.mjs optimise                # → webp 1280 + 640, budget check
node tools/art.mjs verify                  # coverage, sizes, manifest integrity
```

Requirements: resumable (never regenerate what exists unless `--force`), rate-limit aware with
backoff, writes the manifest entry atomically, and **prints a cost estimate before starting a batch
and asks for confirmation** when a run would exceed a configured threshold.

## 7. Placeholder art (build this first, before any generation)

Deterministic procedural SVG from the page id: chapter palette gradient, a House sigil from the
Deck, subtle noise, and the mood tag as a shape motif. Same id → same placeholder, always. It must
look *intentional*, so an unfinished chapter is presentable rather than broken.

## 8. QA pass

After every batch, a human-or-agent review against a checklist: right characters, right number of
limbs, no text artefacts, no anachronism, readable at 160 px wide, palette on-brand. Rejects go
back into the queue with a note appended to the prompt. Track the reject rate per provider in the
manifest — it decides where the budget goes next.

## 9. Licensing and credit

- Generated images: state the provider and model in `public/CREDITS.md`.
- Any non-generated asset (texture, font, UI sigil): record source + licence **before** committing.
- Fonts: self-hosted, open licence only (no Google Fonts CDN call — offline and privacy).
- The game carries a clear fan-work disclaimer; see `MASTER_PROMPT.md` § Legal.
</content>
