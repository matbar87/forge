import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BellRing, X } from 'lucide-react';
import { Language, translations } from '../translations';

interface CheckoutNoticeProps {
  lang: Language;
}

// Room check-out deadline: 14 Nov 2026, 9:30, on the viewer's device clock
// (like EVENT_END in App.tsx). After it the badge disappears on its own.
const CHECKOUT_DEADLINE = new Date(2026, 10, 14, 9, 30, 0);

// Remembers that the notice has already opened by itself once, so it pops up
// on the next visit only, not on every one. "_app": event-app-only flag.
const SEEN_KEY = 'kuznia_checkout_notice_seen_app';

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // storage unavailable - the notice may then show again, which is harmless
  }
};

const isPastDeadline = () => new Date() >= CHECKOUT_DEADLINE;

// Pulsing yellow badge in the event app's header; clicking it opens the
// check-out message. The message also opens by itself once, on the first
// visit after this was deployed.
export const CheckoutNotice: React.FC<CheckoutNoticeProps> = ({ lang }) => {
  const t = translations[lang].checkoutNotice;
  const [expired, setExpired] = useState(isPastDeadline);
  const [open, setOpen] = useState(() => !isPastDeadline() && !readSeen());
  const okRef = useRef<HTMLButtonElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);

  // Marking it seen as soon as it is shown (not on close) means a reload
  // while it's open doesn't show it a second time.
  useEffect(() => {
    if (open) markSeen();
  }, [open]);

  useEffect(() => {
    if (expired) return;
    const check = () => setExpired(isPastDeadline());
    const id = setInterval(check, 60000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, [expired]);

  useEffect(() => {
    if (!open) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      // Hand focus back to the badge once the dialog closes (keyboard users).
      badgeRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  if (expired) return null;

  return (
    <>
      <button
        ref={badgeRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="relative inline-flex items-center gap-1.5 min-w-0 px-2 min-[360px]:px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FACC15] text-[#121820] font-mono-code text-[10px] sm:text-[11px] font-bold sm:tracking-wide whitespace-nowrap shadow-[0_0_0_0_rgba(250,204,21,0.6)] motion-safe:animate-[checkout-pulse_2s_ease-out_infinite] hover:bg-[#FDE047] active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18212C]"
      >
        {/* The bell gives way to the text on the narrowest phones. */}
        <BellRing className="hidden min-[360px]:block w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{t.badge}</span>
      </button>

      {/* Portalled to <body>: the header is transformed (it slides away on
          scroll), which would otherwise trap a fixed overlay inside it. */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-checkout-fade-in"
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-notice-title"
              aria-describedby="checkout-notice-message"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm bg-[#18212C] border border-[#FACC15]/40 rounded-2xl shadow-2xl p-6 text-center"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-[#E3E6DB]/40 hover:text-[#E3E6DB]/80 hover:bg-[#253242] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#FACC15] text-[#121820] flex items-center justify-center">
                <BellRing className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2
                id="checkout-notice-title"
                className="font-bebas text-3xl tracking-wide uppercase text-[#E3E6DB] leading-none"
              >
                {t.title}
              </h2>
              <p id="checkout-notice-message" className="mt-3 text-sm text-[#E3E6DB]/80 leading-relaxed">
                {t.message}
              </p>
              <button
                ref={okRef}
                type="button"
                onClick={() => setOpen(false)}
                className="w-full mt-6 px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#121820] font-mono-code text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18212C]"
              >
                {t.ok}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
