import React from 'react';
import { Language, translations } from '../translations';
import { Languages, ArrowUpRight } from 'lucide-react';
import { usePinGate } from '../hooks/usePinGate';
import { PinEntryCard } from './PinEntryCard';

interface TranslationViewProps {
  lang: Language;
}

const TRANSLATION_URL = 'https://speakmic.com/r/p1Lq589yiU7T3ByteJ9Bqg?lp=forge';

export const TranslationView: React.FC<TranslationViewProps> = ({ lang }) => {
  const t = translations[lang].translationView;
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
          <div className="max-w-sm mx-auto text-center">
            <a
              href={TRANSLATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn w-full inline-flex items-center justify-center gap-2 sm:gap-3 py-4 px-5 sm:px-6 rounded-2xl font-bebas text-lg sm:text-2xl tracking-wider uppercase shadow-xl transition-all bg-[#E3E6DB] hover:bg-white text-[#121820] hover:shadow-2xl active:scale-95"
            >
              <Languages className="w-5 h-5 text-[#121820] shrink-0" />
              <span className="whitespace-nowrap">{t.button}</span>
              <ArrowUpRight className="w-5 h-5 text-[#121820] shrink-0 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
