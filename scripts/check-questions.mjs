// Validates src/data/questions.json before the build, so a mistake made while
// editing the Group Time questions fails the CI build instead of publishing
// a broken page — the live site then keeps the previous version.
import { readFileSync } from 'node:fs';

import { validateQuestions } from '../src/data/validation.js';

const file = new URL('../src/data/questions.json', import.meta.url);
let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`questions.json: niepoprawny JSON / invalid JSON — ${e.message}`);
  process.exit(1);
}

const errors = validateQuestions(data);
if (errors.length) {
  console.error('questions.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}

// Sessions left on automatic unlock need a "Sesja N" item in the detailed
// plan (same match as src/data/unlock.ts); without one their questions are
// visible right away. Warn, don't fail: that may be intended.
try {
  const plan = JSON.parse(readFileSync(new URL('../src/data/plan.json', import.meta.url), 'utf8'));
  const titles = (plan.pl?.szczegolowy?.days ?? []).flatMap((d) => (d.items ?? []).map((it) => it.title.trim()));
  data.pl.sessions.forEach((s, i) => {
    if (s.unlock) return;
    const want = new RegExp(`^sesja\\s+${i + 1}(?!\\d)`, 'i');
    if (!titles.some((t) => want.test(t))) {
      console.log(`::warning::questions.json: Sesja ${i + 1} ma automatyczne odblokowanie, ale w planie szczegółowym nie ma punktu „Sesja ${i + 1}” — pytania będą widoczne od razu.`);
    }
  });
} catch {
  /* plan.json errors are reported by check-plan.mjs */
}
console.log('questions.json OK');
