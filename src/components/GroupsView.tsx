import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Language, translations } from '../translations';
import { usePinGate } from '../hooks/usePinGate';
import { groups } from '../data/groups';
import { PinEntryCard } from './PinEntryCard';

interface GroupsViewProps {
  lang: Language;
}

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');

export const GroupsView: React.FC<GroupsViewProps> = ({ lang }) => {
  const t = translations[lang].groupsView;
  const pinGate = usePinGate();
  const [query, setQuery] = useState('');

  // A group whose name matches shows all its members; otherwise only the
  // members that match.
  const visible = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return groups.groups;
    return groups.groups
      .map((g) => {
        if (normalize(g.name).includes(q)) return g;
        return { ...g, members: g.members.filter((m) => normalize(`${m.first} ${m.last}`).includes(q)) };
      })
      .filter((g) => g.members.length > 0);
  }, [query]);

  return (
    <section className="min-h-screen w-full pt-[104px] sm:pt-[128px] pb-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] bg-[#1E2938]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-[#16202B]/60 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9] mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium">{t.subtitle}</p>
        </div>

        {!pinGate.unlocked ? (
          <PinEntryCard prompt={t.pinPrompt} errorText={t.pinError} lockedText={t.pinLocked} pinGate={pinGate} />
        ) : (
          <>
            <label className="relative block mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E3E6DB]/40" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                className="w-full bg-[#18212C] border border-[#3E4C5E]/40 rounded-xl pl-10 pr-4 py-3 text-sm text-[#E3E6DB] placeholder:text-[#E3E6DB]/35 focus:outline-none focus:border-[#E3E6DB]/50"
              />
            </label>

            {visible.length === 0 && <p className="text-sm text-[#E3E6DB]/50 italic text-center">{t.noResults}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visible.map((group) => (
                <div key={group.name} className="bg-[#18212C] rounded-2xl p-5 sm:p-6 shadow-xl">
                  <h3 className="font-bebas text-2xl sm:text-3xl text-[#E3E6DB] tracking-wide uppercase mb-3">{group.name}</h3>
                  <ul className="space-y-2">
                    {group.members.map((m, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 text-sm text-[#E3E6DB]/85">
                        <span>
                          {m.first} {m.last}
                        </span>
                        {m.role && (
                          <span
                            className={`shrink-0 font-mono-code text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              m.role === 'leader' ? 'bg-[#E3E6DB] text-[#121820]' : 'bg-[#253242] text-[#E3E6DB]/80'
                            }`}
                          >
                            {m.role === 'leader' ? t.leader : t.assistant}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
