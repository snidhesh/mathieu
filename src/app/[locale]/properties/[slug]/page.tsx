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
import { getProperty, properties } from '@/lib/listings';
import { getCommunity } from '@/lib/communities';
import { Dirham } from '@/components/Dirham';
import { JsonLd } from '@/components/JsonLd';
import { propertySchema, breadcrumb } from '@/lib/schema';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    properties.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const property = getProperty(slug);
  if (!property) notFound();

  const t = await getTranslations({ locale, namespace: 'listings.items' });
  const name = t(`${property.slug}.name`);
  const blurb = t(`${property.slug}.blurb`);
  return {
    title: `${name} — Mathieu Poissonnet`,
    description: blurb,
    openGraph: {
      title: `${name} — Mathieu Poissonnet`,
      description: blurb,
      url: `/${locale}/properties/${property.slug}`,
      images: [property.cover],
    },
    alternates: {
      canonical: `/${locale}/properties/${property.slug}`,
      languages: {
        en: `/en/properties/${property.slug}`,
        fr: `/fr/properties/${property.slug}`,
      },
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const property = getProperty(slug);
  if (!property) notFound();

  const community = getCommunity(property.community);
  const tDetail = await getTranslations('properties.detail');
  const tItem = await getTranslations(`listings.items.${property.slug}`);
  const tCommunity = community
    ? await getTranslations(`communities.items.${property.community}`)
    : null;

  const facts: Array<{ label: string; value: string }> = [
    { label: tDetail('facts.beds'), value: String(property.beds) },
    { label: tDetail('facts.baths'), value: String(property.baths) },
    { label: tDetail('facts.sqft'), value: property.sqft.toLocaleString() },
    { label: tDetail('facts.parking'), value: String(property.parking) },
    { label: tDetail('facts.type'), value: property.type },
    { label: tDetail('facts.furnishing'), value: property.furnishing },
  ];
  if (property.handover) {
    facts.push({
      label: tDetail('facts.handover'),
      value: property.handover,
    });
  }

  const amenityKeys = property.amenities;
  const description = tItem('description');
  const paragraphs = description.split('\n\n');

  const propertyName = tItem('name');
  const communityName = community && tCommunity ? tCommunity('name') : 'Dubai';
  const listingsLabel = await getTranslations({
    locale,
    namespace: 'nav',
  });

  return (
    <>
      <JsonLd
        data={propertySchema(
          property,
          locale,
          propertyName,
          tItem('blurb'),
          communityName,
        )}
      />
      <JsonLd
        data={breadcrumb([
          { name: 'Home', path: `/${locale}` },
          { name: listingsLabel('properties'), path: `/${locale}/properties` },
          { name: propertyName, path: `/${locale}/properties/${property.slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1 pt-16">
        {/* HERO */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
          <Image
            src={property.cover}
            alt={tItem('name')}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/30" />
          <div className="relative min-h-[60vh] lg:min-h-[70vh] mx-auto max-w-7xl px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-between gap-10">
            <FadeIn>
              <Link
                href="/properties"
                className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
              >
                ← {tDetail('backTo')}
              </Link>
            </FadeIn>

            <div className="max-w-4xl">
              <FadeIn delay={0.1}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-porcelain">
                  <span>{tDetail(`offering.${property.offering}`)}</span>
                  <span className="text-porcelain-dim hidden sm:inline">·</span>
                  <span>{tItem('location')}</span>
                  <span className="text-porcelain-dim hidden sm:inline">·</span>
                  <span className="text-porcelain-dim">
                    {tDetail('referenceLabel')} {property.reference}
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h1 className="mt-6 font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] text-porcelain tracking-[0.04em]">
                  {tItem('name')}
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-8 text-[11px] tracking-[0.25em] uppercase text-porcelain-dim">
                  {tDetail('priceLabel')}
                </p>
                <p className="mt-2 font-display text-3xl md:text-4xl text-porcelain">
                  <Dirham amount={property.price} />
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* QUICK FACTS STRIP */}
        <section className="border-y border-porcelain-dim/15">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-8">
            {facts.map((fact) => (
              <div key={fact.label}>
                <p className="text-[10px] tracking-[0.22em] uppercase text-porcelain-dim">
                  {fact.label}
                </p>
                <p className="mt-2 font-display text-xl md:text-2xl text-porcelain">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DESCRIPTION + STICKY SIDEBAR */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-16">
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('aboutHeading')}
                </p>
                <div className="hairline w-40 mt-6" />
                <div className="mt-10 space-y-6 text-porcelain-dim leading-relaxed max-w-2xl">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-base lg:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('amenitiesHeading')}
                </p>
                <div className="hairline w-40 mt-6" />
                <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                  {amenityKeys.map((key) => (
                    <li
                      key={key}
                      className="text-porcelain text-sm tracking-wide flex items-baseline gap-3"
                    >
                      <span className="text-porcelain-dim">—</span>
                      {tItem(`amenities.${key}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 border border-porcelain-dim/20 p-8">
                <p className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim">
                  {tDetail('priceLabel')}
                </p>
                <p className="mt-2 font-display text-3xl text-porcelain">
                  <Dirham amount={property.price} />
                </p>
                <p className="mt-4 text-[11px] tracking-[0.25em] uppercase text-porcelain">
                  {tDetail(`offering.${property.offering}`)}
                </p>

                <div className="hairline mt-8" />

                <p className="mt-8 font-display text-lg text-porcelain">
                  Mathieu Poissonnet
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-porcelain-dim mt-1">
                  {tDetail('referenceLabel')} {property.reference}
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <WhatsAppButton
                    variant="primary"
                    message={`${tDetail('askAbout')} ${tItem('name')} (${property.reference})`}
                    className="justify-center"
                  />
                  <a
                    href="#top"
                    className="inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] uppercase px-6 py-3 border border-porcelain-dim/40 text-porcelain hover:border-porcelain transition-colors"
                  >
                    {tDetail('inquireCta')}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* GALLERY */}
        <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
          <div className="mx-auto max-w-7xl">
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {tDetail('galleryHeading')}
            </p>
            <div className="hairline w-40 mt-6" />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.gallery.map((src, i) => (
                <FadeIn key={src} delay={i * 0.08}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={src}
                      alt={`${propertyName} — ${tDetail('galleryHeading')} ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale hover:grayscale-0 hover:scale-[1.03] transition-all duration-1000"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY TEASER */}
        {community && tCommunity && (
          <section className="py-16 md:py-24 px-6 lg:px-12">
            <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('communityHeading')}
                </p>
                <h2 className="mt-6 font-sans font-light text-3xl lg:text-4xl leading-[1.15] text-porcelain tracking-tight">
                  {tCommunity('name')}
                </h2>
                <div className="hairline w-40 mt-8" />
                <p className="mt-8 text-porcelain-dim leading-relaxed max-w-lg">
                  {tCommunity('summary')}
                </p>
                <Link
                  href={`/communities/${community.slug}`}
                  className="inline-flex items-center gap-2 mt-10 text-[11px] tracking-[0.25em] uppercase text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  {tDetail('communityCta')} →
                </Link>
              </div>
              <Link
                href={`/communities/${community.slug}`}
                className="relative aspect-[4/3] block overflow-hidden group"
              >
                <Image
                  src={community.heroImage}
                  alt={tCommunity('name')}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
