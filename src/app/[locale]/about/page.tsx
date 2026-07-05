import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/motion/FadeIn';
import { DirhamSymbol } from '@/components/DirhamSymbol';

const experienceKeys = [
  'blackoak',
  'bwc',
  'huspy',
  'harveySmith',
  'gymnastics',
] as const;

const statKeys = ['placed', 'deals', 'years', 'communities'] as const;

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
  const t = await getTranslations({ locale, namespace: 'about.page' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('intro1'),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: '/en/about', fr: '/fr/about' },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('about.page');
  const philosophyParas = t('philosophyBody').split('\n\n');
  const partners = (t.raw('partners.list') as string[]) ?? [];

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* HERO */}
          <FadeIn>
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {t('eyebrow')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-6 font-sans font-light text-3xl lg:text-6xl leading-[1.05] text-porcelain tracking-tight max-w-4xl">
              {t('title')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-2xl">
              {t('intro1')}
            </p>
          </FadeIn>

          {/* STATS BLOCK — authority anchor near top */}
          <div className="mt-20 border-y border-porcelain-dim/20 py-14">
            <FadeIn>
              <div className="flex flex-wrap items-baseline justify-between gap-6 mb-10">
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {t('stats.heading')}
                </p>
                <p className="text-[11px] text-porcelain-dim max-w-sm">
                  {t('stats.subheading')}
                </p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {statKeys.map((key, i) => (
                <FadeIn key={key} delay={i * 0.06}>
                  <div>
                    <p className="font-display text-4xl lg:text-5xl text-porcelain tracking-[0.03em]">
                      {key === 'placed' && <DirhamSymbol />}
                      {t(`stats.items.${key}.value`)}
                    </p>
                    <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
                      {t(`stats.items.${key}.label`)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* PORTRAIT + PHILOSOPHY */}
          <div className="mt-20 lg:mt-32 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/portraits/agent-dubai.jpg"
                  alt="Mathieu Poissonnet in Dubai"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover grayscale-[70%]"
                />
              </div>
            </FadeIn>

            <div className="lg:col-span-7 space-y-10">
              <FadeIn delay={0.05}>
                <div>
                  <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                    {t('introHeading')}
                  </p>
                  <p className="mt-6 text-base lg:text-lg text-porcelain-dim leading-relaxed">
                    {t('intro2')}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                    {t('philosophyHeading')}
                  </p>
                  <div className="mt-6 space-y-6">
                    {philosophyParas.map((p, i) => (
                      <p
                        key={i}
                        className="text-base lg:text-lg text-porcelain-dim leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* CAREER TIMELINE */}
          <div className="mt-20 lg:mt-32">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('experienceHeading')}
              </p>
              <div className="hairline w-40 mt-6" />
            </FadeIn>

            <ol className="mt-12 space-y-10 max-w-4xl">
              {experienceKeys.map((key, i) => (
                <FadeIn key={key} delay={i * 0.05}>
                  <li className="grid gap-4 md:grid-cols-12 border-l border-porcelain-dim/40 pl-6">
                    <div className="md:col-span-3">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                        {t(`experience.${key}.period`)}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <p className="font-display text-xl text-porcelain tracking-[0.03em]">
                        {t(`experience.${key}.role`)}
                      </p>
                      <p className="mt-1 text-sm text-porcelain">
                        {t(`experience.${key}.company`)}
                      </p>
                      <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
                        {t(`experience.${key}.location`)}
                      </p>
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ol>
          </div>

          {/* DEVELOPER RELATIONSHIPS — Kirman-style credibility strip */}
          <div className="mt-20 lg:mt-32">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('partners.heading')}
              </p>
              <div className="hairline w-40 mt-6" />
              <p className="mt-8 text-porcelain-dim leading-relaxed max-w-2xl">
                {t('partners.subheading')}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <ul className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-6">
                {partners.map((name) => (
                  <li
                    key={name}
                    className="font-display text-2xl lg:text-3xl text-porcelain tracking-[0.05em]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* LANGUAGES */}
          <div className="mt-20 lg:mt-32 max-w-4xl">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('languagesHeading')}
              </p>
              <div className="hairline w-40 mt-6" />
              <p className="mt-8 text-base lg:text-lg text-porcelain-dim leading-relaxed">
                {t('languagesBody')}
              </p>
            </FadeIn>
          </div>

          {/* DUAL-PATHWAY CTA */}
          <div className="mt-20 lg:mt-32">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('pathways.heading')}
              </p>
              <div className="hairline w-40 mt-6" />
            </FadeIn>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {(['talk', 'browse'] as const).map((key, i) => (
                <FadeIn key={key} delay={i * 0.08}>
                  <Link
                    href={key === 'talk' ? '/contact' : '/properties'}
                    className="group block border border-porcelain-dim/25 hover:border-porcelain p-10 h-full transition-colors"
                  >
                    <p className="font-display text-2xl text-porcelain tracking-[0.05em]">
                      {t(`pathways.${key}.eyebrow`)}
                    </p>
                    <h3 className="mt-8 font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight">
                      {t(`pathways.${key}.heading`)}
                    </h3>
                    <p className="mt-4 text-porcelain-dim leading-relaxed">
                      {t(`pathways.${key}.body`)}
                    </p>
                    <p className="mt-10 text-[11px] tracking-[0.25em] uppercase text-porcelain group-hover:text-porcelain-dim transition-colors">
                      {t(`pathways.${key}.cta`)} →
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
