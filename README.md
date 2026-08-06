# Chrysalis Health — design option 1

Live: <https://imageworksc.github.io/chrysalis/>

One of two design options for the children's mental health page. Copy, logo and
palette are identical in both; the layout, typography scale and interaction differ.

Option 2 lives in [`imageworksc/chrysalis-2`](https://github.com/imageworksc/chrysalis-2)
at <https://imageworksc.github.io/chrysalis-2/>. The repository number matches the
option number.

## What distinguishes this option

Full-width alternating bands — white, paper, tint and dark ink — rather than a
12-column grid on a single surface. Carries the 61-symbol inline SVG icon system,
a faded dot texture and corner accent glows on the dark bands, and a sticky header
that compacts as you scroll.

It has no auto-travelling card strips, no sticky warning-signs sequence, no process
rail, no full-bleed telehealth banner and no scroll entrance animation. Those belong
to option 2.

## Structure

A single self-contained file — inline CSS and JS, no build step. Photography is
served from Cloudinary with `f_auto,q_auto` and responsive `srcset`.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root on every push to
`main`. The repository's Pages source must stay on **GitHub Actions** — with that
setting and no workflow file, pushes silently produce no deployment and no failed
run either.

Note that the `Deploy` step can exceed its timeout while GitHub's deployment queue
is backed up, marking the run red even though the site updates a moment later.
Check the site, not the run status.

## Pending wiring

The request form is not connected to a backend. Add a POST endpoint to enable it:

```html
<form id="ch-request-form" data-endpoint="https://your-intake-endpoint" novalidate>
```

Without `data-endpoint` the form shows a message directing visitors to
(888) 587-0335 rather than silently failing.

Header nav items still pointing at `#` are placeholders for the real site URLs.
