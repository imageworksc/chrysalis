// Structural checks across every page. Each of these has caught a real bug in
// this project at least once.
//
//   node build/check.js
const fs = require('fs');
const path = require('path');

const BUILD = __dirname;
const ROOT = path.resolve(BUILD, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(BUILD, 'pages.json'), 'utf8'));
const FILES = [cfg.shell, ...cfg.pages.map(p => p.slug + '/index.html')];

let problems = 0;
const fail = msg => { problems++; console.log('      ✗ ' + msg); };

FILES.forEach(rel => {
  const h = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const main = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  const css = (h.match(/<style>([\s\S]*?)<\/style>/g) || []).map(s => s.slice(7, -8)).join('\n');
  console.log('  ' + rel);

  // tags balance inside <main>
  [['div', /<div\b/g, /<\/div>/g], ['section', /<section\b/g, /<\/section>/g],
   ['ul', /<ul\b/g, /<\/ul>/g], ['p', /<p[ >]/g, /<\/p>/g], ['h2', /<h2\b/g, /<\/h2>/g]
  ].forEach(([name, o, c]) => {
    const d = (main.match(o) || []).length - (main.match(c) || []).length;
    if (d !== 0) fail('<' + name + '> unbalanced by ' + d);
  });

  // every class in the markup has a rule
  const markup = h.replace(/<style>[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '').replace(/<symbol[\s\S]*?<\/symbol>/g, '');
  // A class counts as accounted for if it is styled itself, or if it is a BEM
  // block whose children are styled — .signs carries no rule of its own, it
  // only names .signs__main and the rest, and that is deliberate.
  const used = new Set();
  markup.replace(/class="([^"]+)"/g, (m, c) => { c.split(/\s+/).forEach(x => x && used.add(x)); return m; });
  const noRule = [...used].filter(c => {
    const esc = c.replace(/-/g, '\\-');
    return !new RegExp('\\.' + esc + '(?![\\w-])').test(css)
        && !new RegExp('\\.' + esc + '(__|--)[\\w-]+').test(css);
  });
  if (noRule.length) fail('classes with no rule: ' + noRule.join(', '));

  // every icon reference resolves
  const defined = new Set([...h.matchAll(/<symbol id="(i-[a-z0-9-]+)"/g)].map(m => m[1]));
  const missing = [...new Set([...h.matchAll(/href="#(i-[a-z0-9-]+)"/g)].map(m => m[1]))]
    .filter(x => !defined.has(x));
  if (missing.length) fail('icons not in the sprite: ' + missing.join(', '));

  // ids are unique
  const ids = [...h.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
  const dup = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (dup.length) fail('duplicate id: ' + dup.join(', '));

  // stylesheet and scripts are well formed
  if ((css.match(/\{/g) || []).length !== (css.match(/\}/g) || []).length) fail('CSS braces unbalanced');
  [...h.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => !/type=/.test(m[1]))
    .forEach((m, i) => { try { new Function(m[2]); } catch (e) { fail('script ' + (i + 1) + ' does not parse: ' + e.message); } });

  // JSON-LD parses
  [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .forEach((m, i) => { try { JSON.parse(m[1]); } catch (e) { fail('JSON-LD block ' + (i + 1) + ' does not parse'); } });

  // a row hidden for an entrance must have something to reveal it
  const stranded = [...main.matchAll(/<li class="signs__item"(?![^>]*(data-reveal|--i:))/g)].filter(m => {
    const before = main.slice(0, m.index);
    const open = Math.max(before.lastIndexOf('<ul'), before.lastIndexOf('<ol'));
    return !/signs-list|data-reveal/.test(main.slice(open, main.indexOf('>', open) + 1));
  }).length;
  if (stranded) fail(stranded + ' .signs__item row(s) hidden with nothing to reveal them');

  // a page-scoped modifier must sit at the top level, not inside a media query
  ['.signs__close--sm', '.treat__grid--wide', '.marquee__note', '.sw__knob', '.mcard--sign']
    .forEach(sel => {
      const i = css.indexOf(sel + ' ');
      if (i < 0) return;
      let depth = 0;
      for (const ch of css.slice(0, i)) { if (ch === '{') depth++; else if (ch === '}') depth--; }
      if (depth !== 0) fail(sel + ' is nested inside a media query (depth ' + depth + ')');
    });
});

console.log();
console.log('  ' + (problems ? problems + ' PROBLEM(S)' : 'all structural checks pass'));
process.exit(problems ? 1 : 0);
