// Validates src/data/plan.json before the build, so a typo made while
// editing the plan (e.g. directly on GitHub) fails the CI build instead of
// publishing a broken page — the live site then keeps the previous version.
import { readFileSync } from 'node:fs';

const file = new URL('../src/data/plan.json', import.meta.url);
const errors = [];
let plan;
try {
  plan = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`plan.json: niepoprawny JSON / invalid JSON — ${e.message}`);
  process.exit(1);
}

const TYPES = ['session', 'meal', 'break', 'activity'];
const TIME = /^\d{1,2}:\d{2}( – \d{1,2}:\d{2})?$/;
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const optText = (v) => v === undefined || typeof v === 'string';

const checkItems = (items, where) => {
  if (!Array.isArray(items) || items.length === 0) return errors.push(`${where}.items: brak punktów`);
  items.forEach((it, i) => {
    const at = `${where}.items[${i}]`;
    if (!isText(it.time) || !TIME.test(it.time)) errors.push(`${at}.time: "${it.time}" — oczekiwane "9:30 – 10:30" (z półpauzą –) albo "16:00"`);
    if (!isText(it.title)) errors.push(`${at}.title: brak tytułu`);
    if (!optText(it.description)) errors.push(`${at}.description: musi być tekstem`);
    if (it.type !== undefined && !TYPES.includes(it.type)) errors.push(`${at}.type: "${it.type}" — dozwolone: ${TYPES.join(', ')}`);
    if (!optText(it.badge)) errors.push(`${at}.badge: musi być tekstem`);
  });
};

const dayCounts = [];
for (const lang of ['pl', 'en']) {
  const l = plan[lang];
  if (!l) { errors.push(`${lang}: brak sekcji języka`); continue; }
  if (!isText(l.title)) errors.push(`${lang}.title: brak`);
  if (!isText(l.subtitle)) errors.push(`${lang}.subtitle: brak`);
  const det = l.szczegolowy?.days;
  const sim = l.podstawowy?.days;
  if (!Array.isArray(det) || det.length === 0) { errors.push(`${lang}.szczegolowy.days: brak dni`); continue; }
  if (!Array.isArray(sim) || sim.length === 0) { errors.push(`${lang}.podstawowy.days: brak dni`); continue; }
  if (det.length !== sim.length) errors.push(`${lang}: szczegolowy ma ${det.length} dni, podstawowy ${sim.length} — muszą być równe`);
  det.forEach((d, i) => {
    const at = `${lang}.szczegolowy.days[${i}]`;
    for (const k of ['date', 'dayName', 'theme']) if (!isText(d[k])) errors.push(`${at}.${k}: brak`);
    checkItems(d.items, at);
  });
  sim.forEach((d, i) => {
    const at = `${lang}.podstawowy.days[${i}]`;
    if (!isText(d.date)) errors.push(`${at}.date: brak`);
    checkItems(d.items, at);
  });
  dayCounts.push(det.length);
}
if (dayCounts.length === 2 && dayCounts[0] !== dayCounts[1]) errors.push(`pl i en mają różną liczbę dni (${dayCounts.join(' vs ')})`);
// The event app highlights "happening now" against fixed calendar dates
// (EVENT_DAYS in ScheduleSection.tsx) — one per day.
if (dayCounts[0] !== undefined && dayCounts[0] !== 3) errors.push(`plan ma ${dayCounts[0]} dni — strona zakłada 3 (12-14 listopada); zmiana liczby dni wymaga też zmiany EVENT_DAYS w ScheduleSection.tsx`);

if (errors.length) {
  console.error('plan.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('plan.json OK');
