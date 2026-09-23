import React from 'react';
import { Language, translations } from '../translations';
import { MessageCircleQuestion } from 'lucide-react';
import { usePinGate } from '../hooks/usePinGate';
import { PinEntryCard } from './PinEntryCard';

interface GroupTimeViewProps {
  lang: Language;
}

export const GroupTimeView: React.FC<GroupTimeViewProps> = ({ lang }) => {
  const t = translations[lang].groupTime;
  const pinGate = usePinGate();

  return (
    <section className="min-h-screen w-full pt-[104px] sm:pt-[128px] pb-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] bg-[#1E2938]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-[#16202B]/60 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9] mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium">{t.subtitle}</p>
        </div>

        {!pinGate.unlocked ? (
          <PinEntryCard prompt={t.pinPrompt} errorText={t.pinError} lockedText={t.pinLocked} pinGate={pinGate} />
        ) : (
          <div className="space-y-4">
            {t.sessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-[#18212C] rounded-2xl p-6 sm:p-8 shadow-xl"
              >
                <div className="mb-4">
                  <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#E3E6DB]/50">
                    {session.title}
                  </span>
                  <h3 className="font-bebas text-2xl sm:text-3xl text-[#E3E6DB] tracking-wide uppercase mt-1">
                    {session.topic}
                  </h3>
                </div>

                {session.questions.length > 0 ? (
                  <ul className="space-y-3">
                    {session.questions.map((q, qIdx) => (
                      <li key={qIdx} className="flex items-start gap-3">
                        <MessageCircleQuestion className="w-4 h-4 text-[#E3E6DB]/50 shrink-0 mt-1" />
                        <span className="text-sm text-[#E3E6DB]/85 leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#E3E6DB]/50 italic">{t.questionsComingSoon}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
