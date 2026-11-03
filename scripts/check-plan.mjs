// Validates src/data/plan.json before the build, so a typo made while
// editing the plan (e.g. directly on GitHub) fails the CI build instead of
// publishing a broken page — the live site then keeps the previous version.
import { readFileSync } from 'node:fs';

import { validatePlan } from '../src/data/validation.js';

const file = new URL('../src/data/plan.json', import.meta.url);
let plan;
try {
  plan = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`plan.json: niepoprawny JSON / invalid JSON — ${e.message}`);
  process.exit(1);
}

const errors = validatePlan(plan);
if (errors.length) {
  console.error('plan.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('plan.json OK');
