'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type DropdownOption = {
  value: string;
  label: string;
};

export function Dropdown({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select…',
}: {
  value: string;
  onChange: (v: string) => void;
  options: DropdownOption[];
  label: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mb-3">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="w-full flex items-center justify-between gap-3 bg-transparent border-b border-porcelain-dim/40 hover:border-porcelain focus:border-porcelain outline-none px-1 py-2 text-left transition-colors"
      >
        <span className={selected ? 'text-porcelain' : 'text-porcelain-dim/60'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          viewBox="0 0 12 12"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-porcelain-dim transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <path d="M2 4 L6 8 L10 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 top-full mt-2 w-full bg-charcoal border border-porcelain-dim/25 py-2 shadow-2xl shadow-obsidian/50"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[12px] tracking-[0.15em] uppercase transition-colors ${
                    isSelected
                      ? 'text-porcelain bg-porcelain-dim/10'
                      : 'text-porcelain-dim hover:text-porcelain hover:bg-porcelain-dim/10'
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
