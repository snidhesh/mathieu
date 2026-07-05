import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';

const services = ['offplan', 'resale', 'investment', 'management'] as const;

export function Services() {
  const t = useTranslations('services');

  return (
    <section id="services" className="py-20 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-champagne">
            {t('eyebrow')}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain max-w-2xl tracking-tight">
            {t('title')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="hairline w-40 mt-10" />
        </FadeIn>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((key, i) => (
            <FadeIn key={key} delay={i * 0.08}>
              <div className="border-t border-champagne-dim/40 pt-8">
                <p className="font-display text-3xl text-champagne">
                  0{i + 1}
                </p>
                <h3 className="mt-6 font-display text-2xl text-porcelain leading-tight">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-4 text-sm text-porcelain-dim leading-relaxed">
                  {t(`items.${key}.body`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
