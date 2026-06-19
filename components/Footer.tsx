import Link from 'next/link';
import Logo from './Logo';
import { STATES } from '@/lib/states';

export default function Footer() {
  const states = STATES.filter(s => s.type === 'state');
  const uts = STATES.filter(s => s.type === 'ut');

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-row">
              <Logo size={32} />
              <span className="footer-brand-name">PinCodeFinder</span>
            </div>
            <p className="footer-desc">
              India&apos;s free PIN code directory. Find post offices, delivery status, and addresses across all 35 states and union territories.
            </p>
            <p className="footer-disclaimer">
              Data sourced from India Post. For official information, visit indiapost.gov.in.
            </p>
            <div className="footer-legal-links">
              <Link href="/about/" className="footer-legal-link">About Us</Link>
              <span className="footer-legal-sep">·</span>
              <Link href="/contact/" className="footer-legal-link">Contact</Link>
              <span className="footer-legal-sep">·</span>
              <Link href="/privacy-policy/" className="footer-legal-link">Privacy Policy</Link>
              <span className="footer-legal-sep">·</span>
              <Link href="/cookie-policy/" className="footer-legal-link">Manage Cookies</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">States</div>
            <div className="footer-links">
              {states.slice(0, 14).map(s => (
                <Link key={s.slug} href={`/state/${s.slug}/`} className="footer-link">{s.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">&nbsp;</div>
            <div className="footer-links">
              {states.slice(14).map(s => (
                <Link key={s.slug} href={`/state/${s.slug}/`} className="footer-link">{s.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Union Territories</div>
            <div className="footer-links">
              {uts.map(s => (
                <Link key={s.slug} href={`/state/${s.slug}/`} className="footer-link">{s.name}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PinCodeFinder · India PIN Code Directory</span>
          <span>Data: India Post</span>
        </div>
      </div>
    </footer>
  );
}
