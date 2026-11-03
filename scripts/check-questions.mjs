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
console.log('questions.json OK');
