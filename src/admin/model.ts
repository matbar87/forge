// Editable shape of plan.json / questions.json for the admin panel: PL and EN
// side by side (like the spreadsheet), converted back to the site's JSON on
// save. Same rules as scripts/xlsx-to-plan.py: a day appears in a plan only
// if it has items there, items are ordered by start time, an empty EN text
// falls back to PL.

export type ItemType = 'session' | 'meal' | 'break' | 'activity';

export const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'session', label: 'sesja' },
  { value: 'meal', label: 'posiłek' },
  { value: 'break', label: 'przerwa' },
  { value: 'activity', label: 'aktywność' },
];

export interface Bilingual {
  pl: string;
  en: string;
}

export interface EditItem {
  id: string;
  start: string;
  end: string;
  type: ItemType;
  leaders: boolean;
  title: Bilingual;
  description: Bilingual;
  badge: Bilingual;
}

export interface EditDay {
  id: string;
  number: number;
  isoDate: string;
  date: Bilingual;
  dayName: Bilingual;
  theme: Bilingual;
  detailed: EditItem[];
  basic: EditItem[];
}

export interface EditPlan {
  info: unknown;
  leadersUntil: string;
  title: Bilingual;
  subtitle: Bilingual;
  days: EditDay[];
}

export interface EditSession {
  id: string;
  topic: Bilingual;
  questions: { id: string; text: Bilingual }[];
}

export interface EditQuestions {
  info: unknown;
  sessions: EditSession[];
}

export type MemberRole = '' | 'leader' | 'assistant';

export interface EditMember {
  id: string;
  first: string;
  last: string;
  role: MemberRole;
}

export interface EditGroup {
  id: string;
  name: string;
  members: EditMember[];
}

export interface EditGroups {
  info: unknown;
  enabled: boolean;
  groups: EditGroup[];
}

let nextId = 0;
export const newId = () => `e${Date.now().toString(36)}${(nextId++).toString(36)}`;

const bi = (pl?: string, en?: string): Bilingual => ({ pl: pl ?? '', en: en ?? '' });
const out = (b: Bilingual) => ({ pl: b.pl.trim(), en: (b.en.trim() || b.pl.trim()) });

export const emptyItem = (): EditItem => ({
  id: newId(), start: '', end: '', type: 'session', leaders: false,
  title: bi(), description: bi(), badge: bi(),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export function planToEdit(plan: any): EditPlan {
  const days = new Map<string, EditDay>();
  const dayFor = (pl: any, en: any): EditDay => {
    let d = days.get(pl.isoDate);
    if (!d) {
      d = {
        id: newId(), number: pl.number, isoDate: pl.isoDate,
        date: bi(pl.date, en?.date), dayName: bi(pl.dayName, en?.dayName), theme: bi(pl.theme, en?.theme),
        detailed: [], basic: [],
      };
      days.set(pl.isoDate, d);
    }
    return d;
  };
  for (const [version, key] of [['szczegolowy', 'detailed'], ['podstawowy', 'basic']] as const) {
    const plDays = plan.pl[version].days;
    const enDays = plan.en[version].days;
    plDays.forEach((pd: any, i: number) => {
      const ed = enDays[i];
      const day = dayFor(pd, ed);
      if (version === 'szczegolowy') {
        day.dayName = bi(pd.dayName, ed?.dayName);
        day.theme = bi(pd.theme, ed?.theme);
      }
      day[key] = pd.items.map((it: any, j: number) => {
        const en = ed?.items[j] ?? {};
        const [start, end] = it.time.split('–').map((s: string) => s.trim());
        return {
          id: newId(), start: start ?? '', end: end ?? '', type: it.type ?? 'session', leaders: !!it.leaders,
          title: bi(it.title, en.title), description: bi(it.description, en.description), badge: bi(it.badge, en.badge),
        } satisfies EditItem;
      });
    });
  }
  return {
    info: plan._info,
    leadersUntil: plan.leadersUntil ?? '',
    title: bi(plan.pl.title, plan.en.title),
    subtitle: bi(plan.pl.subtitle, plan.en.subtitle),
    days: [...days.values()].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
  };
}

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return Number.isNaN(h) || Number.isNaN(m) ? 0 : h * 60 + m;
};

export function editToPlan(e: EditPlan): any {
  const plan: any = { _info: e.info };
  if (e.leadersUntil.trim()) plan.leadersUntil = e.leadersUntil.trim();
  const days = [...e.days].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  for (const lang of ['pl', 'en'] as const) {
    const pick = (b: Bilingual) => out(b)[lang];
    const items = (list: EditItem[], detailed: boolean) =>
      [...list]
        .sort((a, b) => minutes(a.start) - minutes(b.start)) // stable: same start keeps order
        .map((it) => {
          const o: any = { time: it.end.trim() ? `${it.start.trim()} – ${it.end.trim()}` : it.start.trim(), title: pick(it.title) };
          if (pick(it.description)) o.description = pick(it.description);
          o.type = it.type;
          if (pick(it.badge)) o.badge = pick(it.badge);
          if (detailed && it.leaders) o.leaders = true;
          return o;
        });
    const version = (key: 'detailed' | 'basic') =>
      days
        .filter((d) => d[key].length > 0)
        .map((d) => {
          const o: any = { number: d.number, isoDate: d.isoDate.trim(), date: pick(d.date) };
          if (key === 'detailed') {
            o.dayName = pick(d.dayName);
            o.theme = pick(d.theme);
          }
          o.items = items(d[key], key === 'detailed');
          return o;
        });
    plan[lang] = {
      title: pick(e.title),
      subtitle: pick(e.subtitle),
      szczegolowy: { days: version('detailed') },
      podstawowy: { days: version('basic') },
    };
  }
  return plan;
}

export function questionsToEdit(q: any): EditQuestions {
  return {
    info: q._info,
    sessions: q.pl.sessions.map((s: any, i: number) => {
      const en = q.en.sessions[i] ?? { questions: [] };
      return {
        id: newId(),
        topic: bi(s.topic, en.topic),
        questions: s.questions.map((text: string, j: number) => ({ id: newId(), text: bi(text, en.questions[j]) })),
      };
    }),
  };
}

export function editToQuestions(e: EditQuestions): any {
  const res: any = { _info: e.info };
  for (const [lang, word] of [['pl', 'Sesja'], ['en', 'Session']] as const) {
    res[lang] = {
      sessions: e.sessions.map((s, i) => ({
        title: `${word} ${i + 1}`,
        topic: out(s.topic)[lang],
        questions: s.questions.map((q) => out(q.text)[lang]).filter((t) => t !== ''),
      })),
    };
  }
  return res;
}
export function groupsToEdit(g: any): EditGroups {
  return {
    info: g._info,
    enabled: g.enabled !== false,
    groups: g.groups.map((x: any) => ({
      id: newId(),
      name: x.name,
      members: x.members.map((m: any) => ({ id: newId(), first: m.first, last: m.last, role: m.role ?? '' })),
    })),
  };
}

export function editToGroups(e: EditGroups): any {
  return {
    _info: e.info,
    enabled: e.enabled,
    groups: e.groups.map((g) => ({
      name: g.name.trim(),
      members: g.members
        .filter((m) => m.first.trim() || m.last.trim()) // fully empty rows are dropped
        .map((m) => ({ first: m.first.trim(), last: m.last.trim(), ...(m.role ? { role: m.role } : {}) })),
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// The site's JSON files are written with 2-space indent and a final newline
// (like the Python converters), so saving unchanged data is a no-op diff.
export const toFileText = (data: unknown) => JSON.stringify(data, null, 2) + '\n';
