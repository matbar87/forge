import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Copy, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { BiField, Label, SmallButton, TextField, inputClass, move, toTimeInput, fromTimeInput } from './fields';
import { ITEM_TYPES, emptyItem, newId, type EditDay, type EditItem, type EditPlan, type ItemType } from './model';

type Version = 'detailed' | 'basic';

const ItemEditor: React.FC<{
  item: EditItem;
  index: number;
  count: number;
  version: Version;
  onChange: (item: EditItem) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}> = ({ item, index, count, version, onChange, onMove, onDuplicate, onDelete }) => (
  <div className={`rounded-xl p-3 sm:p-4 space-y-2 ${item.leaders ? 'bg-[#232B3A] ring-1 ring-[#8FA3BF]/40' : 'bg-[#1E2937]'}`}>
    <div className="flex flex-wrap items-end gap-2">
      <label className="w-[136px]">
        <Label>Od</Label>
        <input
          className={inputClass}
          type="time"
          value={toTimeInput(item.start)}
          onChange={(e) => onChange({ ...item, start: fromTimeInput(e.target.value) })}
        />
      </label>
      <label className="w-[136px]">
        <Label>Do (opcja)</Label>
        <input
          className={inputClass}
          type="time"
          value={toTimeInput(item.end)}
          onChange={(e) => onChange({ ...item, end: fromTimeInput(e.target.value) })}
        />
      </label>
      <label className="w-[128px]">
        <Label>Typ</Label>
        <select className={inputClass} value={item.type} onChange={(e) => onChange({ ...item, type: e.target.value as ItemType })}>
          {ITEM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {version === 'detailed' && (
        <label className="flex items-center gap-2 h-[34px] px-2 rounded-lg bg-[#121820] border border-[#3E4C5E]/60 cursor-pointer select-none">
          <input type="checkbox" checked={item.leaders} onChange={(e) => onChange({ ...item, leaders: e.target.checked })} />
          <span className="text-xs">Tylko liderzy</span>
        </label>
      )}
      <div className="flex gap-1 ml-auto">
        <SmallButton title="W górę" onClick={() => onMove(-1)} disabled={index === 0}>
          <ArrowUp className="w-3.5 h-3.5" />
        </SmallButton>
        <SmallButton title="W dół" onClick={() => onMove(1)} disabled={index === count - 1}>
          <ArrowDown className="w-3.5 h-3.5" />
        </SmallButton>
        <SmallButton title="Duplikuj punkt" onClick={onDuplicate}>
          <Copy className="w-3.5 h-3.5" />
        </SmallButton>
        <SmallButton title="Usuń punkt" danger onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5" />
        </SmallButton>
      </div>
    </div>
    <BiField label="Tytuł" value={item.title} onChange={(title) => onChange({ ...item, title })} />
    <BiField label="Opis (opcja)" value={item.description} onChange={(description) => onChange({ ...item, description })} />
    <BiField label="Etykieta (opcja)" value={item.badge} onChange={(badge) => onChange({ ...item, badge })} />
  </div>
);

const DayEditor: React.FC<{
  day: EditDay;
  version: Version;
  onChange: (day: EditDay) => void;
  onDelete: () => void;
}> = ({ day, version, onChange, onDelete }) => {
  const [open, setOpen] = useState(true);
  const items = day[version];
  const setItems = (list: EditItem[]) => onChange({ ...day, [version]: list });
  const leaders = items.filter((i) => i.leaders).length;

  return (
    <section className="bg-[#18212C] rounded-2xl shadow-xl">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
        <span className="font-bebas text-2xl tracking-wide uppercase">Dzień {day.number}</span>
        <span className="text-xs font-mono-code text-[#E3E6DB]/60">{day.isoDate}</span>
        <span className="text-xs font-mono-code text-[#E3E6DB]/50 ml-auto">
          {items.length} pkt{leaders ? ` · ${leaders} liderzy` : ''}
          {items.length === 0 ? ' · nie pojawi się w tym planie' : ''}
        </span>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-[100px_170px_1fr] gap-2 items-end">
            <TextField
              label="Numer dnia"
              type="number"
              value={String(day.number)}
              onChange={(v) => onChange({ ...day, number: Math.max(0, Number(v) || 0) })}
            />
            <TextField label="Data" type="date" value={day.isoDate} onChange={(isoDate) => onChange({ ...day, isoDate })} />
            <div className="col-span-2 sm:col-span-1 flex sm:justify-end">
              <SmallButton title="Usuń cały dzień (z obu planów)" danger onClick={onDelete}>
                <Trash2 className="w-3.5 h-3.5" /> Usuń dzień
              </SmallButton>
            </div>
          </div>
          <BiField label="Data (wyświetlana)" value={day.date} onChange={(date) => onChange({ ...day, date })} />
          <BiField label="Nazwa dnia" value={day.dayName} onChange={(dayName) => onChange({ ...day, dayName })} />
          <BiField label="Motyw" value={day.theme} onChange={(theme) => onChange({ ...day, theme })} />

          <div className="space-y-2 pt-2">
            {items.map((item, i) => (
              <ItemEditor
                key={item.id}
                item={item}
                index={i}
                count={items.length}
                version={version}
                onChange={(it) => setItems(items.map((x) => (x.id === it.id ? it : x)))}
                onMove={(dir) => setItems(move(items, i, dir))}
                onDuplicate={() => {
                  const copy = { ...structuredClone(item), id: newId() };
                  setItems([...items.slice(0, i + 1), copy, ...items.slice(i + 1)]);
                }}
                onDelete={() => setItems(items.filter((x) => x.id !== item.id))}
              />
            ))}
            <div className="flex flex-wrap gap-2">
              <SmallButton title="Dodaj punkt" onClick={() => setItems([...items, emptyItem()])}>
                <Plus className="w-3.5 h-3.5" /> Dodaj punkt
              </SmallButton>
              {version === 'basic' && items.length === 0 && day.detailed.length > 0 && (
                <SmallButton
                  title="Skopiuj punkty z planu szczegółowego"
                  onClick={() =>
                    setItems(day.detailed.filter((i) => !i.leaders).map((i) => ({ ...structuredClone(i), id: newId(), leaders: false })))
                  }
                >
                  <Copy className="w-3.5 h-3.5" /> Skopiuj z planu szczegółowego
                </SmallButton>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const nextDate = (iso: string) => {
  const d = new Date(`${iso}T12:00`);
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const PlanEditor: React.FC<{ plan: EditPlan; onChange: (p: EditPlan) => void }> = ({ plan, onChange }) => {
  const [version, setVersion] = useState<Version>('detailed');
  const setDay = (day: EditDay) => onChange({ ...plan, days: plan.days.map((d) => (d.id === day.id ? day : d)) });
  const sortedDays = [...plan.days].sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  const addDay = (where: 'before' | 'after') => {
    const first = sortedDays[0];
    const last = sortedDays[sortedDays.length - 1];
    let number = last ? last.number + 1 : 1;
    let isoDate = last ? nextDate(last.isoDate) : '';
    if (where === 'before' && first) {
      number = Math.max(0, first.number - 1);
      const d = new Date(`${first.isoDate}T12:00`);
      d.setDate(d.getDate() - 1);
      isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    const empty = { pl: '', en: '' };
    onChange({
      ...plan,
      days: [
        ...plan.days,
        { id: newId(), number, isoDate, date: { ...empty }, dayName: { ...empty }, theme: { ...empty }, detailed: [emptyItem()], basic: [] },
      ],
    });
  };

  const leadersValue = plan.leadersUntil.replace(' ', 'T');

  return (
    <div className="space-y-5">
      <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        <h2 className="font-bebas text-2xl tracking-wide uppercase">Nagłówek i ustawienia</h2>
        <BiField label="Tytuł sekcji" value={plan.title} onChange={(title) => onChange({ ...plan, title })} />
        <BiField label="Podtytuł" value={plan.subtitle} onChange={(subtitle) => onChange({ ...plan, subtitle })} />
        <div className="grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-3 items-end">
          <label className="block">
            <Label>Koniec wydarzenia dla liderów</Label>
            <input
              className={inputClass}
              type="datetime-local"
              value={leadersValue}
              onChange={(e) => onChange({ ...plan, leadersUntil: e.target.value.replace('T', ' ') })}
            />
          </label>
          <p className="text-xs text-[#E3E6DB]/55 leading-relaxed">
            Od tej chwili punkty „Tylko liderzy” znikają z planu, a dzień, w którym nic nie zostanie (np. Dzień 0), znika z
            przełącznika dni. Puste = nigdy.
          </p>
        </div>
      </section>

      <div className="sticky top-[60px] z-20 -mx-4 px-4 py-2 bg-[#121820]/95 backdrop-blur flex flex-wrap items-center gap-2">
        {(['detailed', 'basic'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVersion(v)}
            className={`px-4 py-2 rounded-xl font-mono-code text-xs font-bold uppercase tracking-wider transition-colors ${
              version === v ? 'bg-[#E3E6DB] text-[#121820]' : 'bg-[#18212C] text-[#E3E6DB]/70 hover:bg-[#1E2937]'
            }`}
          >
            {v === 'detailed' ? 'Plan szczegółowy (/app)' : 'Plan podstawowy (strona główna)'}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#E3E6DB]/55 -mt-2">
        Na stronie punkty każdego dnia są ułożone wg godziny rozpoczęcia (przy tej samej godzinie — w kolejności tutaj).
        Daty, nazwy dni i motywy są wspólne dla obu planów.
      </p>

      {sortedDays.map((day) => (
        <DayEditor
          key={day.id}
          day={day}
          version={version}
          onChange={setDay}
          onDelete={() => {
            if (window.confirm(`Usunąć Dzień ${day.number} (${day.isoDate}) z obu planów?`)) {
              onChange({ ...plan, days: plan.days.filter((d) => d.id !== day.id) });
            }
          }}
        />
      ))}

      <div className="flex flex-wrap gap-2">
        <SmallButton title="Dodaj dzień przed pierwszym" onClick={() => addDay('before')}>
          <Plus className="w-3.5 h-3.5" /> Dodaj dzień na początku
        </SmallButton>
        <SmallButton title="Dodaj dzień po ostatnim" onClick={() => addDay('after')}>
          <Plus className="w-3.5 h-3.5" /> Dodaj dzień na końcu
        </SmallButton>
      </div>
    </div>
  );
};
