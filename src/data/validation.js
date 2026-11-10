// Validation rules for plan.json and questions.json, shared by the build
// (scripts/check-*.mjs, run before every build) and the admin panel
// (src/admin), so both reject exactly the same mistakes. Plain JavaScript so
// Node can run it directly; types are in validation.d.ts.

/** @returns {string[]} error messages (Polish), empty when the plan is valid */
export function validatePlan(plan) {
  const errors = [];
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

  if (plan?.leadersUntil !== undefined && plan.leadersUntil !== '' &&
      !(typeof plan.leadersUntil === 'string' && DATETIME.test(plan.leadersUntil) && validDate(plan.leadersUntil.slice(0, 10)))) {
    errors.push(`leadersUntil: "${plan.leadersUntil}" — oczekiwane "RRRR-MM-DD GG:MM", np. "2026-11-12 16:00"`);
  }

  const checkDays = (days, at, detailed) => {
    const seen = new Set();
    const seenNumbers = new Set();
    days.forEach((d, i) => {
      const w = `${at}.days[${i}]`;
      if (!Number.isInteger(d.number) || d.number < 0) errors.push(`${w}.number: "${d.number}" — numer dnia (0, 1, 2, …)`);
      if (!validDate(d.isoDate)) errors.push(`${w}.isoDate: "${d.isoDate}" — oczekiwane RRRR-MM-DD`);
      if (seen.has(d.isoDate)) errors.push(`${w}.isoDate: ${d.isoDate} występuje dwa razy`);
      seen.add(d.isoDate);
      if (seenNumbers.has(d.number)) errors.push(`${w}.number: numer dnia ${d.number} występuje dwa razy`);
      seenNumbers.add(d.number);
      if (!isText(d.date)) errors.push(`${w}.date: brak`);
      if (detailed) for (const k of ['dayName', 'theme']) if (!isText(d[k])) errors.push(`${w}.${k}: brak`);
      checkItems(d.items, w);
    });
    const dates = days.map((d) => d.isoDate);
    if (dates.join() !== [...dates].sort().join()) errors.push(`${at}: dni muszą być w kolejności dat`);
  };

  const shape = {};
  for (const lang of ['pl', 'en']) {
    const l = plan?.[lang];
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
    const detNumber = new Map(det.map((d) => [d.isoDate, d.number]));
    sim.forEach((d, i) => {
      if (!detNumber.has(d.isoDate)) errors.push(`${lang}.podstawowy.days[${i}]: brak dnia ${d.isoDate} w planie szczegółowym`);
      else if (detNumber.get(d.isoDate) !== d.number) errors.push(`${lang}.podstawowy.days[${i}].number: ${d.number} — w planie szczegółowym ten dzień (${d.isoDate}) ma numer ${detNumber.get(d.isoDate)}`);
    });
    for (const [v, days] of [['szczegolowy', det], ['podstawowy', sim]]) {
      if (!days.some((d) => d.items?.some((it) => !it.leaders))) errors.push(`${lang}.${v}: po zakończeniu wydarzenia liderów nie zostanie żaden punkt planu`);
    }
    shape[lang] = JSON.stringify([det, sim].map((days) => days.map((d) => [d.number, d.isoDate, d.items.length])));
  }
  if (shape.pl && shape.en && shape.pl !== shape.en) errors.push('pl i en muszą mieć te same dni i tyle samo punktów w każdym dniu');

  return errors;
}

/** @returns {string[]} error messages (Polish), empty when the data is valid */
export function validateQuestions(data) {
  const errors = [];
  const isText = (v) => typeof v === 'string' && v.trim() !== '';
  const counts = [];
  for (const lang of ['pl', 'en']) {
    const sessions = data?.[lang]?.sessions;
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

  return errors;
}

export const MAX_GROUP_SIZE = 12;
export const MAX_GROUP_LEADERS = 2;

/** @returns {string[]} error messages (Polish), empty when the data is valid */
export function validateGroups(data) {
  const errors = [];
  const isText = (v) => typeof v === 'string' && v.trim() !== '';
  if (data?.enabled !== undefined && typeof data.enabled !== 'boolean') errors.push('enabled: musi być true albo false');
  const groups = data?.groups;
  if (!Array.isArray(groups)) return [...errors, 'groups: musi być listą grup'];
  const names = new Set();
  groups.forEach((g, i) => {
    const at = `groups[${i}]`;
    if (!isText(g.name)) errors.push(`${at}.name: brak nazwy grupy`);
    else if (names.has(g.name.trim().toLowerCase())) errors.push(`${at}.name: nazwa „${g.name}” występuje dwa razy`);
    else names.add(g.name.trim().toLowerCase());
    if (!Array.isArray(g.members)) return errors.push(`${at}.members: musi być listą`);
    if (g.members.length > MAX_GROUP_SIZE) errors.push(`${at}.members: ${g.members.length} osób — maksymalnie ${MAX_GROUP_SIZE}`);
    g.members.forEach((m, j) => {
      const w = `${at}.members[${j}]`;
      if (!isText(m.first)) errors.push(`${w}.first: brak imienia`);
      if (!isText(m.last)) errors.push(`${w}.last: brak inicjału nazwiska`);
      else if (!/^\p{L}\.$/u.test(m.last.trim())) {
        errors.push(`${w}.last: „${m.last}” — repo jest publiczne, wpisz tylko inicjał nazwiska z kropką, np. „K.”`);
      }
      if (m.role !== undefined && m.role !== '' && !['leader', 'assistant'].includes(m.role)) {
        errors.push(`${w}.role: „${m.role}” — dozwolone: leader, assistant albo brak`);
      }
    });
    if (g.members.filter((m) => m.role === 'leader').length > MAX_GROUP_LEADERS) errors.push(`${at}.members: w grupie mogą być najwyżej ${MAX_GROUP_LEADERS} osoby z rolą lidera`);
  });
  return errors;
}
