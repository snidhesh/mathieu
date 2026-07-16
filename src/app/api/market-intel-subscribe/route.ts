import { NextRequest, NextResponse } from 'next/server';
import { isAllowedOrigin, assertSubscribeConfigOrThrow } from '@/lib/httpOrigin';

// Server constants — never trust client for these.
const CONSENT_SOURCE = 'market-intel-form';
const CONSENT_VERSION = '1';
const ALLOWED_LOCALES = new Set(['en', 'fr']);

const RESEND_BASE = 'https://api.resend.com';
const MAX_BODY_BYTES = 2048;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribePayload = {
  email?: unknown;
  firstName?: unknown;
  consent?: unknown;
  locale?: unknown;
  hp?: unknown;
};

// Bounded reader — aborts past MAX_BODY_BYTES regardless of Content-Length claims.
async function readBoundedText(req: NextRequest): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) throw new BodyTooLargeError();

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
        throw new BodyTooLargeError();
      }
      chunks.push(value);
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  return new TextDecoder().decode(merged);
}

class BodyTooLargeError extends Error {}
class ParseError extends Error {}

function logEvent(
  kind: string,
  meta: Record<string, string | number | undefined>,
): void {
  const eventId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  // Never log the raw email or API key. Only shape / kind / eventId.
  const safe = { eventId, kind, ...meta };
  console.log('[market-intel-subscribe]', JSON.stringify(safe));
}

type ResendContact = {
  id?: string;
  email?: string;
  unsubscribed?: boolean;
};

async function resendJson(
  path: string,
  init: RequestInit,
  apiKey: string,
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${RESEND_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // ignore non-JSON responses
  }
  return { status: res.status, body };
}

// Resend returns a structured error object; treat "already exists" specifically,
// not any 409. Verify exact `name` value at implementation against the current
// Resend API response (as of writing: 'validation_error' with a message
// referencing existence, or a dedicated 'contact_already_exists' name — implementer
// should verify).
function isAlreadyExistsError(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const b = body as { name?: unknown; message?: unknown };
  const name = typeof b.name === 'string' ? b.name.toLowerCase() : '';
  const message =
    typeof b.message === 'string' ? b.message.toLowerCase() : '';
  return (
    name.includes('contact_already_exists') ||
    name.includes('already_exists') ||
    (name.includes('validation') && message.includes('already exists'))
  );
}

export async function POST(req: NextRequest) {
  // Prod-required config surfaces as 503 immediately.
  try {
    assertSubscribeConfigOrThrow();
  } catch {
    return NextResponse.json(
      { error: 'configuration' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (!isAllowedOrigin(req)) {
    return NextResponse.json(
      { error: 'forbidden' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let raw: string;
  try {
    raw = await readBoundedText(req);
  } catch (e) {
    if (e instanceof BodyTooLargeError) {
      return NextResponse.json(
        { error: 'payload-too-large' },
        { status: 413, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return NextResponse.json(
      { error: 'invalid-body' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let body: SubscribePayload;
  try {
    body = JSON.parse(raw) as SubscribePayload;
    if (!body || typeof body !== 'object') throw new ParseError('not-object');
  } catch {
    return NextResponse.json(
      { error: 'invalid-json' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Honeypot — silent 200 (never touches Resend).
  if (typeof body.hp === 'string' && body.hp.length > 0) {
    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Strict validation.
  const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
  const email = emailRaw.toLowerCase();
  const firstNameRaw =
    typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const consent = body.consent === true;
  const locale = typeof body.locale === 'string' ? body.locale : '';

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'invalid-email' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (firstNameRaw.length > 100) {
    return NextResponse.json(
      { error: 'invalid-first-name' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: 'consent-required' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (!ALLOWED_LOCALES.has(locale)) {
    return NextResponse.json(
      { error: 'invalid-locale' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_MARKET_SEGMENT_ID;
  const topicId = process.env.RESEND_MARKET_TOPIC_ID;

  // Dev fallback: only when NODE_ENV !== 'production' AND RESEND_API_KEY is unset.
  if (process.env.NODE_ENV !== 'production' && !apiKey) {
    logEvent('dev-fallback', { locale, hasFirstName: firstNameRaw ? 1 : 0 });
    return NextResponse.json(
      { ok: true, dev: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Prod (or dev with API key set) requires all three env values.
  if (!apiKey || !segmentId || !topicId) {
    logEvent('missing-config', {
      hasApiKey: apiKey ? 1 : 0,
      hasSegment: segmentId ? 1 : 0,
      hasTopic: topicId ? 1 : 0,
    });
    return NextResponse.json(
      { error: 'configuration' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const nowIso = new Date().toISOString();
  const properties = {
    market_consent_at: nowIso,
    market_consent_source: CONSENT_SOURCE,
    market_consent_version: CONSENT_VERSION,
    market_consent_locale: locale,
  };

  // Segments takes objects with { id }; topics takes { id, subscription }.
  const createBody: Record<string, unknown> = {
    email,
    ...(firstNameRaw ? { first_name: firstNameRaw } : {}),
    unsubscribed: false,
    properties,
    segments: [{ id: segmentId }],
    topics: [{ id: topicId, subscription: 'opt_in' }],
  };

  try {
    const create = await resendJson(
      '/contacts',
      { method: 'POST', body: JSON.stringify(createBody) },
      apiKey,
    );

    if (create.status >= 200 && create.status < 300) {
      logEvent('created', { locale });
      return NextResponse.json(
        { ok: true },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (isAlreadyExistsError(create.body)) {
      // Existing contact — fetch and route based on unsubscribed status.
      const getRes = await resendJson(
        `/contacts?email=${encodeURIComponent(email)}`,
        { method: 'GET' },
        apiKey,
      );
      const existing = extractContact(getRes.body);
      if (!existing?.id) {
        logEvent('fetch-existing-missing-id', { locale });
        return NextResponse.json(
          { error: 'upstream' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } },
        );
      }
      if (existing.unsubscribed === true) {
        // Respect prior withdrawal — do NOT flip global flag or touch Segment/Topic.
        logEvent('existing-unsubscribed-noop', { locale });
        return NextResponse.json(
          { ok: true },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      }
      // Update properties via PATCH /contacts/:id.
      const patchProps = await resendJson(
        `/contacts/${encodeURIComponent(existing.id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ...(firstNameRaw ? { first_name: firstNameRaw } : {}),
            properties,
          }),
        },
        apiKey,
      );
      if (patchProps.status < 200 || patchProps.status >= 300) {
        logEvent('existing-patch-failed', {
          locale,
          status: patchProps.status,
        });
        return NextResponse.json(
          { error: 'upstream' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } },
        );
      }
      // Add to Segment via dedicated endpoint (idempotent).
      const seg = await resendJson(
        `/contacts/${encodeURIComponent(existing.id)}/segments/${encodeURIComponent(segmentId)}`,
        { method: 'POST' },
        apiKey,
      );
      if (
        (seg.status < 200 || seg.status >= 300) &&
        seg.status !== 409 &&
        seg.status !== 404 // treat "already assigned" idempotently
      ) {
        logEvent('segment-add-failed', { locale, status: seg.status });
        return NextResponse.json(
          { error: 'upstream' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } },
        );
      }
      // Opt in via dedicated Topic endpoint (idempotent).
      const topic = await resendJson(
        `/contacts/${encodeURIComponent(existing.id)}/topics`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            topics: [{ id: topicId, subscription: 'opt_in' }],
          }),
        },
        apiKey,
      );
      if (
        (topic.status < 200 || topic.status >= 300) &&
        topic.status !== 404 &&
        topic.status !== 409
      ) {
        logEvent('topic-update-failed', { locale, status: topic.status });
        return NextResponse.json(
          { error: 'upstream' },
          { status: 502, headers: { 'Cache-Control': 'no-store' } },
        );
      }
      logEvent('existing-updated', { locale });
      return NextResponse.json(
        { ok: true },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }

    // Some other Resend error — never bubble details to the client, but
    // log the message server-side so we can see what Resend actually said.
    const errBody = create.body as { name?: unknown; message?: unknown } | null;
    logEvent('create-failed', {
      locale,
      status: create.status,
      errorName:
        typeof errBody?.name === 'string' ? errBody.name : 'unknown',
      errorMessage:
        typeof errBody?.message === 'string'
          ? errBody.message.slice(0, 300)
          : 'none',
    });
    return NextResponse.json(
      { error: 'upstream' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    logEvent('exception', {
      locale,
      kind: e instanceof Error ? e.name : 'unknown',
    });
    return NextResponse.json(
      { error: 'internal' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

function extractContact(body: unknown): ResendContact | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as {
    id?: unknown;
    email?: unknown;
    unsubscribed?: unknown;
    data?: unknown;
  };
  // Some Resend responses wrap a single contact under `data` or as an array.
  const candidates: unknown[] = [];
  if (b.data && typeof b.data === 'object') {
    if (Array.isArray(b.data)) candidates.push(...b.data);
    else candidates.push(b.data);
  }
  candidates.push(b);
  for (const c of candidates) {
    if (!c || typeof c !== 'object') continue;
    const cc = c as Record<string, unknown>;
    if (typeof cc.id === 'string') {
      return {
        id: cc.id,
        email: typeof cc.email === 'string' ? cc.email : undefined,
        unsubscribed:
          typeof cc.unsubscribed === 'boolean' ? cc.unsubscribed : undefined,
      };
    }
  }
  return null;
}
