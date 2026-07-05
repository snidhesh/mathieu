import { AGENT, absoluteUrl } from './site';
import type { Property } from './listings';
import type { Community } from './communities';
import type { Insight } from './insights';

// ─────────────────────────────────────────────────────────────
// Root graph — Person + RealEstateAgent + WebSite
// Embed once per HTML document (homepage, layout, or per-page).
// ─────────────────────────────────────────────────────────────
export function rootGraph(locale: string) {
  const home = absoluteUrl(`/${locale}`);
  const personId = `${absoluteUrl('/')}#mathieu`;
  const agentId = `${absoluteUrl('/')}#agent`;
  const websiteId = `${absoluteUrl('/')}#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: AGENT.name,
        jobTitle: 'Off-Plan Real Estate Advisor',
        email: AGENT.email,
        telephone: AGENT.phoneE164,
        image: absoluteUrl('/portraits/agent.jpg'),
        knowsLanguage: AGENT.languages,
        url: absoluteUrl('/'),
        sameAs: [AGENT.linkedin],
        worksFor: {
          '@type': 'Organization',
          name: AGENT.brokerage,
          address: {
            '@type': 'PostalAddress',
            addressLocality: AGENT.city,
            addressCountry: AGENT.countryCode,
          },
        },
      },
      {
        '@type': 'RealEstateAgent',
        '@id': agentId,
        name: AGENT.name,
        url: absoluteUrl('/'),
        image: absoluteUrl('/portraits/agent.jpg'),
        email: AGENT.email,
        telephone: AGENT.phoneE164,
        address: {
          '@type': 'PostalAddress',
          addressLocality: AGENT.city,
          addressCountry: AGENT.countryCode,
        },
        areaServed: [
          { '@type': 'City', name: 'Dubai' },
          ...AGENT.areasServed.map((n) => ({
            '@type': 'Place' as const,
            name: n,
          })),
        ],
        priceRange: 'AED 2,000,000 – AED 200,000,000',
        knowsLanguage: AGENT.languages,
        parentOrganization: {
          '@type': 'Organization',
          name: AGENT.brokerage,
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absoluteUrl('/'),
        name: `${AGENT.name} — Dubai Real Estate`,
        inLanguage: AGENT.languages,
        publisher: { '@id': personId },
      },
      {
        '@type': 'WebPage',
        '@id': `${home}#webpage`,
        url: home,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        about: { '@id': agentId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl('/portraits/agent.jpg'),
        },
      },
    ],
  };
}

// ─────────────────────────────────────────────────────────────
// BreadcrumbList
// ─────────────────────────────────────────────────────────────
export function breadcrumb(
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// Property detail — SingleFamilyResidence / Apartment for schema
// with Offer, address, area served.
// ─────────────────────────────────────────────────────────────
export function propertySchema(
  property: Property,
  locale: string,
  name: string,
  description: string,
  communityName: string,
) {
  const url = absoluteUrl(`/${locale}/properties/${property.slug}`);
  const isHouse =
    property.type === 'Villa' || property.type === 'Mansion';
  const type = isHouse ? 'SingleFamilyResidence' : 'Apartment';

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#property`,
    name,
    description,
    url,
    image: [absoluteUrl(property.cover.replace(/\?.*/, ''))],
    numberOfBedrooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    numberOfRooms: property.beds,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.sqft,
      unitCode: 'FTK', // square feet
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: communityName,
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        '@id': `${absoluteUrl('/')}#mathieu`,
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Article — for insight detail pages
// ─────────────────────────────────────────────────────────────
export function articleSchema(
  insight: Insight,
  locale: string,
  headline: string,
  description: string,
) {
  const url = absoluteUrl(`/${locale}/insights/${insight.slug}`);
  const authorId = `${absoluteUrl('/')}#mathieu`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    image: absoluteUrl(insight.cover.replace(/\?.*/, '')),
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    inLanguage: locale,
    articleSection: insight.category,
    wordCount: insight.readMinutes * 200,
    author: { '@type': 'Person', '@id': authorId, name: AGENT.name },
    publisher: {
      '@type': 'Person',
      '@id': authorId,
      name: AGENT.name,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

// ─────────────────────────────────────────────────────────────
// Community detail — Place / TouristDestination
// ─────────────────────────────────────────────────────────────
export function communitySchema(
  community: Community,
  locale: string,
  name: string,
  description: string,
) {
  const url = absoluteUrl(`/${locale}/communities/${community.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${url}#place`,
    name,
    description,
    url,
    image: absoluteUrl(community.heroImage.replace(/\?.*/, '')),
    address: {
      '@type': 'PostalAddress',
      addressLocality: name,
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    containedInPlace: {
      '@type': 'City',
      name: 'Dubai',
    },
  };
}

// ─────────────────────────────────────────────────────────────
// <JsonLd data={...}/> — inline JSON-LD script tag
// ─────────────────────────────────────────────────────────────
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data);
}
