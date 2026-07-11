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
      {/* Mobile: portrait glued behind the copy with obsidian gradient overlays.
          Desktop keeps the two-column card layout below. */}
      <div className="lg:hidden absolute inset-0" aria-hidden="true">
        <Image
          src="/portraits/mathieu.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-[85%_20%] grayscale-[70%] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/70 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-obsidian/20" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
            {t('eyebrow')}
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16 items-stretch">
          <div className="lg:col-span-7 space-y-10">
            <FadeIn delay={0.1}>
              <h2 className="font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain tracking-tight">
                {t('title')}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="hairline w-40" />
            </FadeIn>
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
                      className="flex items-start gap-3 text-[11px] tracking-[0.2em] uppercase text-porcelain leading-relaxed"
                    >
                      <span className="text-porcelain-dim shrink-0">—</span>
                      <span>{t(key)}</span>
                    </p>
                  ),
                )}
              </div>
            </FadeIn>
          </div>

          {/* Desktop-only portrait column — mobile uses the glued background above */}
          <FadeIn delay={0.15} className="hidden lg:block lg:col-span-5 lg:h-full">
            <div className="relative lg:h-full w-full overflow-hidden">
              <Image
                src="/portraits/mathieu.png"
                alt="Mathieu Poissonnet"
                fill
                sizes="40vw"
                className="object-cover grayscale-[70%]"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
