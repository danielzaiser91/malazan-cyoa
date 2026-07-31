# Game Design Plan — Malazan CYOA

The concrete design. Built on `01-cyoa-best-practices.md` and `02-story-graph-save-and-ui.md`,
sourced from `../_knowledgebase/`.

---

## 1. Pitch

A bilingual, illustrated choose-your-own-adventure retelling of **Book 1 of The Malazan Book of the
Fallen — *Gardens of the Moon***. You are a recruit in the Bridgeburners; the
story is being laid out for you, card by card, by a fat little man in Darujhistan who insists he is
merely a passing observer. Branches die. The reading remembers. You lay the cards again.

## 2. The framing device — Kruppe's reading

Every meta-system is diegetic, and one character carries all of them:

| System | In-fiction form |
|---|---|
| Story graph | A **Deck of Dragons reading** Kruppe lays out; each scene is a card |
| Save / checkpoint | Kruppe re-lays the reading from an earlier card |
| Death / game over | "Kruppe misremembers. Kruppe begins again, slightly wiser." |
| Explored dead branch | A card already turned face-up — you know how that one ends |
| Locked branch | A card whose name you do not yet know |
| Codex | Kruppe's marginalia |
| Achievements | Cards collected into the Deck |

This solves the ludonarrative problem of save-scumming for free, gives the flowchart a personality,
and puts the book's warmest voice in the player's ear between chapters. **It is the single most
important design decision in this document.**

## 3. Player character — the dual-track model

**Primary PC:** an original character, a **Bridgeburner recruit** who joins Whiskeyjack's squad
after Pale. Name, gender/pronouns and one of three backgrounds chosen at profile creation:

| Background | Start bias | Opens |
|---|---|---|
| **Marine** (line soldier) | Klinge +2, Herz +1 | Combat routes, squad trust, protecting people |
| **Sappeur** (sapper) | List +2, Klinge +1 | Munitions, sabotage, the Fiddler/Hedge thread |
| **Kadermagier** (cadre mage) | Wille +2, List +1 | One warren, Quick Ben's confidence, Tattersail |

**Why an original PC:** no canon character is present at more than about a third of *Gardens of the
Moon*'s plot, and rewriting canon characters' decisions breaks the promise of staying close to the
book. A recruit is canon-shaped (the Bridgeburners lost most of their people at Pale and took on
replacements), can be *present* at the Malazan thread's events without changing them, and gives
stats and inventory a continuous owner.

**POV interludes:** chapters the Bridgeburners are not in are played as **canon characters** —
Crokus, Tattersail, Lorn, Paran, Kruppe. Interludes:
- use a **fixed, pre-set sheet** (that character's own stats/items), not the PC's;
- **cannot kill the PC**, but can end in their own dead-ends;
- feed **flags and codex**, not PC stats — so the two tracks never entangle mechanically;
- are marked in the flowchart with the character's sigil.

This mirrors the novel's rotating-POV structure instead of fighting it.

> **Confirm with the user before writing content** — this is the one decision that is expensive to
> reverse. Alternative on the table: play **Ganoes Paran** throughout, closer to canon, less
> freedom. Default to the recruit if no answer.

## 4. Stats

Six, all thematic, all tested, all visible.

| Stat | DE | What it does |
|---|---|---|
| **Blade** | Klinge | Violence, endurance, holding a line |
| **Will** | Wille | Warren capacity, resisting possession/domination/fear |
| **Cunning** | List | Deception, tactics, sabotage, reading a room |
| **Heart** | Herz | Compassion. Gates the side arcs, the best endings, and several survivals |
| **Standing** | Ansehen | Reputation inside the squad and with factions |
| **Fortune** | Fügung | Oponn's attention. **Double-edged by design** |

**Fortune is the book's own mechanic made literal.** It raises success odds on chance-driven checks
— and it raises **Divine Attention**, a hidden counter. High attention means gods notice you, and
being noticed is exactly what the prologue warns against: more Fortune, more godly interference,
more lethal branches unlocked. The Coin can be thrown away (canon does this in the epilogue), which
is a real, costed choice.

**Heart is the thematic spine.** Erikson's series is a plea for compassion; the mercy detours cost
time, coin and sometimes lives, and pay in Heart, lore, allies and the endings worth reaching. A
Heart-blind run must be *possible* and must feel colder — never punished with a lecture.

Checks: `stat + d6-ish roll` from a seeded RNG (seed stored in the run state, so a jump-back
replays deterministically and cannot be re-rolled by reloading). **Failure branches, rarely kills.**

## 5. Progression

- **XP** for scenes completed, dead-ends survived-as-knowledge, codex entries, side arcs, mercy.
- **Ascendancy track**, levels 1–10 across Book 1 (the in-world word for levelling). Each level:
  +1 stat point and a choice of one **Talent** from three.
- **Talents** are content keys, not numbers — e.g. *Sapper's Ear* (see traps as choices),
  *Warren-Touched* (a warren option appears in some scenes), *Old Guard's Nod* (Standing checks
  with veterans), *Reader* (see one extra hint on a card in the reading).
- **Coin**: council-marks in Darujhistan, imperial silver crescents with the army — same resource,
  different name by region (flavour only). Spent on gear, bribes, information, and mercy.
- **Inventory**: consumables that appear as **choices when held** — Moranth munitions (sharper,
  burner, cusser), Otataral splinter (kills magic near you, including help), Denul poultice,
  documents, keys. Key items: **Oponn's Coin**, a **Deck of Dragons**, a squad token.
- **Deck cards** as collectibles: found in scenes, granting a small passive or a one-shot reading
  that reveals one adjacent card in the flowchart. This is the diegetic hint system.
- **Relationship flags** with Whiskeyjack, Quick Ben, Fiddler, Kalam, Mallet, Paran, Tattersail,
  Crokus, Sorry/Apsalar — shown in the sheet as sentences, never as hearts or bars.

## 6. Chapter map — Book 1 (`b1`)

Novel → game. Beats are in `../_knowledgebase/50-gotm-chapter-map.md`.

| # | Game chapter | Novel | Playing as | Convergence (bottleneck) |
|---|---|---|---|---|
| 0 | Prolog — Die Maus brennt | Prologue | Paran (child, interlude) | Leaving Malaz City |
| 1 | Die Küste von Itko Kan | Ch. 1 | Recruit *or* Lorn interlude | Boarding for Genabackis |
| 2 | Die Asche von Pale | Ch. 2 | Recruit | The survivors' count after the siege |
| 3 | Die Gasse | Ch. 3–4 | Recruit + Tattersail interlude | Dujek's order: Darujhistan |
| 4 | Stadt des blauen Feuers | Ch. 5–7 | Crokus interlude + Recruit | The Coinbearer is marked |
| 5 | Der Auftrag | Ch. 8–10 | Recruit | The mines are laid |
| 6 | Meuchler | Ch. 11–13 | Recruit + Crokus | Rake ends the ambush |
| 7 | Die Gadrobi-Hügel | Ch. 14–16 | Lorn interlude + Recruit | The Finnest is buried |
| 8 | Die Glocke von K'rul | Ch. 17–19 | Recruit + Crokus | Everyone is inside the city |
| 9 | Das Fest | Ch. 20–22 | Recruit + Crokus + interludes | The Tyrant wakes |
| 10 | Konvergenz | Ch. 23–24 + Epilogue | Recruit | **Endings** |

**Content budget for Book 1:** ~11 chapters · ~95–110 scenes · ~380–430 pages ·
~65,000–75,000 words **per language** · ~400 illustrations.

## 7. Branch taxonomy — what a choice may do

Each chapter carries roughly this mix (tune, don't ignore):

| Type | Count/chapter | Shape |
|---|---|---|
| **Spine choice** | 2–4 | Different route, same convergence. Real divergence, 2–5 scenes each. |
| **Mercy detour** (side arc) | 1 | Stop and help / keep going. Stopping costs time or an opportunity, pays Heart, lore, sometimes an ally. Rejoins the spine. Explicitly requested by the brief — the wounded-bystander pattern. |
| **Lore arc** (side) | 1–2 | Optional, 3–6 scenes, ends in a codex payload and a card. |
| **Dead end** | 1–3 | Death, capture, too late, or a wrong deduction. **3–6 pages of real content first** — a death branch that pays off in characterisation or lore before the game over. |
| **Loopback** | 0–1 | Return to the previous node minus an option, plus knowledge. |
| **Flag choice** | many | In-scene, no structural change, sets who you are. |

**Rule:** every dead-end must teach something the player can *use* after jumping back — a name, a
weakness, a warning, a relationship. Death as pure punishment is banned.

## 8. Endings — Book 1

Design endings first. Five, plus the failure terminals:

| Ending | Condition (sketch) |
|---|---|
| **Die Ausgestoßenen** (canon) | Survive the Fête; the army is outlawed and free |
| **Der Preis der Fügung** | High Fortune / kept the Coin — you end the book as a god's plaything |
| **Die Münze im Meer** | Coin thrown away; the quietest and most human ending |
| **Der Eid** | High Standing + high Heart; the squad becomes something that outlasts the empire |
| **Asche** | Low Heart, high Blade; you survive and nothing else does |
| Terminals | Death / Azath / captured — game over, not endings |

Each ending unlocks its card and an epilogue paragraph per major relationship flag. **No Book-2
teaser** — every ending has to work as an ending (see `../MASTER_PROMPT.md` § 0, Scope). One
discreet closing line noting that this was the first book is the most that is allowed.

## 9. Codex ("Kruppes Marginalien")

Auto-unlocking encyclopaedia — **the feature that makes Malazan playable for newcomers**.
Categories: People · Peoples & Races · Places · Warrens & Magic · The Deck · History · Words.
Every entry is spoiler-scoped and only ever reveals what the player has already met. Proper nouns
in prose are subtly marked and open the entry inline. Target for Book 1: ~180 entries.

## 10. Accessibility and comfort (required, not optional)

Keyboard navigation everywhere · visible focus · screen-reader labels on the chart and every choice
· `prefers-reduced-motion` respected · font size / line width / serif toggle / dyslexia-friendly
font · high-contrast theme · text-reveal speed incl. instant · auto-advance · alt text on every
illustration (write it in the art data, both languages) · no colour-only information (the badges
carry glyphs) · full text-list fallback for the flowchart.

## 11. Out of scope (say no early)

Multiplayer · combat minigames · timed choices · procedurally generated text · voice acting ·
monetisation · Esslemont's novels · anything that requires a backend.

## 12. Scope: Book 1 only

**The project ends with Book 1.** *Gardens of the Moon*, complete and polished, is the whole
deliverable. Whether Book 2 ever follows is the user's decision after playing the finished game —
not an assumption this design makes.

What stays in anyway, because it is nearly free: the engine keys everything (profile, save,
flowchart, codex, content) by book id, so `b1` is never hardcoded. If a second season is ever
green-lit it would bring its own PC track — *Deadhouse Gates* changes continent and cast entirely,
which suits the format — but **nothing for it is written, outlined or researched now.**
</content>
