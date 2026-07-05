import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Browser favicon (tab, bookmarks) — MP monogram in the site palette.
// Rendered at 32×32 as PNG. Browsers scale down for the 16×16 slot.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000a0c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'Georgia, serif',
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: 2,
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        MP
      </div>
    ),
    { ...size },
  );
}
