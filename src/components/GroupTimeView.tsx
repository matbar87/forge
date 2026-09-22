import React, { useEffect, useRef, useState } from 'react';
import { Language, translations } from '../translations';
import { Lock, MessageCircleQuestion } from 'lucide-react';

interface GroupTimeViewProps {
  lang: Language;
}

const PIN_CODE = '1126';
const PIN_STORAGE_KEY = 'kuznia_group_pin_ok';

export const GroupTimeView: React.FC<GroupTimeViewProps> = ({ lang }) => {
  const t = translations[lang].groupTime;

  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(PIN_STORAGE_KEY) === '1');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!unlocked) {
      inputRefs.current[0]?.focus();
    }
  }, [unlocked]);

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(false);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      const entered = next.join('');
      if (entered === PIN_CODE) {
        localStorage.setItem(PIN_STORAGE_KEY, '1');
        setUnlocked(true);
      } else {
        setError(true);
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    setError(false);
    if (pasted.length === 4) {
      if (pasted === PIN_CODE) {
        localStorage.setItem(PIN_STORAGE_KEY, '1');
        setUnlocked(true);
      } else {
        setError(true);
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const forgetCode = () => {
    localStorage.removeItem(PIN_STORAGE_KEY);
    setUnlocked(false);
    setDigits(['', '', '', '']);
  };

  return (
    <section className="min-h-screen w-full pt-[104px] sm:pt-[128px] pb-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] bg-[#1E2938]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-[#16202B]/60 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        <div className="text-center max-w-xl mx-auto pt-4 mb-12">
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9] mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium">{t.subtitle}</p>
        </div>

        {!unlocked ? (
          <div className="max-w-sm mx-auto bg-[#18212C] rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#253242] flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#E3E6DB]" />
            </div>
            <p className="text-sm font-mono-code text-[#E3E6DB]/70 uppercase tracking-wider mb-6">
              {t.pinPrompt}
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-16 text-center font-bebas text-3xl rounded-2xl bg-[#1E2937] text-[#E3E6DB] border-2 transition-colors focus:outline-none ${
                    error ? 'border-red-500/70' : 'border-[#3E4C5E]/40 focus:border-[#E3E6DB]/60'
                  }`}
                />
              ))}
            </div>
            {error && (
              <p className="text-xs font-mono-code text-red-400/90 uppercase tracking-wider">
                {t.pinError}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {t.sessions.map((session, idx) => (
                <div
                  key={idx}
                  className="bg-[#18212C] rounded-2xl p-6 sm:p-8 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#E3E6DB]/50">
                      // {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-bebas text-2xl sm:text-3xl text-[#E3E6DB] tracking-wide uppercase">
                      {session.title}
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

            <button
              onClick={forgetCode}
              className="block mx-auto mt-10 text-[11px] font-mono-code text-[#E3E6DB]/30 hover:text-[#E3E6DB]/60 uppercase tracking-wider transition-colors"
            >
              {t.forgetCode}
            </button>
          </>
        )}
      </div>
    </section>
  );
};
