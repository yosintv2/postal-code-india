'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { SearchEntry } from './SearchClient';

interface ValidatorResult {
  entries: SearchEntry[];
  pincode: string;
}

function validate(pincode: string, entries: SearchEntry[]): ValidatorResult | null {
  const clean = pincode.replace(/\D/g, '').slice(0, 6);
  if (clean.length !== 6) return null;
  const matches = entries.filter(e => e.pincode === clean);
  return matches.length > 0 ? { entries: matches, pincode: clean } : null;
}

export default function PincodeValidator({ entries }: { entries: SearchEntry[] }) {
  const [input, setInput] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setInput(val);
    setTouched(true);
  }, []);

  const result = useMemo(() => validate(input, entries), [input, entries]);
  const isValidFormat = input.length === 6;
  const isNotFound = touched && isValidFormat && !result;

  const firstEntry = result?.entries[0];

  return (
    <div className="validator-wrap">
      <div className="validator-input-row">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          className={`validator-input${isNotFound ? ' validator-input-error' : isValidFormat && result ? ' validator-input-success' : ''}`}
          placeholder="Enter 6-digit PIN code"
          value={input}
          onChange={handleChange}
          aria-label="PIN code validator"
        />
        <div className="validator-dots">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`validator-dot${i < input.length ? (result ? ' filled-ok' : ' filled') : ''}`}
            />
          ))}
        </div>
      </div>

      {result && firstEntry && (
        <div className="validator-result">
          <div className="validator-result-pin">{result.pincode}</div>
          <div className="validator-result-info">
            <div className="validator-result-name">{firstEntry.officeName}</div>
            <div className="validator-result-loc">{firstEntry.districtName}, {firstEntry.stateName}</div>
          </div>
          {result.entries.length > 1 && (
            <div className="validator-result-count">+{result.entries.length - 1} more offices</div>
          )}
          <Link href={firstEntry.href} className="validator-result-link">
            View Details →
          </Link>
        </div>
      )}

      {isNotFound && (
        <div className="validator-not-found">
          PIN code <strong>{input}</strong> not found in our database. Check for typos or try searching above.
        </div>
      )}
    </div>
  );
}
