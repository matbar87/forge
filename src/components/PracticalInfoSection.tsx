import React from 'react';
import { Language, translations } from '../translations';
import { Backpack, Languages, UtensilsCrossed, PartyPopper, Coffee } from 'lucide-react';

interface PracticalInfoSectionProps {
  lang: Language;
}

const groupIcons = [
  <Backpack className="w-5 h-5 text-[#E3E6DB]" key="backpack" />,
  <Languages className="w-5 h-5 text-[#E3E6DB]" key="languages" />,
  <UtensilsCrossed className="w-5 h-5 text-[#E3E6DB]" key="utensils" />,
  <PartyPopper className="w-5 h-5 text-[#E3E6DB]" key="party" />,
  <Coffee className="w-5 h-5 text-[#E3E6DB]" key="coffee" />,
];

export const PracticalInfoSection: React.FC<PracticalInfoSectionProps> = ({ lang }) => {
  const t = translations[lang].practicalInfo;

  return (
    <section id="informacje" className="py-28 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#1E2938]/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag - No borders */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ 05 // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto pt-14 mb-14">
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9]">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium mt-4">
            {t.subtitle}
          </p>
        </div>

        {/* Info Cards Grid - Borderless */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.groups.map((group, idx) => (
            <div
              key={idx}
              className="bg-[#18212C] rounded-3xl p-6 sm:p-8 shadow-2xl hover:bg-[#1E2937] transition-colors duration-300"
            >
              <div className="mb-4 p-2.5 rounded-2xl bg-[#253242] w-fit">
                {groupIcons[idx % groupIcons.length]}
              </div>
              <h3 className="font-bebas text-2xl text-[#E3E6DB] tracking-wide uppercase mb-3 leading-tight">
                {group.heading}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-[#E3E6DB]/80 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3E6DB]/50 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
