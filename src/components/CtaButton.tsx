import React from 'react';

interface CtaButtonProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  fullWidthOnMobile?: boolean;
  // "dark" is the secondary CTA seen next to a "light" one (e.g. Hero's
  // "Zobacz Plan" beside "Zarejestruj się") — same font sizing, just the
  // inverted color scheme, so the pair always reads as one family.
  variant?: 'light' | 'dark';
  // Every short button label stays on one line (default). A full-sentence
  // CTA (e.g. About's "Zarezerwuj swoje miejsce...") needs to wrap instead.
  allowWrap?: boolean;
  className?: string;
}

// The one primary CTA button style used across the site (register, maps
// link, mailto, etc.) — kept in one place, with no icon and a single font
// size, so nothing drifts or wraps unpredictably on mobile again.
export const CtaButton: React.FC<CtaButtonProps> = ({
  children,
  href,
  external,
  onClick,
  disabled,
  fullWidthOnMobile = true,
  variant = 'light',
  allowWrap = false,
  className = '',
}) => {
  const colorClasses = disabled
    ? 'bg-[#3E4C5E]/30 text-[#E3E6DB]/40 cursor-not-allowed pointer-events-none'
    : variant === 'dark'
    ? 'bg-[#1E2937]/90 hover:bg-[#28374A] text-[#E3E6DB] active:scale-95'
    : 'bg-[#E3E6DB] hover:bg-white text-[#121820] hover:shadow-2xl active:scale-95';

  const classes = `inline-flex items-center justify-center text-center ${
    fullWidthOnMobile ? 'w-full sm:w-auto' : ''
  } px-4 sm:px-8 py-4 rounded-2xl font-bebas text-xl sm:text-2xl tracking-wider uppercase shadow-xl transition-all ${
    allowWrap ? '' : 'whitespace-nowrap'
  } ${colorClasses} ${className}`;

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        target={!disabled && external ? '_blank' : undefined}
        rel={!disabled && external ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={(e) => disabled && e.preventDefault()}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
};
