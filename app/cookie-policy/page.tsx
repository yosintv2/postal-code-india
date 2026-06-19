'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'pcf_cookie_consent';

export default function CookiePolicyPage() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
  }, []);

  function acceptAll() {
    localStorage.setItem(CONSENT_KEY, 'all');
    setConsent('all');
  }
  function acceptEssential() {
    localStorage.setItem(CONSENT_KEY, 'essential');
    setConsent('essential');
  }
  function withdraw() {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
  }

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Cookie Policy &amp; Consent</h1>
        <p className="page-sub">Manage how PinCodeFinder uses cookies on your device</p>
      </div>

      <section className="section">
        {/* Consent control panel */}
        <div className="consent-panel">
          <h2>Your Cookie Preferences</h2>
          <p>Current status: <strong>{consent === 'all' ? 'All cookies accepted' : consent === 'essential' ? 'Essential cookies only' : 'No preference set'}</strong></p>
          <div className="consent-actions">
            <button className="consent-btn consent-btn-accept" onClick={acceptAll}>Accept All Cookies</button>
            <button className="consent-btn consent-btn-essential" onClick={acceptEssential}>Essential Only</button>
            {consent && <button className="consent-btn consent-btn-withdraw" onClick={withdraw}>Withdraw Consent</button>}
          </div>
        </div>

        <div className="prose-section" style={{ marginTop: 32 }}>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your web browser when you visit a website.
            They help websites remember information about your visit, like your preferences or previously
            viewed items, to make your next visit easier and the site more useful to you.
          </p>

          <h2>Cookies We Use</h2>

          <div className="cookie-table-wrap">
            <table className="cookie-table">
              <thead>
                <tr>
                  <th>Cookie / Storage</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>pcf_cookie_consent</code></td>
                  <td><span className="cookie-badge essential">Essential</span></td>
                  <td>Stores your cookie consent preference</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td><code>pincode_in_recently_viewed</code></td>
                  <td><span className="cookie-badge essential">Essential</span></td>
                  <td>Stores your recently viewed PIN codes (localStorage, never sent to server)</td>
                  <td>Until cleared</td>
                </tr>
                <tr>
                  <td>Google Analytics (_ga, _gid)</td>
                  <td><span className="cookie-badge analytics">Analytics</span></td>
                  <td>Anonymised usage statistics — page views, sessions, traffic sources</td>
                  <td>2 years / 24h</td>
                </tr>
                <tr>
                  <td>Google AdSense / Ads</td>
                  <td><span className="cookie-badge advertising">Advertising</span></td>
                  <td>Personalised and contextual advertisements</td>
                  <td>Up to 2 years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Essential Cookies</h2>
          <p>
            Essential cookies are necessary for the website to function and cannot be disabled. They are
            usually only set in response to actions you take, such as setting your privacy preferences or
            using built-in features like &quot;Recently Viewed PIN Codes&quot;. These do not collect or share
            personal data with any third parties.
          </p>

          <h2>Analytics Cookies</h2>
          <p>
            With your consent, we use Google Analytics to collect anonymised data about how visitors use
            PinCodeFinder — which pages are most popular, how long people stay, and where traffic comes from.
            This helps us improve the site. Google Analytics data is anonymised and cannot identify you
            personally. You can opt out of Google Analytics globally at{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              tools.google.com/dlpage/gaoptout
            </a>.
          </p>

          <h2>Advertising Cookies</h2>
          <p>
            With your consent, PinCodeFinder displays advertisements served by Google AdSense. Google may
            use cookies to show you ads based on your interests and browsing history. You can manage your
            Google ad personalisation preferences at{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>.
            If you withdraw consent for advertising cookies, you may still see ads but they will not be
            personalised to your interests.
          </p>

          <h2>EU User Consent (GDPR)</h2>
          <p>
            If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we
            are required under GDPR to obtain your explicit consent before placing non-essential cookies
            on your device. Our cookie consent banner appears on your first visit to collect this consent.
            You can update your preferences at any time using the panel at the top of this page or by
            clicking &quot;Manage Cookies&quot; in the footer.
          </p>
          <p>
            We support Google&apos;s Consent Mode v2, meaning that when consent is not given, we operate
            in a privacy-safe mode that does not pass user-level data to Google&apos;s ad systems.
          </p>

          <h2>How to Control Cookies</h2>
          <p>In addition to the controls on this page, you can also manage cookies through your browser settings:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
          <p>Note that blocking all cookies may affect the functionality of PinCodeFinder.</p>

          <h2>More Information</h2>
          <p>
            For more details about how we use your data, please read our <Link href="/privacy-policy/">Privacy Policy</Link>.
            If you have any questions about our use of cookies, <Link href="/contact/">contact us</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
