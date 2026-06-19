'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'pcf_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'all');
    setVisible(false);
  }

  function essential() {
    localStorage.setItem(CONSENT_KEY, 'essential');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-bar" role="dialog" aria-label="Cookie consent" aria-modal="false">
      <div className="cookie-bar-inner">
        <div className="cookie-bar-text">
          <span className="cookie-bar-title">🍪 We use cookies</span>
          <p>
            PinCodeFinder uses cookies for analytics and personalised ads. By clicking &quot;Accept All&quot; you
            consent to our use of cookies. See our{' '}
            <Link href="/cookie-policy/" className="cookie-bar-link">Cookie Policy</Link> to manage preferences.
          </p>
        </div>
        <div className="cookie-bar-actions">
          <button className="cookie-btn cookie-btn-essential" onClick={essential}>
            Essential Only
          </button>
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
