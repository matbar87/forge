// What the public site is allowed to know about the groups. Used by the Vite
// build (vite.config.ts passes src/data/groups.json through it before it enters
// any bundle) and by scripts/check-groups-leak.mjs. Plain JavaScript so Node
// can run it directly.
//
// The repository is public, so groups.json itself holds no surnames — only an
// initial ("B."). With "enabled": false the people are dropped from the site
// altogether.

/** Surname shortened to one letter and a dot ("Kowalski" -> "K."). */
export const initial = (last) => {
  const ch = [...String(last ?? '').trim()][0];
  return ch ? `${ch.toLocaleUpperCase('pl')}.` : '';
};

const heading = (h) => (h ? { title: h.title, subtitle: h.subtitle } : undefined);

export function publicGroups(data) {
  if (data.enabled === false) return { enabled: false, groups: [] };
  // Task PDFs (download button under a group): only the ones some group uses.
  const files = Array.isArray(data.tasks?.files) ? data.tasks.files : [];
  const byName = new Map(files.map((t) => [String(t.name).trim().toLowerCase(), t]));
  const taskOf = (g) => (g.task ? byName.get(String(g.task).trim().toLowerCase()) : undefined);
  const used = files.filter((t) => (data.groups ?? []).some((g) => taskOf(g) === t));
  return {
    enabled: true,
    pl: heading(data.pl),
    en: heading(data.en),
    tasks: {
      unlock: data.tasks?.unlock ?? '',
      files: used.map((t) => ({ name: t.name, pl: t.pl, ...(t.en ? { en: t.en } : {}) })),
    },
    groups: (data.groups ?? []).map((g) => ({
      name: g.name,
      ...(taskOf(g) ? { task: taskOf(g).name } : {}),
      members: g.members.map((m) => ({ first: m.first, last: m.last, ...(m.role ? { role: m.role } : {}) })),
    })),
  };
}
