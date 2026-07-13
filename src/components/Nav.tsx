'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';
import { WhatsAppButton } from './WhatsAppButton';

type NavItem = {
  label: string;
  // Standalone item → provide `href`.
  // Group (container-only parent) → omit `href` and provide `children`.
  href?: string;
  children?: NavItem[];
};

export function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Clicking the logotype while already on the homepage should smooth-scroll
  // to the top rather than no-op (Next.js suppresses same-URL navigations).
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const items: NavItem[] = [
    { href: '/properties', label: t('properties') },
    { href: '/projects', label: t('projects') },
    { href: '/communities', label: t('communities') },
    {
      label: t('theMarket'),
      children: [
        { href: '/market-intelligence', label: t('marketIntelligence') },
        { href: '/insights', label: t('insights') },
      ],
    },
    {
      label: t('about'),
      children: [
        { href: '/about', label: t('aboutMe') },
        { href: '/services', label: t('services') },
      ],
    },
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
            onClick={handleLogoClick}
            className="font-display text-base sm:text-lg tracking-[0.05em] text-porcelain hover:text-porcelain-dim transition-colors truncate max-w-[55%] sm:max-w-none"
          >
            {agentName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
            {items.map((item, i) => (
              <DesktopNavItem key={item.href ?? `group-${i}`} item={item} />
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
            <nav className="flex-1 overflow-y-auto flex flex-col justify-center gap-5 px-6 py-10">
              {items.map((item, i) => (
                <MobileNavItem
                  key={item.href ?? `group-${i}`}
                  item={item}
                  index={i}
                  onNavigate={() => setMobileOpen(false)}
                />
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

// ─────────────────────────────────────────────────────────────
// Desktop item
//  - Standalone link → plain <Link>.
//  - Group (no href, has children) → <button> that toggles a
//    dropdown; hover also opens it for mouse users. Closes on
//    outside click, Escape, or child navigation.
// ─────────────────────────────────────────────────────────────
function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Standalone link.
  if (!item.children || item.children.length === 0) {
    if (!item.href) return null;
    return (
      <Link
        href={item.href}
        className="hover:text-porcelain transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  // Group — container-only parent + dropdown of child links.
  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 uppercase tracking-[0.2em] hover:text-porcelain transition-colors focus:text-porcelain outline-none"
      >
        {item.label}
        <svg
          viewBox="0 0 12 12"
          width="9"
          height="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`opacity-70 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <path d="M2 4 L6 8 L10 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3">
          <div
            role="menu"
            className="min-w-[220px] bg-obsidian/95 backdrop-blur-md border border-porcelain-dim/25 py-2 shadow-2xl shadow-obsidian/50"
          >
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href ?? '#'}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim hover:text-porcelain hover:bg-porcelain-dim/10 transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile item — top-level items get numbered labels. Groups
// render their label as a static heading (no link), with the
// child links stacked below and indented.
// ─────────────────────────────────────────────────────────────
function MobileNavItem({
  item,
  index,
  onNavigate,
}: {
  item: NavItem;
  index: number;
  onNavigate: () => void;
}) {
  const isGroup = !!item.children && item.children.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {isGroup ? (
        <div className="flex items-center gap-6">
          <span className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim">
            0{index + 1}
          </span>
          <span className="font-sans font-light text-3xl sm:text-4xl leading-tight tracking-tight text-porcelain">
            {item.label}
          </span>
        </div>
      ) : (
        item.href && (
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group flex items-center gap-6 text-porcelain hover:text-porcelain-dim transition-colors"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim group-hover:text-porcelain transition-colors">
              0{index + 1}
            </span>
            <span className="font-sans font-light text-3xl sm:text-4xl leading-tight tracking-tight">
              {item.label}
            </span>
          </Link>
        )
      )}
      {isGroup && item.children && (
        <div className="pl-[calc(11px+1.5rem)] flex flex-col gap-2">
          {item.children.map(
            (child) =>
              child.href && (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
                >
                  → {child.label}
                </Link>
              ),
          )}
        </div>
      )}
    </div>
  );
}
