import React, { useEffect, useRef, useState } from 'react';
import { Language, translations } from '../translations';
import { CtaButton } from './CtaButton';

interface HeroProps {
  lang: Language;
  isEventLive: boolean;
  onNavigate: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, isEventLive, onNavigate }) => {
  const t = translations[lang].hero;
  // A static frame (2.webp) covers the video while it loads, and stays as a
  // fallback if the video never plays. It fades out once playback starts.
  const [showVideoCover, setShowVideoCover] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const logoSrc = lang === 'pl' ? './kuznia-logo.svg' : './forge-logo.svg';
  const logoAlt = lang === 'pl' ? 'Kuźnia Męski Wyjazd' : "Forge Men's Camp";

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        videoRef.current?.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <section
      id="start"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#121820] pt-[72px] sm:pt-[80px]"
    >
      {/* Background Video Layer - Starts precisely under the header and covers 100% of all screens including portrait mobile */}
      <div className="absolute top-[72px] sm:top-[80px] inset-x-0 bottom-0 overflow-hidden select-none pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setShowVideoCover(false)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        >
          <source src="./intro.mp4" type="video/mp4" />
        </video>

        {/* Startup Cover - A static frame shown instead of a blank background while
            the video loads, and stays as a graceful fallback if it never plays.
            Sits in the same layer as the video, below the darkening overlays
            below, so it gets identical treatment, and fades once video plays. */}
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
      </div>

      {/* Hero Foreground Content - Elevated above the video layer */}
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
          {/* Main Registration Button - hidden once the camp itself has started */}
          {!isEventLive && (
            <CtaButton onClick={() => onNavigate('rejestracja')}>{t.registerCta}</CtaButton>
          )}

          {/* Secondary Plan Button */}
          <CtaButton onClick={() => onNavigate('plan')} variant="dark" hideIcon>
            {t.explorePlan}
          </CtaButton>
        </div>
      </div>
    </section>
  );
};
