export type MarketReport = {
  id: string;
  slug: string;
  publishedAt: string; // ISO date
  // Optional — when set, page renders a "Download report" button.
  // When absent, the report is treated as an inline brief.
  pdfPath?: string;
  // Optional cover image (rendered via next/image if present).
  coverImage?: string;
};

// Client supplies real PDFs; drop them into public/market-intelligence/
// and set `pdfPath` on the matching entry below. All copy lives in
// src/messages/{en,fr}.json under marketIntelligence.reports.<id>.
export const reports: MarketReport[] = [
  {
    id: 'off-plan-h1-2026',
    slug: 'off-plan-h1-2026',
    publishedAt: '2026-07-08',
  },
  {
    id: 'palm-jebel-ali-focus',
    slug: 'palm-jebel-ali-focus',
    publishedAt: '2026-06-24',
  },
  {
    id: 'handover-wave-2026',
    slug: 'handover-wave-2026',
    publishedAt: '2026-06-10',
  },
];

export const publishedReports: MarketReport[] = [...reports].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
);

export function resolveReport(id: string): MarketReport | undefined {
  return reports.find((r) => r.id === id);
}

export function getLatestReport(): MarketReport | undefined {
  return publishedReports[0];
}

// Headline market stats surfaced at the top of /market-intelligence.
// Values sourced from public H1 2026 releases (Dubai Land Department,
// Knight Frank, Reidin, Emirates NBD reporting). Update quarterly.
// Copy lives in translations under marketIntelligence.brief.stats.
export type MarketStat = {
  id: 'salesValue' | 'offPlanShare' | 'avgPsf' | 'handovers';
  value: string;
};

export const marketStats: MarketStat[] = [
  { id: 'salesValue', value: 'AED 221.3B' },
  { id: 'offPlanShare', value: '76%' },
  { id: 'avgPsf', value: 'AED 2,050' },
  { id: 'handovers', value: '~120,000' },
];
