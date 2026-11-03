// Validates src/data/questions.json before the build, so a mistake made while
// editing the Group Time questions fails the CI build instead of publishing
// a broken page — the live site then keeps the previous version.
import { readFileSync } from 'node:fs';

const file = new URL('../src/data/questions.json', import.meta.url);
const errors = [];
let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`questions.json: niepoprawny JSON / invalid JSON — ${e.message}`);
  process.exit(1);
}

const isText = (v) => typeof v === 'string' && v.trim() !== '';
const counts = [];
for (const lang of ['pl', 'en']) {
  const sessions = data[lang]?.sessions;
  if (!Array.isArray(sessions) || sessions.length === 0) { errors.push(`${lang}.sessions: brak sesji`); continue; }
  sessions.forEach((s, i) => {
    const at = `${lang}.sessions[${i}]`;
    if (!isText(s.title)) errors.push(`${at}.title: brak`);
    if (!isText(s.topic)) errors.push(`${at}.topic: brak`);
    if (!Array.isArray(s.questions)) errors.push(`${at}.questions: musi być listą`);
    else s.questions.forEach((q, j) => { if (!isText(q)) errors.push(`${at}.questions[${j}]: puste pytanie`); });
  });
  counts.push(sessions.length);
}
if (counts.length === 2 && counts[0] !== counts[1]) errors.push(`pl i en mają różną liczbę sesji (${counts.join(' vs ')})`);

if (errors.length) {
  console.error('questions.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('questions.json OK');
