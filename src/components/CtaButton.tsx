import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CtaButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
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
  className?: string;
}

// The one primary "light" CTA button style used across the site (register,
// maps link, mailto, etc.) — kept in one place so icon size, font size and
// single-line behavior stay consistent everywhere instead of drifting.
export const CtaButton: React.FC<CtaButtonProps> = ({
  children,
  icon,
  iconPosition = 'trailing',
  href,
  external,
  onClick,
  disabled,
  fullWidthOnMobile = true,
  size = 'default',
  className = '',
}) => {
  const sizeClasses =
    size === 'compact'
      ? 'gap-1 sm:gap-3 px-3 sm:px-8 text-sm sm:text-2xl'
      : 'gap-2 sm:gap-3 px-6 sm:px-8 text-lg sm:text-2xl';

  const classes = `group/btn inline-flex items-center justify-center ${sizeClasses} ${
    fullWidthOnMobile ? 'w-full sm:w-auto' : ''
  } py-4 rounded-2xl font-bebas tracking-wider uppercase shadow-xl transition-all whitespace-nowrap ${
    disabled
      ? 'bg-[#3E4C5E]/30 text-[#E3E6DB]/40 cursor-not-allowed pointer-events-none'
      : 'bg-[#E3E6DB] hover:bg-white text-[#121820] hover:shadow-2xl active:scale-95'
  } ${className}`;

  const resolvedIcon = !disabled && (
    icon ?? (
      <ArrowUpRight className="w-5 h-5 text-[#121820] shrink-0 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
