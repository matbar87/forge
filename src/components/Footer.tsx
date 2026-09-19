import React from 'react';
import { Language, translations } from '../translations';
import { ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (id === 'start') {
      scrollToTop();
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-[#0E131A] text-[#E3E6DB] pt-20 pb-12 relative overflow-hidden">
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

            <p className="text-sm text-[#E3E6DB]/60 max-w-md leading-relaxed">
              {lang === 'pl'
                ? 'Spotkanie mężczyzn poszukujących prawdy, braterstwa i siły do codziennych zmagań. Wykuj charakter w ogniu wyzwań.'
                : 'A gathering of men seeking truth, brotherhood, and grit for everyday battles. Forge your character in the fire of challenge.'}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono-code text-[#E3E6DB]/70">
              <Mail className="w-4 h-4 text-[#E3E6DB]" />
              <span>{t.email}</span>
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
              <li>
                <button
                  onClick={() => scrollToSection('meski-wyjazd')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('rejestracja')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.registration}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('plan')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.schedule}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('miejsce')}
                  className="text-[#E3E6DB]/70 hover:text-[#E3E6DB] transition-colors uppercase"
                >
                  {translations[lang].nav.location}
                </button>
              </li>
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

            <button
              onClick={() => scrollToSection('rejestracja')}
              className="px-6 py-3 rounded-2xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-bebas text-xl tracking-wider uppercase shadow-xl transition-all"
            >
              {translations[lang].nav.registerBtn}
            </button>
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
