import React, { useState } from 'react';
import { BRAND_ASSETS } from '../data/assets';
import { Layers, Shield, Sparkles, Smartphone, Shirt, CreditCard, Globe } from 'lucide-react';

export const MockupShowcase: React.FC = () => {
  const [apparelColor, setApparelColor] = useState<'black' | 'charcoal' | 'white' | 'sand'>('black');
  const [cardSheen, setCardSheen] = useState<'gold' | 'silver' | 'ember'>('gold');

  const forgeLogo = BRAND_ASSETS[0];
  const forgeNoSygnet = BRAND_ASSETS[1];
  const kuzniaLogo = BRAND_ASSETS[2];
  const sygnet = BRAND_ASSETS[4];

  const getFoilColor = () => {
    switch (cardSheen) {
      case 'gold':
        return '#D4AF37';
      case 'silver':
        return '#E3E6DB';
      case 'ember':
        return '#E25822';
    }
  };

  return (
    <div className="space-y-10">
      {/* Introduction Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-500" />
          Real-World Brand Context Mockups
        </h2>
        <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
          Observe the Forge and Kuźnia vector assets deployed across contemporary digital products, physical stationery, mobile applications, and apparel.
        </p>
      </div>

      {/* Grid of Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mockup 1: Dark & Light Web Navigation Headers */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <Globe className="w-4 h-4" />
                Digital Interface / SaaS Navbars
              </span>
              <span className="text-[11px] font-mono text-neutral-400">Web Component</span>
            </div>

            <div className="space-y-4">
              {/* Dark Navbar */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox={sygnet.viewBox} className="w-7 h-7 text-amber-500 fill-current">
                      <path d={sygnet.pathD} />
                    </svg>
                    <svg viewBox={forgeNoSygnet.viewBox} className="h-4.5 w-auto text-neutral-200 fill-current">
                      <path d={forgeNoSygnet.pathD} />
                    </svg>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-400">
                    <span className="text-neutral-200 font-medium">Products</span>
                    <span>Studio</span>
                    <span>Enterprise</span>
                  </div>
                  <button className="px-3 py-1 rounded-md bg-amber-500 text-neutral-950 font-semibold text-xs shadow-sm">
                    Launch
                  </button>
                </div>
              </div>

              {/* Light Polish Navbar */}
              <div className="bg-neutral-100 border border-neutral-300/80 rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox={sygnet.viewBox} className="w-7 h-7 text-neutral-900 fill-current">
                      <path d={sygnet.pathD} />
                    </svg>
                    <svg viewBox={kuzniaLogo.viewBox} className="h-6 w-auto text-neutral-950 fill-current">
                      <path d={kuzniaLogo.pathD} />
                    </svg>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-600">
                    <span className="text-neutral-900 font-medium">Oferta</span>
                    <span>Warsztat</span>
                    <span>Kontakt</span>
                  </div>
                  <button className="px-3 py-1 rounded-md bg-neutral-900 text-neutral-100 font-semibold text-xs shadow-sm">
                    Zaloguj
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Clean legibility at reduced scale in responsive navigation locks.
          </p>
        </div>

        {/* Mockup 2: Luxury Business Stationery & Foil Card */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <CreditCard className="w-4 h-4" />
                Matte Black Metallic Foil Card
              </span>
              <div className="flex items-center gap-1">
                {(['gold', 'silver', 'ember'] as const).map((foil) => (
                  <button
                    key={foil}
                    onClick={() => setCardSheen(foil)}
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border transition-colors ${
                      cardSheen === foil
                        ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                        : 'border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {foil}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full aspect-[1.75/1] rounded-xl bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border border-neutral-800 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Subtle metallic sheen accent */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60 pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <svg
                  viewBox={sygnet.viewBox}
                  className="w-12 h-12 transition-colors duration-300"
                  style={{ fill: getFoilColor() }}
                >
                  <path d={sygnet.pathD} />
                </svg>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400">
                  EST. 2024
                </span>
              </div>

              <div className="relative z-10">
                <svg
                  viewBox={forgeLogo.viewBox}
                  className="w-36 h-auto transition-colors duration-300 mb-2"
                  style={{ fill: getFoilColor() }}
                >
                  <path d={forgeLogo.pathD} />
                </svg>
                <div className="text-[11px] font-mono text-neutral-400 tracking-wider">
                  PREMIUM METALLURGY & INDUSTRIAL DESIGN
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Embossed hot-stamping visual simulation with custom metallic foil selection.
          </p>
        </div>

        {/* Mockup 3: Heavyweight Apparel Print */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <Shirt className="w-4 h-4" />
                Heavyweight Cotton Garment
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'black', color: '#121212' },
                  { id: 'charcoal', color: '#27272a' },
                  { id: 'white', color: '#fafafa' },
                  { id: 'sand', color: '#d6cdb8' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setApparelColor(c.id as any)}
                    className={`w-4 h-4 rounded-full border ${
                      apparelColor === c.id ? 'ring-2 ring-amber-400 border-black' : 'border-neutral-700'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            <div
              className="relative w-full h-56 rounded-xl flex items-center justify-center p-8 transition-colors duration-200 border border-neutral-800/80 shadow-inner"
              style={{
                backgroundColor:
                  apparelColor === 'black'
                    ? '#121212'
                    : apparelColor === 'charcoal'
                    ? '#27272a'
                    : apparelColor === 'white'
                    ? '#fafafa'
                    : '#d6cdb8',
              }}
            >
              {/* Distressed chest print representation */}
              <div className="flex flex-col items-center">
                <svg
                  viewBox={forgeLogo.viewBox}
                  className="w-48 h-auto"
                  style={{
                    fill: apparelColor === 'white' ? '#18181b' : '#E3E6DB',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                >
                  <path d={forgeLogo.pathD} />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            Industrial distressed print texture simulated on custom garment canvas colors.
          </p>
        </div>

        {/* Mockup 4: Mobile App Icon & Favicon Badge */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <Smartphone className="w-4 h-4" />
                App Icons & Favicon Badges
              </span>
              <span className="text-[11px] font-mono text-neutral-400">iOS / Android / Web</span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              {/* Squircle Dark Gold */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-[22%] bg-neutral-950 border border-neutral-800 p-4 shadow-xl flex items-center justify-center">
                  <svg viewBox={sygnet.viewBox} className="w-full h-full text-amber-400 fill-current">
                    <path d={sygnet.pathD} />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Forge OS</span>
              </div>

              {/* Squircle Steel Grey */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-[22%] bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/80 p-4 shadow-xl flex items-center justify-center">
                  <svg viewBox={sygnet.viewBox} className="w-full h-full text-[#E3E6DB] fill-current">
                    <path d={sygnet.pathD} />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Kuźnia Hub</span>
              </div>

              {/* White Minimalist */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-[22%] bg-white border border-neutral-200 p-4 shadow-xl flex items-center justify-center">
                  <svg viewBox={sygnet.viewBox} className="w-full h-full text-neutral-950 fill-current">
                    <path d={sygnet.pathD} />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">Studio</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            The Sygnet symbol scales down seamlessly into app stores, launch icons, and browser favicons.
          </p>
        </div>
      </div>
    </div>
  );
};
