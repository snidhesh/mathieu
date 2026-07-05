import type { CommunitySlug } from './listings';

export type Community = {
  slug: CommunitySlug;
  emirate: string;
  heroImage: string;
  attractions: string[];
  attractionImages: string[];
  highlights: string[];
};

// Bumping this cache-busts stale <img>/next-image URLs in browsers.
// Increment whenever the underlying JPGs are swapped.
const V = 'v2';

export const communities: Community[] = [
  {
    slug: 'palm-jumeirah',
    emirate: 'Dubai',
    heroImage: `/communities/palm-jumeirah/hero.jpg?${V}`,
    attractions: ['nakheel-mall', 'atlantis', 'private-beaches', 'the-view'],
    attractionImages: [
      `/communities/palm-jumeirah/1.jpg?${V}`,
      `/communities/palm-jumeirah/2.jpg?${V}`,
      `/communities/palm-jumeirah/3.jpg?${V}`,
    ],
    highlights: ['supply', 'yield'],
  },
  {
    slug: 'downtown-dubai',
    emirate: 'Dubai',
    heroImage: `/communities/downtown-dubai/hero.jpg?${V}`,
    attractions: ['burj-khalifa', 'dubai-mall', 'fountain', 'opera'],
    attractionImages: [
      `/communities/downtown-dubai/1.jpg?${V}`,
      `/communities/downtown-dubai/2.jpg?${V}`,
      `/communities/downtown-dubai/3.jpg?${V}`,
    ],
    highlights: ['walkability', 'brand'],
  },
  {
    slug: 'emirates-hills',
    emirate: 'Dubai',
    heroImage: `/communities/emirates-hills/hero.jpg?${V}`,
    attractions: [
      'montgomerie-golf',
      'lake-views',
      'gated-community',
      'international-schools',
    ],
    attractionImages: [
      `/communities/emirates-hills/1.jpg?${V}`,
      `/communities/emirates-hills/2.jpg?${V}`,
      `/communities/emirates-hills/3.jpg?${V}`,
    ],
    highlights: ['supply', 'prestige'],
  },
];

export function getCommunity(slug: string): Community | undefined {
  return communities.find((c) => c.slug === slug);
}
