import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, ExternalLink, LogOut, MessageCircleQuestion, RefreshCw, Save, Users } from 'lucide-react';
import { validateGroups, validatePlan, validateQuestions } from '../data/validation.js';
import {
  ACTIONS_URL,
  GITHUB_PAGES_ADMIN_URL,
  GitHubError,
  NEW_TOKEN_URL,
  REPO,
  checkAccess,
  readFile,
  writeFile,
  type RepoFile,
} from './github';
import {
  editToGroups,
  editToPlan,
  editToQuestions,
  groupsToEdit,
  planToEdit,
  questionsToEdit,
  toFileText,
  type EditGroups,
  type EditPlan,
  type EditQuestions,
} from './model';
import { PlanEditor } from './PlanEditor';
import { QuestionsEditor } from './QuestionsEditor';
import { GroupsEditor } from './GroupsEditor';
import { PrimaryButton, inputClass } from './fields';

const PLAN_PATH = 'src/data/plan.json';
const QUESTIONS_PATH = 'src/data/questions.json';
const GROUPS_PATH = 'src/data/groups.json';
const TOKEN_KEY = 'kuznia_admin_token';

const storage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? '';
    } catch {
      return '';
    }
  },
  set: (token: string, remember: boolean) => {
    try {
      (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    } catch {
      /* storage blocked: token lives only in memory */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// Turns validation paths like "pl.szczegolowy.days[1].items[2].time: …" into
// "Plan szczegółowy, Dzień 1, punkt 3 (9:30 – 10:30 Sesja 2): …".
const friendlyPlanError = (plan: any, msg: string) => {
  const m = /^(pl|en)\.(szczegolowy|podstawowy)\.days\[(\d+)\](?:\.items\[(\d+)\])?\.?([\w]*): (.*)$/.exec(msg);
  if (!m) return msg;
  const [, lang, version, di, ii, field, rest] = m;
  const day = plan[lang]?.[version]?.days?.[Number(di)];
  const item = ii !== undefined ? day?.items?.[Number(ii)] : undefined;
  const where = [
    version === 'szczegolowy' ? 'Plan szczegółowy' : 'Plan podstawowy',
    day ? `Dzień ${day.number}` : `dzień ${Number(di) + 1}`,
    item ? `punkt ${Number(ii) + 1} (${item.time} ${item.title || 'bez tytułu'})` : '',
    lang === 'en' ? 'wersja EN' : '',
  ]
    .filter(Boolean)
    .join(', ');
  const fieldName: Record<string, string> = {
    time: 'godzina', title: 'tytuł', type: 'typ', date: 'data', dayName: 'nazwa dnia', theme: 'motyw',
    isoDate: 'data', number: 'numer dnia', items: 'punkty',
  };
  return `${where}${field ? ` — ${fieldName[field] ?? field}` : ''}: ${rest}`;
};
const friendlyHeadingError = (msg: string) =>
  msg.replace(/^(pl|en)\.(title|subtitle):/, (_, lang, f) => `Nagłówek strony — ${f === 'title' ? 'tytuł' : 'podtytuł'}${lang === 'en' ? ' (EN)' : ''}:`);
const friendlyQuestionsError = (msg: string) =>
  friendlyHeadingError(msg).replace(/^(pl|en)\.sessions\[(\d+)\](?:\.questions\[(\d+)\])?\.?(\w*):/, (_, lang, si, qi, f) =>
    `Sesja ${Number(si) + 1}${qi !== undefined ? `, pytanie ${Number(qi) + 1}` : ''}${f === 'topic' ? ' — temat' : ''}${
      lang === 'en' ? ' (EN)' : ''
    }:`
  );
const friendlyGroupsError = (data: any, msg: string) =>
  friendlyHeadingError(msg).replace(/^groups\[(\d+)\](?:\.members(?:\[(\d+)\])?)?\.?(\w*):/, (_, gi, mi, f) => {
    const g = data?.groups?.[Number(gi)];
    const m = mi !== undefined ? g?.members?.[Number(mi)] : undefined;
    const field = { first: ' — imię', last: ' — nazwisko', role: ' — rola', name: ' — nazwa' }[f as string] ?? '';
    return `Grupa „${g?.name || Number(gi) + 1}”${m ? `, osoba ${Number(mi) + 1}${m.first || m.last ? ` (${m.first} ${m.last})` : ''}` : ''}${field}:`;
  });
/* eslint-enable @typescript-eslint/no-explicit-any */

const Login: React.FC<{ onLogin: (token: string, remember: boolean) => Promise<void> }> = ({ onLogin }) => {
  const [token, setToken] = useState('');
  // Off by default: a remembered token stays in this browser until logout.
  // On a shared origin (koscioldlamiasta.pl hosts the whole KDM site) any
  // script on that site could read it, so suggest the github.io address.
  const [remember, setRemember] = useState(false);
  const sharedOrigin = !location.hostname.endsWith('github.io') && location.hostname !== 'localhost';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onLogin(token.trim(), remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="max-w-lg mx-auto bg-[#18212C] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
      <h1 className="font-bebas text-4xl tracking-wide uppercase">Panel edycji</h1>
      <p className="text-sm text-[#E3E6DB]/70 leading-relaxed">
        Zaloguj się swoim tokenem GitHub z dostępem do repo <span className="font-mono-code">{REPO}</span>. Zmiany zapisane tutaj
        trafiają od razu do repo, a strona przebudowuje się sama w ciągu kilku minut.
      </p>
      <details className="text-xs text-[#E3E6DB]/70 bg-[#121820] rounded-xl p-3">
        <summary className="cursor-pointer font-bold">Jak założyć token?</summary>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>
            Otwórz{' '}
            <a className="underline" href={NEW_TOKEN_URL} target="_blank" rel="noopener noreferrer">
              GitHub → Fine-grained personal access token
            </a>
            .
          </li>
          <li>Nazwa np. „Kuźnia panel”, data ważności wg uznania.</li>
          <li>Repository access: Only select repositories → {REPO}.</li>
          <li>Permissions → Repository permissions → Contents: Read and write.</li>
          <li>Generate token, skopiuj go i wklej poniżej.</li>
        </ol>
      </details>
      <label className="block">
        <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#E3E6DB]/50 mb-1">Token</span>
        <input
          className={inputClass}
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_…"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        Zapamiętaj na tym urządzeniu (tylko na własnym komputerze / telefonie)
      </label>
      {sharedOrigin && (
        <p className="text-xs text-[#E3E6DB]/60 bg-[#121820] rounded-xl p-3 leading-relaxed">
          Bezpieczniej korzystać z panelu pod adresem{' '}
          <a className="underline break-all" href={GITHUB_PAGES_ADMIN_URL}>
            {GITHUB_PAGES_ADMIN_URL}
          </a>
          {' '}— token nie jest tam dostępny dla reszty strony koscioldlamiasta.pl.
        </p>
      )}
      {error && <p className="text-sm text-[#F2B8B5]">{error}</p>}
      <PrimaryButton type="submit" disabled={busy || !token.trim()}>
        {busy ? 'Sprawdzam…' : 'Zaloguj'}
      </PrimaryButton>
    </form>
  );
};

type Tab = 'plan' | 'questions' | 'groups';

export const AdminApp: React.FC = () => {
  const [token, setToken] = useState(storage.get);
  const [login, setLogin] = useState('');
  const [tab, setTab] = useState<Tab>('plan');
  const [files, setFiles] = useState<{ plan: RepoFile; questions: RepoFile; groups: RepoFile } | null>(null);
  const [plan, setPlan] = useState<EditPlan | null>(null);
  const [questions, setQuestions] = useState<EditQuestions | null>(null);
  const [groups, setGroups] = useState<EditGroups | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState<{ url: string; at: Date } | null>(null);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setLoadError('');
    try {
      const [p, q, g] = await Promise.all([readFile(t, PLAN_PATH), readFile(t, QUESTIONS_PATH), readFile(t, GROUPS_PATH)]);
      setFiles({ plan: p, questions: q, groups: g });
      setPlan(planToEdit(JSON.parse(p.text)));
      setQuestions(questionsToEdit(JSON.parse(q.text)));
      setGroups(groupsToEdit(JSON.parse(g.text)));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
      if (err instanceof GitHubError && err.status === 401) {
        storage.clear();
        setToken('');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      checkAccess(token).then(setLogin).catch(() => undefined);
      load(token);
    }
  }, [token, load]);

  const planJson = useMemo(() => (plan ? editToPlan(plan) : null), [plan]);
  const questionsJson = useMemo(() => (questions ? editToQuestions(questions) : null), [questions]);
  const groupsJson = useMemo(() => (groups ? editToGroups(groups) : null), [groups]);
  const planText = planJson ? toFileText(planJson) : '';
  const questionsText = questionsJson ? toFileText(questionsJson) : '';
  const planDirty = !!files && planText !== files.plan.text;
  const questionsDirty = !!files && questionsText !== files.questions.text;
  const groupsText = groupsJson ? toFileText(groupsJson) : '';
  const groupsDirty = !!files && groupsText !== files.groups.text;
  const dirty = planDirty || questionsDirty || groupsDirty;

  const errors = useMemo(() => {
    const list: string[] = [];
    if (planJson && planDirty) list.push(...validatePlan(planJson).map((e) => friendlyPlanError(planJson, e)));
    if (questionsJson && questionsDirty) list.push(...validateQuestions(questionsJson).map(friendlyQuestionsError));
    if (groupsJson && groupsDirty) list.push(...validateGroups(groupsJson).map((e) => friendlyGroupsError(groupsJson, e)));
    return list;
  }, [planJson, questionsJson, groupsJson, planDirty, questionsDirty, groupsDirty]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const handleLogin = async (t: string, remember: boolean) => {
    const who = await checkAccess(t);
    storage.set(t, remember);
    setLogin(who);
    setToken(t);
  };

  const logout = () => {
    if (dirty && !window.confirm('Masz niezapisane zmiany. Wylogować mimo to?')) return;
    storage.clear();
    setToken('');
    setFiles(null);
    setPlan(null);
    setQuestions(null);
    setGroups(null);
  };

  const reload = () => {
    if (dirty && !window.confirm('Odrzucić niezapisane zmiany i wczytać aktualną wersję z GitHuba?')) return;
    setSaved(null);
    setSaveError('');
    load(token);
  };

  const save = async () => {
    if (!files || errors.length) return;
    setSaving(true);
    setSaveError('');
    try {
      // Each file's new sha is stored as soon as its commit succeeds, so if
      // the second write fails, a retry only re-sends that one (with the
      // first file's up-to-date sha) instead of failing with a conflict.
      let url = '';
      if (planDirty) {
        const r = await writeFile(token, files.plan, planText, 'Update event plan via admin panel');
        setFiles((f) => f && { ...f, plan: { ...f.plan, sha: r.sha, text: planText } });
        url = r.commitUrl;
      }
      if (questionsDirty) {
        const r = await writeFile(token, files.questions, questionsText, 'Update Group Time questions via admin panel');
        setFiles((f) => f && { ...f, questions: { ...f.questions, sha: r.sha, text: questionsText } });
        url = r.commitUrl;
      }
      if (groupsDirty) {
        const r = await writeFile(token, files.groups, groupsText, 'Update groups via admin panel');
        setFiles((f) => f && { ...f, groups: { ...f.groups, sha: r.sha, text: groupsText } });
        url = r.commitUrl;
      }
      setSaved({ url, at: new Date() });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen px-4 py-16">
        <Login onLogin={handleLogin} />
        {loadError && <p className="max-w-lg mx-auto mt-4 text-sm text-[#F2B8B5]">{loadError}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40">
      <header className="sticky top-0 z-30 bg-[#18212C]/95 backdrop-blur border-b border-[#3E4C5E]/30">
        <div className="max-w-5xl mx-auto px-4 h-[60px] flex items-center gap-2">
          <span className="font-bebas text-2xl tracking-wide uppercase mr-2">Panel</span>
          {(
            [
              ['plan', 'Plan', <CalendarDays key="i" className="w-4 h-4" />, planDirty],
              ['questions', 'Pytania', <MessageCircleQuestion key="i" className="w-4 h-4" />, questionsDirty],
              ['groups', 'Grupy', <Users key="i" className="w-4 h-4" />, groupsDirty],
            ] as const
          ).map(([id, label, icon, isDirty]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono-code font-bold uppercase tracking-wider ${
                tab === id ? 'bg-[#E3E6DB] text-[#121820]' : 'text-[#E3E6DB]/70 hover:bg-[#253242]'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
              {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#F2C96B]" aria-label="niezapisane zmiany" />}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            {login && <span className="hidden md:inline text-xs text-[#E3E6DB]/50 mr-2">@{login}</span>}
            <button type="button" onClick={reload} title="Wczytaj z GitHuba" className="p-2 rounded-lg hover:bg-[#253242]">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button type="button" onClick={logout} title="Wyloguj" className="p-2 rounded-lg hover:bg-[#253242]">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        {loading && <p className="text-sm text-[#E3E6DB]/60">Wczytuję dane z GitHuba…</p>}
        {loadError && <p className="text-sm text-[#F2B8B5]">{loadError}</p>}
        {!loading && plan && questions && groups && (tab === 'plan' ? (
          <PlanEditor plan={plan} onChange={(p) => { setPlan(p); setSaved(null); }} />
        ) : tab === 'questions' ? (
          <QuestionsEditor data={questions} onChange={(q) => { setQuestions(q); setSaved(null); }} />
        ) : (
          <GroupsEditor data={groups} onChange={(g) => { setGroups(g); setSaved(null); }} />
        ))}
      </main>

      {files && (
        <footer className="fixed bottom-0 inset-x-0 z-30 bg-[#18212C]/97 backdrop-blur border-t border-[#3E4C5E]/30 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-5xl mx-auto px-4 py-3 space-y-2">
            {errors.length > 0 && (
              <ul className="max-h-28 overflow-y-auto text-xs text-[#F2B8B5] space-y-0.5 list-disc pl-4">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
            {saveError && <p className="text-xs text-[#F2B8B5]">{saveError}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton onClick={save} disabled={!dirty || errors.length > 0 || saving}>
                <Save className="w-4 h-4" />
                {saving ? 'Zapisuję…' : 'Zapisz i opublikuj'}
              </PrimaryButton>
              <span className="text-xs text-[#E3E6DB]/60">
                {saved ? (
                  <>
                    Zapisano o {saved.at.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}. Strona zaktualizuje się
                    za 2–4 min.{' '}
                    <a className="underline inline-flex items-center gap-0.5" href={ACTIONS_URL} target="_blank" rel="noopener noreferrer">
                      Postęp w Actions <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                ) : dirty ? (
                  errors.length ? 'Popraw błędy, aby zapisać.' : 'Masz niezapisane zmiany.'
                ) : (
                  'Brak zmian.'
                )}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
