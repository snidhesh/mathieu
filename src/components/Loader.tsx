'use client';

import { useEffect, useState } from 'react';

// Full-screen splash on first visit. Types "Mathieu Poissonnet" character
// by character with a terminal-style blinking cursor, then fades out.
// Suppressed for the rest of the browser session via sessionStorage.

const NAME = 'Mathieu Poissonnet';
const KEY = 'loader-shown';
const CHAR_MS = 90; // per-character delay
const HOLD_MS = 700; // hold after typing before fade
const FADE_MS = 600; // fade-out duration

type Phase = 'idle' | 'typing' | 'holding' | 'fading' | 'done';

export function Loader() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [text, setText] = useState('');

  useEffect(() => {
    // Skip if we've already shown the loader this session
    try {
      if (sessionStorage.getItem(KEY)) {
        setPhase('done');
        return;
      }
    } catch {
      /* private-mode: fall through and just show it */
    }

    setPhase('typing');

    let cancelled = false;
    let i = 0;
    let holdTimer: number | undefined;
    let fadeTimer: number | undefined;
    let doneTimer: number | undefined;

    const tick = () => {
      if (cancelled) return;
      if (i <= NAME.length) {
        setText(NAME.slice(0, i));
        i++;
        window.setTimeout(tick, CHAR_MS);
      } else {
        setPhase('holding');
        holdTimer = window.setTimeout(() => {
          if (cancelled) return;
          setPhase('fading');
          fadeTimer = window.setTimeout(() => {
            if (cancelled) return;
            setPhase('done');
            try {
              sessionStorage.setItem(KEY, '1');
            } catch {
              /* private-mode: no-op */
            }
          }, FADE_MS);
        }, HOLD_MS);
      }
    };
    tick();

    return () => {
      cancelled = true;
      if (holdTimer) window.clearTimeout(holdTimer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, []);

  // Lock body scroll while the loader is up so background doesn't sneak past
  useEffect(() => {
    if (phase === 'idle' || phase === 'typing' || phase === 'holding') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden={phase === 'fading'}
      role="status"
      className={`fixed inset-0 z-[200] flex items-center justify-center px-6 bg-obsidian transition-opacity duration-500 ease-out ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-baseline gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="font-display text-lg sm:text-2xl md:text-3xl tracking-[0.35em] uppercase text-porcelain-dim/60 select-none"
        >
          &gt;
        </span>
        <span className="font-display text-xl sm:text-3xl md:text-5xl tracking-[0.1em] uppercase text-porcelain whitespace-pre">
          {text}
        </span>
        <span
          aria-hidden="true"
          className="inline-block w-[2px] sm:w-[3px] bg-porcelain self-stretch loader-cursor"
        />
      </div>
      <span className="sr-only">{NAME}</span>
    </div>
  );
}
