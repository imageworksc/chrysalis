// Resolves every internal link on every page against the files on disk, so a
// wrong relative depth shows up here rather than as a 404 for a visitor.
//
//   node build/check-links.js
const fs = require('fs');
const path = require('path');

const BUILD = __dirname;
const ROOT = path.resolve(BUILD, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(BUILD, 'pages.json'), 'utf8'));

const PAGES = [[cfg.shell, '.'], ...cfg.pages.map(p => [p.slug + '/index.html', p.slug])];

let problems = 0, checked = 0;
PAGES.forEach(([rel, dir]) => {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const markup = h.replace(/<style>[\s\S]*?<\/style>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ');

  const hrefs = [...new Set([...markup.matchAll(/href="([^"]+)"/g)].map(m => m[1]))]
    .filter(href => !/^(#|https?:|mailto:|tel:|data:)/.test(href));

  const broken = [];
  hrefs.forEach(href => {
    checked++;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) return;
    const target = path.resolve(ROOT, dir, clean);
    const ok = fs.existsSync(target) ||
      fs.existsSync(path.join(target, 'index.html')) ||
      fs.existsSync(target + '.html');
    if (!ok) { broken.push(href); problems++; }
  });

  console.log('  ' + rel.padEnd(32) + hrefs.length + ' internal link(s)' +
    (broken.length ? '   BROKEN: ' + broken.join(', ') : '   all resolve'));
});

console.log();
console.log('  ' + checked + ' checked, ' + (problems ? problems + ' BROKEN' : 'none broken'));
process.exit(problems ? 1 : 0);
