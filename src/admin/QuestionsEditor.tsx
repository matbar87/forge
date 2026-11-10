import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Plus, Trash2 } from 'lucide-react';
import { BiField, SmallButton, move } from './fields';
import { newId, type EditQuestions, type EditSession } from './model';

const SessionEditor: React.FC<{
  session: EditSession;
  index: number;
  count: number;
  onChange: (s: EditSession) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
  open: boolean;
  onToggle: () => void;
}> = ({ session, index, count, onChange, onMove, onDelete, open, onToggle }) => {
  const qs = session.questions;
  const setQs = (questions: EditSession['questions']) => onChange({ ...session, questions });
  return (
    <section className="bg-[#18212C] rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 p-4 sm:p-5">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex-1 min-w-0 flex items-center gap-3 text-left">
          {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
          <h2 className="font-bebas text-2xl tracking-wide uppercase shrink-0">Sesja {index + 1}</h2>
          <span className="hidden sm:block text-sm text-[#E3E6DB]/60 truncate">{session.topic.pl}</span>
          <span className="text-xs font-mono-code text-[#E3E6DB]/50 ml-auto shrink-0">{qs.length} pyt.</span>
        </button>
        <div className="flex gap-1">
          <SmallButton title="Sesja w górę" onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp className="w-3.5 h-3.5" />
          </SmallButton>
          <SmallButton title="Sesja w dół" onClick={() => onMove(1)} disabled={index === count - 1}>
            <ArrowDown className="w-3.5 h-3.5" />
          </SmallButton>
          <SmallButton title="Usuń sesję" danger onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </SmallButton>
        </div>
      </div>
      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-3">
      <BiField label="Temat" value={session.topic} onChange={(topic) => onChange({ ...session, topic })} />

      <ol className="space-y-2">
        {qs.map((q, i) => (
          <li key={q.id} className="flex gap-2 items-start bg-[#1E2937] rounded-xl p-3">
            <span className="shrink-0 w-6 h-6 mt-5 rounded-full bg-[#253242] text-[11px] font-mono-code font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <BiField
                label="Pytanie"
                multiline
                value={q.text}
                onChange={(text) => setQs(qs.map((x) => (x.id === q.id ? { ...x, text } : x)))}
              />
            </div>
            <div className="flex flex-col gap-1 mt-5">
              <SmallButton title="Pytanie w górę" onClick={() => setQs(move(qs, i, -1))} disabled={i === 0}>
                <ArrowUp className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Pytanie w dół" onClick={() => setQs(move(qs, i, 1))} disabled={i === qs.length - 1}>
                <ArrowDown className="w-3.5 h-3.5" />
              </SmallButton>
              <SmallButton title="Usuń pytanie" danger onClick={() => {
                  const preview = q.text.pl.trim().slice(0, 60);
                  if (window.confirm(`Usunąć pytanie ${i + 1}${preview ? ` („${preview}${q.text.pl.trim().length > 60 ? '…' : ''}”)` : ''}?`)) {
                    setQs(qs.filter((x) => x.id !== q.id));
                  }
                }}>
                <Trash2 className="w-3.5 h-3.5" />
              </SmallButton>
            </div>
          </li>
        ))}
      </ol>
      {qs.length === 0 && (
        <p className="text-xs text-[#E3E6DB]/50 italic">Bez pytań — na stronie pojawi się „Pytania do tej sesji pojawią się wkrótce”.</p>
      )}
      <SmallButton title="Dodaj pytanie" onClick={() => setQs([...qs, { id: newId(), text: { pl: '', en: '' } }])}>
        <Plus className="w-3.5 h-3.5" /> Dodaj pytanie
      </SmallButton>
        </div>
      )}
    </section>
  );
};

export const QuestionsEditor: React.FC<{ data: EditQuestions; onChange: (d: EditQuestions) => void }> = ({ data, onChange }) => {
  const sessions = data.sessions;
  const set = (list: EditSession[]) => onChange({ ...data, sessions: list });
  // Everything starts collapsed; a newly added session opens straight away.
  const [open, setOpen] = useState<Set<string>>(new Set());
  const allOpen = sessions.length > 0 && sessions.every((s) => open.has(s.id));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  return (
    <div className="space-y-5">
      <SmallButton title={allOpen ? 'Zwiń wszystkie sesje' : 'Rozwiń wszystkie sesje'} onClick={() => setOpen(allOpen ? new Set() : new Set(sessions.map((s) => s.id)))}>
        {allOpen ? <ChevronsDownUp className="w-3.5 h-3.5" /> : <ChevronsUpDown className="w-3.5 h-3.5" />}
        {allOpen ? 'Zwiń wszystkie' : 'Rozwiń wszystkie'}
      </SmallButton>
      <p className="text-xs text-[#E3E6DB]/55">
        Tytuł sesji na stronie to „Sesja [numer]” / „Session [number]” wg kolejności. Puste pole EN = na angielskiej wersji
        pojawi się tekst PL. Puste pytania są pomijane.
      </p>
      {sessions.map((s, i) => (
        <SessionEditor
          key={s.id}
          session={s}
          index={i}
          count={sessions.length}
          open={open.has(s.id)}
          onToggle={() => toggle(s.id)}
          onChange={(ns) => set(sessions.map((x) => (x.id === ns.id ? ns : x)))}
          onMove={(dir) => set(move(sessions, i, dir))}
          onDelete={() => {
            if (window.confirm(`Usunąć Sesję ${i + 1} razem z pytaniami?`)) set(sessions.filter((x) => x.id !== s.id));
          }}
        />
      ))}
      <SmallButton
        title="Dodaj sesję"
        onClick={() => {
          const id = newId();
          set([...sessions, { id, topic: { pl: '', en: '' }, questions: [] }]);
          setOpen((prev) => new Set(prev).add(id));
        }}
      >
        <Plus className="w-3.5 h-3.5" /> Dodaj sesję
      </SmallButton>
    </div>
  );
};
