import React, { useState, useEffect, useRef } from 'react';
import { Language } from './translations';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ScheduleSection } from './components/ScheduleSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { GroupTimeView } from './components/GroupTimeView';
import { EventTabBar } from './components/EventTabBar';
import { InstallBanner } from './components/InstallBanner';

type View = 'site' | 'group-time';

// While the camp itself is running, the marketing/registration content stops
// being relevant — only Hero and the live Schedule stay up. Once it's over,
// the full site returns, but registration is closed (see isRegistrationClosed
// below). Both are based on the viewer's own device clock (not a server
// date), so it's also easy to test: just change the system clock.
const EVENT_START = new Date(2026, 10, 12, 0, 0, 0);
const EVENT_END = new Date(2026, 10, 15, 0, 0, 0);

export function App() {
  // Initialize language preference from localStorage, or detect it from the browser/device language
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('kuznia_lang');
    if (saved === 'en' || saved === 'pl') return saved;

    const browserLangs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    const isPolish = browserLangs.some((l) => l?.toLowerCase().startsWith('pl'));
    return isPolish ? 'pl' : 'en';
  });

  const isWithinEvent = (d: Date) => d >= EVENT_START && d < EVENT_END;

  const [isEventLive, setIsEventLive] = useState(() => isWithinEvent(new Date()));
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(() => new Date() >= EVENT_END);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      setIsEventLive(isWithinEvent(now));
      setIsRegistrationClosed(now >= EVENT_END);
    };
    const id = setInterval(check, 60000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  // "Czas w grupach" is a separate full-screen view (not a section on the
  // main page), reachable from the bottom tab bar that appears only while
  // the event is live. Navigating to a section id while on that view first
  // switches back to the site, then scrolls once the site's DOM is mounted.
  const [view, setView] = useState<View>('site');
  const pendingScrollRef = useRef<string | null>(null);

  const scrollToId = (id: string) => {
    if (id === 'start') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const navigateToSection = (id: string) => {
    if (view !== 'site') {
      pendingScrollRef.current = id;
      setView('site');
    } else {
      scrollToId(id);
    }
  };

  useEffect(() => {
    if (view === 'site' && pendingScrollRef.current) {
      const id = pendingScrollRef.current;
      pendingScrollRef.current = null;
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    }
    if (view === 'group-time') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [view]);

  // The tab bar only exists during the event; if the event window ends
  // while someone is sitting on the Group Time view, bring them back.
  useEffect(() => {
    if (!isEventLive && view === 'group-time') {
      setView('site');
    }
  }, [isEventLive, view]);

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
      <Header lang={lang} setLang={handleSetLang} isEventLive={isEventLive} onNavigate={navigateToSection} />

      {/* Main Landing Sections */}
      <main className={`flex-1 w-full ${isEventLive ? 'pb-20' : ''}`}>
        {view === 'site' ? (
          <>
            {/* 2. Hero with background YouTube video, logo, date & registration CTA */}
            <Hero lang={lang} isEventLive={isEventLive} onNavigate={navigateToSection} />

            {!isEventLive && (
              <>
                {/* 3. Męski Wyjazd - description and modern 6-photo gallery */}
                <AboutSection lang={lang} />

                {/* 4. Rejestracja - individual & group registration cards */}
                <RegistrationSection lang={lang} isRegistrationClosed={isRegistrationClosed} />
              </>
            )}

            {/* 5. Plan - 3-day schedule table for 12, 13 and 14 Nov */}
            <ScheduleSection lang={lang} />

            {/* 6. Miejsce - location and venue details */}
            {!isEventLive && <LocationSection lang={lang} />}
          </>
        ) : (
          /* Czas w grupach - PIN-gated discussion questions, one per session */
          <GroupTimeView lang={lang} />
        )}
      </main>

      {/* Footer only makes sense as part of the full scrolling site */}
      {view === 'site' && <Footer lang={lang} isEventLive={isEventLive} onNavigate={navigateToSection} />}

      {/* Bottom tab bar - only while the event itself is running */}
      {isEventLive && (
        <EventTabBar
          lang={lang}
          activeView={view}
          onSelectPlan={() => navigateToSection('plan')}
          onSelectGroupTime={() => setView('group-time')}
        />
      )}

      {/* Mobile PWA install nudge - Nov 11-14, pinned under the header so it never covers the bottom event tab bar */}
      <InstallBanner lang={lang} />
    </div>
  );
}

export default App;
