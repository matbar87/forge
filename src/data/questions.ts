// Typed access to questions.json — the Group Time sessions (title, topic and
// numbered discussion questions) shown in the event app's "Czas w grupach"
// tab. Edit questions.json (or plan/pytania-grupy.xlsx, which CI converts
// into it); scripts/check-questions.mjs validates it before every build.
import questionsJson from './questions.json';

export interface GroupSession {
  title: string;
  topic: string;
  questions: string[];
}

export const questions = questionsJson as unknown as {
  pl: { sessions: GroupSession[] };
  en: { sessions: GroupSession[] };
};
