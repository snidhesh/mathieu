'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'email' | 'consent', string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePrivacyUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

const externalPrivacyUrl = validatePrivacyUrl(
  process.env.NEXT_PUBLIC_PRIVACY_URL,
);

export function MarketIntelForm({ className }: { className?: string }) {
  const t = useTranslations('marketIntelligence.form');
  const locale = useLocale();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = (): boolean => {
    const next: Errors = {};
    if (!email.trim()) next.email = t('errors.email');
    else if (!emailRe.test(email.trim())) next.email = t('errors.emailInvalid');
    if (!consent) next.consent = t('errors.consent');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/market-intel-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          consent,
          locale,
          hp: honeypot,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch (err) {
      console.error('Market intel submission failed', err);
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className={`text-center py-10 ${className ?? ''}`}>
        <h3 className="font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight">
          {t('success.title')}
        </h3>
        <p className="mt-4 text-porcelain-dim leading-relaxed">
          {t('success.body')}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`text-center py-10 ${className ?? ''}`}>
        <h3 className="font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight">
          {t('error.title')}
        </h3>
        <p className="mt-4 text-porcelain-dim leading-relaxed">
          {t('error.body')}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
        >
          {t('error.retry')}
        </button>
      </div>
    );
  }

  const privacyContent = (
    <span className="underline underline-offset-4 hover:text-porcelain">
      {t('privacyLink')}
    </span>
  );

  const privacyEl = externalPrivacyUrl ? (
    <a
      href={externalPrivacyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-porcelain-dim hover:text-porcelain transition-colors"
    >
      {privacyContent}
    </a>
  ) : (
    <Link
      href="/privacy"
      className="text-porcelain-dim hover:text-porcelain transition-colors"
    >
      {privacyContent}
    </Link>
  );

  return (
    <form
      onSubmit={submit}
      noValidate
      className={`grid gap-6 lg:grid-cols-2 ${className ?? ''}`}
    >
      <div>
        <label className="block text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mb-3">
          {t('email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          autoComplete="email"
          required
          maxLength={320}
          aria-invalid={errors.email ? true : undefined}
          className={`w-full bg-transparent border-b outline-none px-1 py-2 text-porcelain transition-colors ${
            errors.email
              ? 'border-red-400/70 focus:border-red-300'
              : 'border-porcelain-dim/40 focus:border-porcelain'
          }`}
        />
        {errors.email && (
          <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-red-300">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mb-3">
          {t('firstName')}
        </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          maxLength={100}
          className="w-full bg-transparent border-b border-porcelain-dim/40 focus:border-porcelain outline-none px-1 py-2 text-porcelain transition-colors"
        />
      </div>

      <div className="lg:col-span-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent)
                setErrors({ ...errors, consent: undefined });
            }}
            required
            className="mt-1 accent-porcelain"
          />
          <span className="text-sm text-porcelain-dim leading-relaxed">
            {t('consent')} {privacyEl}
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-red-300">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden via class (no inline style), not in a11y tree, unfocusable. */}
      <div aria-hidden="true" className="sr-only-offscreen">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div className="lg:col-span-2 pt-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase px-8 py-4 bg-porcelain text-obsidian hover:bg-porcelain-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
