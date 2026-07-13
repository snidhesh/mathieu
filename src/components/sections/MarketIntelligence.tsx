import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { WhatsAppGroupButton } from '@/components/WhatsAppGroupButton';
import { getLatestReport } from '@/lib/market-reports';

export function MarketIntelligence() {
  const t = useTranslations('marketIntelligence');
  const latest = getLatestReport();

  return (
    <section className="border-t border-porcelain-dim/20 bg-obsidian">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-28">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
            {t('eyebrow')}
          </p>
        </FadeIn>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <FadeIn delay={0.1} className="lg:col-span-7">
            <h2 className="font-sans font-light text-3xl lg:text-5xl leading-[1.1] text-porcelain tracking-tight">
              {latest
                ? t(`reports.${latest.id}.title`)
                : t('title')}
            </h2>
            <p className="mt-8 text-base lg:text-lg text-porcelain-dim leading-relaxed max-w-xl">
              {latest
                ? t(`reports.${latest.id}.description`)
                : t('description')}
            </p>
            <div className="hairline w-40 mt-10" />
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-5">
            <div className="border border-porcelain-dim/30 p-6 lg:p-8 space-y-6">
              <p className="text-[11px] tracking-[0.3em] uppercase text-porcelain-dim">
                {t('latestReport')}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/market-intelligence"
                  className="inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase text-porcelain hover:text-porcelain-dim transition-colors"
                >
                  {t('viewAllCta')} →
                </Link>
                <WhatsAppGroupButton variant="footer" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
