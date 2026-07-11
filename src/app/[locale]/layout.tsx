import type { Metadata } from 'next';
import { Julius_Sans_One, Source_Sans_3, Amiri } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { StickyContactCTA } from '@/components/StickyContactCTA';
import { Loader } from '@/components/Loader';
import { JsonLd } from '@/components/JsonLd';
import { rootGraph } from '@/lib/schema';
import '../globals.css';

const juliusSans = Julius_Sans_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-julius-sans-one',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  variable: '--font-source-sans-3',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-amiri',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'meta' });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `/${locale}`,
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', fr: '/fr' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${juliusSans.variable} ${sourceSans.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-obsidian text-porcelain flex flex-col">
        <NextIntlClientProvider locale={locale}>
          {children}
          <StickyContactCTA />
          <Loader />
          <JsonLd data={rootGraph(locale)} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
