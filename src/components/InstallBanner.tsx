import React, { useEffect, useState } from 'react';
import { Language, translations } from '../translations';
import { X, Download, Share } from 'lucide-react';

interface InstallBannerProps {
  lang: Language;
  isEventLive: boolean;
}

// Visible only on mobile (sm:hidden), and only while the device clock falls
// within this window — one day ahead of the event itself, so attendees see
// it before they arrive too. Device-clock based like the rest of the
// event-phase logic, so it's easy to test by changing the system clock.
const BANNER_START = new Date(2026, 10, 11, 0, 0, 0);
const BANNER_END = new Date(2026, 10, 15, 0, 0, 0);

const DISMISS_KEY = 'kuznia_install_banner_dismissed';
const INSTALLED_KEY = 'kuznia_pwa_installed';

const isRunningStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

const isIOSDevice = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ lang, isEventLive }) => {
  const t = translations[lang].installBanner;

  const [withinWindow, setWithinWindow] = useState(() => {
    const now = new Date();
    return now >= BANNER_START && now < BANNER_END;
  });
  const [installed, setInstalled] = useState(
    () => isRunningStandalone() || localStorage.getItem(INSTALLED_KEY) === '1'
  );
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1'
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS] = useState(isIOSDevice);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      setWithinWindow(now >= BANNER_START && now < BANNER_END);
    };
    const id = setInterval(check, 60000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      setInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem(INSTALLED_KEY, '1');
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  const canOffer = !!deferredPrompt || isIOS;
  const shouldShow = withinWindow && !installed && !dismissed && canOffer;

  if (!shouldShow) return null;

  return (
    <div
      className={`sm:hidden fixed left-0 right-0 z-40 px-4 ${
        isEventLive ? 'bottom-[76px]' : 'bottom-0 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-0'
      }`}
    >
      <div className={`relative max-w-md mx-auto bg-[#18212C] border border-[#3E4C5E]/40 rounded-2xl shadow-2xl p-4 ${
        isEventLive ? 'mb-0' : 'mb-4'
      }`}>
        <button
          onClick={handleDismiss}
          aria-label={t.dismiss}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-[#E3E6DB]/40 hover:text-[#E3E6DB]/80 hover:bg-[#253242] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-7">
          <img
            src="./pwa-192x192.png"
            alt=""
            className="w-11 h-11 rounded-xl shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bebas text-lg text-[#E3E6DB] tracking-wide uppercase leading-tight">
              {t.title}
            </p>
            {isIOS && !deferredPrompt ? (
              <p className="text-[11px] text-[#E3E6DB]/60 leading-snug flex items-center gap-1 mt-0.5">
                <Share className="w-3 h-3 shrink-0" />
                {t.iosInstructions}
              </p>
            ) : (
              <p className="text-[11px] text-[#E3E6DB]/60 leading-snug mt-0.5">{t.subtitle}</p>
            )}
          </div>
        </div>

        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="w-full mt-3.5 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-mono-code text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {t.installBtn}
          </button>
        )}
      </div>
    </div>
  );
};
