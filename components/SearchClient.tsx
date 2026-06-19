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

function scoreEntry(entry: SearchEntry, q: string): number {
  const pin = entry.pincode;
  const office = entry.officeName.toLowerCase();
  const district = entry.districtName.toLowerCase();
  const state = entry.stateName.toLowerCase();

  // Exact PIN match
  if (pin === q) return 100;
  // PIN starts with query
  if (/^\d+$/.test(q) && pin.startsWith(q)) return 90;
  // Exact office name match
  if (office === q) return 85;
  // Office name starts with query
  if (office.startsWith(q)) return 75;
  // District exact
  if (district === q) return 70;
  // District starts with
  if (district.startsWith(q)) return 60;
  // Office contains query word at word boundary
  if (office.split(/\s+/).some(w => w.startsWith(q))) return 55;
  // District contains query word at word boundary
  if (district.split(/\s+/).some(w => w.startsWith(q))) return 50;
  // Office contains substring
  if (office.includes(q)) return 40;
  // District contains substring
  if (district.includes(q)) return 35;
  // State contains
  if (state.includes(q)) return 20;

  return 0;
}

export default function SearchClient({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const scored: Array<{ entry: SearchEntry; score: number }> = [];
    for (const e of entries) {
      const score = scoreEntry(e, q);
      if (score > 0) scored.push({ entry: e, score });
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map(s => s.entry);
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
          aria-label="Search PIN codes"
          aria-autocomplete="list"
          aria-expanded={results.length > 0}
        />
      </div>
      {query.length >= 2 && (
        <div className="search-results" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <p className="search-empty" style={{ color: 'var(--text-muted)', padding: '12px 14px' }}>
              No results for &quot;{query}&quot; — try a district name or 6-digit PIN
            </p>
          ) : (
            results.map((e, i) => (
              <Link key={i} href={e.href} className="search-result-item" role="option">
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
