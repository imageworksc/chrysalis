# Chrysalis Health — style guide

How the pages in this repository are built, and everything needed to build another
one that matches. Every value below is copied from the live stylesheet, not
approximated.

The site is plain HTML: one file per page, an inline `<style>`, an inline
`<script>`, an inline SVG sprite. No build tool, no framework, no dependencies.

---

## 1. The five rules the design rests on

Break these and a new page stops looking like the others, whatever the colours say.

1. **Sections are separated by a hairline, never boxed.** A section is padding
   plus a `border-top`. There are no cards wrapping whole sections.
2. **One grid, one gutter.** Twelve columns, `--gap` everywhere. Nothing invents
   its own column widths.
3. **Headings sit at weight 500,** not 700. This is what keeps the page airy.
4. **Content never depends on JavaScript.** Anything hidden for an entrance has a
   CSS failsafe that reveals it if the script never runs.
5. **Automatic motion has an off switch,** and stops entirely under
   `prefers-reduced-motion`.

---

## 2. Tokens

Paste this block whole. Everything else references it.

```css
:root {
  /* brand */
  --green:      #87bf57;   /* primary button */
  --green-dk:   #6aaa35;   /* its hover */
  --green-cta:  #4f8226;   /* green text/icons on light ground — the accessible one */
  --green-lt:   #eef5e6;
  --blue:       #52a5cf;
  --blue-dk:    #3d8fb8;
  --blue-deep:  #23617f;   /* blue text on light ground, and the banner ground */
  --blue-lt:    #e8f4fb;
  --navy:       #2e2e2e;

  /* ink and paper */
  --ink:        #16323f;   /* headings, and the dark bands */
  --ink-2:      #0f2530;
  --paper:      #f7f9fa;
  --paper-2:    #eef2f5;
  --tint:       #f5f9fc;
  --white:      #ffffff;
  --rule:       #e2e9ed;   /* the hairline between sections */
  --rule-dk:    #cfdae0;
  --body:       #4c5a62;   /* body copy */
  --card-txt:   #5e6c75;   /* copy inside a card */
  --muted:      #5f7480;   /* notes and captions */
  --announce:   #2f7ea5;
  --announce-dk:#26688a;

  /* the same colours as channels, for rgba() */
  --rgb-green: 135,191,87;
  --rgb-blue:  82,165,207;
  --rgb-ink:   22,50,63;

  /* type */
  --font:  'Lato', Arial, sans-serif;
  --head:  'Montserrat', 'Lato', Arial, sans-serif;
  --fs-display: clamp(36px, 4.4vw, 56px);
  --fs-h2:      clamp(27px, 2.9vw, 38px);
  --fs-h3:      clamp(17px, 1.3vw, 20px);
  --fs-lead:    clamp(16px, 1.05vw, 17px);
  --fs-base:    16px;
  --fs-sm:      15px;
  --fs-xs:      13px;
  --fs-nav:     15px;
  --fs-cta:     14px;
  --fs-phone:   21px;
  --fs-tag:     10px;
  --fw-reg: 400; --fw-mid: 500; --fw-med: 600; --fw-bold: 700;

  /* spacing — a 4px scale, used by name and never as a raw pixel value */
  --sp-05: 2px; --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 40px; --sp-8: 56px;
  --sp-9: 72px; --sp-10: 96px; --sp-11: 128px;

  /* layout */
  --gap:     clamp(16px, 1.7vw, 24px);   /* the grid gutter, everywhere */
  --band:    clamp(56px, 6vw, 100px);    /* vertical padding of a section */
  --w-page:  1300px;
  --w-text:  62ch;
  --gutter:  clamp(16px, 2.6vw, 40px);

  /* shape */
  --r:      clamp(10px, 0.9vw, 14px);
  --r-sm:   8px;
  --r-btn:  10px;
  --r-pill: 999px;

  /* elevation and motion */
  --e-1: 0 1px 3px rgba(var(--rgb-ink),0.04);
  --e-2: 0 8px 24px rgba(var(--rgb-ink),0.07);
  --e-3: 0 18px 44px rgba(var(--rgb-ink),0.12);
  --ease: cubic-bezier(.4,0,.2,1);
}
```

**Which colour where.** `--green` is for the primary button only. Green *text* or
*icons* on a light ground use `--green-cta`, which is the darker one that passes
contrast. The same split applies to blue: `--blue` for large shapes,
`--blue-deep` for text.

---

### Starting from nothing

The tokens above are self-contained, but two things live outside them and a new
page will look wrong without both.

**Fonts.** Lato and Montserrat, from Google Fonts. In `<head>`, before the
stylesheet:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

The token fallbacks (`Arial, sans-serif`) mean the page still works if the
request fails, at a different rhythm.

**Icons.** 64 symbols in an inline sprite, copied whole from `index.html` — the
block runs from `<svg width="0" height="0" …>` to its `</svg>`, about 11 KB, and
sits just before the scripts at the end of `<body>`:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="i-arrow-right" viewBox="0 0 24 24">…</symbol>
  …
</svg>
```

Every symbol draws with `currentColor`, so an icon takes the colour of whatever
contains it. Reference one with `<svg class="ico" aria-hidden="true"><use href="#i-name"/></svg>`.
Names are listed by `grep -o 'id="i-[a-z-]*"' index.html`.

---

## 3. Page skeleton

```html
<body>
  <script>document.documentElement.className += " has-js";</script>
  <!-- header -->
  <main id="main" class="page">
    <section class="sec g"> … </section>
    <section class="sec g"> … </section>
  </main>
  <!-- sprite, then scripts -->
</body>
```

The `has-js` line runs **inline, immediately after `<body>`**, before the first
paint. Everything that hides content for an entrance is gated on `.has-js`, so a
reader without JavaScript is never shown a blank page and a reader with it never
sees a flash of unstyled content.

```css
.page { max-width: var(--w-page); margin: 0 auto; padding-inline: var(--gutter); }
.g { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: var(--gap); }
.c-3 { grid-column: span 3; } .c-4 { grid-column: span 4; }
.c-5 { grid-column: span 5; } .c-6 { grid-column: span 6; }
.c-7 { grid-column: span 7; } .c-8 { grid-column: span 8; }
.c-9 { grid-column: span 9; } .c-12 { grid-column: span 12; }

/* sections are separated by a rule, never boxed */
.sec { padding-block: var(--band); }
.sec + .sec { border-top: 1px solid var(--rule); }
.sec:first-child { padding-top: clamp(36px, 4vw, 64px); }
[id] { scroll-margin-top: 120px; }
```

There is no `.c-10` or `.c-11`. Add one only if a layout genuinely needs it —
usually the answer is `.c-9` or `.c-12`.

---

## 4. Type

```css
body { font-family: var(--font); font-size: var(--fs-base); line-height: 1.65; }
.h1 { font-size: var(--fs-display); font-weight: var(--fw-mid); line-height: 1.1;  letter-spacing: -0.025em; text-wrap: balance; }
.h2 { font-size: var(--fs-h2);      font-weight: var(--fw-mid); line-height: 1.14; letter-spacing: -0.022em; text-wrap: balance; }
.h3 { font-size: var(--fs-h3);      font-weight: var(--fw-med); line-height: 1.3;  letter-spacing: -0.012em; }
.lead { font-size: var(--fs-lead); line-height: 1.65; color: var(--body); }

.measure { max-width: 56ch; }     /* stop body copy running the full column */
.balance { text-wrap: balance; }  /* even out a block that ends on a stub */
.clear-right { padding-right: clamp(32px, 5vw, 88px); }
@media (max-width: 920px) { .clear-right { padding-right: 0; } }
```

Headings are `.h1` / `.h2` / `.h3` **classes**, applied to whichever element the
document outline calls for. Never pick a heading level for its size.

**Two typographic habits worth copying.**

- A non-breaking space (`&nbsp;`) before the last word of a short paragraph stops
  a single word dropping to a line of its own. Used on conjunctions too — `and&nbsp;other`.
- When a heading is clamped and needs to break in a particular place, set
  `style="max-width:14em"` on it. `em` tracks the clamped font size; a pixel
  value does not.

---

## 5. Buttons

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-2);
  min-height: 52px; padding: var(--sp-3) var(--sp-6);
  border: 1px solid transparent; border-radius: var(--r-btn);
  font-family: var(--font); font-weight: var(--fw-bold); font-size: var(--fs-sm);
  text-decoration: none; cursor: pointer;
  transition: background .2s var(--ease), color .2s var(--ease),
              border-color .2s var(--ease), transform .12s var(--ease);
}
.btn--primary { background: var(--green); border-color: var(--green); color: var(--white); }
.btn--primary:hover { background: var(--green-dk); border-color: var(--green-dk); }
.btn--ghost { background: transparent; border-color: var(--rule-dk); color: var(--ink); }
.btn--ghost:hover { border-color: var(--ink); background: var(--white); }

.actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-3); margin-top: var(--sp-6); }
```

```html
<div class="actions">
  <a href="#request-form" class="btn btn--primary">
    Request Mental Health Services
    <svg class="ico" aria-hidden="true"><use href="#i-arrow-right"/></svg>
  </a>
  <a href="tel:18885870335" class="btn btn--ghost">Call (888) 587-0335</a>
</div>
```

Below 600px `.actions` becomes a column and buttons go full width.

---

## 6. Small primitives

```css
/* an icon in a soft square — the page's one decorative container */
.badge { display: grid; place-items: center; flex-shrink: 0; width: 56px; height: 56px; border-radius: 12px; }
.badge--sm { width: 44px; height: 44px; border-radius: 10px; }
.badge--green { background: var(--green-lt); color: var(--green-cta); }
.badge--blue  { background: var(--blue-lt);  color: var(--blue-deep); }

/* a list of short statements, divided by hairlines rather than bullets */
.ilist { list-style: none; margin: 0; padding: 0; }
.ilist li {
  display: grid; grid-template-columns: 30px minmax(0,1fr); gap: var(--sp-4);
  align-items: center; padding: var(--sp-4) 0; border-bottom: 1px solid var(--rule);
  font-size: var(--fs-sm); line-height: 1.45; color: var(--ink);
}
.ilist li:last-child { border-bottom: none; padding-bottom: 0; }
.ilist .ico { color: var(--green-cta); }

/* the line that introduces a list */
.listhead { display: flex; align-items: center; gap: var(--sp-3); margin-bottom: var(--sp-5);
  font-family: var(--head); font-weight: var(--fw-med); font-size: var(--fs-h3);
  line-height: 1.3; color: var(--ink); }

/* a caveat or footnote */
.note { display: flex; gap: var(--sp-3); align-items: flex-start; margin-top: var(--sp-5);
  font-size: var(--fs-xs); line-height: 1.5; color: var(--muted); }
.note .ico { margin-top: 3px; }

/* a photograph held to a ratio */
.figure { border-radius: var(--r); overflow: hidden; background: var(--paper-2); align-self: center; }
.figure img { width: 100%; height: 100%; object-fit: cover; }
.figure--tall { aspect-ratio: 4/5; }
.figure--sq   { aspect-ratio: 1/1; }
```

Icons come from an inline `<symbol>` sprite and inherit `currentColor`:

```html
<svg class="ico" aria-hidden="true"><use href="#i-arrow-right"/></svg>
```

---

## 7. Full-bleed bands

A band escapes the page container without a wrapper, then restores the container
inside itself. This is the pattern to copy for any edge-to-edge section:

```css
.def {
  margin-inline: calc(50% - 50vw);        /* break out to the viewport */
  padding-block: clamp(56px, 6.4vw, 104px);
  background: var(--ink);
}
.def__in { max-width: var(--w-page); margin: 0 auto; padding-inline: var(--gutter); }

/* a hairline against a dark band reads as a seam, so drop it either side */
.sec + .def, .def + .sec { border-top: none; }
```

```html
<section class="sec def">
  <div class="def__in">
    <div class="g"> … normal 12-column content … </div>
  </div>
</section>
```

Four bands exist, all built this way:

| Band | Ground | Use |
| --- | --- | --- |
| `.def` | `--ink` | one short definition, high on the page |
| `.treat` | `--ink` | a heading plus a grid of treatment cards |
| `.tele` | `--blue-deep` + photograph | a photographic banner with points over it |
| `.final` | `--blue-deep` panel beside a photograph | the closing call to action |

**Always drop the section hairline on both sides of a band** — otherwise a light
rule sits on a dark edge and reads as a seam.

The photographic banner veils its image so text stays legible:

```css
.tele__bg { position: absolute; inset: 0; }
.tele__bg img { width: 100%; height: 100%; object-fit: cover; }
.tele__bg::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(100deg,
    rgba(var(--rgb-ink), 0.95) 0%,
    rgba(35, 97, 127, 0.93) 48%,
    rgba(35, 97, 127, 0.92) 100%);
}
```

On a veiled ground the focus ring has to change too: `.tele :focus-visible { outline-color: var(--white); }`.

---

## 8. Motion

### The entrance

One entrance, applied to any block by attribute:

```css
@keyframes reveal-failsafe { to { opacity: 1; transform: none; } }
.has-js [data-reveal] {
  opacity: 0; transform: translateY(20px);
  transition: opacity .6s var(--ease), transform .6s var(--ease);
  transition-delay: var(--d, 0s);
  animation: reveal-failsafe .4s var(--ease) forwards;
  animation-delay: calc(1.6s + var(--d, 0s));
}
.has-js [data-reveal].is-in { opacity: 1; transform: none; animation: none; }
```

```html
<div data-reveal>…</div>
<div data-reveal style="--d:.12s">…</div>   <!-- staggered 120ms behind -->
```

Two things carry the whole design here, and both are easy to lose:

- **The failsafe.** The block is hidden by CSS. If the observer never runs, the
  keyframe expires on its own and leaves it visible. Content is never gated on JS.
- **The failsafe delay tracks `--d`.** `calc(1.6s + var(--d, 0s))`. If it were a
  constant, a late item in a stagger would be flipped visible by the failsafe
  before its own transition had begun.

**A row that is hidden must be revealed by something.** Either give it
`data-reveal`, or put it inside a list the script staggers (`#signs-list`,
`#steps-list`). A `.signs__item` outside both, with no `data-reveal`, stays at
`opacity: 0` forever. This has happened; it is worth a grep before shipping.

### Reduced motion

Blanket rule at the end of the stylesheet, plus per-component opt-outs:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

---

## 9. Components that need the script

Each needs specific hooks. The script finds them by these exact ids and attributes.

### FAQ — `id="faq"`

```html
<div class="faq" id="faq">
  <div class="faq__item is-open" data-reveal>
    <button type="button" class="faq__q" aria-expanded="true" aria-controls="a1" id="q1">
      Question text <span class="faq__icon" aria-hidden="true"></span>
    </button>
    <div class="faq__panel" id="a1" role="region" aria-labelledby="q1">
      <div class="faq__inner"><p>Answer.</p></div>
    </div>
  </div>
</div>
```

### Travelling cards — `.marquee` with `--dur`

```html
<div class="marquee" id="daily-strip" style="--dur:70s">
  <ul class="marquee__track">
    <li class="mcard">…</li>                       <!-- the real list -->
    <li class="mcard" aria-hidden="true">…</li>    <!-- an exact duplicate -->
  </ul>
</div>
<div class="marquee__bar">
  <button type="button" class="marquee__toggle" data-marquee="daily-strip"
          aria-pressed="false" aria-label="Pause the moving cards">
    <svg class="ico ico--pause" aria-hidden="true"><use href="#i-pause"/></svg>
    <svg class="ico ico--play"  aria-hidden="true"><use href="#i-play"/></svg>
  </button>
</div>
```

The track is **the list twice**; the animation translates it by `-50%`, so the
seam never shows. The second copy is `aria-hidden` so the list is not read twice.
The strip pauses on hover, on focus within, on the button, and entirely under
reduced motion — where the mask is dropped and it becomes a normal scroller.

```css
.marquee {
  position: relative; overflow: hidden;
  margin-inline: calc(50% - 50vw); padding-block: var(--sp-2);
  mask-image: linear-gradient(90deg, transparent, var(--ink) 6%, var(--ink) 94%, transparent);
}
.marquee__track {
  display: flex; gap: var(--sp-4); width: max-content; padding-inline: var(--sp-4);
  animation: marquee var(--dur, 70s) linear infinite;
}
.mcard {
  flex: 0 0 clamp(300px, 26vw, 380px);
  display: grid; grid-template-columns: auto minmax(0,1fr);
  align-items: center; column-gap: var(--sp-4);
  padding: var(--sp-5); background: var(--white);
  border: 1px solid var(--rule); border-radius: var(--r);
}
```

### Numbered process — `#steps-list` and `#steps-fill`

A rail is drawn down the steps as the reader descends. The rail is
`position: absolute; left: 31px` against the padding box of `.steps__body` — so
to move the steps sideways use **`margin-left`, not `padding-left`**, or the rows
move and the rail stays behind.

### Scroll-driven signs list — `#signs-list` and `#signs-fill`

Rows reveal on entry, the row at the reading line is emphasised, and a meter
tracks progress. Rows are staggered by an inline `style="--i:0"`, `--i:1`, …

### Two lists behind a switch — `[data-switch]`, `[data-sw-tab]`

```html
<div class="c-12" data-switch>
  <div class="sw__ctl" role="group" aria-label="Choose which signs to view">
    <button type="button" class="sw__opt" data-sw-tab aria-controls="p-a" aria-pressed="true">Anxiety</button>
    <button type="button" class="sw__opt" data-sw-tab aria-controls="p-b" aria-pressed="false">Depression</button>
    <span class="sw__knob" aria-hidden="true"></span>
  </div>
  <div class="sw__panel" id="p-a" role="group" aria-labelledby="a-t"> … </div>
  <div class="sw__panel sw__panel--off" id="p-b" role="group" aria-labelledby="b-t"> … </div>
</div>
```

Three decisions worth reusing:

- These are **toggle buttons in a group, not an ARIA tablist**. `aria-pressed`
  carries the state and both stay reachable with Tab. No roving `tabindex`.
- The knob is a real element placed **after** both buttons, so a plain sibling
  combinator slides it — no `:has()`, no script:
  `.sw__opt:nth-of-type(2)[aria-pressed="true"] ~ .sw__knob { transform: translateX(100%); }`
  Equal-width buttons are what make `translateX(100%)` land exactly.
- `.sw__panel--off` is hidden **only under `.has-js`**, so without a script both
  panels are simply on the page.

An `<h2>` cannot go inside a `<button>` — a button takes phrasing content only.
Put the headings inside the panels instead.

---

## 10. Accessibility, as practised here

- **Focus ring**, one rule for everything:
  ```css
  :where(a, button, input, select, textarea):focus-visible {
    outline: 3px solid var(--blue-deep); outline-offset: 3px; border-radius: var(--sp-1);
  }
  ```
- **Contrast is computed, not eyeballed.** Take the relative luminance of both
  colours, composite any alpha over the worst-case pixel underneath, and require
  4.5:1 for body text. Two results from this palette worth keeping: white on
  `--blue-deep` is 6.8:1; `--ink` on `--blue-lt` is 12:1. `--muted` on
  `--blue-lt` is 4.37:1 — it **fails**, so a label on a light blue ground uses
  `--ink` or `--blue-deep` instead.
- **Automatic motion is pausable**, and the control is a real button with
  `aria-pressed` and an `aria-label`.
- **Duplicated content is `aria-hidden`** — the marquee's second copy.
- **Decorative images take `alt=""`**; the banner photograph is decorative, the
  hero photograph is not.
- Every icon `<svg>` is `aria-hidden="true"`; the meaning lives in the text next to it.

---

## 11. Responsive

Three breakpoints, and nothing moves except the grid.

| Width | What changes |
| --- | --- |
| `1100px` | `.c-3` becomes half width; three-column grids become two |
| `920px` | `.c-4`…`.c-9` all become full width; the hero stacks; tall figures become `16/10`; the sticky mobile bar appears |
| `600px` | `.c-3` becomes full width; `.actions` becomes a column and buttons go full width |

Because `.c-4`…`.c-9` collapse by name at 920px, a section that sets its spans
some other way — the hero does — has to be stacked by name too.

**A scoped rule must live at the top level, not inside a media query.** A
modifier added next to a rule that happened to sit inside `@media (max-width: 920px)`
will silently apply on phones only. Check the nesting depth of any new rule.

---

## 12. Building more than one page

The header, stylesheet, sprite and scripts are identical on every page, so they
are not maintained per page. `index.html` is the source; a sub-page is assembled
from it:

1. Split `index.html` at `<main>` into `shell-head.html` and `shell-tail.html`.
2. Write the page's `<main>` on its own.
3. Concatenate head + main + tail, then rewrite the per-page parts: `<title>`,
   description, canonical, Open Graph, Twitter, the hero `imagesrcset` preloads,
   and the JSON-LD (`WebPage`, `FAQPage`, `BreadcrumbList`).

**Any edit to the shared stylesheet means re-splitting the shell and rebuilding
every sub-page.** Editing one page's copy makes the pages drift.

Internal links are written relative in the shell — `./trauma-therapy/` — and the
build step rewrites them to `../trauma-therapy/` for sub-pages. `index.html`
stays valid standing alone, and nothing depends on the repository name.

---

## 13. Before shipping

Mechanical checks, all of which have caught a real bug in this project:

- [ ] `<div>`, `<section>`, `<ul>`, `<p>` open/close counts balance in `<main>`
- [ ] every class used in the markup has a rule in the stylesheet
- [ ] every `href="#i-…"` resolves to a `<symbol>` in the sprite
- [ ] no duplicate `id`
- [ ] every inline `<script>` parses
- [ ] `{` and `}` balance in the stylesheet
- [ ] no `[data-reveal]`-hidden element without a revealer
- [ ] any new scoped rule is at nesting depth 0, not inside a media query
- [ ] every image URL returns 200, and the **delivered crop** was looked at — not
      the source photograph. A 3:2 source centre-cropped to 4:5 can cut a face
- [ ] internal links resolve against files that exist, from every page's depth
- [ ] the published URL was polled until the change appeared — the deploy status
      is not evidence

---

## 14. Where things live

```
index.html                     home page, and the source of the shared shell
trauma-therapy/index.html
family-counseling/index.html
anxiety-depression/index.html
anger-management/index.html
.github/workflows/deploy-pages.yml
```

Published at `https://imageworksc.github.io/chrysalis/`.
