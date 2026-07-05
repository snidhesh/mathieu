import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ContactForm } from '@/components/ContactForm';
import { FadeIn } from '@/components/motion/FadeIn';
import { mailtoHref } from '@/lib/formatters';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

const methodKeys = ['whatsapp', 'email', 'call', 'meet'] as const;
const briefKeys = ['budget', 'horizon', 'locations', 'constraints'] as const;

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
  const t = await getTranslations({ locale, namespace: 'contact.page' });
  return {
    title: `${t('title')} — Mathieu Poissonnet`,
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: '/en/contact', fr: '/fr/contact' },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('contact.page');
  const mail = mailtoHref(contactEmail);

  return (
    <>
      <Nav />
      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* HERO — two-column with portrait */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <FadeIn>
                <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                  {t('eyebrow')}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="mt-6 font-sans font-light text-3xl lg:text-6xl leading-[1.05] text-porcelain tracking-tight max-w-3xl">
                  {t('title')}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-8 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-xl">
                  {t('intro')}
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="hairline w-40 mt-10" />
              </FadeIn>
            </div>

            <FadeIn delay={0.15} className="lg:col-span-5">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/portraits/agent-dubai.jpg"
                  alt="Mathieu Poissonnet — Dubai"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover grayscale-[65%]"
                />
                <div className="absolute inset-0 border border-porcelain-dim/25" />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-obsidian/80 to-transparent">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-porcelain">
                    Dubai · Available now
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* METHODS GRID */}
          <div className="mt-20 lg:mt-32">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('methodsHeading')}
              </p>
            </FadeIn>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {methodKeys.map((key, i) => (
                <FadeIn key={key} delay={i * 0.06}>
                  <div className="border-t border-porcelain-dim/40 pt-8 h-full">
                    <p className="font-display text-2xl text-porcelain tracking-[0.05em]">
                      0{i + 1}
                    </p>
                    <h2 className="mt-6 font-display text-xl text-porcelain tracking-[0.05em]">
                      {t(`methods.${key}.label`)}
                    </h2>
                    <p className="mt-4 text-sm text-porcelain-dim leading-relaxed">
                      {t(`methods.${key}.detail`)}
                    </p>
                    {key === 'whatsapp' && (
                      <div className="mt-6">
                        <WhatsAppButton variant="ghost" />
                      </div>
                    )}
                    {key === 'email' && (
                      <div className="mt-6">
                        <a
                          href={mail}
                          className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-porcelain hover:text-porcelain-dim transition-colors"
                        >
                          {contactEmail ?? 'Email →'}
                        </a>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* WHAT TO INCLUDE — editorial redesign */}
          <div className="mt-20 lg:mt-32">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('briefEyebrow')}
              </p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain tracking-tight max-w-3xl">
                {t('briefHeading')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="hairline w-40 mt-10" />
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-10 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-2xl">
                {t('briefIntro')}
              </p>
            </FadeIn>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {briefKeys.map((key, i) => (
                <FadeIn key={key} delay={0.2 + i * 0.06}>
                  <article className="group h-full flex flex-col border-t border-porcelain-dim/30 pt-8 hover:border-porcelain transition-colors">
                    <div className="flex items-baseline justify-between text-[10px] tracking-[0.4em] uppercase text-porcelain-dim/70 mb-10">
                      <span className="text-porcelain">0{i + 1}</span>
                      <span>/ 04</span>
                    </div>
                    <h3 className="font-sans font-light text-2xl lg:text-3xl text-porcelain leading-tight tracking-tight">
                      {t(`briefItems.${key}.label`)}
                    </h3>
                    <div className="hairline w-10 mt-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <p className="mt-6 text-sm text-porcelain-dim leading-relaxed flex-1">
                      {t(`briefItems.${key}.detail`)}
                    </p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div className="mt-20 lg:mt-32 max-w-4xl">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('formHeading')}
              </p>
              <div className="hairline w-40 mt-6" />
              <p className="mt-8 text-porcelain-dim leading-relaxed max-w-xl">
                {t('formSubtitle')}
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-12">
                <ContactForm />
              </div>
            </FadeIn>
          </div>

          {/* RESPONSE TIMES */}
          <div className="mt-20 lg:mt-32 max-w-4xl border-t border-porcelain-dim/20 pt-12">
            <FadeIn>
              <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
                {t('responseHeading')}
              </p>
              <p className="mt-6 text-porcelain-dim leading-relaxed max-w-2xl">
                {t('responseBody')}
              </p>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
