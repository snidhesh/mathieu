import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

export function About() {
  const t = useTranslations('about');

  return (
    <section
      id="about"
      className="relative py-20 lg:py-32 px-6 lg:px-12 overflow-hidden"
    >
      {/* Full-bleed background portrait — same "glued" pattern as the Hero.
          Mobile uses vertical gradient; desktop uses horizontal gradient
          keeping the face readable on the right, text crisp on the left. */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/portraits/agent-dubai.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[85%_35%] lg:object-[50%_35%] lg:translate-x-[15%] grayscale-[70%]"
        />
        {/* Mobile: strong vertical gradient */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-obsidian/90 via-obsidian/65 to-obsidian/95" />
        {/* Desktop: horizontal gradient — dark left for text, softer right for image */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-obsidian from-30% via-obsidian/75 via-60% to-obsidian/15" />
        {/* Universal top/bottom fade so section blends with neighbours */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-transparent to-obsidian/70" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
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

        {/* All body copy + credentials in a single left-aligned column so it
            never fights the portrait for space. */}
        <div className="mt-16 max-w-2xl space-y-10">
          <FadeIn delay={0.3}>
            <p className="text-base lg:text-lg text-porcelain-dim leading-relaxed">
              {t('body1')}
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-base lg:text-lg text-porcelain-dim leading-relaxed">
              {t('body2')}
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="border-l border-porcelain-dim/40 pl-6 space-y-3">
              {(['credential1', 'credential2', 'credential3'] as const).map(
                (key) => (
                  <p
                    key={key}
                    className="text-[11px] tracking-[0.2em] uppercase text-porcelain"
                  >
                    <span className="text-porcelain-dim mr-3">—</span>
                    {t(key)}
                  </p>
                ),
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Desktop-only Dubai caption tucked into the image's bottom-right corner */}
      <p className="hidden lg:block absolute bottom-8 right-8 z-10 text-[10px] tracking-[0.3em] uppercase text-porcelain-dim/80">
        Dubai · 2025
      </p>
    </section>
  );
}
