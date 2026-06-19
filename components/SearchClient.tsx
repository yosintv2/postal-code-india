'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export interface SearchEntry {
  pincode: string;
  officeName: string;
  districtName: string;
  stateName: string;
  href: string;
}

export default function SearchClient({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return entries
      .filter(e =>
        e.pincode.includes(q) ||
        e.officeName.toLowerCase().includes(q) ||
        e.districtName.toLowerCase().includes(q) ||
        e.stateName.toLowerCase().includes(q),
      )
      .slice(0, 15);
  }, [query, entries]);

  return (
    <div className="search-wrap">
      <div className="hero-search-box">
        <svg className="hero-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
          stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          className="hero-search"
          placeholder="Search PIN code, post office, or district…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      {query.length >= 2 && (
        <div className="search-results">
          {results.length === 0 ? (
            <p className="search-empty" style={{ color: 'var(--text-muted)', padding: '12px 14px' }}>
              No results for &quot;{query}&quot;
            </p>
          ) : (
            results.map((e, i) => (
              <Link key={i} href={e.href} className="search-result-item">
                <span className="search-result-code">{e.pincode}</span>
                <span className="search-result-text">
                  <span className="search-result-name">{e.officeName}</span>
                  <span className="search-result-meta">{e.districtName}, {e.stateName}</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
