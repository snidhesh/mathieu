'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { whatsappHref } from '@/lib/formatters';
import { Dropdown } from './Dropdown';

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  onSuccess,
  className,
}: {
  subject?: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const t = useTranslations('contact.form');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // hidden bot trap
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = t('errors.name');
    if (!email.trim()) next.email = t('errors.email');
    else if (!emailRe.test(email)) next.email = t('errors.emailInvalid');
    if (!message.trim()) next.message = t('errors.message');
    else if (message.trim().length < 20) next.message = t('errors.messageShort');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          interest: interest ? t(`interestOptions.${interest}`) : undefined,
          message,
          hp: honeypot,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      onSuccess?.();
    } catch (err) {
      console.error('Contact submission failed', err);
      setStatus('error');
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setInterest('');
    setMessage('');
    setHoneypot('');
    setErrors({});
    setStatus('idle');
  };

  const composedForWa = () => {
    const parts = [
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      interest && `Interest: ${t(`interestOptions.${interest}`)}`,
      message && `\n${message}`,
    ].filter(Boolean) as string[];
    return parts.join('\n');
  };

  if (status === 'sent') {
    return (
      <SuccessState
        onReset={reset}
        waHref={whatsappHref(whatsappNumber, composedForWa() || undefined)}
        className={className}
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        onReset={() => setStatus('idle')}
        waHref={whatsappHref(whatsappNumber, composedForWa() || undefined)}
        className={className}
      />
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className={`grid gap-6 lg:grid-cols-2 ${className ?? ''}`}
    >
      <Field
        label={t('name')}
        value={name}
        onChange={(v) => {
          setName(v);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        error={errors.name}
        autoComplete="name"
        required
      />
      <Field
        label={t('email')}
        type="email"
        value={email}
        onChange={(v) => {
          setEmail(v);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
        error={errors.email}
        autoComplete="email"
        required
      />
      <div className="lg:col-span-2">
        <Field
          label={t('phone')}
          value={phone}
          onChange={setPhone}
          autoComplete="tel"
        />
      </div>

      <div className="lg:col-span-2">
        <Dropdown
          value={interest}
          onChange={setInterest}
          label={t('interest')}
          placeholder={t('interestPlaceholder')}
          options={(['offplan', 'ready', 'investment', 'other'] as const).map(
            (k) => ({ value: k, label: t(`interestOptions.${k}`) }),
          )}
        />
      </div>

      <div className="lg:col-span-2">
        <label className="block text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mb-3">
          {t('message')}
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder={t('messagePlaceholder')}
          rows={5}
          className={`w-full bg-transparent border outline-none px-4 py-3 text-porcelain placeholder:text-porcelain-dim/50 transition-colors resize-none ${
            errors.message
              ? 'border-red-400/70 focus:border-red-300'
              : 'border-porcelain-dim/40 focus:border-porcelain'
          }`}
        />
        {errors.message && (
          <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — kept in the accessibility tree at zero size so bots that
          crawl the form still see it, but visually hidden from real users. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
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

      <div className="lg:col-span-2 flex flex-wrap items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase px-8 py-4 bg-porcelain text-obsidian hover:bg-porcelain-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? t('submitting') : t('submit')}
        </button>
        <a
          href={whatsappHref(whatsappNumber, message || undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase px-8 py-4 border border-porcelain-dim/60 text-porcelain hover:border-porcelain transition-colors"
        >
          {t('whatsappCta')}
        </a>
      </div>
    </form>
  );
}

function SuccessState({
  onReset,
  waHref,
  className,
}: {
  onReset: () => void;
  waHref: string;
  className?: string;
}) {
  const t = useTranslations('contact.form.success');
  return (
    <div className={`text-center py-12 ${className ?? ''}`}>
      <div className="mx-auto max-w-md">
        <div
          className="mx-auto mb-8 h-14 w-14 border border-porcelain rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-porcelain"
          >
            <path
              d="M4 12 l 5 5 l 11 -12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-sans font-light text-3xl lg:text-4xl text-porcelain leading-tight tracking-tight">
          {t('title')}
        </h3>
        <p className="mt-6 text-porcelain-dim leading-relaxed">{t('body')}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase px-8 py-4 border border-porcelain-dim/60 text-porcelain hover:border-porcelain transition-colors"
          >
            {t('wa')}
          </a>
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
          >
            {t('reset')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  onReset,
  waHref,
  className,
}: {
  onReset: () => void;
  waHref: string;
  className?: string;
}) {
  const t = useTranslations('contact.form.error');
  return (
    <div className={`text-center py-12 ${className ?? ''}`}>
      <div className="mx-auto max-w-md">
        <div
          className="mx-auto mb-8 h-14 w-14 border border-red-300/70 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-red-300"
          >
            <path d="M12 8 v5 M12 16.5 v0.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <h3 className="font-sans font-light text-3xl lg:text-4xl text-porcelain leading-tight tracking-tight">
          {t('title')}
        </h3>
        <p className="mt-6 text-porcelain-dim leading-relaxed">{t('body')}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase px-8 py-4 bg-porcelain text-obsidian hover:bg-porcelain-dim transition-colors"
          >
            {t('wa')}
          </a>
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mb-3">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        className={`w-full bg-transparent border-b outline-none px-1 py-2 text-porcelain transition-colors ${
          error
            ? 'border-red-400/70 focus:border-red-300'
            : 'border-porcelain-dim/40 focus:border-porcelain'
        }`}
      />
      {error && (
        <p className="mt-2 text-[11px] tracking-[0.15em] uppercase text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
