// Regenerates the intermediates the build needs, from what is already in the
// repository. Run this after editing index.html, or after .work/ is lost.
//
//   .work/shell-head.html   index.html up to <main>
//   .work/shell-tail.html   index.html from </main>
//   .work/<slug>-main.html  the <main> of each sub-page
//   meta/<slug>.json        that page's title, description, canonical, image,
//                           hero preloads and FAQ  (versioned, hand-editable)
//
// meta/ is only written when it does not already exist, so hand edits survive.
const fs = require('fs');
const path = require('path');

const BUILD = __dirname;
const ROOT = path.resolve(BUILD, '..');
const WORK = path.join(BUILD, '.work');
const META = path.join(BUILD, 'meta');
const cfg = JSON.parse(fs.readFileSync(path.join(BUILD, 'pages.json'), 'utf8'));

fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(META, { recursive: true });

const home = fs.readFileSync(path.join(ROOT, cfg.shell), 'utf8');
fs.writeFileSync(path.join(WORK, 'shell-head.html'), home.slice(0, home.indexOf('<main')));
fs.writeFileSync(path.join(WORK, 'shell-tail.html'), home.slice(home.indexOf('</main>') + 7));
console.log('  shell split from ' + cfg.shell);

cfg.pages.forEach(({ slug, crumb }) => {
  const file = path.join(ROOT, slug, 'index.html');
  if (!fs.existsSync(file)) { console.log('  ' + slug + ': no built page to read — skipped'); return; }
  const h = fs.readFileSync(file, 'utf8');

  // sibling links go back to the ./ form the shell is written in, so the build
  // step can step them up again for the sub-page
  const main = h.slice(h.indexOf('  <main'), h.indexOf('</main>') + 7)
    .replace(/href="\.\.\/([^"]*)"/g, 'href="./$1"');
  fs.writeFileSync(path.join(WORK, slug + '-main.html'), main);

  const metaFile = path.join(META, slug + '.json');
  if (fs.existsSync(metaFile)) {
    console.log('  ' + slug.padEnd(20) + 'main ' + (main.length / 1024).toFixed(0) + ' KB, meta kept');
    return;
  }
  const pick = re => (h.match(re) || [])[1] || '';
  const ld = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = ((ld['@graph'] || []).find(n => n['@type'] === 'FAQPage') || {}).mainEntity || [];
  fs.writeFileSync(metaFile, JSON.stringify({
    title: pick(/<title>([^<]*)<\/title>/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    url: pick(/<link rel="canonical" href="([^"]*)"/),
    crumb,
    image: pick(/<meta property="og:image" content="([^"]*)"/),
    preload: [...h.matchAll(/imagesrcset="([^"]*)"/g)].map(m => m[1]),
    faq: faq.map(q => ({ q: q.name, a: q.acceptedAnswer.text }))
  }, null, 2) + '\n');
  console.log('  ' + slug.padEnd(20) + 'main ' + (main.length / 1024).toFixed(0) + ' KB, meta written');
});
