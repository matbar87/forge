import React from 'react';
import { Language, translations } from '../translations';
import { Check, User, Users } from 'lucide-react';
import { CtaButton } from './CtaButton';

interface RegistrationSectionProps {
  lang: Language;
  isRegistrationClosed: boolean;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ lang, isRegistrationClosed }) => {
  const t = translations[lang].registration;

  const individualRegistrationUrl = 'https://kdmkrakow.churchtrac.com/';
  const groupMailtoUrl = `mailto:info@koscioldlamiasta.pl?subject=${encodeURIComponent('Kuźnia - Rejestracja Grupowa')}`;

  return (
    <section id="rejestracja" className="py-28 bg-transparent relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3E4C5E]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag - No borders */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ 02 // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto pt-20 mb-20">
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9] mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* The Two Cards - Completely Borderless */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Individual Registration */}
          <div
            id="ticket-individual"
            className="flex flex-col justify-between bg-[#18212C] rounded-3xl p-8 sm:p-10 shadow-2xl relative group hover:bg-[#1E2937] transition-all duration-300"
          >
            <div>
              {/* Header Meta */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#3E4C5E]/30">
                <div className="p-2.5 rounded-2xl bg-[#253242] text-[#E3E6DB]">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono-code text-[#E3E6DB] font-semibold">
                  {t.individual.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bebas text-4xl sm:text-5xl text-[#E3E6DB] tracking-wide uppercase mb-2">
                {t.individual.title}
              </h3>
              <p className="text-sm text-[#E3E6DB]/70 mb-8 leading-relaxed">
                {t.individual.description}
              </p>

              {/* Price Callout */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 pb-8 mb-8 border-b border-[#3E4C5E]/30">
                <span className="font-bebas text-5xl sm:text-6xl text-[#E3E6DB] tracking-tight whitespace-nowrap">
                  {t.individual.price}
                </span>
                <span className="text-xs font-mono-code text-[#E3E6DB]/60 uppercase">
                  {t.individual.priceSub}
                </span>
              </div>

              {/* Inclusions Checklist */}
              <div className="space-y-4 mb-10">
                {t.individual.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#253242] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#E3E6DB]" />
                    </div>
                    <span className="text-sm text-[#E3E6DB]/85 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button - Borderless */}
            <div className="pt-4 border-t border-[#3E4C5E]/30">
              <CtaButton href={individualRegistrationUrl} external disabled>
                {t.comingSoonCta}
              </CtaButton>
            </div>
          </div>

          {/* Card 2: Group Registration (Featured / Recommended) */}
          <div
            id="ticket-group"
            className="flex flex-col justify-between bg-[#1E2937] rounded-3xl p-8 sm:p-10 shadow-2xl relative group hover:bg-[#253346] transition-all duration-300"
          >
            <div>
              {/* Header Meta */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#3E4C5E]/40">
                <div className="p-2.5 rounded-2xl bg-[#3E4C5E]/60 text-[#E3E6DB]">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono-code text-[#E3E6DB] font-semibold">
                  {t.group.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bebas text-4xl sm:text-5xl text-[#E3E6DB] tracking-wide uppercase mb-2">
                {t.group.title}
              </h3>
              <p className="text-sm text-[#E3E6DB]/70 mb-8 leading-relaxed">
                {t.group.description}
              </p>

              {/* Price Callout */}
              <div className="pb-8 mb-8 border-b border-[#3E4C5E]/40">
                <p className="font-bebas text-2xl sm:text-3xl text-[#E3E6DB] tracking-wide uppercase">
                  {t.group.priceNote}
                </p>
              </div>

              {/* Inclusions Checklist */}
              <div className="space-y-4 mb-10">
                {t.group.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md bg-[#3E4C5E]/60 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#E3E6DB] font-bold" />
                    </div>
                    <span className="text-sm text-[#E3E6DB] leading-snug font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button - Borderless */}
            <div className="pt-4 border-t border-[#3E4C5E]/40">
              <CtaButton href={groupMailtoUrl} disabled={isRegistrationClosed}>
                {t.group.cta}
              </CtaButton>
              <span className="block text-center text-[11px] font-mono-code text-[#E3E6DB]/50 mt-2.5">
                {isRegistrationClosed ? t.closedNote : t.group.note}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
