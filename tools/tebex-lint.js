// Tebex compatibility checker.
// Tebex runs Twig in a sandbox: only the filters, functions and tags listed in its docs are allowed
// (https://docs.tebex.io/developers/templates/twig/filters, /functions, /tags).
// This scans every template and fails if anything outside that allowlist is used.
// Usage: node tools/tebex-lint.js [dir]   (exit code 1 on problems)
const fs = require('fs');
const path = require('path');

const ALLOWED = {
  filters: ['escape', 'length', 'raw', 'money', 'slice', 'number_format', 'date', 'nl2br', 'replace', 'split', 'upper', 'lower'],
  functions: ['__', '_p', 'config', 'asset', 'path', 'query', 'range'],
  tags: ['if', 'elseif', 'else', 'endif', 'for', 'endfor', 'block', 'endblock', 'extends', 'include', 'set', 'endset']
};
// Words that look like calls inside Twig but are operators / tests / literals
const NOT_CALLS = ['defined', 'not', 'and', 'or', 'in', 'is', 'null', 'none', 'true', 'false', 'empty', 'even', 'odd', 'iterable', 'divisible', 'same', 'starts', 'ends', 'matches', 'with', 'only', 'ignore', 'missing', 'b-and', 'b-or', 'b-xor'];

const root = path.resolve(process.argv[2] || 'templates');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(html|twig)$/.test(f)) files.push(p);
  }
})(root);

const problems = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8').replace(/\{#[\s\S]*?#\}/g, m => m.replace(/[^\n]/g, ' '));
  const lineOf = i => src.slice(0, i).split('\n').length;
  // Every Twig expression / statement
  const re = /\{\{([\s\S]*?)\}\}|\{%-?\s*(\w+)([\s\S]*?)-?%\}/g;
  let m;
  while ((m = re.exec(src))) {
    const line = lineOf(m.index);
    const tag = m[2];
    const body = (m[1] !== undefined ? m[1] : m[3]) || '';
    if (tag && !ALLOWED.tags.includes(tag)) problems.push([file, line, 'tag', tag]);
    // strip string literals so words inside quotes are ignored
    const code = body.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, "''");
    for (const f of code.matchAll(/\|\s*([a-zA-Z_]\w*)/g)) {
      if (!ALLOWED.filters.includes(f[1])) problems.push([file, line, 'filter', f[1]]);
    }
    for (const f of code.matchAll(/(^|[^\w.|])([a-zA-Z_]\w*)\s*\(/g)) {
      const name = f[2];
      if (NOT_CALLS.includes(name)) continue;
      // method calls like obj.method( are attribute access, not functions
      if (!ALLOWED.functions.includes(name)) problems.push([file, line, 'function', name]);
    }
    if (/\?\?/.test(code)) problems.push([file, line, 'operator', '??']);
  }
}

// Store URLs checked against live Tebex stores (see docs/VERIFY.md). Wrong ones are errors.
const BAD_URLS = [
  [/href="\/logout"|['"`]\/logout['"`]/, 'use /checkout/logout (Tebex returns 404 for /logout)'],
  [/name="card"(?!_)/, 'gift card field must be name="card_number"']
];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  for (const [re, msg] of BAD_URLS) if (re.test(src)) problems.push([file, src.slice(0, src.search(re)).split('\n').length, 'url', msg]);
}

const rel = f => path.relative(process.cwd(), f);
if (problems.length) {
  const byKind = {};
  problems.forEach(([f, l, k, n]) => { const key = k + ' ' + n; (byKind[key] = byKind[key] || []).push(rel(f) + ':' + l); });
  console.log('Tebex sandbox check FAILED — not allowed on Tebex:\n');
  Object.keys(byKind).sort().forEach(k => console.log(`  ${k}  (${byKind[k].length}×)  e.g. ${byKind[k].slice(0, 3).join(', ')}`));
  console.log(`\n${problems.length} problems in ${new Set(problems.map(p => p[0])).size} files.`);
  process.exit(1);
}
console.log(`Tebex sandbox check passed — ${files.length} templates use only allowed tags, filters and functions.`);
