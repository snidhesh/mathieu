'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WhatsAppButton } from './WhatsAppButton';

type NavLink = {
  href: string;
  label: string;
};

export function Nav() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: NavLink[] = [
    { href: '/properties', label: t('properties') },
    { href: '/communities', label: t('communities') },
    { href: '/insights', label: t('insights') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/contact', label: t('contact') },
  ];

  const agentName = process.env.NEXT_PUBLIC_AGENT_NAME ?? 'Mathieu Poissonnet';

  // Escape + body-scroll lock while mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-obsidian/70 border-b border-porcelain-dim/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-3 sm:gap-6">
          <Link
            href="/"
            className="font-display text-base sm:text-lg tracking-[0.05em] text-porcelain hover:text-porcelain-dim transition-colors truncate max-w-[55%] sm:max-w-none"
          >
            {agentName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-porcelain transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3 sm:gap-5">
            <LocaleSwitcher />
            <div className="hidden md:block">
              <WhatsAppButton variant="nav" />
            </div>
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-porcelain hover:text-porcelain-dim transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path
                  d="M4 7 h16 M4 12 h16 M4 17 h16"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] lg:hidden bg-obsidian"
          role="dialog"
          aria-modal="true"
          aria-label={agentName}
        >
          <div className="h-full flex flex-col">
            {/* Bar mirroring the top nav */}
            <div className="flex items-center justify-between h-16 px-5 sm:px-6 border-b border-porcelain-dim/15">
              <span className="font-display text-base sm:text-lg tracking-[0.05em] text-porcelain">
                {agentName}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-10 h-10 -mr-2 text-porcelain hover:text-porcelain-dim transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <path d="M6 6 L18 18 M18 6 L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Links — centered vertically */}
            <nav className="flex-1 overflow-y-auto flex flex-col justify-center gap-6 px-6 py-10">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center gap-6 text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  <span className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim group-hover:text-porcelain transition-colors">
                    0{i + 1}
                  </span>
                  <span className="font-sans font-light text-3xl sm:text-4xl leading-tight tracking-tight">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Footer of mobile menu — WhatsApp + Locale */}
            <div className="px-5 sm:px-6 py-6 border-t border-porcelain-dim/15 flex items-center justify-between gap-4">
              <LocaleSwitcher />
              <div onClick={() => setMobileOpen(false)}>
                <WhatsAppButton variant="nav" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
