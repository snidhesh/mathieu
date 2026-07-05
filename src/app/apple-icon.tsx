import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// iOS "Add to Home Screen" icon — 180×180 PNG.
// Same MP monogram, scaled up with a subtle frame.
export default function AppleIcon() {
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
          fontSize: 96,
          fontWeight: 400,
          letterSpacing: 10,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />
        <span style={{ display: 'flex', marginLeft: 10 }}>MP</span>
      </div>
    ),
    { ...size },
  );
}
