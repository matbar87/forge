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
    if (it.leaders !== undefined && typeof it.leaders !== 'boolean') errors.push(`${at}.leaders: true albo brak`);
  });
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME = /^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}$/;
const validDate = (s) => ISO.test(s) && !Number.isNaN(new Date(`${s}T00:00`).getTime());

if (plan.leadersUntil !== undefined && plan.leadersUntil !== '' &&
    !(typeof plan.leadersUntil === 'string' && DATETIME.test(plan.leadersUntil) && validDate(plan.leadersUntil.slice(0, 10)))) {
  errors.push(`leadersUntil: "${plan.leadersUntil}" — oczekiwane "RRRR-MM-DD GG:MM", np. "2026-11-12 16:00"`);
}

const checkDays = (days, at, detailed) => {
  const seen = new Set();
  days.forEach((d, i) => {
    const w = `${at}.days[${i}]`;
    if (!Number.isInteger(d.number) || d.number < 0) errors.push(`${w}.number: "${d.number}" — numer dnia (0, 1, 2, …)`);
    if (!validDate(d.isoDate)) errors.push(`${w}.isoDate: "${d.isoDate}" — oczekiwane RRRR-MM-DD`);
    if (seen.has(d.isoDate)) errors.push(`${w}.isoDate: ${d.isoDate} występuje dwa razy`);
    seen.add(d.isoDate);
    if (!isText(d.date)) errors.push(`${w}.date: brak`);
    if (detailed) for (const k of ['dayName', 'theme']) if (!isText(d[k])) errors.push(`${w}.${k}: brak`);
    checkItems(d.items, w);
  });
  const dates = days.map((d) => d.isoDate);
  if (dates.join() !== [...dates].sort().join()) errors.push(`${at}: dni muszą być w kolejności dat`);
};

const shape = {};
for (const lang of ['pl', 'en']) {
  const l = plan[lang];
  if (!l) { errors.push(`${lang}: brak sekcji języka`); continue; }
  if (!isText(l.title)) errors.push(`${lang}.title: brak`);
  if (!isText(l.subtitle)) errors.push(`${lang}.subtitle: brak`);
  const det = l.szczegolowy?.days;
  const sim = l.podstawowy?.days;
  if (!Array.isArray(det) || det.length === 0) { errors.push(`${lang}.szczegolowy.days: brak dni`); continue; }
  if (!Array.isArray(sim) || sim.length === 0) { errors.push(`${lang}.podstawowy.days: brak dni`); continue; }
  checkDays(det, `${lang}.szczegolowy`, true);
  checkDays(sim, `${lang}.podstawowy`, false);
  // The basic plan takes its day name and theme from the detailed day with
  // the same date.
  const detDates = new Set(det.map((d) => d.isoDate));
  sim.forEach((d, i) => { if (!detDates.has(d.isoDate)) errors.push(`${lang}.podstawowy.days[${i}]: brak dnia ${d.isoDate} w planie szczegółowym`); });
  for (const [v, days] of [['szczegolowy', det], ['podstawowy', sim]]) {
    if (!days.some((d) => d.items?.some((it) => !it.leaders))) errors.push(`${lang}.${v}: po zakończeniu wydarzenia liderów nie zostanie żaden punkt planu`);
  }
  shape[lang] = JSON.stringify([det, sim].map((days) => days.map((d) => [d.number, d.isoDate, d.items.length])));
}
if (shape.pl && shape.en && shape.pl !== shape.en) errors.push('pl i en muszą mieć te same dni i tyle samo punktów w każdym dniu');

if (errors.length) {
  console.error('plan.json — błędy:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('plan.json OK');
