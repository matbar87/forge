import React from 'react';
import { Language, translations } from '../translations';
import { CalendarDays, Users } from 'lucide-react';

interface EventTabBarProps {
  lang: Language;
  activeView: 'site' | 'group-time';
  onSelectPlan: () => void;
  onSelectGroupTime: () => void;
}

export const EventTabBar: React.FC<EventTabBarProps> = ({
  lang,
  activeView,
  onSelectPlan,
  onSelectGroupTime,
}) => {
  const t = translations[lang].nav;

  const tabClass = (active: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
      active ? 'text-[#E3E6DB]' : 'text-[#E3E6DB]/45 hover:text-[#E3E6DB]/70'
    }`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#18212C]/95 backdrop-blur-xl border-t border-[#3E4C5E]/30 shadow-2xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Event navigation"
    >
      <div className="max-w-md mx-auto flex items-stretch">
        <button onClick={onSelectPlan} className={tabClass(activeView === 'site')}>
          <CalendarDays className="w-5 h-5" />
          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider">
            {t.schedule}
          </span>
        </button>
        <button onClick={onSelectGroupTime} className={tabClass(activeView === 'group-time')}>
          <Users className="w-5 h-5" />
          <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider">
            {t.groupTime}
          </span>
        </button>
      </div>
    </nav>
  );
};
