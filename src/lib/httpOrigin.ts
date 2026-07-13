import type { NextRequest } from 'next/server';

// Strict origin allowlist for market-intel subscribe endpoint.
// Do NOT copy the /api/contact helper — its `.vercel.app` wildcard is over-broad.
// Only exact origins are accepted: canonical prod URL, current Vercel deployment,
// and localhost dev ports.

function tryOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return url.origin;
  } catch {
    return null;
  }
}

function collectAllowedOrigins(): Set<string> {
  const out = new Set<string>();
  const site = tryOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (site) out.add(site);
  const vercel = tryOrigin(process.env.VERCEL_URL);
  if (vercel) out.add(vercel);
  if (process.env.NODE_ENV !== 'production') {
    for (const port of [3000, 3001, 3002, 3003]) {
      out.add(`http://localhost:${port}`);
    }
  }
  return out;
}

export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const requestOrigin = tryOrigin(origin);
  if (!requestOrigin) return false;
  return collectAllowedOrigins().has(requestOrigin);
}

// Config validator surfaced from the route. Throws in prod when required env is missing.
export function assertSubscribeConfigOrThrow(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const site = tryOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (!site) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL missing or unparseable in production',
    );
  }
}
