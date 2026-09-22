import { useEffect, useRef, useState } from 'react';

const HIDE_THRESHOLD = 100;

// Shared by the fixed Header and any sticky element positioned right below
// it (like the schedule's day switcher), so they slide away and back
// together instead of leaving a gap where the header used to be.
export function useHeaderVisibility() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < HIDE_THRESHOLD) {
        setHidden(false);
      } else {
        setHidden(currentY > lastScrollY.current);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return hidden;
}
