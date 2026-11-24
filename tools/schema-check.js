#!/usr/bin/env node
/* Validates schema.json against the Tebex template schema format
   (https://docs.tebex.io/developers/templates/schema) and checks that every
   config('id') used in templates/ exists in the schema.
   Usage: node tools/schema-check.js [--fix]
   --fix fills missing description/default fields (description from the name). */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const file = path.join(root, 'schema.json');
const raw = fs.readFileSync(file, 'utf8');
const schema = JSON.parse(raw);
const fix = process.argv.includes('--fix');

// Required properties per option type (Tebex rejects the schema without them).
const REQUIRED = {
  'select': ['id', 'name', 'type', 'description', 'default', 'values'],
  'colour-picker': ['id', 'name', 'type', 'description', 'default'],
  'image-uploader': ['id', 'name', 'type', 'description'],
  'file': ['id', 'name', 'type', 'description'],
  'slider': ['id', 'name', 'type', 'description', 'default', 'min', 'max'],
  'textarea': ['id', 'name', 'type', 'description', 'default'],
  'url': ['id', 'name', 'type', 'description', 'default'],
};

const errors = [];
const ids = new Set();

if (typeof schema.author !== 'string') errors.push('top level: "author" must be a string');
if (typeof schema.support_email !== 'string') errors.push('top level: "support_email" must be a string');
if (!Array.isArray(schema.config)) errors.push('top level: "config" must be an array of groups');

(schema.config || []).forEach((group, gi) => {
  if (typeof group.header !== 'string') errors.push(`group ${gi}: missing "header"`);
  if (!Array.isArray(group.options)) { errors.push(`group ${gi}: "options" must be an array`); return; }
  group.options.forEach((o) => {
    const where = `option "${o.id || '?'}"`;
    const need = REQUIRED[o.type];
    if (!need) { errors.push(`${where}: unknown type "${o.type}"`); return; }
    if (fix) {
      if (!o.description) o.description = describe(o);
      if (need.includes('default') && !('default' in o)) o.default = '';
    }
    need.forEach((k) => { if (!(k in o)) errors.push(`${where}: missing "${k}"`); });
    if (!o.description) errors.push(`${where}: empty "description"`);
    if (ids.has(o.id)) errors.push(`${where}: duplicate id`);
    ids.add(o.id);
    if (o.type === 'select') {
      if (!Array.isArray(o.values) || !o.values.length) errors.push(`${where}: "values" must be a non-empty array`);
      else if (!o.values.includes(o.default)) errors.push(`${where}: default "${o.default}" is not one of its values`);
    }
    if (o.type === 'colour-picker' && !/^#[0-9a-f]{6}$/i.test(o.default)) errors.push(`${where}: default must be a #RRGGBB hex`);
    if (o.type === 'slider' && !(o.min <= o.default && o.default <= o.max)) errors.push(`${where}: default outside min/max`);
  });
});

// Every config('x') used by the templates must be defined.
const used = new Set();
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(html|twig)$/.test(f)) {
      const src = fs.readFileSync(p, 'utf8').replace(/\{#[\s\S]*?#\}/g, '');
      for (const m of src.matchAll(/config\(\s*['"]([^'"]+)['"]\s*\)/g)) used.add(m[1]);
    }
  }
})(path.join(root, 'templates'));
for (const id of used) if (!ids.has(id)) errors.push(`templates use config('${id}') but schema.json has no option with that id`);

function describe(o) {
  const m = /^(.*?)\s*\((.+)\)\s*$/.exec(o.name);
  const base = m ? m[1] : o.name;
  const note = m ? ' ' + cap(m[2]) + '.' : '';
  switch (o.type) {
    case 'select': return `${base}.${note} Options: ${o.values.join(', ')}.`;
    case 'colour-picker': return `${base}.${note} Pick a colour.`;
    case 'image-uploader': return `${base}.${note} Upload an image, or leave empty.`;
    case 'url': return `${base}.${note} Full link starting with https://, or leave empty.`;
    default: return `${base}.${note}`;
  }
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

if (fix) {
  fs.writeFileSync(file, JSON.stringify(schema, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
  console.log('schema.json: filled missing fields');
}
const count = (schema.config || []).reduce((n, g) => n + (g.options || []).length, 0);
if (errors.length) {
  console.error(`schema.json: ${errors.length} problem(s)\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`schema.json ok: ${count} options in ${schema.config.length} groups, ${used.size} config() ids used by templates`);
