// Validates src/data/groups.json before the build, so a mistake made while
// editing the groups fails the CI build instead of publishing
// a broken page — the live site then keeps the previous version.
import { existsSync, readFileSync } from 'node:fs';

import { validateGroups } from '../src/data/validation.js';

const file = new URL('../src/data/groups.json', import.meta.url);
let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`groups.json: niepoprawny JSON / invalid JSON — ${e.message}`);
  process.exit(1);
}

const errors = validateGroups(data);
// Task PDFs are uploaded to public/zadania/ (by the admin panel, before it
// saves groups.json); a path pointing at a missing file would be a dead button.
for (const [i, t] of (Array.isArray(data.tasks?.files) ? data.tasks.files : []).entries()) {
  for (const lang of ['pl', 'en']) {
    const path = t?.[lang];
    if (typeof path === 'string' && path && !existsSync(new URL(`../public/${path}`, import.meta.url))) {
      errors.push(`tasks.files[${i}].${lang}: brak pliku public/${path} w repo`);
    }
  }
}
if (errors.length) {
  console.error('groups.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('groups.json OK');
