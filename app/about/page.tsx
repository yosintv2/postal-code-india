import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — PinCodeFinder | India PIN Code Directory',
  description: 'Learn about PinCodeFinder — India\'s free, comprehensive PIN code directory covering all 35 states and union territories with 1,50,000+ post offices.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <>
      <div className="page-head">
        <h1 className="page-title">About PinCodeFinder</h1>
        <p className="page-sub">India&apos;s free PIN code directory — built for everyone</p>
      </div>

      <section className="section">
        <div className="prose-section">
          <h2>Who We Are</h2>
          <p>
            PinCodeFinder is a free, independent online directory dedicated to helping people across India find
            accurate PIN (Postal Index Number) codes for any post office, locality, or district. We are not
            affiliated with India Post or the Department of Posts, Government of India — we are an independent
            information service built by developers who believe that postal information should be freely and
            easily accessible to everyone.
          </p>

          <h2>Our Mission</h2>
          <p>
            India has over 1,50,000 post offices spread across 35 states and union territories — one of the
            largest postal networks in the world. Yet finding the right 6-digit PIN code for a specific locality
            can be surprisingly frustrating. PinCodeFinder was created to solve this: one fast, clean, and
            reliable place to look up any PIN code in India.
          </p>
          <p>
            Whether you&apos;re filling out a shipping address, verifying a delivery zone, or building a logistics
            application, PinCodeFinder gives you instant access to the PIN code, office type, delivery status,
            division, and circle for every post office in India.
          </p>

          <h2>What We Cover</h2>
          <div className="about-stats-grid">
            <div className="about-stat">
              <div className="about-stat-num">35</div>
              <div className="about-stat-label">States &amp; Union Territories</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">700+</div>
              <div className="about-stat-label">Districts</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">1.5L+</div>
              <div className="about-stat-label">Post Offices</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-num">Free</div>
              <div className="about-stat-label">No Registration Required</div>
            </div>
          </div>

          <h2>Our Data</h2>
          <p>
            The PIN code data on PinCodeFinder is sourced from India Post&apos;s official records. Each entry
            includes the post office name, PIN code, office type (H.O / S.O / B.O), delivery status, taluk,
            division, and postal circle. While we strive to keep information current, postal boundaries and
            office details may change — for official or legal purposes, always verify with
            <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer"> India Post directly</a>.
          </p>

          <h2>Understanding PIN Codes</h2>
          <p>
            India&apos;s PIN (Postal Index Number) system was introduced on 15 August 1972. Every PIN code is
            6 digits: the first digit represents one of India&apos;s 9 postal zones, the second indicates the
            sub-zone (usually the state), the third identifies the sorting district, and the final three digits
            pinpoint the specific delivery post office. This hierarchical structure allows India Post to sort and
            route millions of pieces of mail every day with precision.
          </p>

          <h2>Contact &amp; Feedback</h2>
          <p>
            We&apos;re always looking to improve PinCodeFinder. If you spot an incorrect PIN code, a missing
            post office, or have a feature suggestion, please{' '}
            <Link href="/contact/">reach out to us</Link>. We read every message and appreciate your help in
            making this resource better for everyone.
          </p>

          <div className="about-disclaimer">
            <strong>Disclaimer:</strong> PinCodeFinder is an independent information service and is not
            affiliated with, endorsed by, or connected to India Post, the Department of Posts, or the
            Government of India. All trademarks belong to their respective owners.
          </div>
        </div>
      </section>
    </>
  );
}
