// "Zadania (PDF)" section of the groups tab: the task PDFs (PL + EN) that the
// groups download with the "Pobierz zadanie" button, and when that button
// appears. A PDF picked here is kept in memory and committed to
// public/zadania/ on "Zapisz i opublikuj", just before groups.json.
import React, { useRef } from 'react';
import { ExternalLink, FileUp, Plus, Trash2 } from 'lucide-react';
import { TASK_DIR } from '../data/validation.js';
import { toLocalISODate } from '../data/plan';
import { TASK_LEAD_MINUTES, UNLOCK_OPEN, formatUnlock, planGameNightStart, taskUnlockAt } from '../data/unlock';
import { repoFileUrl } from './github';
import { Label, SmallButton, TextField, inputClass } from './fields';
import { newId, type EditGroups, type EditTask } from './model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlanJson = any;

/** Largest PDF accepted (GitHub's contents API takes more, but phones download it). */
export const MAX_TASK_MB = 20;

type UnlockMode = 'auto' | 'open' | 'custom';
const modeOf = (u: string): UnlockMode => (u === '' ? 'auto' : u === UNLOCK_OPEN ? 'open' : 'custom');
const toInput = (u: string) => u.replace(/ (\d):/, ' 0$1:').replace(' ', 'T');
const fromInput = (v: string) => v.replace('T', ' ');
const pad = (n: number) => String(n).padStart(2, '0');
const toSetting = (d: Date) => `${toLocalISODate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** "Zadanie 1 – PL.pdf" -> "zadania/zadanie-1-pl.pdf" */
export const taskPath = (fileName: string) => {
  const base = fileName
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${TASK_DIR}/${base || 'zadanie'}.pdf`;
};

const FilePicker: React.FC<{
  label: string;
  path: string;
  pending: boolean;
  optional?: boolean;
  onPick: (file: File) => void;
  onClear: () => void;
}> = ({ label, path, pending, optional, onPick, onClear }) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 bg-[#121820] border border-[#3E4C5E]/60 rounded-lg px-2.5 py-1.5 min-h-[34px]">
        <span className="flex-1 min-w-0 truncate text-sm">
          {path ? (
            pending ? (
              <span title="Zostanie wgrany przy zapisie">
                {path.slice(TASK_DIR.length + 1)} <span className="text-[#F2C96B] text-xs">(nowy — wgra się przy zapisie)</span>
              </span>
            ) : (
              <a className="underline inline-flex items-center gap-1" href={repoFileUrl(`public/${path}`)} target="_blank" rel="noopener noreferrer">
                {path.slice(TASK_DIR.length + 1)} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            )
          ) : (
            <span className="text-[#E3E6DB]/40">{optional ? 'brak — uczestnicy EN dostaną plik PL' : 'brak pliku'}</span>
          )}
        </span>
        <input
          ref={input}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') return window.alert('Wybierz plik PDF.');
            if (f.size > MAX_TASK_MB * 1024 * 1024) return window.alert(`Plik ma ${(f.size / 1048576).toFixed(1)} MB — maksymalnie ${MAX_TASK_MB} MB.`);
            onPick(f);
          }}
        />
        <SmallButton title={path ? 'Wybierz inny PDF' : 'Wybierz PDF'} onClick={() => input.current?.click()}>
          <FileUp className="w-3.5 h-3.5" /> PDF
        </SmallButton>
        {path && (
          <SmallButton title="Usuń plik z zadania" danger onClick={onClear}>
            <Trash2 className="w-3.5 h-3.5" />
          </SmallButton>
        )}
      </div>
    </div>
  );
};

export const TasksEditor: React.FC<{
  data: EditGroups;
  plan: PlanJson;
  onChange: (d: EditGroups) => void;
  uploads: Record<string, File>;
  onUpload: (path: string, file: File) => void;
}> = ({ data, plan, onChange, uploads, onUpload }) => {
  const tasks = data.tasks;
  const setTasks = (list: EditTask[]) => onChange({ ...data, tasks: list });
  const patch = (id: string, p: Partial<EditTask>) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const pick = (task: EditTask, lang: 'pl' | 'en', file: File) => {
    const path = taskPath(file.name);
    const other = tasks.find((t) => t.id !== task.id && (t.pl === path || t.en === path)) || (lang === 'en' ? task.pl === path : task.en === path);
    if (other && !window.confirm(`Plik ${path.slice(TASK_DIR.length + 1)} jest już użyty w innym miejscu i zostanie zastąpiony nowym. Kontynuować?`)) return;
    onUpload(path, file);
    patch(task.id, { [lang]: path });
  };

  const mode = modeOf(data.tasksUnlock);
  const gameNight = plan ? planGameNightStart(plan) : null;
  const at = taskUnlockAt(data.tasksUnlock, plan ?? {});
  const hint =
    mode === 'auto'
      ? gameNight
        ? `„Gra nocna” w planie: ${formatUnlock(gameNight, 'pl')} — przycisk pojawi się ${formatUnlock(at!, 'pl')}.`
        : 'W planie szczegółowym nie ma punktu „Gra nocna” — przycisk będzie widoczny od razu.'
      : mode === 'open'
        ? 'Przycisk widoczny od razu.'
        : 'Przycisk pojawi się o wybranej godzinie (czas urządzenia uczestnika).';

  return (
    <section className="bg-[#18212C] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      <div>
        <h2 className="font-bebas text-2xl tracking-wide uppercase">Zadania (PDF)</h2>
        <p className="text-xs text-[#E3E6DB]/55 leading-relaxed mt-1">
          Każde zadanie ma plik PL i EN. W grupie wybierz zadanie — na końcu jej karty pojawi się przycisk „Pobierz zadanie”; uczestnik
          z językiem EN pobierze plik EN, z PL — plik PL. Uwaga: repo jest publiczne, więc pliki PDF też są publiczne (ukryty jest tylko
          przycisk do czasu odblokowania).
        </p>
      </div>

      <div className="bg-[#1E2937] rounded-xl p-3 space-y-2">
        <Label>Kiedy pokazać przycisk „Pobierz zadanie”</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            className={`${inputClass} sm:w-auto`}
            value={mode}
            onChange={(e) => {
              const m = e.target.value as UnlockMode;
              if (m === 'auto') onChange({ ...data, tasksUnlock: '' });
              else if (m === 'open') onChange({ ...data, tasksUnlock: UNLOCK_OPEN });
              else onChange({ ...data, tasksUnlock: mode === 'custom' ? data.tasksUnlock : toSetting(at ?? new Date()) });
            }}
          >
            <option value="auto">Automatycznie — {TASK_LEAD_MINUTES} min przed „Gra nocna”</option>
            <option value="open">Od razu</option>
            <option value="custom">Od wybranej daty i godziny</option>
          </select>
          {mode === 'custom' && (
            <input
              type="datetime-local"
              className={`${inputClass} sm:w-auto`}
              value={toInput(data.tasksUnlock)}
              onChange={(e) => e.target.value && onChange({ ...data, tasksUnlock: fromInput(e.target.value) })}
            />
          )}
        </div>
        <p className="text-xs text-[#E3E6DB]/55">{hint}</p>
      </div>

      <ol className="space-y-3">
        {tasks.map((task, i) => {
          const used = data.groups.filter((g) => g.taskId === task.id).length;
          return (
            <li key={task.id} className="bg-[#1E2937] rounded-xl p-3 space-y-2">
              <div className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <TextField label={`Zadanie ${i + 1} — nazwa (widoczna tylko w panelu)`} value={task.name} onChange={(name) => patch(task.id, { name })} />
                </div>
                <span className="text-xs text-[#E3E6DB]/50 mb-2 shrink-0">grup: {used}</span>
                <SmallButton
                  title="Usuń zadanie"
                  danger
                  onClick={() => {
                    if (!window.confirm(`Usunąć zadanie „${task.name || i + 1}”?${used ? ` Grupy, które je mają (${used}), zostaną bez zadania.` : ''}`)) return;
                    onChange({
                      ...data,
                      tasks: tasks.filter((t) => t.id !== task.id),
                      groups: data.groups.map((g) => (g.taskId === task.id ? { ...g, taskId: '' } : g)),
                    });
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </SmallButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FilePicker
                  label="PDF PL"
                  path={task.pl}
                  pending={!!uploads[task.pl]}
                  onPick={(f) => pick(task, 'pl', f)}
                  onClear={() => patch(task.id, { pl: '' })}
                />
                <FilePicker
                  label="PDF EN"
                  path={task.en}
                  optional
                  pending={!!uploads[task.en]}
                  onPick={(f) => pick(task, 'en', f)}
                  onClear={() => patch(task.id, { en: '' })}
                />
              </div>
            </li>
          );
        })}
      </ol>
      <SmallButton title="Dodaj zadanie" onClick={() => setTasks([...tasks, { id: newId(), name: `Zadanie ${tasks.length + 1}`, pl: '', en: '' }])}>
        <Plus className="w-3.5 h-3.5" /> Dodaj zadanie
      </SmallButton>
    </section>
  );
};
