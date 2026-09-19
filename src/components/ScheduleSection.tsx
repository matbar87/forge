import React, { useState } from 'react';
import { Language, translations } from '../translations';
import { Clock, Flame, Utensils, Award, Coffee } from 'lucide-react';

interface ScheduleSectionProps {
  lang: Language;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ lang }) => {
  const t = translations[lang].schedule;
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const getBadgeForType = (type?: string) => {
    switch (type) {
      case 'session':
        return {
          bg: 'bg-[#3E4C5E] text-[#E3E6DB]',
          labelPl: 'SESJA',
          labelEn: 'SESSION',
          icon: <Award className="w-3.5 h-3.5" />,
        };
      case 'activity':
        return {
          bg: 'bg-[#4A5D75] text-[#E3E6DB]',
          labelPl: 'OGIEŃ',
          labelEn: 'FIRE',
          icon: <Flame className="w-3.5 h-3.5" />,
        };
      case 'meal':
        return {
          bg: 'bg-[#2D3A4B] text-[#E3E6DB]/80',
          labelPl: 'POSIŁEK',
          labelEn: 'MEAL',
          icon: <Utensils className="w-3.5 h-3.5" />,
        };
      case 'break':
      default:
        return {
          bg: 'bg-[#253242] text-[#E3E6DB]/70',
          labelPl: 'RELAKS',
          labelEn: 'BREAK',
          icon: <Coffee className="w-3.5 h-3.5" />,
        };
    }
  };

  const currentDay = t.days[selectedDayIndex];

  return (
    <section id="plan" className="py-28 bg-transparent relative overflow-hidden">
      {/* Dark Ambient Gradient Blobs */}
      <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-[#16202B]/60 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-40 w-[450px] h-[450px] bg-[#1E2938]/40 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag - No borders */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[#E3E6DB] font-mono-code text-xs font-bold tracking-widest uppercase bg-[#3E4C5E]/50 px-3 py-1 rounded-full">
            [ 03 // {t.badge} ]
          </span>
          <div className="h-0.5 bg-[#3E4C5E]/30 flex-1 rounded-full" />
        </div>

        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto pt-16 mb-16">
          <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#E3E6DB] uppercase leading-[0.9] mb-4">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-[#E3E6DB]/70 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Day Switcher Cards - Borderless */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-5xl mx-auto">
          {t.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIndex(idx)}
                className={`text-left p-6 rounded-3xl transition-all duration-300 relative overflow-hidden shadow-xl ${
                  isSelected
                    ? 'bg-[#1E2937] shadow-2xl scale-[1.02]'
                    : 'bg-[#18212C] hover:bg-[#1C2633]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E3E6DB]" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono-code text-xs font-bold uppercase tracking-wider ${
                      isSelected ? 'text-[#E3E6DB]' : 'text-[#E3E6DB]/50'
                    }`}
                  >
                    // DZIEŃ 0{idx + 1}
                  </span>
                  <span
                    className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#3E4C5E] text-[#E3E6DB]' : 'bg-[#253242] text-[#E3E6DB]/60'
                    }`}
                  >
                    {day.date.split(' ')[0]} {day.date.split(' ')[1]}
                  </span>
                </div>
                <h4 className="font-bebas text-2xl sm:text-3xl text-[#E3E6DB] tracking-wide uppercase">
                  {day.date.includes('(') ? day.date.split('(')[1].replace(')', '') : day.dayName}
                </h4>
                <p className="text-xs font-mono-code text-[#E3E6DB]/60 truncate mt-1">
                  {day.theme}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Day Timeline Container - Borderless */}
        <div className="max-w-5xl mx-auto bg-[#18212C] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Day Theme Banner */}
          <div className="pb-8 mb-8 border-b border-[#3E4C5E]/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3E6DB]" />
              <span className="font-mono-code text-xs text-[#E3E6DB] uppercase font-bold tracking-widest">
                {currentDay.dayName} // {currentDay.date}
              </span>
            </div>
            <h3 className="font-bebas text-3xl sm:text-4xl text-[#E3E6DB] tracking-wide uppercase">
              {currentDay.theme}
            </h3>
          </div>

          {/* Timeline Items - Borderless */}
          <div className="space-y-4">
            {currentDay.items.map((item, itemIdx) => {
              const badges = item.badges
                ? item.badges.map((b) => ({ ...getBadgeForType(b.type), label: b.label }))
                : [{ ...getBadgeForType(item.type), label: item.badge ?? (lang === 'pl' ? getBadgeForType(item.type).labelPl : getBadgeForType(item.type).labelEn) }];

              // Plain "session" items (no title-specific override) are the core
              // teaching blocks, so they get a stronger card background. Groups
              // and Prayer keep full title emphasis; everything else fades its
              // title a touch to recede behind those.
              const isMainSession = item.type === 'session' && !item.badge && !item.badges;
              const groupsLabel = lang === 'pl' ? 'GRUPY' : 'GROUPS';
              const prayerLabel = lang === 'pl' ? 'MODLITWA' : 'PRAYER';
              const isGroups = badges.some((b) => b.label.toUpperCase() === groupsLabel);
              const isPrayer = badges.some((b) => b.label.toUpperCase() === prayerLabel);

              return (
                <div
                  key={itemIdx}
                  className={`group relative flex flex-col md:flex-row md:items-start gap-4 p-5 sm:p-6 rounded-2xl transition-all shadow-md ${
                    isMainSession ? 'bg-[#2C3B4E] hover:bg-[#324259]' : 'bg-[#1E2937]/70 hover:bg-[#232F3F]'
                  }`}
                >
                  {/* Time & Badge */}
                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#293648] text-[#E3E6DB] font-mono-code text-xs font-bold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[#E3E6DB]/70 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    {badges.map((badge, badgeIdx) => (
                      <span
                        key={badgeIdx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono-code text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h4
                      className={`font-bebas text-2xl sm:text-3xl tracking-wide uppercase ${
                        isMainSession || isGroups || isPrayer ? 'text-[#E3E6DB]' : 'text-[#E3E6DB]/70'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-[#E3E6DB]/70 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
