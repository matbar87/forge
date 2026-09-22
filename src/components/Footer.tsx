import React from 'react';
import { Language, translations } from '../translations';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  lang: Language;
  isEventLive: boolean;
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, isEventLive, onNavigate }) => {
  const t = translations[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => onNavigate(id);

  return (
    <footer
      className={`bg-[#0E131A] text-[#E3E6DB] pt-20 relative overflow-hidden ${
        isEventLive ? 'pb-28' : 'pb-12'
      }`}
    >
      {/* Background ambient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#3E4C5E]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 items-start">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="./sygnet.svg"
                alt="Kuźnia Sygnet"
                className="h-10 w-auto object-contain"
              />
              <span className="font-bebas text-3xl tracking-wider text-[#E3E6DB] uppercase">
                {lang === 'pl' ? 'KUŹNIA // MĘSKI WYJAZD' : "FORGE // MEN'S CAMP"}
              </span>
            </div>

            <p className="text-sm text-[#E3E6DB]/70 max-w-md leading-relaxed">
              {translations[lang].about.quoteText}
              <span className="block mt-1.5 font-mono-code text-xs text-[#E3E6DB]/50">
                — {translations[lang].about.quoteRef}
              </span>
            </p>

            <div className="flex flex-col items-start gap-3 pt-2">
              <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#E3E6DB]/50">
                {t.organizedBy}
              </span>
              <a
                href="https://www.koscioldlamiasta.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <img
                  src="./kdm-logo.png"
                  alt="Kościół Dla Miasta Krakowa"
                  className="h-16 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links - Borderless */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-[#E3E6DB]/50 block">
              // {t.nav}
            </span>
            <ul className="space-y-2.5 text-sm font-mono-code">
              <li>
                <button
                  onClick={() => scrollToSection('start')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.start}
                </button>
              </li>
              {!isEventLive && (
                <li>
                  <button
                    onClick={() => scrollToSection('meski-wyjazd')}
                    className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                  >
                    {translations[lang].nav.about}
                  </button>
                </li>
              )}
              {!isEventLive && (
                <li>
                  <button
                    onClick={() => scrollToSection('rejestracja')}
                    className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                  >
                    {translations[lang].nav.registration}
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => scrollToSection('plan')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.schedule}
                </button>
              </li>
              {!isEventLive && (
                <li>
                  <button
                    onClick={() => scrollToSection('miejsce')}
                    className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                  >
                    {translations[lang].nav.location}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Registration Quick Action & Back to Top - Borderless */}
          <div className="md:col-span-3 space-y-4 flex flex-col items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#18212C] hover:bg-[#253242] text-xs font-mono-code font-bold uppercase tracking-wider text-[#E3E6DB] shadow-lg transition-all"
            >
              <span>{t.top}</span>
              <ArrowUp className="w-4 h-4 text-[#E3E6DB] group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {!isEventLive && (
              <button
                onClick={() => scrollToSection('rejestracja')}
                className="px-6 py-3 rounded-2xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-bebas text-xl tracking-wider uppercase shadow-xl transition-all"
              >
                {translations[lang].nav.registerBtn}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Bar - Borderless */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-[#E3E6DB]/40">
          <p>
            © {new Date().getFullYear()} KUŹNIA / FORGE. {t.rights}
          </p>
          <p>
            12 – 14 LISTOPADA 2026 // {lang === 'pl' ? 'MĘSKI WYJAZD' : "MEN'S CAMP"}
          </p>
        </div>
      </div>
    </footer>
  );
};
