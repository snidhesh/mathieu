import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/motion/FadeIn';
import { MarketIntelForm } from '@/components/MarketIntelForm';
import { WhatsAppGroupButton } from '@/components/WhatsAppGroupButton';
import {
  publishedReports,
  marketStats,
  type MarketStat,
} from '@/lib/market-reports';

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
  const t = await getTranslations({
    locale,
    namespace: 'marketIntelligence',
  });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('description'),
    alternates: {
      canonical: `/${locale}/market-intelligence`,
      languages: {
        en: '/en/market-intelligence',
        fr: '/fr/market-intelligence',
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

export default async function MarketIntelligencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('marketIntelligence');

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
              {t('description')}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hairline w-40 mt-10" />
          </FadeIn>

          {/* MARKET BRIEF */}
          <section className="mt-20 lg:mt-28">
            <FadeIn>
              <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim">
                {t('brief.eyebrow')}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.1] text-porcelain tracking-tight max-w-3xl">
                {t('brief.title')}
              </h2>
            </FadeIn>

            {/* Stat tiles */}
            <div className="mt-12 grid gap-px bg-porcelain-dim/20 border border-porcelain-dim/20 sm:grid-cols-2 lg:grid-cols-4">
              {marketStats.map((stat, i) => (
                <FadeIn key={stat.id} delay={0.15 + i * 0.05}>
                  <StatTile stat={stat} label={t(`brief.stats.${stat.id}`)} />
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <p className="mt-12 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-3xl">
                {t('brief.body')}
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain">
                    {t('brief.communitiesTitle')}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-porcelain-dim leading-relaxed">
                    {t('brief.communitiesBody')}
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <p className="mt-10 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim/70">
                {t('brief.sourceNote')}
              </p>
            </FadeIn>
          </section>

          {/* REPORT LIST */}
          {publishedReports.length > 0 && (
            <section className="mt-24 lg:mt-32 border-t border-porcelain-dim/20 pt-16">
              <FadeIn>
                <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim">
                  {t('latestReport')}
                </p>
              </FadeIn>
              <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {publishedReports.map((report, i) => (
                  <FadeIn key={report.id} delay={0.1 + i * 0.05}>
                    <article className="h-full flex flex-col border border-porcelain-dim/25 p-6 lg:p-8">
                      {report.coverImage && (
                        <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-charcoal">
                          <Image
                            src={report.coverImage}
                            alt={t(`reports.${report.id}.title`)}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-[10px] tracking-[0.28em] uppercase text-porcelain-dim">
                        {formatDate(report.publishedAt, locale)}
                      </p>
                      <h3 className="mt-4 font-sans font-light text-xl lg:text-2xl text-porcelain leading-tight tracking-tight">
                        {t(`reports.${report.id}.title`)}
                      </h3>
                      <p className="mt-4 text-sm text-porcelain-dim leading-relaxed flex-1">
                        {t(`reports.${report.id}.description`)}
                      </p>
                      {report.pdfPath && (
                        <a
                          href={report.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex self-start items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-porcelain hover:text-porcelain-dim transition-colors"
                        >
                          {t('downloadCta')} ↓
                        </a>
                      )}
                    </article>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* SUBSCRIBE FORM */}
          <FadeIn delay={0.4}>
            <div className="mt-24 border-t border-porcelain-dim/20 pt-16">
              <h2 className="font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight max-w-2xl">
                {t('form.title')}
              </h2>
              <MarketIntelForm className="mt-10 max-w-2xl" />
            </div>
          </FadeIn>

          {/* WHATSAPP GROUP */}
          <FadeIn delay={0.5}>
            <div className="mt-24 border-t border-porcelain-dim/20 pt-16 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <h2 className="font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight">
                  {t('whatsappGroup.title')}
                </h2>
                <p className="mt-6 text-porcelain-dim leading-relaxed max-w-xl">
                  {t('whatsappGroup.description')}
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:items-center">
                <WhatsAppGroupButton variant="section" />
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatTile({ stat, label }: { stat: MarketStat; label: string }) {
  return (
    <div className="bg-obsidian p-6 lg:p-8">
      <p className="font-display text-3xl lg:text-4xl text-porcelain leading-none">
        {stat.value}
      </p>
      <p className="mt-4 text-[10px] tracking-[0.28em] uppercase text-porcelain-dim">
        {label}
      </p>
    </div>
  );
}
