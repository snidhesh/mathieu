import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/motion/FadeIn';

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
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('title'),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: '/en/privacy', fr: '/fr/privacy' },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('privacy');

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {t('title')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-6 font-sans font-light text-4xl lg:text-5xl leading-[1.05] text-porcelain tracking-tight">
              {t('title')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-porcelain-dim">
              {t('updatedAt')}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hairline w-40 mt-10" />
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-12 space-y-6 text-porcelain-dim leading-relaxed whitespace-pre-line">
              {t('body')}
            </div>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="mt-12 text-sm text-porcelain-dim leading-relaxed">
              {t('contact')}
            </p>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
