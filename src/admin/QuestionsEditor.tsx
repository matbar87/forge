import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { BiField, SmallButton, move } from './fields';
import { newId, type EditQuestions, type EditSession } from './model';

const SessionEditor: React.FC<{
  session: EditSession;
  index: number;
  count: number;
  onChange: (s: EditSession) => void;
  onMove: (dir: -1 | 1) => void;
  onDelete: () => void;
}> = ({ session, index, count, onChange, onMove, onDelete }) => {
  const qs = session.questions;
  const setQs = (questions: EditSession['questions']) => onChange({ ...session, questions });
  return (
    <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
      <div className="flex items-center gap-2">
        <h2 className="font-bebas text-2xl tracking-wide uppercase">Sesja {index + 1}</h2>
        <span className="text-xs font-mono-code text-[#E3E6DB]/50">{qs.length} pyt.</span>
        <div className="flex gap-1 ml-auto">
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
              <SmallButton title="Usuń pytanie" danger onClick={() => setQs(qs.filter((x) => x.id !== q.id))}>
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
    </section>
  );
};

export const QuestionsEditor: React.FC<{ data: EditQuestions; onChange: (d: EditQuestions) => void }> = ({ data, onChange }) => {
  const sessions = data.sessions;
  const set = (list: EditSession[]) => onChange({ ...data, sessions: list });
  return (
    <div className="space-y-5">
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
          onChange={(ns) => set(sessions.map((x) => (x.id === ns.id ? ns : x)))}
          onMove={(dir) => set(move(sessions, i, dir))}
          onDelete={() => {
            if (window.confirm(`Usunąć Sesję ${i + 1} razem z pytaniami?`)) set(sessions.filter((x) => x.id !== s.id));
          }}
        />
      ))}
      <SmallButton
        title="Dodaj sesję"
        onClick={() => set([...sessions, { id: newId(), topic: { pl: '', en: '' }, questions: [] }])}
      >
        <Plus className="w-3.5 h-3.5" /> Dodaj sesję
      </SmallButton>
    </div>
  );
};
