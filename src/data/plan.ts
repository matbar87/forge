// Typed access to the event plan in plan.json — the single source of the
// schedule for both the main site (the "podstawowy" plan) and the event app
// at /app (the "szczegolowy" plan). Edit plan.json to change the plan;
// scripts/check-plan.mjs validates it before every build.
import planJson from './plan.json';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  type?: 'session' | 'meal' | 'break' | 'activity';
  badge?: string;
  // Part of the separate leaders' event: hidden once plan.leadersUntil has
  // passed (see visibleDays).
  leaders?: boolean;
}

export interface DaySchedule {
  number: number;
  isoDate: string;
  date: string;
  dayName: string;
  theme: string;
  items: ScheduleItem[];
}

export interface SimpleDaySchedule {
  number: number;
  isoDate: string;
  date: string;
  items: ScheduleItem[];
}

export interface LanguagePlan {
  title: string;
  subtitle: string;
  szczegolowy: { days: DaySchedule[] };
  podstawowy: { days: SimpleDaySchedule[] };
}

export const plan = planJson as unknown as {
  leadersUntil?: string;
  pl: LanguagePlan;
  en: LanguagePlan;
};

/** A Date as 'YYYY-MM-DD' in the viewer's local time (the plan's isoDate format). */
export const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 'YYYY-MM-DD HH:MM' in the viewer's local time, like the plan's own times.
export const parseLocalDateTime = (s: string, hhmm = '00:00'): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/.exec(s.trim());
  const t = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m || !t) return null;
  const [h, min] = m[4] !== undefined ? [Number(m[4]), Number(m[5])] : [Number(t[1]), Number(t[2])];
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), h, min);
};

const leadersUntil = plan.leadersUntil ? parseLocalDateTime(plan.leadersUntil) : null;

// The days to show at `now`: once the leaders' event is over, its items
// (leaders: true) are dropped, and so is any day left without items — e.g.
// a "Day 0" that only held the leaders' event.
export const visibleDays = <D extends { items: ScheduleItem[] }>(days: D[], now: Date): D[] => {
  if (!leadersUntil || now < leadersUntil) return days;
  return days
    .map((d) => ({ ...d, items: d.items.filter((it) => !it.leaders) }))
    .filter((d) => d.items.length > 0);
};
