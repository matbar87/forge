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
}

export interface DaySchedule {
  date: string;
  dayName: string;
  theme: string;
  items: ScheduleItem[];
}

export interface SimpleDaySchedule {
  date: string;
  items: ScheduleItem[];
}

export interface LanguagePlan {
  title: string;
  subtitle: string;
  szczegolowy: { days: DaySchedule[] };
  podstawowy: { days: SimpleDaySchedule[] };
}

export const plan = planJson as unknown as { pl: LanguagePlan; en: LanguagePlan };
