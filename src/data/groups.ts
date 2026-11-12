// Typed access to groups.json — the division into groups shown in the event
// app's "Grupy" tab. Edit groups.json (or plan/grupy.xlsx, which CI converts
// into it); scripts/check-groups.mjs validates it before every build.
//
// The repo is public, so surnames are never stored: `last` is an initial
// ("B."). vite.config.ts passes the file through publicGroups()
// (groups-public.js) first, so with "enabled": false no people at all end up
// in the published code.
import groupsJson from './groups.json';

export interface GroupMember {
  first: string;
  /** Initial of the surname with a dot, e.g. "K." */
  last: string;
  role?: 'leader' | 'assistant';
}

export interface Group {
  name: string;
  /** Name of the task PDF (tasks.files) to download under this group. */
  task?: string;
  members: GroupMember[];
}

export interface GroupTask {
  name: string;
  /** Path under the site root, e.g. "zadania/zadanie-1-pl.pdf". */
  pl: string;
  /** English version; missing = the PL file. */
  en?: string;
}

export const groups = groupsJson as unknown as {
  enabled: boolean;
  // Page heading per language (absent when the page is disabled).
  pl?: { title: string; subtitle: string };
  en?: { title: string; subtitle: string };
  // '' = an hour before "Gra nocna" in the plan, 'open', 'RRRR-MM-DD GG:MM'
  // (see data/unlock.ts).
  tasks?: { unlock: string; files: GroupTask[] };
  groups: Group[];
};
