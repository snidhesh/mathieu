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
import { communities, getCommunity } from '@/lib/communities';
import { getPropertiesInCommunity } from '@/lib/listings';
import { Dirham } from '@/components/Dirham';
import { JsonLd } from '@/components/JsonLd';
import { communitySchema, breadcrumb } from '@/lib/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    communities.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const community = getCommunity(slug);
  if (!community) notFound();

  const t = await getTranslations({
    locale,
    namespace: `communities.items.${slug}`,
  });
  const name = t('name');
  const summary = t('summary');
  return {
    title: `${name} — Mathieu Poissonnet`,
    description: summary,
    openGraph: {
      title: `${name} — Mathieu Poissonnet`,
      description: summary,
      url: `/${locale}/communities/${slug}`,
      images: [community.heroImage],
    },
    alternates: {
      canonical: `/${locale}/communities/${slug}`,
      languages: {
        en: `/en/communities/${slug}`,
        fr: `/fr/communities/${slug}`,
      },
    },
  };
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const community = getCommunity(slug);
  if (!community) notFound();

  const tDetail = await getTranslations('communities.detail');
  const tItem = await getTranslations(`communities.items.${slug}`);
  const tItems = await getTranslations('listings.items');
  const tPropDetail = await getTranslations('properties.detail');
  const tListings = await getTranslations('listings');

  const inCommunity = getPropertiesInCommunity(community.slug);
  const communityName = tItem('name');
  const communitySummary = tItem('summary');
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <JsonLd
        data={communitySchema(
          community,
          locale,
          communityName,
          communitySummary,
        )}
      />
      <JsonLd
        data={breadcrumb([
          { name: 'Home', path: `/${locale}` },
          { name: tNav('communities'), path: `/${locale}/communities` },
          { name: communityName, path: `/${locale}/communities/${community.slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1 pt-16">
        {/* HERO */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
          <Image
            src={community.heroImage}
            alt={tItem('name')}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20" />
          <div className="relative min-h-[60vh] lg:min-h-[70vh] mx-auto max-w-7xl px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-between gap-10">
            <FadeIn>
              <Link
                href="/communities"
                className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
              >
                ← {tDetail('backTo')}
              </Link>
            </FadeIn>
            <div className="max-w-3xl">
              <FadeIn delay={0.1}>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {community.emirate}
                </p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.05] text-porcelain tracking-[0.05em]">
                  {tItem('name')}
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-8 font-italic italic text-xl md:text-2xl text-porcelain leading-snug max-w-2xl">
                  {tItem('summary')}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* LIFESTYLE */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {tItem('name')}
            </p>
            <div className="hairline w-40 mt-6" />
            <div className="mt-10 space-y-6 text-porcelain-dim leading-relaxed">
              {tItem('lifestyle')
                .split('\n\n')
                .map((paragraph, i) => (
                  <p key={i} className="text-base lg:text-lg">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </section>

        {/* ATTRACTIONS */}
        <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
          <div className="mx-auto max-w-7xl">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {tDetail('attractionsHeading')}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="hairline w-40 mt-6" />
            </FadeIn>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {community.attractions.map((key, i) => (
                <FadeIn key={key} delay={i * 0.08}>
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={
                          community.attractionImages[
                            i % community.attractionImages.length
                          ]
                        }
                        alt={tItem(`attractions.${key}.name`)}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>
                    <p className="mt-4 text-[11px] tracking-[0.22em] uppercase text-porcelain">
                      {tItem(`attractions.${key}.name`)}
                    </p>
                    <p className="mt-2 text-sm text-porcelain-dim leading-relaxed">
                      {tItem(`attractions.${key}.description`)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTMENT HIGHLIGHTS */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {tDetail('highlightsHeading')}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="hairline w-40 mt-6" />
            </FadeIn>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {community.highlights.map((key, i) => (
                <FadeIn key={key} delay={i * 0.1}>
                  <div className="border-l border-porcelain-dim/40 pl-6">
                    <h3 className="font-display text-xl text-porcelain tracking-[0.03em]">
                      {tItem(`highlights.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-porcelain-dim leading-relaxed">
                      {tItem(`highlights.${key}.description`)}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* PROPERTIES IN THIS COMMUNITY */}
        {inCommunity.length > 0 && (
          <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
            <div className="mx-auto max-w-7xl">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('propertiesHeading')} · {tItem('name')}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="hairline w-40 mt-6" />
              </FadeIn>
              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {inCommunity.map((p, i) => (
                  <FadeIn key={p.slug} delay={i * 0.08}>
                    <Link href={`/properties/${p.slug}`} className="group block">
                      <div className="relative aspect-[7/5] overflow-hidden">
                        <Image
                          src={p.cover}
                          alt={tItems(`${p.slug}.name`)}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-1000"
                        />
                      </div>
                      <div className="mt-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                            {tPropDetail(`offering.${p.offering}`)}
                          </p>
                          <h3 className="mt-3 font-display text-lg text-porcelain tracking-[0.03em] leading-tight">
                            {tItems(`${p.slug}.name`)}
                          </h3>
                          <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
                            {p.beds} {tListings('beds')} · {p.sqft.toLocaleString()} {tListings('sqft')}
                          </p>
                        </div>
                        <p className="font-display text-base text-porcelain whitespace-nowrap">
                          <Dirham amount={p.price} />
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-sans font-light text-2xl md:text-3xl text-porcelain leading-snug">
              {tDetail('inquireCta')}
            </p>
            <div className="mt-8 inline-block">
              <WhatsAppButton
                variant="primary"
                message={`${tPropDetail('askAbout')} ${tItem('name')}`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
