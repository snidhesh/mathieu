// Inline JSON-LD script tag. Server component; safe to embed anywhere
// in the App Router tree. Multiple can co-exist on the same page.
//
// XSS hardening: escape the three characters that would allow a
// malicious string inside the schema (e.g. `</script>` or embedded
// HTML) to break out of the script tag and execute.
function safeJson(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(data) }}
    />
  );
}
