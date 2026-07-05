'use client';

import { useTranslations } from 'next-intl';
import { whatsappHref } from '@/lib/formatters';

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function WhatsAppButton({
  variant = 'nav',
  className,
  message,
}: {
  variant?: 'nav' | 'primary' | 'ghost';
  className?: string;
  message?: string;
}) {
  const t = useTranslations('nav');
  const href = whatsappHref(whatsappNumber, message);

  const base =
    'inline-flex items-center gap-2 whitespace-nowrap transition-colors';

  const styles = {
    nav: 'text-[11px] tracking-[0.2em] uppercase px-4 py-2 border border-champagne-dim text-champagne hover:bg-champagne hover:text-obsidian',
    primary:
      'text-[12px] tracking-[0.25em] uppercase px-8 py-4 bg-champagne text-obsidian hover:bg-porcelain',
    ghost:
      'text-[11px] tracking-[0.2em] uppercase text-champagne hover:text-porcelain',
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles} ${className ?? ''}`}
    >
      <WhatsAppIcon />
      <span>{t('whatsapp')}</span>
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.37a9.96 9.96 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm5.83 14.09c-.24.68-1.42 1.32-1.97 1.4-.51.07-1.14.1-1.84-.12-.42-.13-.97-.31-1.66-.61-2.93-1.27-4.83-4.22-4.98-4.42-.15-.2-1.2-1.59-1.2-3.03 0-1.44.75-2.15 1.02-2.44.27-.29.6-.36.79-.36l.58.01c.19.01.44-.07.68.52.24.6.83 2.05.9 2.2.07.15.12.33.02.53-.09.19-.14.31-.28.48-.14.17-.3.38-.42.5-.14.14-.28.29-.12.57.16.28.7 1.15 1.5 1.86 1.03.91 1.9 1.19 2.18 1.33.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.63-.14.26.09 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.71-.17 1.4Z" />
    </svg>
  );
}
