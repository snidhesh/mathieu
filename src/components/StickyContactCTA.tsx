'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { ContactForm } from './ContactForm';

// Floating "Let's Connect" pill anchored bottom-right.
// Fades in once the user has scrolled past the hero (~350px).
// Hidden on /contact because the page IS the contact form.
// Clicking opens the same modal used elsewhere in the site.

export function StickyContactCTA() {
  const t = useTranslations('contact.modal');
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  // Show once the user has scrolled past 60% of the page's scrollable height.
  // Re-checked on scroll AND resize so images loading / mobile URL-bar shifts
  // recompute the threshold naturally.
  useEffect(() => {
    const check = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // Very short pages (no scroll room) — never show
      if (scrollable < 50) {
        setVisible(false);
        return;
      }
      setVisible(window.scrollY / scrollable >= 0.6);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Modal escape + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Hide entirely on /contact routes
  if (pathname.startsWith('/contact')) return null;

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-500 ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('trigger')}
          className="group inline-flex items-center gap-3 text-[11px] sm:text-[12px] tracking-[0.28em] uppercase px-6 py-4 sm:px-8 sm:py-5 bg-obsidian/90 backdrop-blur-md border border-porcelain text-porcelain hover:bg-porcelain hover:text-obsidian transition-colors shadow-2xl shadow-obsidian/60"
        >
          <MessageIcon />
          <span>{t('trigger')}</span>
          <span
            className="text-lg transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sticky-contact-title"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label={t('close')}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-obsidian/85 backdrop-blur-sm cursor-default"
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-2xl my-8 bg-charcoal border border-porcelain-dim/25 p-8 sm:p-12">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center text-porcelain-dim hover:text-porcelain transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M6 6 L18 18 M18 6 L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {t('trigger')}
            </p>
            <h2
              id="sticky-contact-title"
              className="mt-4 font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight max-w-md"
            >
              {t('title')}
            </h2>
            <p className="mt-4 text-porcelain-dim leading-relaxed max-w-md">
              {t('subtitle')}
            </p>

            <div className="hairline w-24 mt-8" />

            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        d="M4 6 h16 v11 h-9 l-4 3 v-3 h-3 z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
