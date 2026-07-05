import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/motion/FadeIn';
import { communities } from '@/lib/communities';

export function CommunitiesGrid() {
  const t = useTranslations('communities.index');
  const tItems = useTranslations('communities.items');

  return (
    <section id="communities" className="py-20 lg:py-32 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-[11px] tracking-[0.35em] uppercase text-porcelain">
            {t('eyebrow')}
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-6 font-sans font-light text-3xl lg:text-5xl leading-[1.15] text-porcelain tracking-tight max-w-3xl">
            {t('title')}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-porcelain-dim max-w-xl">{t('subtitle')}</p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="hairline w-40 mt-10" />
        </FadeIn>

        {/* Mobile: horizontal snap-scroll. md+: 3-column grid. */}
        <div className="mt-16 flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x md:snap-none snap-mandatory -mx-6 md:mx-0 px-6 md:px-0 pb-4 md:pb-0 scrollbar-hide">
          {communities.map((community, i) => (
            <FadeIn
              key={community.slug}
              delay={i * 0.08}
              className="snap-start shrink-0 w-[82%] sm:w-[65%] md:w-auto md:shrink"
            >
              <Link
                href={`/communities/${community.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={community.heroImage}
                    alt={tItems(`${community.slug}.name`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 82vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-porcelain-dim">
                      {community.emirate}
                    </p>
                    <h3 className="mt-2 font-display text-2xl lg:text-3xl text-porcelain tracking-[0.05em]">
                      {tItems(`${community.slug}.name`)}
                    </h3>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* Mobile-only affordance: swipe hint */}
        <p className="md:hidden mt-4 text-[10px] tracking-[0.25em] uppercase text-porcelain-dim/70">
          ← Swipe →
        </p>
      </div>
    </section>
  );
}
