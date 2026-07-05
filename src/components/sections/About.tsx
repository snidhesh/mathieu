import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-20 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-champagne">
            {t('eyebrow')}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain max-w-3xl tracking-tight">
            {t('title')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="hairline w-40 mt-10" />
        </FadeIn>

        <div className="mt-16 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-6 text-porcelain-dim leading-relaxed">
            <FadeIn delay={0.3}>
              <p className="text-base lg:text-lg">{t('body1')}</p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-base lg:text-lg">{t('body2')}</p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="pt-6 mt-8 border-l border-champagne-dim/40 pl-6 space-y-3">
                {(['credential1', 'credential2', 'credential3'] as const).map(
                  (key) => (
                    <p
                      key={key}
                      className="text-[11px] tracking-[0.2em] uppercase text-porcelain"
                    >
                      <span className="text-champagne mr-3">—</span>
                      {t(key)}
                    </p>
                  ),
                )}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="lg:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src="/portraits/agent-dubai.jpg"
                alt="Mathieu Poissonnet in Dubai"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover grayscale-[65%] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 border border-champagne-dim/30" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-obsidian/80 to-transparent">
                <p className="text-[10px] tracking-[0.3em] uppercase text-champagne">
                  Dubai · 2025
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
