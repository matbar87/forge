import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CtaButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  iconPosition?: 'leading' | 'trailing';
  href?: string;
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  fullWidthOnMobile?: boolean;
  // "compact" is for labels too long to fit the default size on mobile
  // without wrapping (e.g. "Otwórz wskazówki dojazdu") — same icon size
  // and same size from sm: up, just a smaller mobile font/padding/gap.
  size?: 'default' | 'compact';
  // "dark" is the secondary CTA seen next to a "light" one (e.g. Hero's
  // "Zobacz Plan" beside "Zarejestruj się") — same font/icon sizing, just
  // the inverted color scheme, so the pair always reads as one family.
  variant?: 'light' | 'dark';
  className?: string;
}

// The one primary "light" CTA button style used across the site (register,
// maps link, mailto, etc.) — kept in one place so icon size, font size and
// single-line behavior stay consistent everywhere instead of drifting.
export const CtaButton: React.FC<CtaButtonProps> = ({
  children,
  icon,
  hideIcon = false,
  iconPosition = 'trailing',
  href,
  external,
  onClick,
  disabled,
  fullWidthOnMobile = true,
  size = 'default',
  variant = 'light',
  className = '',
}) => {
  const sizeClasses =
    size === 'compact'
      ? 'gap-1 sm:gap-3 px-3 sm:px-8 text-[15px] sm:text-2xl'
      : 'gap-2 sm:gap-3 px-6 sm:px-8 text-lg sm:text-2xl';

  const colorClasses = disabled
    ? 'bg-[#3E4C5E]/30 text-[#E3E6DB]/40 cursor-not-allowed pointer-events-none'
    : variant === 'dark'
    ? 'bg-[#1E2937]/90 hover:bg-[#28374A] text-[#E3E6DB] active:scale-95'
    : 'bg-[#E3E6DB] hover:bg-white text-[#121820] hover:shadow-2xl active:scale-95';

  const classes = `group/btn inline-flex items-center justify-center ${sizeClasses} ${
    fullWidthOnMobile ? 'w-full sm:w-auto' : ''
  } py-4 rounded-2xl font-bebas tracking-wider uppercase shadow-xl transition-all whitespace-nowrap ${colorClasses} ${className}`;

  const iconColor = variant === 'dark' ? 'text-[#E3E6DB]' : 'text-[#121820]';

  const resolvedIcon = !disabled && !hideIcon && (
    icon ?? (
      <ArrowUpRight
        className={`w-5 h-5 ${iconColor} shrink-0 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform`}
      />
    )
  );

  const content =
    iconPosition === 'leading' ? (
      <>
        {resolvedIcon}
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        {resolvedIcon}
      </>
    );

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
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
};
