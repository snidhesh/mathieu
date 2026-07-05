import { NextRequest, NextResponse } from 'next/server';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  hp?: string; // honeypot
};

// ─────────────────────────────────────────────────────────────
// Origin verification — only accept POSTs from a known origin.
// Blocks casual cross-site abuse (a third party pointing their
// form at this endpoint) without adding UX friction for real users.
// ─────────────────────────────────────────────────────────────
function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) {
    // Same-origin fetch from a browser sends no Origin on same-site GETs;
    // for POSTs it always sends one. Missing Origin on a POST is suspicious.
    return false;
  }

  const allowed: string[] = [];
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    allowed.push(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    allowed.push(`https://${process.env.VERCEL_URL}`);
  }
  // Dev
  allowed.push('http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003');

  // Preview URLs: any *.vercel.app that matches the project name.
  // If the project is deployed on Vercel and NEXT_PUBLIC_SITE_URL isn't
  // set for preview, allow *.vercel.app under the same project prefix.
  try {
    const url = new URL(origin);
    if (allowed.some((a) => a.replace(/\/$/, '') === origin.replace(/\/$/, ''))) {
      return true;
    }
    if (url.hostname.endsWith('.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 });
  }

  const { name, email, phone, interest, message, hp } = body;

  // Honeypot — if a bot filled the hidden field, accept silently
  if (hp && hp.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'missing-fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid-email' }, { status: 400 });
  }
  if (message.trim().length < 20) {
    return NextResponse.json({ error: 'message-too-short' }, { status: 400 });
  }

  // Field length caps — refuse absurdly large payloads even if they got past
  // client-side validation.
  if (
    name.length > 200 ||
    email.length > 320 ||
    (phone && phone.length > 40) ||
    (interest && interest.length > 120) ||
    message.length > 10_000
  ) {
    return NextResponse.json({ error: 'payload-too-large' }, { status: 413 });
  }

  const to = process.env.CONTACT_INBOX;
  const from = process.env.CONTACT_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  const lines = [
    `From: ${name} <${email}>`,
    phone ? `Phone: ${phone}` : null,
    interest ? `Interest: ${interest}` : null,
    '',
    message,
  ].filter(Boolean) as string[];
  const text = lines.join('\n');
  const subject = `Website enquiry — ${name}${interest ? ` · ${interest}` : ''}`;

  // Dev fallback: RESEND not configured. Log to server console so the
  // form flow can be tested end-to-end without setting up delivery.
  if (!apiKey || !to || !from) {
    console.log('─── Contact form submission (RESEND not configured) ───');
    console.log('Subject:', subject);
    console.log('Reply-To:', email);
    console.log(text);
    console.log('─────');
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend send failed:', res.status, errText);
      return NextResponse.json({ error: 'send-failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact route error:', e);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
