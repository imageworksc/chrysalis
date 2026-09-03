# Chrysalis Health

Live: <https://imageworksc.github.io/chrysalis/>

Five static pages. Each is one self-contained HTML file with an inline `<style>`,
an inline `<script>` and an inline SVG sprite — no framework, no dependencies, no
build tool required to view them.

| Page | Path |
| --- | --- |
| Children's mental health services | `index.html` |
| Trauma Therapy | `trauma-therapy/` |
| Family Counseling and Therapy | `family-counseling/` |
| Anxiety and Depression Therapy | `anxiety-depression/` |
| Anger Management Therapy and Counseling | `anger-management/` |

Copy on the four service pages is taken from the client's source document and is
checked against it line by line; the pages carry no invented prose.

## The design

`STYLEGUIDE.md` is the reference — tokens, grid, components, motion, the
accessibility rules and the checks to run before shipping. Every value in it was
verified against the live stylesheet.

The short version: an explicit 12-column grid, sections on white divided by
hairlines rather than boxed, headings at Montserrat 500. The set pieces are a
scroll-driven signs list, a process rail drawn as the reader descends,
auto-travelling card strips that are pausable four ways, full-bleed bands on
`--ink` and `--blue-deep`, and a 64-symbol inline icon sprite.

Photography is from Pexels, sized and cropped through their CDN with `srcset`
per breakpoint. One image — the telehealth banner on the home page — is served
from the client's Cloudinary with `f_auto,q_auto`.

## Building

The header, stylesheet, sprite and scripts are identical on every page, so they
are not maintained per page: `index.html` is the source and the sub-pages are
assembled from it.

```
node build/build-all.js       # regenerate, rebuild all four, then check
```

or step by step:

```
node build/rebuild-sources.js       # split the shell, extract each <main>
node build/build-page.js <slug>     # assemble one page
node build/check.js                 # structure, classes, icons, ids, scripts
node build/check-links.js           # every internal link resolves on disk
```

`build/meta/<slug>.json` holds each page's title, description, canonical URL,
social image, hero preloads and FAQ. Edit those by hand; `rebuild-sources.js`
will not overwrite a file that already exists.

`build/.work/` holds the split shell and the extracted `<main>` of each page. It
is generated and not versioned — `rebuild-sources.js` recreates it from the
repository at any time.

**Editing the shared stylesheet means rebuilding every sub-page.** Editing one
page's copy of it makes the pages drift.

## Deployment

`.github/workflows/deploy-pages.yml` publishes the repository root on every push
to `main`. Two things worth knowing:

- The Pages source must stay on **GitHub Actions**. With that setting and no
  workflow file, pushes silently produce no deployment and no failed run either.
- The `Deploy` step can exceed its timeout while GitHub's deployment queue is
  backed up, marking the run red even though the site updates a moment later.
  **Check the live URL, not the run status.**

## Known gaps

- Ten header nav items still point at `#`: the six under *About*, plus
  Counseling, Psychiatric Services, Case Management and Telehealth. They are
  placeholders for pages that do not exist yet.
- No `sitemap.xml` or `robots.txt`. The four service pages are reachable only
  through the menu.
- Two sentences still describe an online request form — "Complete the online
  request form or call…" on the home page and trauma page. The form was removed
  from the site, but the wording is verbatim from the source document, so
  changing it is a content decision rather than a fix.
