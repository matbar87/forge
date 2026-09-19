import React from 'react';
import { Language, translations } from '../translations';
import { MapPin, Navigation, Shield, Trees, Flame, BedDouble, UtensilsCrossed, Car } from 'lucide-react';

interface LocationSectionProps {
  lang: Language;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang }) => {
  const t = translations[lang].location;

  const amenityIcons = [
    <BedDouble className="w-5 h-5 text-[#E3E6DB]" key="bed" />,
    <UtensilsCrossed className="w-5 h-5 text-[#E3E6DB]" key="food" />,
    <Flame className="w-5 h-5 text-[#E3E6DB]" key="fire" />,
    <Trees className="w-5 h-5 text-[#E3E6DB]" key="trees" />,
    <Shield className="w-5 h-5 text-[#E3E6DB]" key="sauna" />,
    <Car className="w-5 h-5 text-[#E3E6DB]" key="car" />,
  ];

  return (
    <section id="miejsce" className="py-28 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag - No borders */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ 04 // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        {/* Section Headline */}
        <div className="mb-14">
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9]">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium max-w-2xl mt-4">
            {t.subtitle}
          </p>
        </div>

        {/* Location Bento Grid - Borderless */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Info Card - Borderless */}
          <div className="lg:col-span-7 bg-[#18212C] rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div>
              {/* Region Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#253242] text-[#E3E6DB] text-xs font-mono-code font-bold uppercase mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#E3E6DB]" />
                <span>{t.region}</span>
              </div>

              <h3 className="font-bebas text-4xl sm:text-5xl text-[#E3E6DB] tracking-wide uppercase mb-4 leading-tight">
                {t.venueTitle}
              </h3>

              <p className="text-[#E3E6DB]/80 text-base sm:text-lg leading-relaxed mb-8">
                {t.description}
              </p>

              {/* Transport notice box - Borderless */}
              <div className="p-5 rounded-2xl bg-[#1E2937] mb-8">
                <p className="text-xs font-mono-code text-[#E3E6DB]/75 leading-relaxed">
                  <strong className="text-[#E3E6DB] uppercase block mb-1">
                    // {lang === 'pl' ? 'DOJAZD I LOGISTYKA' : 'TRAVEL & LOGISTICS'}:
                  </strong>
                  {t.transportInfo}
                </p>
              </div>
            </div>

            {/* Google Maps External Action Button - Borderless */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-bebas text-xl tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all active:scale-95"
            >
              <Navigation className="w-5 h-5 text-[#121820]" />
              <span>{t.mapsButton}</span>
            </a>
          </div>

          {/* Visual Nature Card & Amenities - Borderless */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Image Preview - Borderless */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#18212C] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
                alt="Retreat Venue Lodging in Pine Woods"
                className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121820] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#E3E6DB]/70 block">
                    // {lang === 'pl' ? 'OTOCZENIE' : 'SURROUNDINGS'}
                  </span>
                  <span className="font-bebas text-2xl text-[#E3E6DB] uppercase tracking-wide">
                    {lang === 'pl' ? 'CISZA, LAS I PRZESTRZEŃ' : 'PEACE, WOODS & SPACE'}
                  </span>
                </div>
                <span className="text-xs font-mono-code px-3 py-1 rounded-full bg-[#18212C]/90 text-[#E3E6DB] backdrop-blur-md">
                  100% PRIVATE
                </span>
              </div>
            </div>

            {/* Amenities Grid - Borderless */}
            <div className="grid grid-cols-2 gap-3">
              {t.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#18212C] hover:bg-[#1E2937] transition-colors shadow-lg flex flex-col justify-between"
                >
                  <div className="mb-3 p-2 rounded-xl bg-[#253242] w-fit">
                    {amenityIcons[idx % amenityIcons.length]}
                  </div>
                  <div>
                    <h5 className="font-bebas text-lg text-[#E3E6DB] tracking-wide uppercase leading-tight">
                      {item.label}
                    </h5>
                    <p className="text-[11px] font-mono-code text-[#E3E6DB]/60 mt-0.5 leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
