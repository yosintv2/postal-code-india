'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ViewedPin {
  pincode: string;
  officeName: string;
  districtName: string;
  stateName: string;
  stateSlug: string;
  districtSlug: string;
  viewedAt: number;
}

const STORAGE_KEY = 'pincode_in_recently_viewed';
const MAX_ITEMS = 8;

export function trackPincodeView(data: Omit<ViewedPin, 'viewedAt'>) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: ViewedPin[] = stored ? JSON.parse(stored) : [];
    const filtered = existing.filter(item => item.pincode !== data.pincode);
    const updated = [{ ...data, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* silently fail */ }
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<ViewedPin[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch { /* silently fail */ }
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section recently-viewed-section">
      <h2 className="section-heading">
        <div className="accent-bar" />
        Recently Viewed PIN Codes
      </h2>
      <div className="recently-viewed-list">
        {items.map(item => (
          <Link
            key={item.pincode}
            href={`/state/${item.stateSlug}/${item.districtSlug}/${item.pincode}/`}
            className="recently-viewed-item"
          >
            <span className="recently-viewed-pin">{item.pincode}</span>
            <span className="recently-viewed-info">
              <span className="recently-viewed-name">{item.officeName}</span>
              <span className="recently-viewed-loc">{item.districtName}, {item.stateName}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
