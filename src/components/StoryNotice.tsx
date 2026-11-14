import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, PenLine, X } from 'lucide-react';
import { Language, translations } from '../translations';
import { STORY_FORM_URL, hasGoneToForm, isStoryActive, noteWentToForm } from '../data/story';

// Coming back to the app (e.g. an installed app resumed from the background)
// counts as a new entry once it was away at least this long, so a quick
// glance at another app doesn't reopen the notice straight away.
const REENTRY_MS = 60 * 1000;

/**
 * Whether the "My story" phase (from the start of Session 7) has begun.
 * Re-checked every 30 s and when the app comes back to the foreground, so the
 * header switches over without a reload.
 */
export const useStoryActive = () => {
  const [active, setActive] = useState(() => isStoryActive());
  useEffect(() => {
    if (active) return;
    const tick = () => setActive(isStoryActive());
    const id = setInterval(tick, 30000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [active]);
  return active;
};

interface StoryNoticeProps {
  lang: Language;
}

const linkProps = { href: STORY_FORM_URL, target: '_blank', rel: 'noopener noreferrer' } as const;

// Pulsing yellow "My story" badge in the event app's header (in place of the
// check-out badge), linking straight to the story form. Rendered only once
// the story phase has begun; the notice then opens on every entry to the app.
// Its X, Escape or a tap beside it closes it.
export const StoryNotice: React.FC<StoryNoticeProps> = ({ lang }) => {
  const t = translations[lang].storyNotice;
  // Opens on entering the app - but only when the page is actually on screen;
  // otherwise as soon as it comes to the foreground (see below).
  const [open, setOpen] = useState(() => document.visibilityState === 'visible');
  const goRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shownThisEntry = useRef(open);

  useEffect(() => {
    let hiddenAt: number | null = null;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
        return;
      }
      const awayLongEnough = hiddenAt !== null && Date.now() - hiddenAt >= REENTRY_MS;
      hiddenAt = null;
      if (!shownThisEntry.current || (awayLongEnough && !hasGoneToForm())) {
        shownThisEntry.current = true;
        setOpen(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!open) return;
    goRef.current?.focus();
    // Keep the page behind the dialog from scrolling (and the header from
    // sliding away with it).
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Escape closes (the keyboard's X); Tab stays within the dialog's two controls.
  const onDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === 'Tab') {
      const first = closeRef.current;
      const last = goRef.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <>
      <a
        {...linkProps}
        onClick={noteWentToForm}
        className="relative inline-flex items-center gap-1.5 min-w-0 px-2 min-[360px]:px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FACC15] text-[#121820] font-mono-code text-[10px] sm:text-[11px] font-bold sm:tracking-wide whitespace-nowrap shadow-[0_0_0_0_rgba(250,204,21,0.6)] motion-safe:animate-[checkout-pulse_2s_ease-out_infinite] hover:bg-[#FDE047] active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18212C]"
      >
        {/* The icon gives way to the text on the narrowest phones. */}
        <PenLine className="hidden min-[360px]:block w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{t.badge}</span>
      </a>

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
              aria-labelledby="story-notice-title"
              aria-describedby="story-notice-message"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onDialogKeyDown}
              className="relative w-full max-w-sm bg-[#18212C] border border-[#FACC15]/40 rounded-2xl shadow-2xl p-6 text-center"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-[#E3E6DB]/40 hover:text-[#E3E6DB]/80 hover:bg-[#253242] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#FACC15] text-[#121820] flex items-center justify-center">
                <PenLine className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2
                id="story-notice-title"
                className="font-bebas text-3xl tracking-wide uppercase text-[#E3E6DB] leading-none"
              >
                {t.title}
              </h2>
              <p id="story-notice-message" className="mt-3 text-sm text-[#E3E6DB]/80 leading-relaxed">
                {t.message}
              </p>
              <a
                ref={goRef}
                {...linkProps}
                onClick={() => {
                  noteWentToForm();
                  // Closed only after the click has run its course: a link
                  // already removed from the page may not navigate (Safari).
                  setTimeout(() => setOpen(false), 0);
                }}
                className="w-full mt-6 px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#121820] font-mono-code text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDE047] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18212C]"
              >
                {t.go}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
