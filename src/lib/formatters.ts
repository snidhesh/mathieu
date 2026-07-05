// Format a positive integer as a locale-grouped decimal — no currency prefix.
// The Dirham symbol is rendered separately via <DirhamSymbol />.
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function whatsappHref(
  number: string | undefined,
  text?: string,
): string {
  const num = (number ?? '').replace(/\D/g, '');
  const base = `https://wa.me/${num}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mailtoHref(
  email: string | undefined,
  subject?: string,
  body?: string,
): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const qs = params.length ? `?${params.join('&')}` : '';
  return `mailto:${email ?? ''}${qs}`;
}
