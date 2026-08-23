// Validates the dataset: unique ids, valid categories/relations/coords,
// and country names that actually exist in the world-atlas TopoJSON.
// Run with: node scripts/validate-data.mjs
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-50m.json');
const countryNames = new Set(topo.objects.countries.geometries.map((g) => g.properties.name));

const tmp = mkdtempSync(join(tmpdir(), 'atlas-validate-'));
const outfile = join(tmp, 'entities.mjs');
await build({ entryPoints: ['src/data/entities.ts'], bundle: true, format: 'esm', outfile, logLevel: 'silent' });
const { ENTITIES } = await import(pathToFileURL(outfile).href);
rmSync(tmp, { recursive: true, force: true });

const CATEGORIES = new Set(['agency', 'startup', 'manufacturer', 'rnd', 'launch-site', 'ground-station', 'investor']);
const REL_TYPES = new Set(['supplier-of', 'launches-from', 'invested-in', 'partner-of', 'operates', 'tracks-for']);

const errors = [];
const ids = new Set();
for (const e of ENTITIES) {
  const tag = e.id ?? '(missing id)';
  if (ids.has(e.id)) errors.push(`${tag}: duplicate id`);
  ids.add(e.id);
  if (!CATEGORIES.has(e.category)) errors.push(`${tag}: bad category '${e.category}'`);
  const mapName = e.mapName ?? e.country;
  if (!countryNames.has(mapName)) errors.push(`${tag}: country '${mapName}' not in world-atlas`);
  const [lng, lat] = e.coords ?? [];
  if (typeof lng !== 'number' || typeof lat !== 'number' || Math.abs(lng) > 180 || Math.abs(lat) > 90)
    errors.push(`${tag}: bad coords ${JSON.stringify(e.coords)}`);
  if (Math.abs(lat) > 79) errors.push(`${tag}: suspicious latitude ${lat} — check [lng, lat] order`);
  if (!Number.isInteger(e.founded)) errors.push(`${tag}: bad founded`);
  if (!Array.isArray(e.description) || e.description.length === 0) errors.push(`${tag}: empty description`);
  if (!e.website?.startsWith('http')) errors.push(`${tag}: bad website`);
  for (const r of e.related ?? []) {
    if (!REL_TYPES.has(r.type)) errors.push(`${tag}: bad relation type '${r.type}'`);
    if (r.id === e.id) errors.push(`${tag}: self-relation`);
  }
}
// related-id resolution (after collecting all ids)
for (const e of ENTITIES) {
  for (const r of e.related ?? []) {
    if (!ids.has(r.id)) errors.push(`${e.id}: relation target '${r.id}' does not exist`);
  }
}
// reciprocal duplicates (A→B and B→A) are legal but worth flagging
const pairs = new Set();
for (const e of ENTITIES) for (const r of e.related ?? []) pairs.add(`${e.id}→${r.id}`);
const dupes = [...pairs].filter((p) => {
  const [a, b] = p.split('→');
  return pairs.has(`${b}→${a}`) && a < b;
});

const byCat = {};
for (const e of ENTITIES) byCat[e.category] = (byCat[e.category] ?? 0) + 1;
console.log(`Entities: ${ENTITIES.length}`);
console.log(`By category:`, byCat);
console.log(`Countries covered: ${new Set(ENTITIES.map((e) => e.country)).size}`);
if (dupes.length) console.log(`Note — reciprocal relation pairs (fine, but dedupe if unintended): ${dupes.join(', ')}`);
if (errors.length) {
  console.error(`\n${errors.length} ERROR(S):`);
  for (const err of errors) console.error(' -', err);
  process.exit(1);
}
console.log('\nAll checks passed.');
