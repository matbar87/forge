import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../translations';
import { Clock, Flame, Utensils, Award, Coffee } from 'lucide-react';
import { useHeaderVisibility } from '../hooks/useHeaderVisibility';

interface ScheduleSectionProps {
  lang: Language;
}

// Fixed calendar dates behind t.days[0..2], used to default to "today's" tab
// and to highlight whichever item is happening right now, based on the
// viewer's own device clock.
const EVENT_DAYS = [
  { year: 2026, month: 11, day: 12 },
  { year: 2026, month: 11, day: 13 },
  { year: 2026, month: 11, day: 14 },
];

const toLocalISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getTodayEventDayIndex = (): number => {
  const today = toLocalISODate(new Date());
  return EVENT_DAYS.findIndex(
    ({ year, month, day }) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` === today
  );
};

const parseItemRange = (dayIndex: number, time: string): { start: Date; end: Date } | null => {
  const eventDay = EVENT_DAYS[dayIndex];
  const [startStr, endStr] = time.split('–').map((s) => s.trim());
  if (!eventDay || !startStr || !endStr) return null;
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return null;
  return {
    start: new Date(eventDay.year, eventDay.month - 1, eventDay.day, sh, sm),
    end: new Date(eventDay.year, eventDay.month - 1, eventDay.day, eh, em),
  };
};

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ lang }) => {
  const t = translations[lang].schedule;
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const todayIdx = getTodayEventDayIndex();
    return todayIdx >= 0 ? todayIdx : 0;
  });
  const [now, setNow] = useState<Date>(() => new Date());
  const switcherRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerHidden = useHeaderVisibility();
  // Once the reader taps a day tab themselves, stop overriding their choice
  // — only the still-on-"today" default should keep tracking the calendar.
  const hasManuallySelectedDay = useRef(false);

  // Keeps the "happening now" border current, and lets a tester watch it
  // update live after nudging their device clock forward. Also keeps the
  // default day tab in sync if the calendar day rolls over while the page
  // is left open (e.g. across midnight) instead of only computing it once
  // at mount.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
      if (!hasManuallySelectedDay.current) {
        const todayIdx = getTodayEventDayIndex();
        if (todayIdx >= 0) setSelectedDayIndex(todayIdx);
      }
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Switching days keeps the tab bar sticky under the header, but a reader
  // who scrolled deep into a long day's items would otherwise land mid-way
  // through the newly selected day. Snap back to the top of the timeline
  // only when the click happened while already scrolled past it.
  const handleSelectDay = (idx: number) => {
    hasManuallySelectedDay.current = true;
    setSelectedDayIndex(idx);
    requestAnimationFrame(() => {
      const switcherEl = switcherRef.current;
      const timelineEl = timelineRef.current;
      if (!switcherEl || !timelineEl) return;
      // Reaching this branch always means scrolling upward, and the header
      // reveals itself on any upward scroll — so by the time it settles the
      // switcher will be pinned below the header again, not wherever it was
      // (possibly at top-0, header hidden) at click time. Use the header's
      // own rendered height rather than the switcher's current position,
      // which would otherwise undershoot the target while the header is
      // hidden and leave the timeline's top edge covered.
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl?.getBoundingClientRect().height ?? 80;
      const switcherHeight = switcherEl.getBoundingClientRect().height;
      const offset = headerHeight + switcherHeight + 16;
      const target = timelineEl.getBoundingClientRect().top + window.scrollY - offset;
      if (window.scrollY > target) {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    });
  };

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
          labelEn: 'FIRE PIT',
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
    // overflow-anchor:none disables CSS scroll anchoring for this whole
    // section: switching days swaps in a completely different item
    // count/set below, and the browser's anchor heuristic otherwise
    // mis-picks a reference node and scrolls the page far off after reflow.
    <section id="plan" className="py-28 bg-transparent relative [overflow-anchor:none]">
      {/* Dark Ambient Gradient Blobs - clipped by their own wrapper (not the
          section) so this stays clipped without constraining the sticky day
          switcher below, which needs the section as its unclipped container. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] bg-[#16202B]/60 rounded-full blur-[150px]" />
        <div className="absolute -bottom-24 -right-40 w-[450px] h-[450px] bg-[#1E2938]/40 rounded-full blur-[130px]" />
      </div>

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

        {/* Day Switcher Cards - Borderless. Always 3 columns, even at 360px:
            mobile leads with "Dzień 1/2/3" (more useful than repeating the
            month) and a short "12 Lis" date underneath; full weekday name,
            date and the theme line only reappear from `sm` up. Sticks below
            the fixed header while scrolling so switching days stays within
            reach, and rises to the very top when the header slides away so
            it doesn't leave a gap behind. */}
        <div
          ref={switcherRef}
          className={`sticky z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mb-8 sm:mb-12 bg-[#121820]/95 backdrop-blur-xl shadow-xl transition-[top] duration-300 ${
            headerHidden ? 'top-0' : 'top-[72px] sm:top-[80px]'
          }`}
        >
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-5xl mx-auto">
          {t.days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const weekdayLabel = day.date.includes('(')
              ? day.date.split('(')[1].replace(')', '')
              : day.dayName;
            const dayLabel = lang === 'pl' ? `Dzień ${idx + 1}` : `Day ${idx + 1}`;
            const dateWithoutWeekday = day.date.includes('(') ? day.date.split('(')[0].trim() : day.date;
            const dayNumber = day.date.match(/\d+/)?.[0] ?? '';
            const monthWord = dateWithoutWeekday.split(' ').find((w) => !/\d/.test(w)) ?? '';
            const shortDate = `${dayNumber} ${monthWord.slice(0, 3)}`;
            return (
              <button
                key={idx}
                onClick={() => handleSelectDay(idx)}
                className={`text-center sm:text-left p-3 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden shadow-xl ${
                  isSelected
                    ? 'bg-[#1E2937] shadow-2xl scale-[1.02]'
                    : 'bg-[#18212C] hover:bg-[#1C2633]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-[#E3E6DB]" />
                )}
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <span
                    className={`font-mono-code text-xs font-bold uppercase tracking-wider ${
                      isSelected ? 'text-[#E3E6DB]' : 'text-[#E3E6DB]/50'
                    }`}
                  >
                    // {lang === 'pl' ? `DZIEŃ 0${idx + 1}` : `DAY 0${idx + 1}`}
                  </span>
                  <span
                    className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#3E4C5E] text-[#E3E6DB]' : 'bg-[#253242] text-[#E3E6DB]/60'
                    }`}
                  >
                    {dateWithoutWeekday}
                  </span>
                </div>
                <h4 className="font-bebas text-lg sm:text-2xl md:text-3xl text-[#E3E6DB] tracking-wide uppercase">
                  <span className="sm:hidden">{dayLabel}</span>
                  <span className="hidden sm:inline">{weekdayLabel}</span>
                </h4>
                <span
                  className={`sm:hidden mt-1 inline-block text-[10px] font-mono-code px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#3E4C5E] text-[#E3E6DB]' : 'bg-[#253242] text-[#E3E6DB]/60'
                  }`}
                >
                  {shortDate}
                </span>
                <p className="hidden sm:block text-xs font-mono-code text-[#E3E6DB]/60 truncate mt-1">
                  {day.theme}
                </p>
              </button>
            );
          })}
        </div>
        </div>

        {/* Active Day Timeline Container - Borderless */}
        <div ref={timelineRef} className="max-w-5xl mx-auto bg-[#18212C] rounded-3xl p-6 sm:p-10 shadow-2xl">
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
              const typeBadge = getBadgeForType(item.type);
              const badgeLabel = item.badge ?? (lang === 'pl' ? typeBadge.labelPl : typeBadge.labelEn);

              // Plain "session" items (no title-specific override) are the core
              // teaching blocks, so they get the strongest card background.
              // Groups and Prayer share the same middle-ground background;
              // everything else keeps the plain background. Titles stay at
              // full brightness everywhere.
              const isMainSession = item.type === 'session' && !item.badge;
              const groupsLabel = lang === 'pl' ? 'GRUPY' : 'GROUPS';
              const prayerLabel = lang === 'pl' ? 'MODLITWA' : 'PRAYER';
              const isGroups = badgeLabel.toUpperCase() === groupsLabel;
              const isPrayer = badgeLabel.toUpperCase() === prayerLabel;

              const cardBg = isMainSession
                ? 'bg-[#2C3B4E] hover:bg-[#324259]'
                : isGroups || isPrayer
                ? 'bg-[#253243] hover:bg-[#2B394C]'
                : 'bg-[#1E2937]/70 hover:bg-[#232F3F]';

              const itemRange = parseItemRange(selectedDayIndex, item.time);
              const isLiveNow = !!itemRange && now >= itemRange.start && now < itemRange.end;

              return (
                <div
                  key={itemIdx}
                  className={`group relative flex flex-col md:flex-row md:items-start gap-4 p-5 sm:p-6 rounded-2xl transition-all shadow-md border-2 ${cardBg} ${
                    isLiveNow
                      ? 'border-[#E3E6DB] shadow-[0_0_25px_-6px_rgba(227,230,219,0.55)]'
                      : 'border-transparent'
                  }`}
                >
                  {/* Time & Badge */}
                  <div className="flex items-center gap-3 flex-wrap md:flex-nowrap md:w-72 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#293648] text-[#E3E6DB] font-mono-code text-xs font-bold whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-[#E3E6DB]/70 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono-code text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${typeBadge.bg}`}
                    >
                      {typeBadge.icon}
                      <span>{badgeLabel}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1">
                    <h4 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase text-[#E3E6DB]">
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
