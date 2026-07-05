export type PropertySlug = 'palm' | 'downtown' | 'hills';
export type CommunitySlug = 'palm-jumeirah' | 'downtown-dubai' | 'emirates-hills';

export type Property = {
  slug: PropertySlug;
  offering: 'sale' | 'off-plan';
  price: number;
  reference: string;
  community: CommunitySlug;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  type: string;
  furnishing: string;
  handover: string | null;
  cover: string;
  gallery: string[];
  amenities: string[];
};

// Bumping this cache-busts stale <img>/next-image URLs in browsers that
// hold onto the previous file at the same path. Increment when the
// underlying JPGs are swapped.
const V = 'v2';

const covers: Record<PropertySlug, string> = {
  palm: `/listings/palm/cover.jpg?${V}`,
  downtown: `/listings/downtown/cover.jpg?${V}`,
  hills: `/listings/hills/cover.jpg?${V}`,
};

const galleries: Record<PropertySlug, string[]> = {
  palm: [
    `/listings/palm/1.jpg?${V}`,
    `/listings/palm/2.jpg?${V}`,
    `/listings/palm/3.jpg?${V}`,
  ],
  downtown: [
    `/listings/downtown/1.jpg?${V}`,
    `/listings/downtown/2.jpg?${V}`,
    `/listings/downtown/3.jpg?${V}`,
  ],
  hills: [
    `/listings/hills/1.jpg?${V}`,
    `/listings/hills/2.jpg?${V}`,
    `/listings/hills/3.jpg?${V}`,
  ],
};

export const properties: Property[] = [
  {
    slug: 'palm',
    offering: 'sale',
    price: 42500000,
    reference: 'MP-PALM-006',
    community: 'palm-jumeirah',
    beds: 6,
    baths: 7,
    sqft: 12400,
    parking: 4,
    type: 'Villa',
    furnishing: 'Furnished',
    handover: null,
    cover: covers.palm,
    gallery: galleries.palm,
    amenities: [
      'private-beach',
      'infinity-pool',
      'private-cinema',
      'staff-quarters',
      'smart-home',
      'gym',
    ],
  },
  {
    slug: 'downtown',
    offering: 'off-plan',
    price: 28900000,
    reference: 'MP-DTWN-004',
    community: 'downtown-dubai',
    beds: 4,
    baths: 5,
    sqft: 6800,
    parking: 3,
    type: 'Penthouse',
    furnishing: 'Unfurnished',
    handover: 'Q4 2028',
    cover: covers.downtown,
    gallery: galleries.downtown,
    amenities: [
      'burj-views',
      'private-terrace',
      'concierge',
      'infinity-pool',
      'valet-parking',
      'private-lift',
    ],
  },
  {
    slug: 'hills',
    offering: 'sale',
    price: 76000000,
    reference: 'MP-HILL-007',
    community: 'emirates-hills',
    beds: 7,
    baths: 9,
    sqft: 18500,
    parking: 6,
    type: 'Mansion',
    furnishing: 'Furnished',
    handover: null,
    cover: covers.hills,
    gallery: galleries.hills,
    amenities: [
      'golf-frontage',
      'indoor-pool',
      'staff-wing',
      'private-cinema',
      'wine-cellar',
      'smart-home',
    ],
  },
];

export function getProperty(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertiesInCommunity(
  community: CommunitySlug,
): Property[] {
  return properties.filter((p) => p.community === community);
}

/* --- Legacy alias so existing Listings.tsx code compiles unchanged --- */
export type Listing = {
  id: PropertySlug;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
};

export const listings: Listing[] = properties.map((p) => ({
  id: p.slug,
  price: p.price,
  beds: p.beds,
  baths: p.baths,
  sqft: p.sqft,
  image: p.cover,
}));
