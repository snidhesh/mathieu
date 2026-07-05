import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      className="relative min-h-screen pt-32 lg:pt-40 pb-24 px-6 lg:px-12 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative z-10">
          <FadeIn>
            <p className="text-[11px] tracking-[0.35em] uppercase text-champagne mb-8">
              {t('eyebrow')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-porcelain tracking-[0.06em]">
              {t('name')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="hairline w-40 mt-8" />
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-8 font-italic italic text-2xl lg:text-3xl text-porcelain leading-snug max-w-lg">
              {t('tagline')}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="mt-6 text-sm lg:text-base text-porcelain-dim max-w-md leading-relaxed">
              {t('subtagline')}
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="mt-10">
              <WhatsAppButton variant="primary" />
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-6 relative">
          <FadeIn delay={0.3}>
            <ParallaxImage
              className="relative aspect-[3/4] w-full max-w-md mx-auto lg:ml-auto"
              amount={40}
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src="/portraits/agent.jpg"
                  alt="Portrait of Mathieu Poissonnet"
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
              </div>
            </ParallaxImage>
          </FadeIn>
        </div>
      </div>

    </section>
  );
}
