import Link from 'next/link';
import Logo from './Logo';
import { STATES } from '@/lib/states';

export default function Navbar() {
  const states = STATES.filter(s => s.type === 'state');
  const uts = STATES.filter(s => s.type === 'ut');

  return (
    <nav className="navbar">
      <div className="nav-top">
        <div className="nav-top-inner">
          <Link href="/" className="nav-logo">
            <Logo size={36} />
            <span className="nav-brand">Pincode<span>IN</span></span>
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/state/delhi/">Delhi</Link>
            <Link href="/state/maharashtra/">Maharashtra</Link>
            <Link href="/state/uttar-pradesh/">Uttar Pradesh</Link>
            <Link href="/state/karnataka/">Karnataka</Link>
          </div>
        </div>
      </div>
      <div className="nav-states">
        <div className="nav-states-inner">
          {states.map(s => (
            <Link key={s.slug} href={`/state/${s.slug}/`} className="nav-state-pill">
              {s.name}
            </Link>
          ))}
          {uts.map(s => (
            <Link key={s.slug} href={`/state/${s.slug}/`} className="nav-state-pill nav-state-pill--ut">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
