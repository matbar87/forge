import React, { useState, useEffect } from 'react';
import { Language } from './translations';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ScheduleSection } from './components/ScheduleSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

export function App() {
  // Initialize language preference from localStorage or default to 'pl'
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kuznia_lang');
    return saved === 'en' ? 'en' : 'pl';
  });

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('kuznia_lang', newLang);
    // Update document title dynamically
    document.title =
      newLang === 'pl'
        ? 'Kuźnia — Męski Wyjazd | 12 - 14 Listopada'
        : "Forge — Men's Camp | November 12 - 14";
  };

  useEffect(() => {
    // Initial sync
    document.title =
      lang === 'pl'
        ? 'Kuźnia — Męski Wyjazd | 12 - 14 Listopada'
        : "Forge — Men's Camp | November 12 - 14";
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#121820] text-[#E3E6DB] flex flex-col relative selection:bg-[#E3E6DB] selection:text-[#121820] font-['Plus_Jakarta_Sans']">
      {/* Ambient background organic dark blobs (darker than #121820 base) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
        {/* Deep dark blob 1 - Top Left */}
        <div
          className="absolute -top-[15%] -left-[15%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full blur-3xl opacity-80"
          style={{
            background: 'radial-gradient(circle at center, #05080C 0%, #080B10 50%, transparent 75%)',
          }}
        />

        {/* Deep dark blob 2 - Top Right */}
        <div
          className="absolute top-[20%] -right-[20%] w-[65vw] h-[65vw] max-w-[950px] max-h-[950px] rounded-full blur-3xl opacity-75"
          style={{
            background: 'radial-gradient(circle at center, #040609 0%, #070A0F 55%, transparent 80%)',
          }}
        />

        {/* Deep dark blob 3 - Middle Left */}
        <div
          className="absolute top-[50%] -left-[15%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full blur-3xl opacity-70"
          style={{
            background: 'radial-gradient(circle at center, #05070B 0%, #080C11 50%, transparent 75%)',
          }}
        />

        {/* Deep dark blob 4 - Lower Right */}
        <div
          className="absolute top-[75%] -right-[15%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full blur-3xl opacity-75"
          style={{
            background: 'radial-gradient(circle at center, #030508 0%, #06090E 55%, transparent 80%)',
          }}
        />
      </div>

      {/* 1. Header with sygnet.svg and navigation menu */}
      <Header lang={lang} setLang={handleSetLang} />

      {/* Main Landing Sections */}
      <main className="flex-1 w-full">
        {/* 2. Hero with background YouTube video, logo, date & registration CTA */}
        <Hero lang={lang} />

        {/* 3. Męski Wyjazd - description and modern 8-photo gallery */}
        <AboutSection lang={lang} />

        {/* 4. Rejestracja - individual & group registration cards */}
        <RegistrationSection lang={lang} />

        {/* 5. Plan - 3-day schedule table for 12, 13 and 14 Nov */}
        <ScheduleSection lang={lang} />

        {/* 6. Miejsce - location and venue details */}
        <LocationSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default App;
