import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { listings } from '@/lib/listings';
import { Dirham } from '@/components/Dirham';

export function Listings() {
  const t = useTranslations('listings');

  return (
    <section id="listings" className="py-20 lg:py-32 px-6 lg:px-12 bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
            {t('eyebrow')}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain tracking-tight">
            {t('title')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-porcelain-dim max-w-xl">{t('subtitle')}</p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="hairline w-40 mt-10" />
        </FadeIn>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {listings.map((listing, i) => (
            <FadeIn key={listing.id} delay={i * 0.1} className="h-full">
              <Link
                href={`/properties/${listing.id}`}
                className="group flex flex-col h-full bg-obsidian border border-porcelain-dim/15 hover:border-porcelain/60 transition-colors"
              >
                <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                  <Image
                    src={listing.image}
                    alt={t(`items.${listing.id}.name`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                    {t(`items.${listing.id}.location`)}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-porcelain leading-tight tracking-[0.03em]">
                    {t(`items.${listing.id}.name`)}
                  </h3>
                  <p className="mt-3 text-sm text-porcelain-dim leading-relaxed">
                    {t(`items.${listing.id}.blurb`)}
                  </p>
                  <div className="mt-auto pt-6 border-t border-porcelain-dim/15 flex items-end justify-between gap-4">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-porcelain-dim space-y-1">
                      <p>
                        <span className="text-porcelain">{listing.beds}</span>{' '}
                        {t('beds')}
                      </p>
                      <p>
                        <span className="text-porcelain">{listing.baths}</span>{' '}
                        {t('baths')}
                      </p>
                      <p>
                        <span className="text-porcelain">
                          {listing.sqft.toLocaleString()}
                        </span>{' '}
                        {t('sqft')}
                      </p>
                    </div>
                    <p className="font-display text-2xl text-porcelain">
                      <Dirham amount={listing.price} />
                    </p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 lg:mt-20 pt-10 lg:pt-12 border-t border-porcelain-dim/25 flex justify-center">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-4 sm:gap-5 text-[12px] sm:text-[13px] tracking-[0.28em] sm:tracking-[0.3em] uppercase px-6 sm:px-12 py-4 sm:py-5 border border-porcelain text-porcelain hover:bg-porcelain hover:text-obsidian transition-colors"
          >
            {t('viewAll')}
            <span
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
