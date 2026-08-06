# Chrysalis Health — Children's Mental Health Services

Live: <https://imageworksc.github.io/chrysalis/>

A single self-contained page: inline CSS and JS, no build step. Photography is served
from Cloudinary with `f_auto,q_auto`, art-directed crops per breakpoint and responsive
`srcset`.

## The design

Built on an explicit 12-column grid. Sections sit on white and are divided by rules
rather than boxed. Headings run at Montserrat 500 on a larger scale.

- A scroll-driven warning-signs sequence: the heading column pins while twelve cards
  travel past, the card at the reading line is emphasised, and a meter tracks progress
- A process rail drawn as the reader descends, with nodes that latch once passed
- Two auto-travelling card strips running in opposite directions, pausable by hover,
  focus, an explicit control and `prefers-reduced-motion`
- A full-bleed telehealth banner: the photograph under a brand-blue veil held dense
  enough that white body copy clears 4.5:1 over the brightest pixel in the image
- A 63-symbol inline SVG icon system

`DESIGN.md` documents the token system, components, motion rules and accepted debt.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root on every push to
`main`. The Pages source must stay on **GitHub Actions** — with that setting and no
workflow file, pushes silently produce no deployment and no failed run either.

The `Deploy` step can exceed its timeout while GitHub's deployment queue is backed up,
marking the run red even though the site updates a moment later. Check the site, not
the run status.

## Pending wiring

The request form is not connected to a backend. Add a POST endpoint to enable it:

```html
<form id="request" data-endpoint="https://your-intake-endpoint" novalidate>
```

Without `data-endpoint` the form shows a message directing visitors to
(888) 587-0335 rather than silently failing.

Header nav items still pointing at `#` are placeholders for the real site URLs.
