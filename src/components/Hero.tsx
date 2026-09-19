import React, { useEffect, useState } from 'react';
import { Language, translations } from '../translations';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = translations[lang].hero;
  // Keep the iframe hidden until playback is confirmed, so YouTube's
  // loading state / play button never flashes on top of the hero
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const scrollToSection = (id: string) => {
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

  const logoSrc = lang === 'pl' ? './kuznia-logo.svg' : './forge-logo.svg';
  const logoAlt = lang === 'pl' ? 'Kuźnia Męski Wyjazd' : "Forge Men's Camp";

  // Seamless loop and zero-controls enforcement for YouTube background video
  useEffect(() => {
    const iframe = document.getElementById('hero-youtube-bg') as HTMLIFrameElement;
    if (!iframe) return;

    // Direct postMessage commands to YouTube iframe (works even without external script loading)
    const sendCommand = (func: string, args: any[] = []) => {
      try {
        iframe.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch {}
    };

    // Ensure 1080p and mute on start
    const initTimer = setTimeout(() => {
      sendCommand('mute');
      sendCommand('playVideo');
      sendCommand('setPlaybackQuality', ['hd1080']);
      sendCommand('addEventListener', ['onStateChange']);
    }, 1000);

    // Listen for YouTube state changes to loop seamlessly
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && (data.event === 'onStateChange' || data.info === 0)) {
          // 1 = PLAYING: reveal the video now that YouTube's own loading UI is gone
          if (data.info === 1 || data.data === 1) {
            setIsVideoPlaying(true);
          }
          // 0 = ENDED: restart immediately
          if (data.info === 0 || data.data === 0) {
            sendCommand('seekTo', [0, true]);
            sendCommand('playVideo');
          }
          // 2 = PAUSED: resume immediately
          if (data.info === 2 || data.data === 2) {
            sendCommand('playVideo');
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendCommand('playVideo');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Safety net: reveal anyway after a short delay in case the PLAYING
    // event never arrives (e.g. blocked postMessage), so the video isn't
    // hidden forever.
    const revealFallbackTimer = setTimeout(() => setIsVideoPlaying(true), 2500);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(revealFallbackTimer);
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section
      id="start"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#121820] pt-[72px] sm:pt-[80px]"
    >
      {/* Background Video Layer - Starts precisely under the header and covers 100% of all screens including portrait mobile */}
      <div className="absolute top-[72px] sm:top-[80px] inset-x-0 bottom-0 overflow-hidden select-none pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(100vw,180vh)] h-[max(60vw,100vh)] min-w-[max(100vw,180vh)] min-h-[max(60vw,100vh)] scale-[1.5] sm:scale-[1.38] pointer-events-none">
          <iframe
            id="hero-youtube-bg"
            src="https://www.youtube-nocookie.com/embed/nbN9Uek2ixg?autoplay=1&mute=1&loop=1&playlist=nbN9Uek2ixg&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0&vq=hd1080&enablejsapi=1"
            title="Forge Background Video"
            className={`w-full h-full border-0 pointer-events-none transition-opacity duration-700 ${
              isVideoPlaying ? 'opacity-90' : 'opacity-0'
            }`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Ambient Dark Overlay - Subtly toned down to reveal rich video detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121820] via-[#121820]/45 to-[#161E28]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-45 pointer-events-none" />

        {/* Shield Overlay - Intercepts all clicks/taps over the video so YouTube player never wakes up or shows pause/play icons */}
        <div className="absolute inset-0 z-10 pointer-events-auto bg-transparent select-none" />
      </div>

      {/* Hero Foreground Content - Elevated above the shield */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 my-auto flex flex-col items-center text-center">
        {/* Logo Container - Calibrated so Polish logo has the exact same visual height as English logo */}
        <div
          className={`relative w-full ${
            lang === 'pl'
              ? 'max-w-[280px] sm:max-w-[380px] md:max-w-[465px]'
              : 'max-w-[340px] sm:max-w-[460px] md:max-w-[565px]'
          } mb-16 sm:mb-20 md:mb-24 flex items-center justify-center`}
        >
          <div className="absolute inset-0 bg-[#3E4C5E]/20 filter blur-3xl rounded-full scale-90 -z-10 pointer-events-none" />
          <img
            src={logoSrc}
            alt={logoAlt}
            className="w-full h-auto max-h-[300px] sm:max-h-[380px] md:max-h-[460px] object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Date Display - Separated with generous spacing from the logo */}
        <div className="flex items-center justify-center mb-10 px-8 py-3.5 rounded-2xl bg-[#1C2633]/85 backdrop-blur-md shadow-2xl">
          <span className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-widest text-[#E3E6DB] uppercase">
            {t.date}
          </span>
        </div>

        {/* Action Buttons - No borders, refined elevation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Main Registration Button */}
          <button
            onClick={() => scrollToSection('rejestracja')}
            className="group w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-bebas text-2xl tracking-wider uppercase shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span>{t.registerCta}</span>
            <ArrowUpRight className="w-5 h-5 text-[#121820] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

          {/* Secondary Plan Button */}
          <button
            onClick={() => scrollToSection('plan')}
            className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#1E2937]/90 hover:bg-[#28374A] text-[#E3E6DB] font-bebas text-2xl tracking-wider uppercase shadow-xl transition-all active:scale-95"
          >
            {t.explorePlan}
          </button>
        </div>
      </div>
    </section>
  );
};
