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

export function publicGroups(data) {
  if (data.enabled === false) return { enabled: false, groups: [] };
  return {
    enabled: true,
    pl: data.pl,
    en: data.en,
    groups: (data.groups ?? []).map((g) => ({
      name: g.name,
      members: g.members.map((m) => ({ first: m.first, last: m.last, ...(m.role ? { role: m.role } : {}) })),
    })),
  };
}
