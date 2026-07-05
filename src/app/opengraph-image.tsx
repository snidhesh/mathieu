import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mathieu Poissonnet — Off-Plan Real Estate Advisor, Dubai';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          background: '#000a0c',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#ffffff',
            fontWeight: 300,
          }}
        >
          Off-Plan Real Estate Advisor — Dubai
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 110,
              lineHeight: 1,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#ffffff',
              fontWeight: 300,
            }}
          >
            Mathieu Poissonnet
          </div>
          <div
            style={{
              marginTop: 32,
              width: 240,
              height: 1,
              background: '#a5a9aa',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              marginTop: 32,
              fontSize: 36,
              fontStyle: 'italic',
              color: '#ffffff',
              maxWidth: 900,
              fontWeight: 300,
            }}
          >
            Off-plan investments in the UAE, done with precision.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#a5a9aa',
          }}
        >
          <span>Emaar Beachfront · Palm Jebel Ali · Emirates Hills</span>
          <span style={{ color: '#ffffff', letterSpacing: 6 }}>MP</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
