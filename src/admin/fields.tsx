// Small form building blocks for the admin panel, in the site's colours.
import React from 'react';
import type { Bilingual } from './model';

export const inputClass =
  'w-full bg-[#121820] border border-[#3E4C5E]/60 rounded-lg px-2.5 py-1.5 text-sm text-[#E3E6DB] placeholder:text-[#E3E6DB]/30 focus:outline-none focus:border-[#E3E6DB]/60';

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#E3E6DB]/50 mb-1">{children}</span>
);

export const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', multiline }) => (
  <label className="block min-w-0">
    <Label>{label}</Label>
    {multiline ? (
      <textarea
        className={`${inputClass} min-h-[60px] resize-y`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input className={inputClass} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    )}
  </label>
);

/** PL and EN versions of one text side by side (stacked on narrow screens). */
export const BiField: React.FC<{
  label: string;
  value: Bilingual;
  onChange: (v: Bilingual) => void;
  multiline?: boolean;
  enHint?: boolean;
}> = ({ label, value, onChange, multiline, enHint = true }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <TextField label={`${label} PL`} value={value.pl} multiline={multiline} onChange={(pl) => onChange({ ...value, pl })} />
    <TextField
      label={`${label} EN`}
      value={value.en}
      multiline={multiline}
      placeholder={enHint && value.pl ? 'puste = tekst PL' : undefined}
      onChange={(en) => onChange({ ...value, en })}
    />
  </div>
);

export const SmallButton: React.FC<{
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}> = ({ onClick, title, children, danger, disabled }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-1 h-8 min-w-8 px-2 rounded-lg text-xs font-mono-code font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
      danger ? 'bg-[#3A2328] text-[#F2B8B5] hover:bg-[#4A2A30]' : 'bg-[#253242] text-[#E3E6DB]/80 hover:bg-[#2E3D51]'
    }`}
  >
    {children}
  </button>
);

export const PrimaryButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ onClick, children, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E3E6DB] hover:bg-white text-[#121820] font-mono-code text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

/** Moves an element of a list up (-1) or down (+1). */
export const move = <T,>(list: T[], index: number, dir: -1 | 1): T[] => {
  const j = index + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
};

// <input type="time"> works with "09:30"; the plan writes "9:30" (and
// midnight as "00:00").
export const toTimeInput = (t: string) => (/^\d:\d{2}$/.test(t) ? `0${t}` : t);
export const fromTimeInput = (t: string) => (t.startsWith('0') && !t.startsWith('00') ? t.slice(1) : t);
