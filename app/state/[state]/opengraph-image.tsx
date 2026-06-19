import { ImageResponse } from 'next/og';
import { STATES, STATES_BY_SLUG } from '@/lib/states';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const info = STATES_BY_SLUG.get(stateSlug);
  const label = info?.type === 'ut' ? 'Union Territory' : 'State';
  const nameFontSize = info && info.name.length > 18 ? '52px' : info && info.name.length > 14 ? '64px' : '76px';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0d2040 0%, #1a3a6b 60%, #1e4d8c 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f97316',
              borderRadius: '14px',
              padding: '10px 18px',
              color: 'white',
              fontWeight: 900,
              fontSize: '30px',
            }}
          >
            PIN
          </div>
          <div style={{ display: 'flex', color: 'white', fontWeight: 900, fontSize: '34px' }}>
            <span>Pincode</span>
            <span style={{ color: '#f97316' }}>IN</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              color: '#f97316',
              fontSize: '18px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            {label} · PIN Code Directory
          </div>
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: nameFontSize,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-2px',
            }}
          >
            {info?.name ?? 'India'}
          </div>
          {info?.capital && (
            <div style={{ display: 'flex', color: 'rgba(255,255,255,0.65)', fontSize: '28px', fontWeight: 500 }}>
              Capital: {info.capital}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '20px',
          }}
        >
          <span style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
            india.singhyogendra.com.np
          </span>
          <div
            style={{
              display: 'flex',
              background: 'rgba(249,115,22,0.15)',
              border: '1px solid rgba(249,115,22,0.4)',
              color: '#f97316',
              fontSize: '16px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '100px',
            }}
          >
            All Districts &amp; PIN Codes
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
