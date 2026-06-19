import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — PinCodeFinder',
  description: 'PinCodeFinder Privacy Policy — how we collect, use, and protect your information when you use our India PIN code directory.',
  alternates: { canonical: '/privacy-policy/' },
  robots: { index: true, follow: false },
};

const LAST_UPDATED = 'June 19, 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-sub">Last updated: {LAST_UPDATED}</p>
      </div>

      <section className="section">
        <div className="prose-section">
          <p>
            PinCodeFinder (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at{' '}
            <strong>www.pincodefinder.net</strong>. This Privacy Policy explains how we handle information
            when you use our service and what rights you have regarding your data.
          </p>

          <h2>1. Information We Collect</h2>
          <p>PinCodeFinder is designed to be a privacy-friendly service. We collect minimal data:</p>
          <ul>
            <li><strong>Usage Data:</strong> We may collect anonymised information about how visitors use our
            site, such as pages visited, search terms entered, browser type, device type, and referring URL.
            This data cannot identify you personally.</li>
            <li><strong>Locally Stored Data:</strong> The &quot;Recently Viewed PIN Codes&quot; feature stores
            your browsing history locally on your own device using browser <code>localStorage</code>. This data
            never leaves your device and is not transmitted to our servers.</li>
            <li><strong>Contact Form:</strong> If you contact us via the contact page, your email and message
            are sent directly to our email address and are not stored on our servers.</li>
          </ul>
          <p>We do <strong>not</strong> collect names, email addresses, phone numbers, payment information,
          or any other personally identifiable information unless you voluntarily provide it (e.g., via the
          contact form).</p>

          <h2>2. Cookies and Tracking Technologies</h2>
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the site to function. These cannot be
            disabled. Example: cookie consent preference storage.</li>
            <li><strong>Analytics Cookies:</strong> With your consent, we may use Google Analytics or similar
            tools to understand how visitors use PinCodeFinder. These use anonymised data and do not identify
            you personally.</li>
            <li><strong>Advertising Cookies:</strong> With your consent, we may serve advertisements through
            Google AdSense. Google may use cookies to personalise ads based on your browsing activity. You
            can manage Google ad preferences at{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
            </li>
          </ul>
          <p>You can manage your cookie preferences using the cookie consent banner shown on your first visit,
          or by visiting our <Link href="/cookie-policy/">Cookie Policy</Link> page.</p>

          <h2>3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Operate and improve PinCodeFinder</li>
            <li>Analyse usage patterns to enhance the user experience</li>
            <li>Display relevant advertisements (with consent)</li>
            <li>Respond to your enquiries when you contact us</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell, rent, or trade your personal information to third parties. We may share
          anonymised, aggregated usage data with:</p>
          <ul>
            <li><strong>Google Analytics</strong> — for usage statistics (with consent)</li>
            <li><strong>Google AdSense</strong> — for displaying advertisements (with consent)</li>
          </ul>
          <p>These third parties have their own privacy policies. We recommend reviewing
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Google&apos;s Privacy Policy</a> for
          more information.</p>

          <h2>5. Data Retention</h2>
          <p>Since we collect minimal personal data, there is very little to retain. Analytics data is
          retained in anonymised form per the third-party service&apos;s standard retention policy.
          Any email correspondence you send us is retained for up to 12 months for support purposes.</p>

          <h2>6. Your Rights (GDPR / EU Users)</h2>
          <p>If you are located in the European Economic Area (EEA) or United Kingdom, you have the following
          rights under GDPR:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data.</li>
            <li><strong>Right to Object:</strong> Object to processing of your data for direct marketing.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for cookies at any time via our
            <Link href="/cookie-policy/"> Cookie Policy</Link> page.</li>
          </ul>
          <p>To exercise these rights, please use our <Link href="/contact/">Contact page</Link>.</p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>PinCodeFinder is not directed at children under 13 years of age. We do not knowingly collect
          personal information from children. If you believe a child has provided us with personal data,
          please contact us immediately and we will delete it.</p>

          <h2>8. Third-Party Links</h2>
          <p>Our site may contain links to external websites (e.g., India Post). We are not responsible for
          the privacy practices of those sites. We encourage you to review their privacy policies before
          providing any personal information.</p>

          <h2>9. Security</h2>
          <p>We implement reasonable technical measures to protect any information we process. However, no
          internet transmission is 100% secure. We encourage you to use secure networks and keep your browser
          up to date.</p>

          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with
          an updated &quot;Last Updated&quot; date. Continued use of PinCodeFinder after changes constitutes
          acceptance of the updated policy.</p>

          <h2>11. Contact Us</h2>
          <p>For any privacy-related questions or requests, please use our <Link href="/contact/">Contact page</Link>.</p>
        </div>
      </section>
    </>
  );
}
