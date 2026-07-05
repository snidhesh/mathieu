// Single source of truth for the site's public origin.
// Prod: NEXT_PUBLIC_SITE_URL. Vercel preview: auto-injected VERCEL_URL.
// Local: falls back to localhost.

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000')
  );
}

// Trailing-slash-stripped absolute URL builder for schema/sitemap use.
export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export const AGENT = {
  name: 'Mathieu Poissonnet',
  email: 'mathieu.poissonnet@gmail.com',
  phoneE164: '+971585586265',
  linkedin:
    'https://www.linkedin.com/in/mathieu-poissonnet-671b8a2b2',
  brokerage: 'BlackOak Real Estate',
  city: 'Dubai',
  countryCode: 'AE',
  languages: ['en', 'fr'],
  areasServed: [
    'Palm Jumeirah',
    'Downtown Dubai',
    'Emirates Hills',
    'Dubai Harbour',
    'Palm Jebel Ali',
    'Emaar Beachfront',
  ],
} as const;
