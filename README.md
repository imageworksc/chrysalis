# Chrysalis Health — Children's Mental Health Services

Two design options for the same page. Copy, logo and palette are identical in both;
only the layout, typography scale and interaction differ.

| | Live | Source |
|---|---|---|
| **Option 2** — current direction | <https://imageworksc.github.io/chrysalis/> | [`index.html`](index.html) |
| **Option 1** — first design | <https://imageworksc.github.io/chrysalis/option-1/> | [`option-1/index.html`](option-1/index.html) |

Each page is a single self-contained file: inline CSS and JS, no build step.
Photography is served from Cloudinary with `f_auto,q_auto` and responsive `srcset`.

## Option 1 — first design

The client's original markup, polished. Full-width alternating bands, a static
two-tier header, a 44% bleed hero. Fixes applied over the original: UTF-8 mojibake in
the stylesheet, five WCAG AA contrast failures, a dead `#request-form` anchor (now a
real request form), a missing footer, and structured data.

## Option 2 — current direction

A rebuild on an explicit 12-column grid. Sections sit on white and are divided by
rules rather than boxed. Adds a 63-symbol inline SVG icon system, a scroll-driven
warning-signs sequence, a process rail that draws as you read, two auto-travelling
card strips, and a full-bleed telehealth banner veiled in brand blue.

`DESIGN.md` documents the token system, components, motion rules and accepted debt.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root on every push to
`main`. The repository's Pages source must stay on **GitHub Actions** — with that
setting and no workflow file, pushes silently produce no deployment.

## Pending wiring

The request form on both pages is not connected to a backend. To enable it, add a
POST endpoint to the form tag:

```html
<form id="request" data-endpoint="https://your-intake-endpoint" novalidate>
```

The handler posts the fields as JSON. Without `data-endpoint` the form shows a message
directing visitors to (888) 587-0335 rather than silently failing.

Header nav items still pointing at `#` are placeholders for the real site URLs.
