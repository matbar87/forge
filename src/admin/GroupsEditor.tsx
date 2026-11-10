import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { MAX_GROUP_SIZE } from '../data/validation.js';
import { initial } from '../data/groups-public.js';
import { SmallButton, TextField, move } from './fields';
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
}> = ({ group, index, count, onChange, onMove, onDelete }) => {
  const ms = group.members;
  const setMs = (members: EditMember[]) => onChange({ ...group, members });
  const patch = (id: string, p: Partial<EditMember>) => setMs(ms.map((m) => (m.id === id ? { ...m, ...p } : m)));
  const full = ms.length >= MAX_GROUP_SIZE;
  const leaders = ms.filter((m) => m.role === 'leader').length;
  return (
    <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <TextField label={`Grupa ${index + 1} — nazwa`} value={group.name} onChange={(name) => onChange({ ...group, name })} />
        </div>
        <span className={`text-xs font-mono-code pb-2 ${ms.length > MAX_GROUP_SIZE ? 'text-[#F2B8B5]' : 'text-[#E3E6DB]/50'}`}>
          {ms.length}/{MAX_GROUP_SIZE}
        </span>
        <div className="flex gap-1 pb-0.5">
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

      <ol className="space-y-2">
        {ms.map((m, i) => (
          <li key={m.id} className="bg-[#1E2937] rounded-xl p-2.5 grid grid-cols-2 sm:grid-cols-[1fr_1fr_130px_auto] gap-2 items-end">
            <TextField label="Imię" value={m.first} onChange={(first) => patch(m.id, { first })} />
            <TextField
              label="Inicjał nazwiska"
              value={m.last}
              placeholder="K."
              onChange={(v) => patch(m.id, { last: initial(v.replace(/\./g, '')) })}
            />
            <label className="block min-w-0">
              <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#E3E6DB]/50 mb-1">Rola</span>
              <select className={selectClass} value={m.role} onChange={(e) => patch(m.id, { role: e.target.value as MemberRole })}>
                <option value="">uczestnik</option>
                <option value="leader">lider</option>
                <option value="assistant">asystent</option>
              </select>
            </label>
            <div className="flex gap-1 justify-end">
              <SmallButton title="Osoba w górę" onClick={() => setMs(move(ms, i, -1))} disabled={i === 0}>
                <ArrowUp className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Osoba w dół" onClick={() => setMs(move(ms, i, 1))} disabled={i === ms.length - 1}>
                <ArrowDown className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Usuń osobę" danger onClick={() => setMs(ms.filter((x) => x.id !== m.id))}>
                <Trash2 className="w-3.5 h-3.5" />
              </SmallButton>
            </div>
          </li>
        ))}
      </ol>
      {leaders > 1 && <p className="text-xs text-[#F2B8B5]">W grupie może być tylko jeden lider.</p>}
      <SmallButton
        title="Dodaj osobę"
        disabled={full}
        onClick={() => setMs([...ms, { id: newId(), first: '', last: '', role: '' }])}
      >
        <Plus className="w-3.5 h-3.5" /> {full ? `Grupa pełna (${MAX_GROUP_SIZE})` : 'Dodaj osobę'}
      </SmallButton>
    </section>
  );
};

export const GroupsEditor: React.FC<{ data: EditGroups; onChange: (d: EditGroups) => void }> = ({ data, onChange }) => {
  const list = data.groups;
  const set = (groups: EditGroup[]) => onChange({ ...data, groups });
  return (
    <div className="space-y-5">
      <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <Switch
          checked={data.enabled}
          onChange={(enabled) => onChange({ ...data, enabled })}
          title="Strona „Grupy” włączona"
          hint="Wyłączona: zakładka Grupy znika z aplikacji, a lista osób w ogóle nie trafia do kodu strony."
        />
      </section>
      <p className="text-xs text-[#E3E6DB]/55">
        Maksymalnie {MAX_GROUP_SIZE} osób w grupie i jeden lider (asystentów może być kilku). Repo jest publiczne, więc zapisujemy tylko imię i inicjał nazwiska (np. „K.”).
        Całość można też wgrać jako arkusz plan/grupy.xlsx na GitHubie.
      </p>
      {list.map((g, i) => (
        <GroupEditor
          key={g.id}
          group={g}
          index={i}
          count={list.length}
          onChange={(ng) => set(list.map((x) => (x.id === ng.id ? ng : x)))}
          onMove={(dir) => set(move(list, i, dir))}
          onDelete={() => {
            if (window.confirm(`Usunąć grupę „${g.name || i + 1}” razem z osobami?`)) set(list.filter((x) => x.id !== g.id));
          }}
        />
      ))}
      <SmallButton title="Dodaj grupę" onClick={() => set([...list, { id: newId(), name: '', members: [] }])}>
        <Plus className="w-3.5 h-3.5" /> Dodaj grupę
      </SmallButton>
    </div>
  );
};
