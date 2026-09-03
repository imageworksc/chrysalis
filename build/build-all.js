// The whole pipeline: regenerate the intermediates, rebuild every sub-page from
// the shared shell, then run the structural and link checks.
//
//   node build/build-all.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILD = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(BUILD, 'pages.json'), 'utf8'));
const run = (script, args = []) =>
  execFileSync(process.execPath, [path.join(BUILD, script), ...args], { stdio: 'inherit' });

console.log('sources');
run('rebuild-sources.js');

console.log('\npages');
cfg.pages.forEach(p => run('build-page.js', [p.slug]));

console.log('\nstructure');
run('check.js');

console.log('\nlinks');
run('check-links.js');
