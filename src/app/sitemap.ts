import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/site';
import { properties } from '@/lib/listings';
import { communities } from '@/lib/communities';
import { insights } from '@/lib/insights';
import { projects } from '@/lib/projects';

// Static top-level routes under [locale]. Order matters for hierarchy in
// some crawlers.
const STATIC_ROUTES = [
  '',
  '/properties',
  '/projects',
  '/communities',
  '/insights',
  '/about',
  '/services',
  '/contact',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static routes × locales
  for (const path of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      const url = absoluteUrl(`/${locale}${path}`);
      entries.push({
        url,
        lastModified: now,
        changeFrequency:
          path === '' || path === '/properties' || path === '/insights'
            ? 'weekly'
            : 'monthly',
        priority:
          path === ''
            ? 1.0
            : path === '/properties' || path === '/insights'
              ? 0.9
              : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, absoluteUrl(`/${l}${path}`)]),
          ),
        },
      });
    }
  }

  // Property details × locales
  for (const p of properties) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/properties/${p.slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              absoluteUrl(`/${l}/properties/${p.slug}`),
            ]),
          ),
        },
      });
    }
  }

  // Community details × locales
  for (const c of communities) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/communities/${c.slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              absoluteUrl(`/${l}/communities/${c.slug}`),
            ]),
          ),
        },
      });
    }
  }

  // Project details × locales
  for (const p of projects) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/projects/${p.slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.75,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              absoluteUrl(`/${l}/projects/${p.slug}`),
            ]),
          ),
        },
      });
    }
  }

  // Insight articles × locales
  for (const i of insights) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/insights/${i.slug}`),
        lastModified: new Date(i.publishedAt),
        changeFrequency: 'yearly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              absoluteUrl(`/${l}/insights/${i.slug}`),
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
