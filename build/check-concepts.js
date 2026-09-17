// Checks the standalone concept pages (homepage/, homepage-2/, homepage-3/): the rules they
// are held to, and the structure. Each page is an index.html with its own
// styles.css, head.js and main.js.
//
//   node build/check-concepts.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['homepage', 'homepage-2', 'homepage-3'];

const OFFICIAL = new Set(['#87bf57', '#6aaa35', '#4f8226', '#eef5e6', '#52a5cf', '#3d8fb8', '#23617f', '#e8f4fb',
  '#2e2e2e', '#16323f', '#0f2530', '#f7f9fa', '#eef2f5', '#f5f9fc', '#ffffff', '#fff', '#e2e9ed', '#cfdae0',
  '#4c5a62', '#5e6c75', '#5f7480', '#2f7ea5', '#26688a', '#000']);
const OK_RGB = new Set(['255,255,255', '22,50,63', '15,37,48', '232,244,251', '0,0,0']);

let problems = 0;
const fail = (msg) => { problems++; console.log('      ✗ ' + msg); };

PAGES.forEach((slug) => {
  const dir = path.join(ROOT, slug);
  console.log('  ' + slug + '/');
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

  /* --- the rules: nothing inline, no var --- */
  const styleAttrs = (html.match(/ style="/g) || []).length;
  if (styleAttrs) fail(styleAttrs + ' style="" attribute(s)');
  if (/<style[\s>]/.test(html)) fail('inline <style> block');
  if (/<script(?![^>]*\ssrc=)[^>]*>(?!\s*<\/script>)/.test(html)) fail('inline <script> block');
  if (/ on[a-z]+="/i.test(html)) fail('inline event handler attribute');

  ['styles.css', 'head.js', 'main.js'].forEach((f) => {
    if (!fs.existsSync(path.join(dir, f))) fail(f + ' missing');
  });
  // the ?v= stamp is what stamp-concepts.js adds, so a cached copy is never served after a change
  if (!/<link rel="stylesheet" href="styles\.css(\?v=[0-9a-f]{8})?">/.test(html)) fail('styles.css not linked');
  if (!/<script src="head\.js(\?v=[0-9a-f]{8})?"><\/script>/.test(html)) fail('head.js not loaded synchronously in <head>');
  if (!/<script src="main\.js(\?v=[0-9a-f]{8})?" defer><\/script>/.test(html)) fail('main.js not loaded with defer');

  ['head.js', 'main.js'].forEach((f) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) return;
    const src = fs.readFileSync(p, 'utf8');
    const vars = (src.match(/\bvar\b/g) || []).length;
    if (vars) fail(f + ' uses var ' + vars + ' time(s)');
    try { new Function(src); } catch (e) { fail(f + ' does not parse: ' + e.message); }
    if (/\.style\.[a-zA-Z]+\s*=|\.style\.setProperty\(/.test(src)) fail(f + ' writes an inline style at runtime');
  });

  /* --- colour: only the palette --- */
  const cssPath = path.join(dir, 'styles.css');
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const hexes = [...new Set([...css.matchAll(/#[0-9a-f]{3,6}\b/gi)].map((m) => m[0].toLowerCase()))];
  const off = hexes.filter((x) => !OFFICIAL.has(x));
  if (off.length) fail('hex colours outside the palette: ' + off.join(', '));
  const rgbs = [...new Set([...css.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)].map((m) => m[1] + ',' + m[2] + ',' + m[3]))];
  const badRgb = rgbs.filter((x) => !OK_RGB.has(x));
  if (badRgb.length) fail('rgba channels outside the palette: ' + badRgb.join(' | '));
  if ((css.match(/\{/g) || []).length !== (css.match(/\}/g) || []).length) fail('CSS braces unbalanced');

  /* --- type: the site's --- */
  if (!/--font:\s*'Lato'/.test(css) || !/--head:\s*'Montserrat'/.test(css)) fail('type is not Lato / Montserrat');
  // headings: Montserrat 500 on the first two concepts; the third sets its titles extra-bold by request
  const hw = slug === 'homepage-3' ? 'xbold' : 'mid';
  if (!new RegExp('\\.h1\\{[^}]*font-weight:var\\(--fw-' + hw + '\\)').test(css)) fail('.h1 is not weight ' + hw);
  if (!new RegExp('\\.h2\\{[^}]*font-weight:var\\(--fw-' + hw + '\\)').test(css)) fail('.h2 is not weight ' + hw);

  /* --- structure --- */
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  [['div', /<div\b/g, /<\/div>/g], ['section', /<section\b/g, /<\/section>/g], ['ul', /<ul\b/g, /<\/ul>/g],
   ['ol', /<ol\b/g, /<\/ol>/g], ['li', /<li\b/g, /<\/li>/g], ['p', /<p[\s>]/g, /<\/p>/g], ['figure', /<figure\b/g, /<\/figure>/g],
   ['a', /<a\b/g, /<\/a>/g], ['button', /<button\b/g, /<\/button>/g], ['h2', /<h2\b/g, /<\/h2>/g], ['h3', /<h3\b/g, /<\/h3>/g]
  ].forEach(([name, o, c]) => {
    const d = (main.match(o) || []).length - (main.match(c) || []).length;
    if (d !== 0) fail('<' + name + '> unbalanced by ' + d);
  });

  const markup = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<symbol[\s\S]*?<\/symbol>/g, '');
  const used = new Set();
  markup.replace(/class="([^"]+)"/g, (m, c) => { c.split(/\s+/).forEach((x) => x && used.add(x)); return m; });
  const noRule = [...used].filter((c) => {
    const esc = c.replace(/-/g, '\\-');
    return !new RegExp('\\.' + esc + '(?![\\w-])').test(css) && !new RegExp('\\.' + esc + '(__|--)[\\w-]+').test(css);
  });
  if (noRule.length) fail('classes with no rule: ' + noRule.join(', '));

  const defined = new Set([...html.matchAll(/<symbol id="(i-[a-z0-9-]+)"/g)].map((m) => m[1]));
  const missing = [...new Set([...html.matchAll(/href="#(i-[a-z0-9-]+)"/g)].map((m) => m[1]))].filter((x) => !defined.has(x));
  if (missing.length) fail('icons not in the sprite: ' + missing.join(', '));

  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  const dup = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (dup.length) fail('duplicate id: ' + dup.join(', '));

  /* --- links to this site resolve --- */
  const hrefs = [...new Set([...markup.matchAll(/href="([^"#][^"]*)"/g)].map((m) => m[1]))];
  hrefs.filter((h) => h.startsWith('../') || h.startsWith('./')).forEach((h) => {
    const t = path.resolve(dir, h);
    if (!fs.existsSync(t) && !fs.existsSync(path.join(t, 'index.html'))) fail('link does not resolve: ' + h);
  });
  const future = hrefs.filter((h) => h.startsWith('/')).length;
  console.log('      ' + future + ' link(s) on the future chrysalishealth.com paths, kept as the mockup has them');
});

console.log();
console.log('  ' + (problems ? problems + ' PROBLEM(S)' : 'the concept pages pass: nothing inline, no var, palette and type held, structure sound'));
process.exit(problems ? 1 : 0);
