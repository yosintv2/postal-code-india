'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { STATES } from '@/lib/states';

const MAIN_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#states', label: 'All States' },
  { href: '/blog/', label: 'Blog' },
];

const TOP_STATES = [
  { href: '/state/maharashtra/', label: 'Maharashtra' },
  { href: '/state/uttar-pradesh/', label: 'Uttar Pradesh' },
  { href: '/state/rajasthan/', label: 'Rajasthan' },
  { href: '/state/karnataka/', label: 'Karnataka' },
  { href: '/state/tamil-nadu/', label: 'Tamil Nadu' },
  { href: '/state/gujarat/', label: 'Gujarat' },
  { href: '/state/west-bengal/', label: 'West Bengal' },
  { href: '/state/madhya-pradesh/', label: 'Madhya Pradesh' },
  { href: '/state/bihar/', label: 'Bihar' },
  { href: '/state/delhi/', label: 'Delhi' },
  { href: '/state/andhra-pradesh/', label: 'Andhra Pradesh' },
  { href: '/state/kerala/', label: 'Kerala' },
  { href: '/state/punjab/', label: 'Punjab' },
  { href: '/state/haryana/', label: 'Haryana' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-top">
        <div className="nav-top-inner">
          <Link href="/" className="nav-logo" aria-label="PinCodeFinder — India PIN Code Directory">
            <Logo size={40} />
            <span className="nav-brand">PinCode<span>Finder</span></span>
          </Link>
          <div className="nav-tagline">India&apos;s PIN Code Directory</div>
          <div className="nav-top-actions">
            <button
              className={`nav-hamburger${open ? ' open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              type="button"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="nav-main">
        <div className="nav-main-inner">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-main-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-leagues" aria-label="State quick links">
        <div className="nav-leagues-inner">
          {TOP_STATES.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-league-link">{label}</Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="nav-mobile-menu" role="menu">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-mobile-link${pathname === href ? ' active' : ''}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="nav-mobile-states">
            <div className="nav-mobile-section-title">States &amp; UTs</div>
            {STATES.map(s => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}/`}
                className="nav-mobile-link"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
