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
import { sortedInsights } from '@/lib/insights';

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
  const t = await getTranslations({ locale, namespace: 'insights.index' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/insights`,
      languages: { en: '/en/insights', fr: '/fr/insights' },
    },
  };
}

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

export default async function InsightsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('insights.index');
  const tDetail = await getTranslations('insights.detail');
  const tCat = await getTranslations('insights.categories');
  const tItems = await getTranslations('insights.items');

  const [featured, ...rest] = sortedInsights;

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* HERO */}
          <FadeIn>
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {t('eyebrow')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-6 font-sans font-light text-4xl lg:text-6xl leading-[1.05] text-porcelain tracking-tight max-w-3xl">
              {t('title')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-2xl">
              {t('subtitle')}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hairline w-40 mt-10" />
          </FadeIn>

          {/* FEATURED — first post gets a bigger card */}
          <FadeIn delay={0.35}>
            <Link
              href={`/insights/${featured.slug}`}
              className="group mt-16 grid gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className="relative aspect-[7/5] lg:col-span-7 overflow-hidden">
                <Image
                  src={featured.cover}
                  alt={tItems(`${featured.slug}.title`)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000"
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.28em] uppercase text-porcelain-dim">
                  <span className="text-porcelain">
                    {tCat(featured.category)}
                  </span>
                  <span className="text-porcelain-dim/50">·</span>
                  <span>{formatDate(featured.publishedAt, locale)}</span>
                  <span className="text-porcelain-dim/50 hidden sm:inline">·</span>
                  <span>
                    {featured.readMinutes} {tDetail('readTime')}
                  </span>
                </div>
                <h2 className="mt-6 font-sans font-light text-2xl lg:text-4xl text-porcelain leading-tight tracking-tight group-hover:text-porcelain-dim transition-colors">
                  {tItems(`${featured.slug}.title`)}
                </h2>
                <p className="mt-6 text-porcelain-dim leading-relaxed">
                  {tItems(`${featured.slug}.excerpt`)}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-porcelain">
                  Read →
                </span>
              </div>
            </Link>
          </FadeIn>

          {/* GRID */}
          <div className="mt-24 border-t border-porcelain-dim/20 pt-16">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {rest.map((insight, i) => (
                <FadeIn
                  key={insight.slug}
                  delay={i * 0.08}
                  className="h-full"
                >
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="group flex flex-col h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                      <Image
                        src={insight.cover}
                        alt={tItems(`${insight.slug}.title`)}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000"
                      />
                    </div>
                    <div className="mt-6 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tracking-[0.28em] uppercase text-porcelain-dim">
                        <span className="text-porcelain">
                          {tCat(insight.category)}
                        </span>
                        <span className="text-porcelain-dim/50">·</span>
                        <span>{formatDate(insight.publishedAt, locale)}</span>
                      </div>
                      <h2 className="mt-4 font-sans font-light text-xl lg:text-2xl text-porcelain leading-tight tracking-tight group-hover:text-porcelain-dim transition-colors">
                        {tItems(`${insight.slug}.title`)}
                      </h2>
                      <p className="mt-4 text-sm text-porcelain-dim leading-relaxed flex-1">
                        {tItems(`${insight.slug}.excerpt`)}
                      </p>
                      <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-porcelain-dim">
                        {insight.readMinutes} {tDetail('readTime')}
                      </p>
                    </div>
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
