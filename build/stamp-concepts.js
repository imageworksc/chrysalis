// Stamps each concept page's stylesheet and script links with a hash of the
// file's content (styles.css?v=1a2b3c4d), so a browser that cached the old
// file fetches the new one as soon as the page itself is reloaded. GitHub
// Pages caches every file for ten minutes and cannot be told otherwise.
//
//   node build/stamp-concepts.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['homepage', 'homepage-2', 'homepage-3'];
const FILES = ['styles.css', 'head.js', 'main.js'];

PAGES.forEach((slug) => {
  const dir = path.join(ROOT, slug);
  const page = path.join(dir, 'index.html');
  let html = fs.readFileSync(page, 'utf8');
  const before = html;
  FILES.forEach((f) => {
    const hash = crypto.createHash('sha1').update(fs.readFileSync(path.join(dir, f))).digest('hex').slice(0, 8);
    const attr = f.endsWith('.css') ? 'href' : 'src';
    html = html.replace(new RegExp(attr + '="' + f.replace('.', '\\.') + '(\\?v=[0-9a-f]+)?"'), attr + '="' + f + '?v=' + hash + '"');
  });
  if (html !== before) fs.writeFileSync(page, html);
  console.log('  ' + slug + '/ ' + (html !== before ? 'stamped' : 'unchanged'));
});
