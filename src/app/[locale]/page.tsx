import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { Stats } from '@/components/sections/Stats';
import { About } from '@/components/sections/About';
import { Listings } from '@/components/sections/Listings';
import { CommunitiesGrid } from '@/components/sections/CommunitiesGrid';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { MarketIntelligence } from '@/components/sections/MarketIntelligence';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <MarketIntelligence />
        <Listings />
        <CommunitiesGrid />
        <About />
        <Services />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
