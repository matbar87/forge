import React from 'react';
import { Language, translations } from '../translations';
import { Check, ArrowUpRight, Sparkles, User, Users } from 'lucide-react';

interface RegistrationSectionProps {
  lang: Language;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ lang }) => {
  const t = translations[lang].registration;

  const individualRegistrationUrl = 'https://forms.google.com';
  const groupRegistrationUrl = 'https://forms.google.com';

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
        <div className="text-center max-w-3xl mx-auto mb-20">
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
              <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-[#3E4C5E]/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#253242] text-[#E3E6DB]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#E3E6DB]/50 block font-bold">
                      // PASS #001
                    </span>
                    <span className="text-xs font-mono-code text-[#E3E6DB] font-semibold">
                      {t.individual.badge}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code uppercase tracking-wider px-3 py-1 rounded-full bg-[#253242] text-[#E3E6DB]/70">
                  STANDARD
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
              <div className="flex items-baseline gap-3 pb-8 mb-8 border-b border-[#3E4C5E]/30">
                <span className="font-bebas text-5xl sm:text-6xl text-[#E3E6DB] tracking-tight">
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
              <a
                href={individualRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#253242] hover:bg-[#3E4C5E] text-[#E3E6DB] font-bebas text-2xl tracking-wider uppercase transition-all active:scale-95 shadow-xl"
              >
                <span>{t.individual.cta}</span>
                <ArrowUpRight className="w-5 h-5 text-[#E3E6DB] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
              <span className="block text-center text-[11px] font-mono-code text-[#E3E6DB]/50 mt-2.5">
                {t.individual.note}
              </span>
            </div>
          </div>

          {/* Card 2: Group Registration (Featured / Recommended) */}
          <div
            id="ticket-group"
            className="flex flex-col justify-between bg-[#1E2937] rounded-3xl p-8 sm:p-10 shadow-2xl relative group hover:bg-[#253346] transition-all duration-300"
          >
            {/* Top Badge - Borderless */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full bg-[#E3E6DB] text-[#121820] font-bebas text-base tracking-widest uppercase shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-4 h-4 fill-current" />
              {t.group.popularBadge}
            </div>

            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-[#3E4C5E]/40">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#3E4C5E]/60 text-[#E3E6DB]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#E3E6DB]/60 block font-bold">
                      // PASS #002 - GROUP
                    </span>
                    <span className="text-xs font-mono-code text-[#E3E6DB] font-semibold">
                      {t.group.badge}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code uppercase tracking-wider px-3 py-1 rounded-full bg-[#3E4C5E]/60 text-[#E3E6DB] font-bold">
                  BEST VALUE
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
              <div className="flex items-baseline gap-3 pb-8 mb-8 border-b border-[#3E4C5E]/40">
                <span className="font-bebas text-5xl sm:text-6xl text-[#E3E6DB] tracking-tight">
                  {t.group.price}
                </span>
                <span className="text-xs font-mono-code text-[#E3E6DB]/60 uppercase">
                  {t.group.priceSub}
                </span>
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
              <a
                href={groupRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-bebas text-2xl tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                <span>{t.group.cta}</span>
                <ArrowUpRight className="w-5 h-5 text-[#121820] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
              <span className="block text-center text-[11px] font-mono-code text-[#E3E6DB]/50 mt-2.5">
                {t.group.note}
              </span>
            </div>
          </div>
        </div>

        {/* Support Help Banner - Borderless */}
        <div className="mt-16 max-w-2xl mx-auto text-center p-5 rounded-2xl bg-[#18212C] text-xs font-mono-code text-[#E3E6DB]/70 shadow-lg">
          <span>{t.faqPrompt} </span>
          <a
            href={`mailto:${t.faqContact.split(': ')[1] || 'kontakt@kuznia.pl'}`}
            className="text-[#E3E6DB] hover:underline font-bold"
          >
            {t.faqContact}
          </a>
        </div>
      </div>
    </section>
  );
};
