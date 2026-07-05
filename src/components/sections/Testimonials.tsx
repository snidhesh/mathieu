import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

const items = ['1', '2', '3'] as const;

export function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section id="testimonials" className="py-20 lg:py-32 px-6 lg:px-12 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-champagne">
            {t('eyebrow')}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain tracking-tight">
            {t('title')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="hairline w-40 mt-10" />
        </FadeIn>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {items.map((key, i) => (
            <FadeIn key={key} delay={i * 0.1}>
              <figure className="h-full flex flex-col">
                <span
                  className="font-italic italic text-5xl md:text-6xl text-porcelain leading-none"
                  aria-hidden="true"
                >
                  “
                </span>
                <blockquote className="mt-4 font-italic italic text-lg sm:text-xl lg:text-2xl text-porcelain leading-snug flex-1">
                  {t(`items.${key}.quote`)}
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-champagne-dim/40">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-porcelain">
                    {t(`items.${key}.author`)}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.15em] uppercase text-porcelain-dim">
                    {t(`items.${key}.context`)}
                  </p>
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
