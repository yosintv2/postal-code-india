import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          The PIN code or district you&apos;re looking for may not exist in our directory.
        </p>
        <Link href="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  );
}
