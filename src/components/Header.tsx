import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '../translations';
import { Menu, X, ChevronRight } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  isEventLive: boolean;
  onNavigate: (id: string) => void;
}

const HIDE_THRESHOLD = 100;

export const Header: React.FC<HeaderProps> = ({ lang, setLang, isEventLive, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 25);

      if (currentY < HIDE_THRESHOLD) {
        setHidden(false);
      } else {
        setHidden(currentY > lastScrollY.current);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep the header visible whenever the mobile drawer is open, so it can't
  // slide away with the menu still showing.
  useEffect(() => {
    if (mobileMenuOpen) setHidden(false);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full h-[72px] sm:h-[80px] z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled
          ? 'bg-[#18212C]/95 backdrop-blur-xl shadow-2xl'
          : 'bg-[#18212C] backdrop-blur-md'
      }`}
    >
      <div className="w-full h-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center justify-between w-full">
          {/* Brand Mark: ONLY sygnet.svg directly, larger and prominent, no text, no box wrapper */}
          <button
            onClick={() => scrollToSection('start')}
            className="flex items-center group focus:outline-none transition-transform hover:scale-105 active:scale-95"
            aria-label="Kuźnia / Forge Home"
          >
            <img
              src="./sygnet.svg"
              alt="Kuźnia Sygnet"
              className="h-11 sm:h-13 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            />
          </button>

          {/* Desktop Navigation Links - No nested background, sits cleanly in header */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => scrollToSection('start')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold tracking-wider text-[#E3E6DB]/80 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/40 transition-all uppercase"
            >
              {t.start}
            </button>
            {!isEventLive && (
              <>
                <button
                  onClick={() => scrollToSection('meski-wyjazd')}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold tracking-wider text-[#E3E6DB]/80 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/40 transition-all uppercase"
                >
                  {t.about}
                </button>
                <button
                  onClick={() => scrollToSection('rejestracja')}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold tracking-wider text-[#E3E6DB]/80 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/40 transition-all uppercase"
                >
                  {t.registration}
                </button>
              </>
            )}
            <button
              onClick={() => scrollToSection('plan')}
              className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold tracking-wider text-[#E3E6DB]/80 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/40 transition-all uppercase"
            >
              {t.schedule}
            </button>
            {!isEventLive && (
              <button
                onClick={() => scrollToSection('miejsce')}
                className="px-3.5 py-2 rounded-xl text-xs font-mono-code font-semibold tracking-wider text-[#E3E6DB]/80 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/40 transition-all uppercase"
              >
                {t.location}
              </button>
            )}
          </nav>

          {/* Language Switcher & Quick Registration Button */}
          <div className="hidden sm:flex items-center gap-5 sm:gap-6">
            {/* PL / EN Switcher - Clean, no heavy box background */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLang('pl')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono-code font-bold tracking-wider transition-all ${
                  lang === 'pl'
                    ? 'bg-[#E3E6DB] text-[#161D26] shadow font-black'
                    : 'text-[#E3E6DB]/60 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/30'
                }`}
              >
                PL
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono-code font-bold tracking-wider transition-all ${
                  lang === 'en'
                    ? 'bg-[#E3E6DB] text-[#161D26] shadow font-black'
                    : 'text-[#E3E6DB]/60 hover:text-[#E3E6DB] hover:bg-[#3E4C5E]/30'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Actions: Language & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex sm:hidden items-center bg-[#1F2B39] rounded-lg p-0.5">
              <button
                onClick={() => setLang('pl')}
                className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold ${
                  lang === 'pl' ? 'bg-[#E3E6DB] text-[#161D26]' : 'text-[#E3E6DB]/60'
                }`}
              >
                PL
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded text-[10px] font-mono-code font-bold ${
                  lang === 'en' ? 'bg-[#E3E6DB] text-[#161D26]' : 'text-[#E3E6DB]/60'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#1F2B39] text-[#E3E6DB] hover:bg-[#3E4C5E] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Full width directly beneath header without border radius */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#18212C]/98 backdrop-blur-2xl border-t border-[#3E4C5E]/20 px-4 sm:px-8 py-5 shadow-2xl animate-fade-in">
          <div className="w-full space-y-2">
            <button
              onClick={() => scrollToSection('start')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-mono-code font-semibold tracking-wider text-[#E3E6DB] hover:bg-[#253242] flex items-center justify-between"
            >
              <span>{t.start}</span>
              <ChevronRight className="w-4 h-4 text-[#E3E6DB]/40" />
            </button>
            {!isEventLive && (
              <>
                <button
                  onClick={() => scrollToSection('meski-wyjazd')}
                  className="w-full text-left py-3 px-4 rounded-xl text-sm font-mono-code font-semibold tracking-wider text-[#E3E6DB] hover:bg-[#253242] flex items-center justify-between"
                >
                  <span>{t.about}</span>
                  <ChevronRight className="w-4 h-4 text-[#E3E6DB]/40" />
                </button>
                <button
                  onClick={() => scrollToSection('rejestracja')}
                  className="w-full text-left py-3 px-4 rounded-xl text-sm font-mono-code font-semibold tracking-wider text-[#E3E6DB] hover:bg-[#253242] flex items-center justify-between"
                >
                  <span>{t.registration}</span>
                  <ChevronRight className="w-4 h-4 text-[#E3E6DB]/40" />
                </button>
              </>
            )}
            <button
              onClick={() => scrollToSection('plan')}
              className="w-full text-left py-3 px-4 rounded-xl text-sm font-mono-code font-semibold tracking-wider text-[#E3E6DB] hover:bg-[#253242] flex items-center justify-between"
            >
              <span>{t.schedule}</span>
              <ChevronRight className="w-4 h-4 text-[#E3E6DB]/40" />
            </button>
            {!isEventLive && (
              <button
                onClick={() => scrollToSection('miejsce')}
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-mono-code font-semibold tracking-wider text-[#E3E6DB] hover:bg-[#253242] flex items-center justify-between"
              >
                <span>{t.location}</span>
                <ChevronRight className="w-4 h-4 text-[#E3E6DB]/40" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
