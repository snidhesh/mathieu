export type InsightSlug =
  | 'palm-jebel-ali'
  | 'emaar-beachfront-payment'
  | 'golden-visa-property'
  | 'off-plan-3-metrics';

export type InsightCategory = 'off-plan' | 'market' | 'investment' | 'guide';

export type Insight = {
  slug: InsightSlug;
  category: InsightCategory;
  publishedAt: string; // ISO date
  readMinutes: number;
  cover: string;
};

// Cover images reuse existing Wikimedia-sourced Dubai landmark photos.
// The `?v2` query keeps them aligned with the site's cache-buster.
export const insights: Insight[] = [
  {
    slug: 'palm-jebel-ali',
    category: 'off-plan',
    publishedAt: '2026-06-24',
    readMinutes: 6,
    cover: '/communities/palm-jumeirah/hero.jpg?v2',
  },
  {
    slug: 'emaar-beachfront-payment',
    category: 'off-plan',
    publishedAt: '2026-06-10',
    readMinutes: 5,
    cover: '/listings/downtown/cover.jpg?v2',
  },
  {
    slug: 'golden-visa-property',
    category: 'guide',
    publishedAt: '2026-05-22',
    readMinutes: 8,
    cover: '/communities/downtown-dubai/hero.jpg?v2',
  },
  {
    slug: 'off-plan-3-metrics',
    category: 'investment',
    publishedAt: '2026-04-18',
    readMinutes: 7,
    cover: '/communities/downtown-dubai/1.jpg?v2',
  },
];

// Sorted newest-first for the index view.
export const sortedInsights: Insight[] = [...insights].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

export function getRelatedInsights(
  current: InsightSlug,
  limit = 2,
): Insight[] {
  return sortedInsights.filter((i) => i.slug !== current).slice(0, limit);
}
