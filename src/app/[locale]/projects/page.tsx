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
import { projects } from '@/lib/projects';

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
  const t = await getTranslations({ locale, namespace: 'projects.index' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { en: '/en/projects', fr: '/fr/projects' },
    },
  };
}

export default async function ProjectsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('projects.index');
  const tItems = await getTranslations('projects.items');

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
            {projects.map((project, i) => (
              <FadeIn key={project.slug} delay={i * 0.08}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.heroImage}
                      alt={tItems(`${project.slug}.name`)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                        {project.developer}
                      </p>
                      <h2 className="mt-2 font-display text-2xl text-porcelain tracking-[0.05em]">
                        {tItems(`${project.slug}.name`)}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-porcelain-dim leading-relaxed">
                    {tItems(`${project.slug}.summary`)}
                  </p>
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
