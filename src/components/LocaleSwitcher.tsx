'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const flagLabels: Record<string, string> = {
  en: 'English',
  fr: 'Français',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className="flex items-center gap-3"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code, idx) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => switchTo(code)}
              disabled={isPending || active}
              aria-label={flagLabels[code] ?? code}
              aria-current={active ? 'true' : undefined}
              title={flagLabels[code] ?? code}
              className={`inline-flex items-center justify-center transition-all duration-200 ${
                active
                  ? 'ring-1 ring-porcelain ring-offset-2 ring-offset-obsidian cursor-default'
                  : 'opacity-55 hover:opacity-100'
              }`}
            >
              <Flag code={code} />
            </button>
            {idx < routing.locales.length - 1 && (
              <span
                className="text-porcelain-dim/60 text-xs select-none"
                aria-hidden="true"
              >
                /
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Flag({ code }: { code: string }) {
  if (code === 'en') return <UkFlag />;
  if (code === 'fr') return <FrFlag />;
  return null;
}

// Simplified Union Jack — recognisable at 22×14 without the full Northern
// Ireland Saltire offset, which reads as noise at small sizes.
function UkFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      width="22"
      height="14"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect width="60" height="40" fill="#012169" />
      {/* White diagonals (Saltire) */}
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#ffffff" strokeWidth="8" />
      {/* Red diagonals (St Patrick) */}
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="3" />
      {/* White cross (St George white edge) */}
      <path d="M30 0 v40 M0 20 h60" stroke="#ffffff" strokeWidth="10" />
      {/* Red cross (St George) */}
      <path d="M30 0 v40 M0 20 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function FrFlag() {
  return (
    <svg
      viewBox="0 0 60 40"
      width="22"
      height="14"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect width="20" height="40" fill="#002395" />
      <rect x="20" width="20" height="40" fill="#ffffff" />
      <rect x="40" width="20" height="40" fill="#ED2939" />
    </svg>
  );
}
