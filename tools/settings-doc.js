// Writes docs/SETTINGS.md from schema.json so the docs never drift from the real settings.
const fs = require('fs');
const s = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
let md = '# Theme settings\n\nAll settings live in **Tebex → Webstore → Templates → your OZ template → Change schema / settings**. This file is generated from `schema.json`.\n';
for (const g of s.config) {
  md += `\n## ${g.header}\n\n| Setting | ID | Type | Default | Choices |\n|---|---|---|---|---|\n`;
  for (const o of g.options) md += `| ${o.name} | \`${o.id}\` | ${o.type} | ${String(o.default ?? '').replace(/\n/g, '<br>') || '—'} | ${(o.values || []).join(', ') || '—'} |\n`;
}
fs.writeFileSync('docs/SETTINGS.md', md);
console.log('docs/SETTINGS.md written');
