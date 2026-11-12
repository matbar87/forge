// When the questions of a Group Time session become visible in /app. Each
// session in questions.json may carry an `unlock` setting (the same in pl
// and en):
//   - missing / ''          -> automatic: when "Sesja N" starts according to
//                              the detailed plan in plan.json
//   - 'open'                -> visible straight away
//   - 'RRRR-MM-DD GG:MM'    -> visible from that moment
// Times are the viewer's local device time, like the rest of the plan.
import { parseLocalDateTime } from './plan';

export const UNLOCK_OPEN = 'open';

interface PlanLike {
  pl?: { szczegolowy?: { days?: { isoDate: string; items?: { time: string; title: string }[] }[] } };
}

/** Start of "Sesja N" (1-based) in the detailed PL plan, or null if the plan has no such item. */
export const planSessionStart = (plan: PlanLike, n: number): Date | null => {
  // "Sesja 1", "Sesja 1 – Serce", "sesja 1." match; "Sesja 10" / "Sesja dla liderów 1" don't.
  const want = new RegExp(`^sesja\\s+${n}(?!\\d)`, 'i');
  let best: Date | null = null;
  for (const day of plan.pl?.szczegolowy?.days ?? []) {
    for (const it of day.items ?? []) {
      if (!want.test(it.title.trim())) continue;
      const start = parseLocalDateTime(day.isoDate, it.time.split('–')[0].trim());
      if (start && (!best || start < best)) best = start;
    }
  }
  return best;
};

/**
 * The moment the questions of session n (1-based) unlock, or null when they
 * are visible right away ('open', or automatic with no matching plan item).
 */
export const sessionUnlockAt = (unlock: string | undefined, n: number, plan: PlanLike): Date | null => {
  const u = (unlock ?? '').trim();
  if (u === UNLOCK_OPEN) return null;
  if (u) return parseLocalDateTime(u);
  return planSessionStart(plan, n);
};

/** Start of the first "Gra nocna" item in the detailed PL plan, or null. */
export const planGameNightStart = (plan: PlanLike): Date | null => {
  let best: Date | null = null;
  for (const day of plan.pl?.szczegolowy?.days ?? []) {
    for (const it of day.items ?? []) {
      if (!/^gra\s+nocna/i.test(it.title.trim())) continue;
      const start = parseLocalDateTime(day.isoDate, it.time.split('–')[0].trim());
      if (start && (!best || start < best)) best = start;
    }
  }
  return best;
};

/** Automatic unlock of the group task PDFs: this long before "Gra nocna". */
export const TASK_LEAD_MINUTES = 60;

/**
 * When the "Download task" buttons appear (tasks.unlock in groups.json), or
 * null when right away: '' = an hour before "Gra nocna" in the plan (right
 * away if the plan has none), 'open', or 'RRRR-MM-DD GG:MM'.
 */
export const taskUnlockAt = (unlock: string | undefined, plan: PlanLike): Date | null => {
  const u = (unlock ?? '').trim();
  if (u === UNLOCK_OPEN) return null;
  if (u) return parseLocalDateTime(u);
  const start = planGameNightStart(plan);
  return start && new Date(start.getTime() - TASK_LEAD_MINUTES * 60000);
};

/** 'czw., 12.11, 19:00' style label (PL) / 'Thu 12 Nov, 19:00' (EN). */
export const formatUnlock = (d: Date, lang: 'pl' | 'en') =>
  d.toLocaleString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: lang === 'pl' ? '2-digit' : 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
