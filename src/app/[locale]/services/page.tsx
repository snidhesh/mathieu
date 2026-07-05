import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { FadeIn } from '@/components/motion/FadeIn';

const serviceKeys = ['offplan', 'resale', 'investment', 'management'] as const;

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
  const t = await getTranslations({ locale, namespace: 'services.page' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/services`,
      languages: { en: '/en/services', fr: '/fr/services' },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('services.page');
  const tRoot = await getTranslations('services');
  const included = (key: string): string[] =>
    (t.raw(`items.${key}.included`) as string[]) ?? [];
  const process = (key: string): string[] =>
    (t.raw(`items.${key}.process`) as string[]) ?? [];

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
              {t('intro')}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hairline w-40 mt-10" />
          </FadeIn>

          {/* SERVICE BLOCKS */}
          <div className="mt-16 lg:mt-24 space-y-20 lg:space-y-32">
            {serviceKeys.map((key, i) => (
              <FadeIn key={key} delay={i * 0.05}>
                <article className="grid gap-10 lg:grid-cols-12">
                  {/* Number + Title */}
                  <div className="lg:col-span-4">
                    <p className="font-display text-4xl lg:text-5xl text-porcelain tracking-[0.05em]">
                      0{i + 1}
                    </p>
                    <h2 className="mt-8 font-display text-2xl lg:text-3xl text-porcelain leading-tight tracking-[0.03em]">
                      {tRoot(`items.${key}.title`)}
                    </h2>
                    <p className="mt-6 text-porcelain-dim leading-relaxed max-w-sm">
                      {t(`items.${key}.intro`)}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-8 space-y-10">
                    {/* For */}
                    <div>
                      <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain">
                        {t('forHeading')}
                      </p>
                      <p className="mt-4 text-porcelain-dim leading-relaxed max-w-2xl">
                        {t(`items.${key}.forWho`)}
                      </p>
                    </div>

                    {/* Included + Process */}
                    <div className="grid gap-10 md:grid-cols-2">
                      <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain">
                          {t('includedHeading')}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {included(key).map((line) => (
                            <li
                              key={line}
                              className="text-sm text-porcelain-dim leading-relaxed flex items-baseline gap-3"
                            >
                              <span className="text-porcelain">—</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain">
                          {t('processHeading')}
                        </p>
                        <ol className="mt-4 space-y-3 counter-reset">
                          {process(key).map((step, idx) => (
                            <li
                              key={step}
                              className="text-sm text-porcelain-dim leading-relaxed flex items-baseline gap-3"
                            >
                              <span className="text-porcelain font-display tabular-nums text-xs">
                                0{idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 lg:mt-32 max-w-4xl">
            <FadeIn>
              <div className="hairline w-40" />
              <h2 className="mt-10 font-sans font-light text-2xl lg:text-4xl leading-[1.15] text-porcelain tracking-tight">
                {t('ctaHeading')}
              </h2>
              <p className="mt-6 text-porcelain-dim leading-relaxed max-w-xl">
                {t('ctaBody')}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <WhatsAppButton variant="primary" />
                <Link
                  href="/contact"
                  className="text-[11px] tracking-[0.25em] uppercase text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  Email →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
