// Run after `vite build`: makes sure that with "enabled": false in
// groups.json the built site (dist/) contains no group members at all.
// (Surnames are never stored — the repo is public — see groups-public.js.)
// A failure stops the build, so nothing is published.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const data = JSON.parse(readFileSync(new URL('../src/data/groups.json', import.meta.url), 'utf8'));
if (data.enabled !== false) {
  console.log('groups: strona włączona — nic do sprawdzenia');
  process.exit(0);
}

const files = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(js|html|json|css|webmanifest)$/.test(f)) files.push(p);
  }
};
walk(dist);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const leaks = new Set();
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const m of data.groups.flatMap((g) => g.members)) {
    if (new RegExp(`["']?first["']?\\s*:\\s*["']${esc(m.first.trim())}["']`).test(text)) leaks.add(`${f}: ${m.first}`);
  }
}
if (leaks.size) {
  console.error('groups: strona jest wyłączona, a dane osób trafiły do kodu:\n  ' + [...leaks].join('\n  '));
  process.exit(1);
}
console.log(`groups: strona wyłączona — ${files.length} plików sprawdzonych, brak danych osób`);
