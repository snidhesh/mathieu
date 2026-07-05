import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { FadeIn } from '@/components/motion/FadeIn';
import {
  getInsight,
  getRelatedInsights,
  insights,
} from '@/lib/insights';
import { JsonLd } from '@/components/JsonLd';
import { articleSchema, breadcrumb } from '@/lib/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    insights.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const insight = getInsight(slug);
  if (!insight) notFound();

  const t = await getTranslations({
    locale,
    namespace: `insights.items.${slug}`,
  });
  const title = t('title');
  const excerpt = t('excerpt');
  return {
    title: `${title} — Mathieu Poissonnet`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      url: `/${locale}/insights/${slug}`,
      images: [insight.cover],
      type: 'article',
    },
    alternates: {
      canonical: `/${locale}/insights/${slug}`,
      languages: {
        en: `/en/insights/${slug}`,
        fr: `/fr/insights/${slug}`,
      },
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

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const insight = getInsight(slug);
  if (!insight) notFound();

  const t = await getTranslations(`insights.items.${slug}`);
  const tDetail = await getTranslations('insights.detail');
  const tCat = await getTranslations('insights.categories');
  const tItems = await getTranslations('insights.items');

  const paragraphs = t('body').split('\n\n');
  const related = getRelatedInsights(insight.slug, 2);
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const articleTitle = t('title');
  const articleExcerpt = t('excerpt');

  return (
    <>
      <JsonLd
        data={articleSchema(insight, locale, articleTitle, articleExcerpt)}
      />
      <JsonLd
        data={breadcrumb([
          { name: 'Home', path: `/${locale}` },
          { name: tNav('insights'), path: `/${locale}/insights` },
          { name: articleTitle, path: `/${locale}/insights/${insight.slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* HERO — contained title + meta */}
        <section className="px-6 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <FadeIn>
              <Link
                href="/insights"
                className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
              >
                ← {tDetail('backTo')}
              </Link>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                <span className="text-porcelain">{tCat(insight.category)}</span>
                <span className="text-porcelain-dim/50 hidden sm:inline">·</span>
                <span>{formatDate(insight.publishedAt, locale)}</span>
                <span className="text-porcelain-dim/50 hidden sm:inline">·</span>
                <span>
                  {insight.readMinutes} {tDetail('readTime')}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="mt-8 font-sans font-light text-3xl lg:text-6xl leading-[1.08] text-porcelain tracking-tight">
                {t('title')}
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-10 font-italic italic text-xl lg:text-2xl text-porcelain-dim leading-snug">
                {t('lead')}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-10 text-[11px] tracking-[0.25em] uppercase text-porcelain">
                {tDetail('by')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* COVER — wider than the prose column */}
        <FadeIn delay={0.15} className="mt-16 px-6 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={insight.cover}
                alt={articleTitle}
                fill
                priority
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </FadeIn>

        {/* PROSE */}
        <section className="mt-16 lg:mt-24 px-6 lg:px-12">
          <div className="mx-auto max-w-2xl space-y-6">
            {paragraphs.map((para, i) => (
              <FadeIn key={i} delay={0.05 + i * 0.03}>
                <p className="text-base lg:text-lg text-porcelain-dim leading-[1.75]">
                  {para}
                </p>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* SHARE + CTA */}
        <section className="mt-20 lg:mt-32 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl border-t border-porcelain-dim/20 pt-14 grid gap-10 md:grid-cols-2 items-start">
            <div>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {tDetail('ctaHeading')}
              </p>
              <p className="mt-4 text-porcelain-dim leading-relaxed max-w-md">
                {tDetail('ctaBody')}
              </p>
              <div className="mt-8">
                <WhatsAppButton
                  variant="primary"
                  message={`${t('title')} — ${tDetail('ctaButton')}`}
                />
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain-dim">
                {tDetail('shareHeading')}
              </p>
              <div className="mt-6 flex md:justify-end gap-4 text-[11px] tracking-[0.25em] uppercase">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(t('title'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  {tDetail('shareWa')}
                </a>
                <span className="text-porcelain-dim/60">·</span>
                <a
                  href={`mailto:?subject=${encodeURIComponent(t('title'))}`}
                  className="text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  {tDetail('shareEmail')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-20 lg:mt-32 px-6 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('relatedHeading')}
                </p>
                <div className="hairline w-40 mt-6" />
              </FadeIn>
              <div className="mt-12 grid gap-10 md:grid-cols-2 items-stretch">
                {related.map((r, i) => (
                  <FadeIn key={r.slug} delay={i * 0.08} className="h-full">
                    <Link
                      href={`/insights/${r.slug}`}
                      className="group flex flex-col h-full"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                        <Image
                          src={r.cover}
                          alt={tItems(`${r.slug}.title`)}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000"
                        />
                      </div>
                      <div className="mt-6 flex-1 flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tracking-[0.28em] uppercase text-porcelain-dim">
                          <span className="text-porcelain">
                            {tCat(r.category)}
                          </span>
                          <span className="text-porcelain-dim/50">·</span>
                          <span>{formatDate(r.publishedAt, locale)}</span>
                        </div>
                        <h3 className="mt-4 font-sans font-light text-xl lg:text-2xl text-porcelain leading-tight tracking-tight group-hover:text-porcelain-dim transition-colors">
                          {tItems(`${r.slug}.title`)}
                        </h3>
                        <p className="mt-4 text-sm text-porcelain-dim leading-relaxed flex-1">
                          {tItems(`${r.slug}.excerpt`)}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
