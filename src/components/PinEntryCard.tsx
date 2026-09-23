import React from 'react';
import { Lock, Timer } from 'lucide-react';
import { usePinGate } from '../hooks/usePinGate';

interface PinEntryCardProps {
  prompt: string;
  errorText: string;
  lockedText: string;
  pinGate: ReturnType<typeof usePinGate>;
}

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const PinEntryCard: React.FC<PinEntryCardProps> = ({ prompt, errorText, lockedText, pinGate }) => {
  const { digits, error, locked, lockRemainingSeconds, inputRefs, setDigit, handleKeyDown, handlePaste } = pinGate;

  return (
    <div className="max-w-sm mx-auto bg-[#18212C] rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[#253242] flex items-center justify-center">
        {locked ? (
          <Timer className="w-6 h-6 text-[#E3E6DB]" />
        ) : (
          <Lock className="w-6 h-6 text-[#E3E6DB]" />
        )}
      </div>
      <p className="text-sm font-mono-code text-[#E3E6DB]/70 uppercase tracking-wider mb-6">
        {locked ? lockedText.replace('{time}', formatTime(lockRemainingSeconds)) : prompt}
      </p>
      <div className="flex items-center justify-center gap-3 mb-4">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={locked}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`w-14 h-16 text-center font-bebas text-3xl rounded-2xl bg-[#1E2937] text-[#E3E6DB] border-2 transition-colors focus:outline-none disabled:opacity-40 ${
              error ? 'border-red-500/70' : 'border-[#3E4C5E]/40 focus:border-[#E3E6DB]/60'
            }`}
          />
        ))}
      </div>
      {error && !locked && (
        <p className="text-xs font-mono-code text-red-400/90 uppercase tracking-wider">
          {errorText}
        </p>
      )}
    </div>
  );
};
