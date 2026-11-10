import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Plus, Trash2 } from 'lucide-react';
import { MAX_GROUP_LEADERS, MAX_GROUP_SIZE } from '../data/validation.js';
import { initial } from '../data/groups-public.js';
import { BiField, SmallButton, TextField, move } from './fields';
import { newId, type EditGroup, type EditGroups, type EditMember, type MemberRole } from './model';

const selectClass =
  'w-full bg-[#121820] border border-[#3E4C5E]/60 rounded-lg px-2.5 py-1.5 text-sm text-[#E3E6DB] focus:outline-none focus:border-[#E3E6DB]/60';

const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; title: string; hint: string }> = ({
  checked,
  onChange,
  title,
  hint,
}) => (
  <label className="flex items-start gap-3 cursor-pointer">
    <input type="checkbox" className="mt-1 w-4 h-4" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>
      <span className="block text-sm font-bold">{title}</span>
      <span className="block text-xs text-[#E3E6DB]/55 leading-relaxed">{hint}</span>
    </span>
  </label>
);

const GroupEditor: React.FC<{
  group: EditGroup;
  index: number;
  count: number;
  onChange: (g: EditGroup) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  selected: Set<string>;
  onToggle: (id: string) => void;
  open: boolean;
  onToggleOpen: () => void;
}> = ({ group, index, count, onChange, onMove, onDelete, selected, onToggle, open, onToggleOpen }) => {
  const ms = group.members;
  const setMs = (members: EditMember[]) => onChange({ ...group, members });
  const patch = (id: string, p: Partial<EditMember>) => setMs(ms.map((m) => (m.id === id ? { ...m, ...p } : m)));
  const full = ms.length >= MAX_GROUP_SIZE;
  const leaders = ms.filter((m) => m.role === 'leader').length;
  return (
    <section className="bg-[#18212C] rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 p-4 sm:p-5">
        <button type="button" onClick={onToggleOpen} aria-expanded={open} className="flex-1 min-w-0 flex items-center gap-3 text-left">
          {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
          <h2 className="font-bebas text-2xl tracking-wide uppercase truncate">{group.name || `Grupa ${index + 1}`}</h2>
          <span className={`text-xs font-mono-code ml-auto shrink-0 ${ms.length > MAX_GROUP_SIZE ? 'text-[#F2B8B5]' : 'text-[#E3E6DB]/50'}`}>
            {ms.length}/{MAX_GROUP_SIZE}
          </span>
        </button>
        <div className="flex gap-1">
          <SmallButton title="Grupa w górę" onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp className="w-3.5 h-3.5" />
          </SmallButton>
          <SmallButton title="Grupa w dół" onClick={() => onMove(1)} disabled={index === count - 1}>
            <ArrowDown className="w-3.5 h-3.5" />
          </SmallButton>
          <SmallButton title="Usuń grupę" danger onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </SmallButton>
        </div>
      </div>
      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-3">
      <TextField label={`Grupa ${index + 1} — nazwa`} value={group.name} onChange={(name) => onChange({ ...group, name })} />

      <ol className="space-y-2">
        {ms.map((m, i) => (
          <li
            key={m.id}
            className={`rounded-xl p-2.5 grid grid-cols-[auto_minmax(0,1fr)_4.5rem] sm:grid-cols-[auto_minmax(0,1fr)_5rem_130px_auto] gap-2 items-end ${
              selected.has(m.id) ? 'bg-[#2A3A50] ring-1 ring-[#E3E6DB]/40' : 'bg-[#1E2937]'
            }`}
          >
            <input
              type="checkbox"
              className="w-4 h-4 mb-2.5"
              aria-label={`Zaznacz ${m.first} ${m.last}`.trim()}
              checked={selected.has(m.id)}
              onChange={() => onToggle(m.id)}
            />
            <TextField label="Imię" value={m.first} onChange={(first) => patch(m.id, { first })} />
            <TextField
              label="Inicjał"
              value={m.last}
              placeholder="K."
              onChange={(v) => {
                // Deleting clears the field; typing (or overtyping a selection) keeps the last letter typed.
                const letters = [...v.replace(/\./g, '').trim()];
                patch(m.id, { last: (v.length < m.last.length && m.last.startsWith(v)) || !letters.length ? '' : initial(letters[letters.length - 1]) });
              }}
            />
            {/* Role + buttons: their own row on a phone, plain grid cells from sm up */}
            <div className="col-span-2 col-start-2 flex items-end gap-2 sm:contents">
            <label className="block min-w-0 flex-1">
              <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#E3E6DB]/50 mb-1">Rola</span>
              <select className={selectClass} value={m.role} onChange={(e) => patch(m.id, { role: e.target.value as MemberRole })}>
                <option value="">uczestnik</option>
                <option value="leader">lider</option>
                <option value="assistant">asystent</option>
              </select>
            </label>
            <div className="flex gap-1 justify-end shrink-0">
              <SmallButton title="Osoba w górę" onClick={() => setMs(move(ms, i, -1))} disabled={i === 0}>
                <ArrowUp className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Osoba w dół" onClick={() => setMs(move(ms, i, 1))} disabled={i === ms.length - 1}>
                <ArrowDown className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Usuń osobę" danger onClick={() => {
                  const who = `${m.first} ${m.last}`.trim();
                  if (window.confirm(`Usunąć osobę${who ? ` ${who}` : ''} z grupy „${group.name || index + 1}”?`)) {
                    setMs(ms.filter((x) => x.id !== m.id));
                  }
                }}>
                <Trash2 className="w-3.5 h-3.5" />
              </SmallButton>
            </div>
            </div>
          </li>
        ))}
      </ol>
      {leaders > MAX_GROUP_LEADERS && (
        <p className="text-xs text-[#F2B8B5]">W grupie mogą być najwyżej {MAX_GROUP_LEADERS} osoby z rolą lidera.</p>
      )}
      <SmallButton
        title="Dodaj osobę"
        disabled={full}
        onClick={() => setMs([...ms, { id: newId(), first: '', last: '', role: '' }])}
      >
        <Plus className="w-3.5 h-3.5" /> {full ? `Grupa pełna (${MAX_GROUP_SIZE})` : 'Dodaj osobę'}
      </SmallButton>
        </div>
      )}
    </section>
  );
};

export const GroupsEditor: React.FC<{ data: EditGroups; onChange: (d: EditGroups) => void }> = ({ data, onChange }) => {
  const list = data.groups;
  const set = (groups: EditGroup[]) => onChange({ ...data, groups });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState('');
  // Everything starts collapsed; a newly added group opens straight away.
  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = list.length > 0 && list.every((g) => open.has(g.id));
  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  // Drop selections of people who no longer exist (deleted / reloaded).
  const existing = new Set(list.flatMap((g) => g.members.map((m) => m.id)));
  const picked = list.flatMap((g) => g.members).filter((m) => selected.has(m.id) && existing.has(m.id));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const targetGroup = list.find((g) => g.id === target);
  // Only people not already in the target group need room there.
  const incoming = targetGroup ? picked.filter((m) => !targetGroup.members.some((x) => x.id === m.id)) : [];
  const room = targetGroup ? MAX_GROUP_SIZE - targetGroup.members.length : 0;
  const leadersAfter = targetGroup
    ? targetGroup.members.filter((m) => m.role === 'leader').length + incoming.filter((m) => m.role === 'leader').length
    : 0;
  const tooManyLeaders = leadersAfter > MAX_GROUP_LEADERS;
  const canMove = !!targetGroup && incoming.length > 0 && incoming.length <= room && !tooManyLeaders;
  const move_ = () => {
    if (!canMove || !targetGroup) return;
    const ids = new Set(incoming.map((m) => m.id));
    set(
      list.map((g) =>
        g.id === targetGroup.id
          ? { ...g, members: [...g.members, ...incoming] }
          : { ...g, members: g.members.filter((m) => !ids.has(m.id)) }
      )
    );
    setSelected(new Set());
  };
  return (
    <div className="space-y-5">
      {picked.length > 0 && (
        <div className="sticky top-[68px] z-20 bg-[#253242] border border-[#3E4C5E] rounded-2xl p-3 shadow-2xl flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold">Zaznaczono: {picked.length}</span>
          <select className={`${selectClass} !w-auto min-w-[160px]`} value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Przenieś do grupy…</option>
            {list.map((g) => {
              const free = MAX_GROUP_SIZE - g.members.length;
              return (
                <option key={g.id} value={g.id}>
                  {g.name || 'bez nazwy'} (wolnych miejsc: {Math.max(free, 0)})
                </option>
              );
            })}
          </select>
          <SmallButton title="Przenieś zaznaczone" onClick={move_} disabled={!canMove}>
            Przenieś
          </SmallButton>
          <SmallButton title="Odznacz wszystkich" onClick={() => setSelected(new Set())}>
            Odznacz
          </SmallButton>
          {targetGroup && tooManyLeaders && (
            <span className="text-xs text-[#F2B8B5]">W grupie „{targetGroup.name}” byłoby więcej niż {MAX_GROUP_LEADERS} liderów.</span>
          )}
          {targetGroup && incoming.length > room && (
            <span className="text-xs text-[#F2B8B5]">W grupie „{targetGroup.name}” jest tylko {Math.max(room, 0)} wolnych miejsc.</span>
          )}
        </div>
      )}
      <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="space-y-3">
          <h2 className="font-bebas text-2xl tracking-wide uppercase">Nagłówek strony</h2>
          <BiField label="Tytuł" value={data.title} onChange={(title) => onChange({ ...data, title })} />
          <BiField label="Podtytuł" value={data.subtitle} multiline onChange={(subtitle) => onChange({ ...data, subtitle })} />
        </div>
        <Switch
          checked={data.enabled}
          onChange={(enabled) => onChange({ ...data, enabled })}
          title="Strona „Grupy” włączona"
          hint="Wyłączona: zakładka Grupy znika z aplikacji, a lista osób w ogóle nie trafia do kodu strony."
        />
      </section>
      <p className="text-xs text-[#E3E6DB]/55">
        Maksymalnie {MAX_GROUP_SIZE} osób w grupie i najwyżej {MAX_GROUP_LEADERS} liderów (asystentów może być kilku). Repo jest publiczne, więc zapisujemy tylko imię i inicjał nazwiska (np. „K.”).
        Zaznacz osoby polem po lewej i przenieś je do innej grupy paskiem u góry. Całość można też wgrać jako arkusz plan/grupy.xlsx na GitHubie.
      </p>
      <SmallButton title={allOpen ? 'Zwiń wszystkie grupy' : 'Rozwiń wszystkie grupy'} onClick={() => setOpen(allOpen ? new Set() : new Set(list.map((g) => g.id)))}>
        {allOpen ? <ChevronsDownUp className="w-3.5 h-3.5" /> : <ChevronsUpDown className="w-3.5 h-3.5" />}
        {allOpen ? 'Zwiń wszystkie' : 'Rozwiń wszystkie'}
      </SmallButton>
      {list.map((g, i) => (
        <GroupEditor
          key={g.id}
          group={g}
          index={i}
          count={list.length}
          onChange={(ng) => set(list.map((x) => (x.id === ng.id ? ng : x)))}
          onMove={(dir) => set(move(list, i, dir))}
          selected={selected}
          onToggle={toggle}
          open={open.has(g.id)}
          onToggleOpen={() => toggleOpen(g.id)}
          onDelete={() => {
            if (window.confirm(`Usunąć grupę „${g.name || i + 1}” razem z osobami?`)) set(list.filter((x) => x.id !== g.id));
          }}
        />
      ))}
      <SmallButton
        title="Dodaj grupę"
        onClick={() => {
          const id = newId();
          set([...list, { id, name: '', members: [] }]);
          setOpen((prev) => new Set(prev).add(id));
        }}
      >
        <Plus className="w-3.5 h-3.5" /> Dodaj grupę
      </SmallButton>
    </div>
  );
};
