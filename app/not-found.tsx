import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 16px' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#f97316' }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: '16px 0 28px' }}>
        Page not found. The PIN code or district you&apos;re looking for may not exist.
      </p>
      <Link href="/" style={{
        display: 'inline-block', background: '#f97316', color: '#fff',
        padding: '10px 24px', borderRadius: '8px', fontWeight: 700,
      }}>
        Back to Home
      </Link>
    </div>
  );
}
