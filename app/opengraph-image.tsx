import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function Image() {
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
              letterSpacing: '-0.5px',
            }}
          >
            PIN
          </div>
          <div style={{ display: 'flex', color: 'white', fontWeight: 900, fontSize: '34px', letterSpacing: '-0.5px' }}>
            <span>PinCode</span>
            <span style={{ color: '#f97316' }}>Finder</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            India&apos;s Complete PIN Code Directory
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                color: 'white',
                fontSize: '74px',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-2px',
              }}
            >
              Find Any
            </div>
            <div
              style={{
                display: 'flex',
                color: 'white',
                fontSize: '74px',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-2px',
              }}
            >
              PIN Code
            </div>
          </div>
          <div style={{ display: 'flex', color: 'rgba(255,255,255,0.7)', fontSize: '26px', fontWeight: 500 }}>
            35 States &amp; UTs · 700+ Districts · 1,50,000+ Offices
          </div>
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
            www.pincodefinder.net
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
            Free · No Registration
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
