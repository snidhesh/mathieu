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
import { projects, getProject } from '@/lib/projects';
import { Dirham } from '@/components/Dirham';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumb } from '@/lib/schema';

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({
    locale,
    namespace: `projects.items.${slug}`,
  });
  const name = t('name');
  const summary = t('summary');
  return {
    title: `${name} — Mathieu Poissonnet`,
    description: summary,
    openGraph: {
      title: `${name} — Mathieu Poissonnet`,
      description: summary,
      url: `/${locale}/projects/${slug}`,
      images: [project.heroImage],
    },
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        fr: `/fr/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const tDetail = await getTranslations('projects.detail');
  const tItem = await getTranslations(`projects.items.${slug}`);
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const name = tItem('name');
  const summary = tItem('summary');
  const location = tItem('location');
  const overviewParas = tItem('overview').split('\n\n');

  const rawTypes = tItem.raw('types');
  const types: string[] = Array.isArray(rawTypes) ? rawTypes : [];

  const handoverLabel =
    project.handoverKey !== null
      ? tItem(project.handoverKey)
      : project.handover !== null
        ? project.handover
        : tDetail('tba');

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: 'Home', path: `/${locale}` },
          { name: tNav('projects'), path: `/${locale}/projects` },
          { name, path: `/${locale}/projects/${project.slug}` },
        ])}
      />
      <Nav />
      <main className="flex-1 pt-16">
        {/* HERO */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
          <Image
            src={project.heroImage}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20" />
          <div className="relative min-h-[60vh] lg:min-h-[70vh] mx-auto max-w-7xl px-6 lg:px-12 py-12 lg:py-16 flex flex-col justify-between gap-10">
            <FadeIn>
              <Link
                href="/projects"
                className="text-[11px] tracking-[0.25em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
              >
                ← {tDetail('backTo')}
              </Link>
            </FadeIn>
            <div className="max-w-3xl">
              <FadeIn delay={0.1}>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {project.developer}
                </p>
              </FadeIn>
              {project.brand !== null && (
                <FadeIn delay={0.12}>
                  <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('brandLabel')} · {project.brand}
                  </p>
                </FadeIn>
              )}
              <FadeIn delay={0.2}>
                <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.05] text-porcelain tracking-[0.05em]">
                  {name}
                </h1>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="mt-8 font-italic italic text-xl md:text-2xl text-porcelain leading-snug max-w-2xl">
                  {summary}
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* FACTS */}
        <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('factsHeadings.developer')}
                  </dt>
                  <dd className="mt-3 font-display text-lg text-porcelain tracking-[0.03em]">
                    {project.developer}
                  </dd>
                </div>

                {project.brand !== null && (
                  <div>
                    <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                      {tDetail('factsHeadings.brand')}
                    </dt>
                    <dd className="mt-3 font-display text-lg text-porcelain tracking-[0.03em]">
                      {project.brand}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('factsHeadings.location')}
                  </dt>
                  <dd className="mt-3 text-porcelain leading-relaxed">
                    {location}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('factsHeadings.status')}
                  </dt>
                  <dd className="mt-3 text-porcelain leading-relaxed">
                    {tDetail(`statusLabels.${project.status}`)}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('factsHeadings.handover')}
                  </dt>
                  <dd className="mt-3 text-porcelain leading-relaxed">
                    {handoverLabel}
                  </dd>
                </div>

                <div>
                  <dt className="text-[10px] tracking-[0.3em] uppercase text-porcelain-dim">
                    {tDetail('factsHeadings.startingPrice')}
                  </dt>
                  <dd className="mt-3">
                    <span className="font-display text-lg text-porcelain tracking-[0.03em]">
                      {project.startingPrice === null ? (
                        tDetail('uponRequest')
                      ) : (
                        <Dirham amount={project.startingPrice} />
                      )}
                    </span>
                    {project.startingPrice !== null &&
                      project.startingPriceSourceKey !== null && (
                        <span className="mt-2 block text-[10px] tracking-[0.2em] uppercase text-porcelain-dim/70 leading-relaxed">
                          {tItem(project.startingPriceSourceKey)}
                        </span>
                      )}
                  </dd>
                </div>

              </dl>
            </FadeIn>
          </div>
        </section>

        {/* OVERVIEW */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {tDetail('overviewHeading')}
            </p>
            <div className="hairline w-40 mt-6" />
            <div className="mt-10 space-y-6 text-porcelain-dim leading-relaxed">
              {overviewParas.map((paragraph, i) => (
                <p key={i} className="text-base lg:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* UNIT TYPES / PRODUCT MIX */}
        {types.length > 0 && (
          <section className="py-16 md:py-24 px-6 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('unitTypesHeading')}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="hairline w-40 mt-6" />
              </FadeIn>
              <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {types.map((typeLabel, i) => (
                  <FadeIn key={typeLabel} delay={i * 0.06}>
                    <li className="border-l border-porcelain-dim/40 pl-6 py-3">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                        0{i + 1}
                      </p>
                      <p className="mt-2 font-display text-lg text-porcelain tracking-[0.03em]">
                        {typeLabel}
                      </p>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* PAYMENT PLAN */}
        {project.paymentPlanKey !== null && (
          <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
            <div className="mx-auto max-w-4xl">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('paymentPlanHeading')}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="hairline w-40 mt-6" />
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="mt-10 text-base lg:text-lg text-porcelain-dim leading-relaxed">
                  {tItem(project.paymentPlanKey)}
                </p>
              </FadeIn>
            </div>
          </section>
        )}

        {/* HIGHLIGHTS */}
        <section className="py-16 md:py-24 px-6 lg:px-12 bg-charcoal">
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
              {project.highlights.map((key, i) => (
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

        {/* GALLERY (only when populated) */}
        {project.gallery.length > 0 && (
          <section className="py-16 md:py-24 px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {tDetail('galleryHeading')}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="hairline w-40 mt-6" />
              </FadeIn>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((src, i) => (
                  <FadeIn key={src} delay={i * 0.06}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={src}
                        alt={name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT CTA */}
        <section className="py-16 md:py-24 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-sans font-light text-2xl md:text-3xl text-porcelain leading-snug">
              {tDetail('inquireCta')}
            </p>
            <div className="mt-8 inline-block">
              <WhatsAppButton
                variant="primary"
                message={`${tDetail('askAbout')} ${name}`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
