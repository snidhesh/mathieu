import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      className="relative min-h-screen pt-24 lg:pt-40 pb-16 lg:pb-24 px-6 lg:px-12 overflow-hidden"
    >
      {/* Full-bleed portrait sitting BEHIND the text on every breakpoint.
          Mobile uses a top-to-bottom gradient; desktop uses a left-to-right
          gradient so the face reads on the right while the text stays crisp
          on the darkened left. */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/portraits/hero_image_1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[35%_25%] lg:object-[70%_30%]"
        />
        {/* Mobile gradient — vertical */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/55 to-obsidian" />
        {/* Desktop gradient — horizontal, keeps face visible right */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-obsidian from-25% via-obsidian/70 via-55% to-obsidian/10" />
        {/* Subtle universal vignette top+bottom for legibility */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian/70" />
      </div>

      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 relative z-10 min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)] items-center">
        <div className="lg:col-span-6 xl:col-span-7 relative z-10">
          <FadeIn>
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain mb-8">
              {t('eyebrow')}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] text-porcelain tracking-[0.06em]">
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
        </div>
      </div>

      {/* Accessibility: give screen readers the portrait's identity even
          though the visible <Image> uses alt="" (decorative background). */}
      <span className="sr-only">Portrait of Mathieu Poissonnet</span>
    </section>
  );
}
