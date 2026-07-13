import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { WhatsAppGroupButton } from './WhatsAppGroupButton';

export function Footer() {
  const t = useTranslations('footer');
  const agentName = process.env.NEXT_PUBLIC_AGENT_NAME ?? 'Mathieu Poissonnet';

  return (
    <footer className="bg-charcoal border-t border-porcelain-dim/20 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16 grid gap-10 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-porcelain">{agentName}</p>
          <p className="mt-2 text-sm text-porcelain-dim">{t('brokerage')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <WhatsAppGroupButton variant="footer" />
            <Link
              href="/privacy"
              className="text-[11px] tracking-[0.2em] uppercase text-porcelain-dim hover:text-porcelain transition-colors"
            >
              {t('privacy')}
            </Link>
          </div>
        </div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-porcelain-dim space-y-2">
          <p>
            {t('rera')} <span className="text-porcelain">{t('reraNumber')}</span>
          </p>
          <p>© {new Date().getFullYear()} {agentName}</p>
          <p>{t('rights')}</p>
        </div>
        <div className="text-[11px] leading-relaxed text-porcelain-dim/70 border-l border-porcelain-dim/30 pl-6">
          {t('placeholderNote')}
        </div>
      </div>
    </footer>
  );
}
