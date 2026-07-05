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
import { properties } from '@/lib/listings';
import { Dirham } from '@/components/Dirham';

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
  const t = await getTranslations({ locale, namespace: 'properties.index' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/properties`,
      languages: { en: '/en/properties', fr: '/fr/properties' },
    },
  };
}

export default async function PropertiesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('properties.index');
  const tDetail = await getTranslations('properties.detail');
  const tItems = await getTranslations('listings.items');
  const tListings = await getTranslations('listings');

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
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
            <p className="mt-8 text-porcelain-dim max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hairline w-40 mt-10" />
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, i) => (
              <FadeIn key={property.slug} delay={i * 0.08}>
                <Link
                  href={`/properties/${property.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[7/5] overflow-hidden">
                    <Image
                      src={property.cover}
                      alt={tItems(`${property.slug}.name`)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000"
                    />
                    <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase text-porcelain bg-obsidian/60 px-3 py-1">
                      {tDetail(`offering.${property.offering}`)}
                    </div>
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                        {tItems(`${property.slug}.location`)}
                      </p>
                      <h2 className="mt-3 font-display text-xl text-porcelain tracking-[0.03em] leading-tight">
                        {tItems(`${property.slug}.name`)}
                      </h2>
                      <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
                        {property.beds} {tListings('beds')} · {property.baths} {tListings('baths')} · {property.sqft.toLocaleString()} {tListings('sqft')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-porcelain">
                        <Dirham amount={property.price} />
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
