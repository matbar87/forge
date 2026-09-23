import React from 'react';
import { Language, translations } from '../translations';
import { Backpack, Languages, UtensilsCrossed, PartyPopper, Coffee, MapPin } from 'lucide-react';
import { CtaButton } from './CtaButton';

interface PracticalInfoSectionProps {
  lang: Language;
  // Used as a standalone full-screen view (the event tab bar's "Informacje"
  // tab) instead of embedded in the scrolling site — drops the section
  // numbering tag and switches to a fixed-header-aware top offset. Also
  // adds a Location card up top, since the full Location section (with its
  // own maps button) isn't shown anywhere else during the live event.
  standalone?: boolean;
}

const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ośrodek h2o, ul. Ochabska 133, 43-430 Kiczyce')}`;

const groupIcons = [
  <Backpack className="w-5 h-5 text-[#E3E6DB]" key="backpack" />,
  <Languages className="w-5 h-5 text-[#E3E6DB]" key="languages" />,
  <UtensilsCrossed className="w-5 h-5 text-[#E3E6DB]" key="utensils" />,
  <PartyPopper className="w-5 h-5 text-[#E3E6DB]" key="party" />,
  <Coffee className="w-5 h-5 text-[#E3E6DB]" key="coffee" />,
];

export const PracticalInfoSection: React.FC<PracticalInfoSectionProps> = ({ lang, standalone }) => {
  const t = translations[lang].practicalInfo;
  const locationT = translations[lang].location;

  return (
    <section
      id={standalone ? undefined : 'informacje'}
      className={`bg-transparent relative overflow-hidden ${
        standalone ? 'min-h-screen w-full pt-[104px] sm:pt-[128px] pb-16' : 'py-28'
      }`}
    >
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-[#1E2938]/40 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {!standalone && (
          /* Section Tag - No borders */
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
              [ 05 // {t.badge} ]
            </span>
            <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
          </div>
        )}

        {/* Section Headline */}
        <div className={`text-center max-w-3xl mx-auto mb-14 ${standalone ? '' : 'pt-14'}`}>
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9]">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium mt-4">
            {t.subtitle}
          </p>
        </div>

        {standalone && (
          /* Location Card - Borderless */
          <div className="bg-[#18212C] rounded-3xl p-6 sm:p-8 shadow-2xl mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-[#253242] w-fit shrink-0">
                <MapPin className="w-5 h-5 text-[#E3E6DB]" />
              </div>
              <div>
                <h3 className="font-bebas text-2xl text-[#E3E6DB] tracking-wide uppercase mb-1 leading-tight">
                  {t.locationTitle}
                </h3>
                <p className="text-sm text-[#E3E6DB]/70">{locationT.region}</p>
              </div>
            </div>
            <CtaButton href={GOOGLE_MAPS_URL} external className="shrink-0">
              {locationT.mapsButton}
            </CtaButton>
          </div>
        )}

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
