import React, { useEffect, useRef, useState } from 'react';
import { Language, translations } from '../translations';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = translations[lang].hero;
  // A solid cover hides YouTube's UI (loading state, and the prev/pause/next
  // strip the loop=1+playlist trick used to trigger) until the official
  // IFrame API confirms real playback, so nothing but our own video ever shows.
  const [showVideoCover, setShowVideoCover] = useState(true);
  const playerRef = useRef<any>(null);

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

  const youtubeSrc =
    'https://www.youtube-nocookie.com/embed/nbN9Uek2ixg?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0&vq=hd1080&enablejsapi=1' +
    (typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : '');

  // Load the video through the official YouTube IFrame API for reliable
  // ready/state events (raw postMessage without it rarely completes the
  // handshake), and loop it ourselves via the ENDED event instead of the
  // loop=1+playlist URL trick, which drags in YouTube's playlist nav strip
  // that controls=0 does not suppress.
  useEffect(() => {
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || playerRef.current) return;
      const YT = window.YT;
      if (!YT?.Player) return;
      playerRef.current = new YT.Player('hero-youtube-bg', {
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.PLAYING) {
              setShowVideoCover(false);
            }
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0, true);
              e.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('youtube-iframe-api')) {
        const script = document.createElement('script');
        script.id = 'youtube-iframe-api';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playerRef.current?.playVideo?.();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Last-resort safety net in case the API script itself is blocked
    // (e.g. by an ad/privacy blocker), so the hero never stays covered forever.
    const revealFallbackTimer = setTimeout(() => setShowVideoCover(false), 4000);

    return () => {
      cancelled = true;
      clearTimeout(revealFallbackTimer);
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
            src={youtubeSrc}
            title="Forge Background Video"
            className="w-full h-full border-0 pointer-events-none opacity-90"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Startup Cover - A static frame shown instead of a blank background while
            the video loads, and hides YouTube's own chrome until the IFrame API
            confirms real playback. Sits in the same layer as the video (below the
            darkening overlays below) so it gets identical treatment, and fades
            smoothly into the video once playback is confirmed. */}
        <img
          src="./2.webp"
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
            showVideoCover ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Dark Overlay - Subtly toned down to reveal rich video detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121820] via-[#121820]/45 to-[#161E28]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-45 pointer-events-none" />

        {/* Center Mask - Strong dark radial patch behind the logo. YouTube briefly
            flashes its own play/pause icon dead-center on every state change
            (state start, loop restart) and controls=0 can't suppress it; this
            permanently darkens that exact spot instead of trying to time-hide it. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 42% 38% at center, rgba(18,24,32,0.94) 0%, rgba(18,24,32,0.6) 55%, transparent 85%)',
          }}
        />

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
