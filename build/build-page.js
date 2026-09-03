// Assembles one sub-page from the shared shell plus its own <main> and metadata,
// so the header, stylesheet, sprite and scripts cannot drift between pages.
//
//   node build/build-page.js <slug>
const fs = require('fs');
const path = require('path');

const BUILD = __dirname;
const ROOT = path.resolve(BUILD, '..');
const WORK = path.join(BUILD, '.work');

const slug = process.argv[2];
if (!slug) { console.error('  usage: node build/build-page.js <slug>'); process.exit(1); }

const cfg = JSON.parse(fs.readFileSync(path.join(BUILD, 'meta', slug + '.json'), 'utf8'));
let head = fs.readFileSync(path.join(WORK, 'shell-head.html'), 'utf8');
const tail = fs.readFileSync(path.join(WORK, 'shell-tail.html'), 'utf8');
const main = fs.readFileSync(path.join(WORK, slug + '-main.html'), 'utf8');

// --- head: title, description, canonical, social ---
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + cfg.title + '</title>');
head = head.replace(/(<meta name="description" content=")[^"]*(")/, '$1' + cfg.description + '$2');
head = head.replace(/(<link rel="canonical" href=")[^"]*(")/, '$1' + cfg.url + '$2');
head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + cfg.title + '$2');
head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + cfg.description + '$2');
head = head.replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + cfg.url + '$2');
head = head.replace(/(<meta property="og:image" content=")[^"]*(")/, '$1' + cfg.image + '$2');
head = head.replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + cfg.title + '$2');
head = head.replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + cfg.description + '$2');
head = head.replace(/(<meta name="twitter:image" content=")[^"]*(")/, '$1' + cfg.image + '$2');

// --- head: the hero preload must point at this page's hero, not the home's ---
let n = 0;
head = head.replace(/imagesrcset="[^"]*"/g, () => 'imagesrcset="' + cfg.preload[n++] + '"');

// --- structured data lives in the tail, not the head ---
const ld = JSON.parse(tail.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
ld['@graph'].forEach(node => {
  if (node['@type'] === 'WebPage' || node['@type'] === 'MedicalWebPage') {
    node.name = cfg.title; node.description = cfg.description; node.url = cfg.url;
    if (node['@id']) node['@id'] = cfg.url + '#webpage';
  }
  if (node['@type'] === 'FAQPage') {
    node.mainEntity = cfg.faq.map(q => ({
      '@type': 'Question', name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a }
    }));
    if (node['@id']) node['@id'] = cfg.url + '#faq';
  }
  if (node['@type'] === 'BreadcrumbList' && node.itemListElement) {
    const last = node.itemListElement[node.itemListElement.length - 1];
    if (last && last.item) { last.name = cfg.crumb; last.item = cfg.url; }
  }
});
const tailOut = tail.replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
  '$1\n' + JSON.stringify(ld, null, 2) + '\n$2');

// --- internal links step up one level for a sub-page ---
//   ./                -> ../
//   ./trauma-therapy/ -> ../trauma-therapy/
// index.html keeps them as written, so it stays valid standing alone and
// nothing depends on the repository name.
const page = (head + main + tailOut).replace(/href="\.\/([^"]*)"/g, 'href="../$1"');

fs.mkdirSync(path.join(ROOT, slug), { recursive: true });
fs.writeFileSync(path.join(ROOT, slug, 'index.html'), page);
console.log('  wrote ' + slug + '/index.html  (' + (page.length / 1024).toFixed(0) + ' KB)');
