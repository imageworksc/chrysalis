# Chrysalis Health — Children's Mental Health Design System

Extracted from the existing implementation in `index.html`, per the Design System Gate.
This file codifies **what exists**, not what we wish existed. Inconsistencies found during
extraction are listed in Section 8.

**Standing client constraints — these override any taste preference in this document:**
copy is frozen, the palette may not gain a colour, the typefaces may not change.

---

## 1. Atmosphere & Identity

Clinical calm without coldness. A parent arriving here is usually worried and unsure, so the
page never shouts and never decorates for its own sake: it answers, then offers one obvious
next step. Surfaces are cool, papery and lightly textured; accents are used sparingly and
always mean something — green marks reassurance and affirmation, blue marks information and
navigation.

**The signature is the alternating band with a badge-led section head.** Every section opens
with the same 52px tinted icon badge over a heading, and bands alternate white / paper / tint
/ ink so the page reads as a sequence of rooms rather than one long scroll. The ink bands are
where the page gains depth: a faded dot grid plus an off-canvas accent glow.

---

## 2. Color

Palette is **frozen**. Every value below already existed in the client's stylesheet; nothing
was added. A colour not in this table may not appear in the codebase.

### Brand

| Role | Token | Value | Usage |
|---|---|---|---|
| Green / base | `--ch-green` | `#87bf57` | Accent rules, glows, badges on dark, dark-band glyphs |
| Green / deep | `--ch-green-dk` | `#6aaa35` | Legacy brand green; not used for text on light |
| Green / CTA | `--ch-green-cta` | `#4f8226` | **Only** solid button fills and glyphs on light (4.6:1 on white) |
| Green / CTA hover | `--ch-green-cta-dk` | `#3f6a1d` | Header CTA hover |
| Green / tint | `--ch-green-lt` | `#eef5e6` | Badge and callout backgrounds |
| Blue / base | `--ch-blue` | `#52a5cf` | Accent rules, glows, list markers, dark-band glyphs |
| Blue / mid | `--ch-blue-dk` | `#3d8fb8` | Graphical strokes only (3:1), never small text |
| Blue / deep | `--ch-blue-deep` | `#23617f` | Section labels, links, focus ring, CTA band (6.8:1 on white) |
| Blue / tint | `--ch-blue-lt` | `#e8f4fb` | Badge backgrounds, step numbers, callouts |
| Announce | `--ch-announce` | `#2f7ea5` | Announcement bar (4.5:1 with white 16px bold) |
| Announce hover | `--ch-announce-dk` | `#26688a` | Announcement bar hover |

### Surface & text

| Role | Token | Value | Usage |
|---|---|---|---|
| Surface | `--ch-surface` | `#ffffff` | Cards, white bands, form |
| Paper | `--ch-paper` | `#f7f9fa` | Page background, input rest state |
| Paper 2 | `--ch-paper-2` | `#eef2f5` | Image placeholders, tag chips |
| Tint band | `--ch-tint-blue` | `#f5f9fc` | Play-therapy band wash |
| Ink | `--ch-ink` | `#16323f` | Dark bands, button hover, mask stops |
| Ink 2 | `--ch-ink-2` | `#0f2530` | Footer |
| Rule | `--ch-rule` | `#e2e9ed` | Default 1px borders, dividers |
| Rule strong | `--ch-rule-dk` | `#cfdae0` | Input borders, hover borders |
| Text / heading | `--ch-navy` | `#2e2e2e` | H1–H3, list text on light |
| Text / body | `--ch-body` | `#4c5a62` | Body copy |
| Text / card | `--ch-card-txt` | `#5e6c75` | Card and tile copy (5.4:1) |
| Text / muted | `--ch-muted` | `#5f7480` | Notes, form hints |

### Header & navigation neutrals

Inherited verbatim from the client's header stylesheet. Literals rather than tokens because
they are scoped to navigation chrome and never appear in content.

| Value | Usage | Contrast |
|---|---|---|
| `#2e3a4a` | Utility link, mobile nav label | 10.4:1 on white |
| `#55636f` | Primary nav item, mobile sub-link | 6.2:1 on white |
| `#45525e` | Dropdown link | 8.1:1 on white |
| `#9aa6b0` | Disabled "Soon" service | exempt (disabled control) |
| `#7a8792` | "Soon" tag label | exempt (disabled control) |
| `#33501c` `#4a6530` `#dff0c8` `#2e4519` | Telehealth feature item in the services dropdown | 4.4:1+ on its tint |

### Channel tokens (for tints and glows only)

`--rgb-green: 135,191,87` · `--rgb-blue: 82,165,207` · `--rgb-ink: 22,50,63`
Used as `rgba(var(--rgb-*), a)` for washes, dot textures, glows and dark-band badge fills.
They express existing colours at alpha — they do not introduce new hues.

### Rules

- Accent colour marks meaning, never decoration: **green = reassurance / affirmation**,
  **blue = information / navigation**.
- Text on light backgrounds uses `--ch-green-cta` or `--ch-blue-deep`, never `--ch-green-dk`
  or `--ch-blue-dk`. Those two are reserved for graphical strokes, which need only 3:1.
- No raw hex outside this table. The only literal in the stylesheet is `#fff` for white text
  on dark surfaces.

---

## 3. Typography

Typefaces are **frozen**: Lato (body) and Montserrat (headings), loaded from Google Fonts
with `display=swap`.

### Scale — five sizes, three weights, four line-heights

| Level | Token | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|---|
| Display | `--fs-display` | `clamp(34px, 3.5vw, 45px)` | 700 | 1.15 | -0.02em | H1, hero only |
| H2 | `--fs-h2` | `clamp(26px, 2.4vw, 30px)` | 700 | 1.25 | -0.015em | Section headings |
| H3 / label | `--fs-base` | `17px` | 700 | 1.25 | -0.008em | Card titles, list labels, FAQ questions |
| Body | `--fs-base` | `17px` | 400 | 1.65 | 0 | Paragraphs, leads |
| Small | `--fs-sm` | `16px` | 400 | 1.5 | 0 | Card copy, tiles, FAQ answers, inputs |
| Caption | `--fs-xs` | `13px` | 400/600/700 | 1.5 | 0.012–0.08em | Trust cards, notes, form labels, footer bar |

Weights: `--fw-reg 400` · `--fw-med 600` · `--fw-bold 700`.
Line heights: `--lh-tight 1.15` · `--lh-head 1.25` · `--lh-snug 1.5` · `--lh-body 1.65`.

### Chrome scale — navigation and utility furniture, never content

Kept separate from the content scale on purpose: chrome must stay quieter than the copy it
frames. Every value is tokenised; no raw px sizes remain in the stylesheet.

| Token | Size | Usage |
|---|---|---|
| `--fs-phone` | 21px | Header and footer phone number (large-text contrast rule applies) |
| `--fs-nav` | 15px | Primary nav items, dropdown and mobile sub-links |
| `--fs-cta` | 14px | Header CTA, sticky mobile bar |
| `--fs-tag` | 10px | "Soon" badge only — uppercase with 0.06em tracking |

### Rules

- Two families, no third.
- **Content** text never below 13px. The 10px `--fs-tag` is the single documented exception:
  it is an uppercase, letter-spaced status badge on a disabled control, never prose.
- Prose is capped by measure, not by pixels: `--w-text: 68ch`, splits at `60ch`,
  duo copy at `56ch`, FAQ answers at `68ch`.
- Headings use `text-wrap: balance`.

---

## 4. Spacing & Layout

### Base unit — 4px, with one documented half-step

`--sp-05: 2px` exists for icon-scale chrome only (the "Soon" tag's vertical padding, the
mobile nav's optical inset). It is the only sub-4px spacing value in the system.

| Token | Value | Token | Value |
|---|---|---|---|
| `--sp-1` | 4px | `--sp-7` | 40px |
| `--sp-2` | 8px | `--sp-8` | 56px |
| `--sp-3` | 12px | `--sp-9` | 72px |
| `--sp-4` | 16px | `--sp-10` | 96px |
| `--sp-5` | 24px | `--sp-11` | 128px |
| `--sp-6` | 32px | | |

### Band rhythm — three tiers, so sections are not all equally loud

| Token | Value | Usage |
|---|---|---|
| `--band-lg` | `clamp(80px, 8.5vw, 128px)` | Primary sections |
| `--band-md` | `clamp(64px, 6.5vw, 96px)` | Supporting sections, hero copy padding |
| `--band-sm` | `clamp(48px, 5vw, 72px)` | Tight sections |

### Containers

| Token | Value | Usage |
|---|---|---|
| `--w-bleed` | 1440px | Header shell only |
| `--w-content` | 1200px | Every content band |
| `--w-text` | 68ch | Single-column prose |
| `--gutter` | `clamp(20px, 4vw, 48px)` | Horizontal padding |
| `--bleed` | `calc((100vw - min(100vw, var(--w-content)))/2 + var(--gutter))` | Drives full-bleed media |

### Grid

Column counts are **never hardcoded**. Every multi-item grid uses
`repeat(auto-fit, minmax(min(100%, Npx), 1fr))` so the count follows available width:
`--2` 420px · `--3` 300px · `--4` 265px.

Breakpoints: **1100px** (nav tightens) · **960px** (mobile nav, single column, sticky CTA bar)
· **600px** (stacked actions, compact flow).

### Rules

- No magic numbers for discrete spacing — use the `--sp-*` scale.
- Fluid `clamp()` values are permitted **only** for band padding, container gutters and
  large grid gaps, where the value must scale with viewport. They are documented above.
- **Optical alignment is not spacing.** A 1–3px `margin-top` used to sit a 15–20px icon on
  the cap-height of the text beside it is a rendering correction, not a layout decision, and
  is exempt from the 4px grid. Snapping these to 4px visibly drops the icon below its line.
  Six such nudges exist, all on `.ch-ico` inside a flex row: `.ch-pull` (2px), `.ch-note`,
  `.ch-flow__note`, `.ch-ft__crisis` (3px), `.ch-form__hint` (1px), `.ch-consent input` (2px).

---

## 5. Components

### Icon + badge (`.ch-ico`, `.ch-badge`)
- **Structure**: `<span class="ch-badge ch-badge--{size} ch-badge--{tint}"><svg class="ch-ico"><use href="#i-*"/></svg></span>`
- **Source**: one inline SVG sprite of 61 `<symbol>`s, 24×24, stroke-based, `currentColor`.
- **Sizes**: 28 / 34 / 44 / 52px; icon sizes `--sm 15px` `--md 20px` `--lg 24px`.
- **Variants**: `--green`, `--blue`, `--solid`, `--round`. Dark-band variants swap the tint
  for `rgba(var(--rgb-*), .16–.20)` and the glyph for the base brand colour.
- **States**: decorative only — always `aria-hidden`, no interactive states.
- **Accessibility**: never the sole carrier of meaning; always paired with visible text.

### Button (`.ch-btn`)
- **Variants**: `--primary` (green CTA fill), `--light` (white on colour), `--ghost` (outlined on colour).
- **Spacing**: `--sp-4 / --sp-6`, min-height 54px.
- **States**: default · hover (fill → ink, shadow to `--e-2`, arrow icon shifts 3px) ·
  active (`translateY(1px)`) · focus-visible (3px `--ch-blue-deep` ring, white on dark).
- **Motion**: 180ms `--ch-ease` on colour, 120ms on transform.

### Text link CTA (`.ch-tlink`)
Bold label over a 2px `--ch-blue` underline; hover deepens to `--ch-blue-deep` and shifts the
arrow. Min-height 44px.

### Section head (`.ch-shead`)
Badge (52px) + H2 + optional lead. `--tight` reduces the bottom gap, `--center` centres it.
This is the page's repeating structural signal.

### Topic card (`.ch-topic`)
Coloured 3px top rule (`--green` / `--blue` alternating), 52px badge, H3, body.
**Static — no hover.** It is not a link.

### Tile list (`.ch-tiles`)
Icon badge + short label in a bordered surface tile, laid out on an auto-fit grid.
**Static — no hover.** Used for the warning signs, therapy types and play techniques.

### Icon list (`.ch-ilist`)
Row of `20px icon | text` separated by 1px rules, used inside cards. Static.

### Card (`.ch-card`)
Surface, 1px rule, `--r-lg`, `--e-1`. `__head` pairs a 44px badge with a label.

### Process flow (`.ch-flow`)
Ordered list; each step is `[44px number circle] | [title with inline icon | description]`
with a 2px connector running down the rail. Single column on mobile.

### FAQ (`.ch-faq`)
One elevated card; each item is a full-width `<button>` with a plus/minus toggle that
inverts to solid `--ch-blue-deep` when open.
- **States**: default · hover (`--ch-tint-blue` row wash) · open · focus-visible.
- **Motion**: `grid-template-rows: 0fr → 1fr`, 260ms; `visibility` is delayed so collapsed
  answers leave the accessibility tree.

### Form (`.ch-form`, `.ch-field`)
Labels are 13px uppercase Montserrat. Inputs rest on `--ch-paper`, hover borders to
`--ch-blue-dk`, focus adds a 3px `--ch-blue-lt` halo and `--ch-blue-deep` border.
Status message region is `role="status"`.

### Sticky action bar (`.ch-sticky`)
Below 960px only. Slides up (`translateY`) past 600px scroll. Call + primary CTA.

---

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 120–150ms | `--ch-ease` | Button press, icon shift, badge scale |
| Standard | 180–260ms | `--ch-ease` | Hover colour, dropdown, FAQ disclosure, sticky bar |
| Scroll-driven | tied to scroll | linear | Header compaction, read-progress bar |

`--ch-ease: cubic-bezier(.4, 0, .2, 1)`.

### Rules

- **Motion serves meaning.** Only interactive elements animate. A hover that changes nothing,
  or motion on a non-interactive element, is a defect — see Section 8.
- Animate `transform`, `opacity`, `filter`, `background`, `border-color`, `box-shadow` only.
  Never `width`, `height`, `top`, `left`, `margin`, `padding`.
  The read-progress bar and the centre-out nav underline both use `scaleX()`, not `width`
  or `left`/`right`.

  *Documented exceptions — three places genuinely change document flow and cannot be
  expressed as a transform without breaking it:*
  1. **FAQ disclosure** animates `grid-template-rows: 0fr → 1fr`. The only technique that
     animates to auto height without JS measurement; one row at a time, off the critical path.
  2. **Header compaction** animates `padding` on the bar and `height` on the logo. A header
     that collapses must actually shorten — a transform would leave the original height
     reserved and the page would not reflow beneath it.
  3. **Menu disclosure** animates `max-height` on the mobile drawer and the desktop nav row,
     for the same reason.

  All three are scroll- or click-triggered on a single element, not per-frame across the page.
- Every interactive element has hover, active and focus-visible.
- `prefers-reduced-motion: reduce` collapses all durations to 0.01ms and disables smooth scroll.

---

## 7. Depth & Surface

**Strategy: mixed — and each mechanism has exactly one job.**

| Mechanism | Job |
|---|---|
| **Tone** | Separates *bands*. White / paper / tint / ink alternation. |
| **Border** | Defines the *edge* of a surface. Always 1px `--ch-rule`. |
| **Shadow** | Conveys *elevation tier* only. |

| Level | Token | Value | Usage |
|---|---|---|---|
| Flat | `--e-0` | `0 1px 2px rgba(var(--rgb-ink),.04)` | Cards at rest |
| Raised | `--e-1` | `0 2px 6px … , 0 1px 2px …` | Trust cards, FAQ card, stuck header |
| Floating | `--e-2` | `0 12px 32px … , 0 2px 6px …` | Photos, back-to-top, button hover |
| Overlay | `--e-3` | `0 20px 56px rgba(var(--rgb-ink),.18)` | Dropdowns, the request form |

### Radius scale
`--r-sm 4px` (buttons, inputs) · `--r-md 10px` (tiles, badges, callouts) ·
`--r-lg 16px` (cards, photos, dropdowns) · `--r-pill 999px`.

### Texture and light
- `.ch-band--dots`: 24px dot grid at `rgba(var(--rgb-ink),.055)`, masked to fade out.
- `.ch-glow--blue/--green`: an off-canvas radial at 0.16–0.18 alpha anchored to a corner.
- Hero: two accent washes plus a masked dot texture behind the copy column.

---

## 8. Inconsistencies found during extraction

Recorded per the extraction workflow. Items marked **fixed** were corrected in the same pass;
items marked **accepted** are deliberate debt with a reason.

1. **Slop hover on non-interactive cards — fixed.** `.ch-topic` lifted and `.ch-tiles li`
   raised a shadow on hover, but neither is a link or a control. Removed per Section 6.
2. **Unsized media — fixed.** Photos carried no intrinsic dimensions. Now every `<img>`
   declares `width`/`height` matching its served crop.
3. **Images larger than their box — fixed.** A landscape source was served into a portrait
   hero column and cropped by `object-fit`. Now art-directed via `<picture>` with
   aspect-matched Cloudinary crops per breakpoint.
4. **Two greens and two blues do the same job** (`--ch-green-dk` / `--ch-green-cta`,
   `--ch-blue-dk` / `--ch-blue-deep`) — **accepted**. The palette is frozen by the client;
   the split is documented in Section 2 as graphical-stroke vs text-safe.
5. **Fonts load from a third-party origin** — **accepted for now**. Self-hosting the two
   subsets would remove a DNS + TLS handshake from the critical path, but the client's CMS
   integration currently expects the Google Fonts link.
6. **Layout-property animations** — **partly fixed, partly accepted.** The read-progress bar
   animated `width` and the nav underline animated `left`/`right`; both now use `scaleX()`.
   The FAQ, header compaction and menu drawers still animate flow properties — accepted and
   justified in Section 6.
7. **Magic numbers in header chrome — fixed.** Nine raw `font-size` values and four sub-4px
   spacing values existed only in the header and footer. They are now the `--fs-nav` /
   `--fs-cta` / `--fs-phone` / `--fs-tag` chrome scale and the `--sp-05` half-step. The
   footer phone was 22px against the header's 21px for no reason; both are now `--fs-phone`.
8. **Header neutrals were undocumented — fixed.** Nine hex values inherited from the client's
   header stylesheet now appear in Section 2 with their contrast ratios.
7. **No Lighthouse baseline.** `playwright` and `playwright-lighthouse` are not installed and
   the site is not yet reachable at its production URL, so no score has been measured. The
   perfection ruleset's root-cause checklist was applied statically; a real audit is still
   owed once the deploy lands.
