import Link from 'next/link';
import { STATES } from '@/lib/states';

export default function Footer() {
  const states = STATES.filter(s => s.type === 'state');
  const uts = STATES.filter(s => s.type === 'ut');

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">PincodeIN</span>
            <p>India&apos;s most complete PIN code directory. Find post offices, delivery status, and addresses across all states and union territories.</p>
          </div>
          <div className="footer-col">
            <h4>States</h4>
            <ul>
              {states.slice(0, 14).map(s => (
                <li key={s.slug}><Link href={`/state/${s.slug}/`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>&nbsp;</h4>
            <ul>
              {states.slice(14).map(s => (
                <li key={s.slug}><Link href={`/state/${s.slug}/`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Union Territories</h4>
            <ul>
              {uts.map(s => (
                <li key={s.slug}><Link href={`/state/${s.slug}/`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PincodeIN · India PIN Code Directory · Data sourced from India Post</p>
        </div>
      </div>
    </footer>
  );
}
