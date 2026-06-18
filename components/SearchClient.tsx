'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface SearchEntry {
  pincode: string;
  officeName: string;
  districtName: string;
  stateName: string;
  stateSlug: string;
  districtSlug: string;
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
      .slice(0, 20);
  }, [query, entries]);

  return (
    <div className="search-wrap">
      <div className="search-box">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
          stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Search by PIN code, office name, or district…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      {query.length >= 2 && (
        <div className="search-results">
          {results.length === 0 ? (
            <p className="search-empty">No results found for &quot;{query}&quot;</p>
          ) : (
            <>
              <p className="search-count">{results.length === 20 ? '20+' : results.length} results</p>
              <ul>
                {results.map((e, i) => (
                  <li key={i}>
                    <Link href={`/state/${e.stateSlug}/${e.districtSlug}/${e.pincode}/`}>
                      <span className="result-pin">{e.pincode}</span>
                      <span className="result-name">{e.officeName}</span>
                      <span className="result-loc">{e.districtName}, {e.stateName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
