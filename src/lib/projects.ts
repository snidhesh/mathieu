export type ProjectSlug = 'hq-by-rove' | 'palm-jebel-ali' | 'bayn-by-ora';

// Only status currently used. Add 'ready' (or others) when a real project needs it —
// both in this union and in projects.detail.statusLabels in the message files.
export type ProjectStatus = 'off-plan';

export type Project = {
  slug: ProjectSlug;
  developer: string;
  brand: string | null;
  emirate: 'Dubai' | 'Abu Dhabi';
  status: ProjectStatus;
  handover: string | null;
  handoverKey: 'handoverText' | null;
  startingPrice: number | null;
  startingPriceSourceKey: 'priceSourceNote' | null;
  paymentPlanKey: 'paymentPlan' | null;
  heroImage: string;
  gallery: string[];
  externalUrl: string;
  highlights: string[];
};

const V = 'v1';

export const projects: Project[] = [
  {
    slug: 'hq-by-rove',
    developer: 'IRTH Urban Development LLC',
    brand: 'Rove Hotels',
    emirate: 'Dubai',
    status: 'off-plan',
    handover: 'Q1 2029',
    handoverKey: null,
    startingPrice: null,
    startingPriceSourceKey: null,
    paymentPlanKey: 'paymentPlan',
    heroImage: `/projects/hq-by-rove/hero.jpg?${V}`,
    gallery: [
      `/projects/hq-by-rove/1.jpg?${V}`,
      `/projects/hq-by-rove/2.jpg?${V}`,
      `/projects/hq-by-rove/3.jpg?${V}`,
      `/projects/hq-by-rove/4.jpg?${V}`,
      `/projects/hq-by-rove/5.jpg?${V}`,
    ],
    externalUrl: 'https://irth.ae/hq-by-rove-marasi-bay/',
    highlights: [
      'hospitality-brand',
      'amenities-120k',
      'lifestyle-mix',
      'rooftop-deck',
    ],
  },
  {
    slug: 'palm-jebel-ali',
    developer: 'Nakheel Properties',
    brand: null,
    emirate: 'Dubai',
    status: 'off-plan',
    handover: null,
    handoverKey: 'handoverText',
    // Price, payment plan, imagery, and "from 7,316 sq ft" size sourced from
    // broker listing: https://allproperties.ae/project/palm-jebel-ali/
    // (verified 2026-07-11). Not Nakheel-confirmed. Update when Nakheel
    // publishes official figures.
    startingPrice: 20000000,
    startingPriceSourceKey: 'priceSourceNote',
    paymentPlanKey: 'paymentPlan',
    heroImage: `/projects/palm-jebel-ali/hero.jpg?${V}`,
    gallery: [
      `/projects/palm-jebel-ali/1.jpg?${V}`,
      `/projects/palm-jebel-ali/2.jpg?${V}`,
      `/projects/palm-jebel-ali/3.jpg?${V}`,
      `/projects/palm-jebel-ali/4.jpg?${V}`,
      `/projects/palm-jebel-ali/5.jpg?${V}`,
    ],
    externalUrl:
      'https://www.nakheel.com/en/developments/nakheel-collections/palmjebelali',
    highlights: [
      'master-plan-scale',
      'beach-frontage',
      'payment-plan-20-80',
      'nakheel-master-plan',
    ],
  },
  {
    slug: 'bayn-by-ora',
    developer: 'ORA Developers',
    brand: null,
    emirate: 'Abu Dhabi',
    status: 'off-plan',
    handover: null,
    handoverKey: null,
    startingPrice: null,
    startingPriceSourceKey: null,
    paymentPlanKey: 'paymentPlan',
    heroImage: `/projects/bayn-by-ora/hero.jpg?${V}`,
    gallery: [
      `/projects/bayn-by-ora/1.jpg?${V}`,
      `/projects/bayn-by-ora/2.jpg?${V}`,
      `/projects/bayn-by-ora/3.jpg?${V}`,
      `/projects/bayn-by-ora/4.jpg?${V}`,
      `/projects/bayn-by-ora/5.jpg?${V}`,
    ],
    externalUrl: 'https://www.ora-developers.com/bayn-ghantoot-uae',
    highlights: [
      'private-beach',
      'marina',
      'lagoon-living',
      'location-between-emirates',
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
