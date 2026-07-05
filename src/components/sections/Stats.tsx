import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { DirhamSymbol } from '@/components/DirhamSymbol';

const stats = [
  { key: 'sold', value: '180M+', currency: true },
  { key: 'deals', value: '34' },
  { key: 'years', value: '3' },
  { key: 'listings', value: '12' },
] as const;

export function Stats() {
  const t = useTranslations('stats');

  return (
    <section className="border-y border-porcelain-dim/20 bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
        <FadeIn>
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
              {t('heading')}
            </p>
            <p className="text-[11px] text-porcelain-dim max-w-sm">
              {t('disclaimer')}
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <FadeIn key={stat.key} delay={i * 0.08}>
              <div className="text-center lg:text-left">
                <p className="font-display text-4xl lg:text-5xl text-porcelain">
                  {'currency' in stat && stat.currency && <DirhamSymbol />}
                  {stat.value}
                </p>
                <p className="mt-3 text-[11px] tracking-[0.2em] uppercase text-porcelain-dim">
                  {t(stat.key)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
