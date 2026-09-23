import { useEffect, useRef, useState } from 'react';

// Shared across every PIN-gated view (Group Time, Translation): entering the
// code once unlocks all of them, since they use the same storage keys —
// including the attempt counter and lockout, so a lockout on one view also
// blocks the other.
export const PIN_CODE = '2611';
export const PIN_STORAGE_KEY = 'kuznia_pin_ok';

const ATTEMPTS_KEY = 'kuznia_pin_attempts';
const LOCKOUT_UNTIL_KEY = 'kuznia_pin_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

const readLockoutUntil = () => {
  const stored = Number(localStorage.getItem(LOCKOUT_UNTIL_KEY));
  return stored && stored > Date.now() ? stored : 0;
};

export function usePinGate() {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(PIN_STORAGE_KEY) === '1');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(() => readLockoutUntil());
  const [lockRemaining, setLockRemaining] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const locked = lockedUntil > Date.now();

  useEffect(() => {
    if (!unlocked && !locked) {
      inputRefs.current[0]?.focus();
    }
  }, [unlocked, locked]);

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const remaining = lockedUntil - Date.now();
      if (remaining <= 0) {
        setLockedUntil(0);
        setLockRemaining(0);
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      } else {
        setLockRemaining(remaining);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const registerFailedAttempt = () => {
    const attempts = Number(localStorage.getItem(ATTEMPTS_KEY) || '0') + 1;
    if (attempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      localStorage.setItem(LOCKOUT_UNTIL_KEY, String(until));
      localStorage.setItem(ATTEMPTS_KEY, '0');
      setLockedUntil(until);
    } else {
      localStorage.setItem(ATTEMPTS_KEY, String(attempts));
    }
  };

  const tryUnlock = (entered: string) => {
    if (entered === PIN_CODE) {
      localStorage.setItem(PIN_STORAGE_KEY, '1');
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
      setUnlocked(true);
    } else {
      registerFailedAttempt();
      setError(true);
      setDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const setDigit = (index: number, value: string) => {
    if (locked) return;
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(false);

    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      tryUnlock(next.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (locked) return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    const next = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    setError(false);
    if (pasted.length === 4) {
      tryUnlock(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  return {
    unlocked,
    digits,
    error,
    locked,
    lockRemainingSeconds: Math.ceil(lockRemaining / 1000),
    inputRefs,
    setDigit,
    handleKeyDown,
    handlePaste,
  };
}
