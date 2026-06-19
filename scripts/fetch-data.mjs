#!/usr/bin/env node
// Downloads all state JSON files from the API into data/ before Next.js build.
// Reads from cache if already downloaded, so re-runs are instant.

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const API_BASE = 'https://api.singhyogendra.com.np/india-pincode';
const DATA_DIR = join(process.cwd(), 'data');

const API_FILES = [
  'andaman_and_nicobar_islands',
  'andhra_pradesh',
  'arunachal_pradesh',
  'assam',
  'bihar',
  'chandigarh',
  'chattisgarh',
  'dadra_and_nagar_haveli',
  'daman_and_diu',
  'delhi',
  'goa',
  'gujarat',
  'haryana',
  'himachal_pradesh',
  'jammu_and_kashmir',
  'jharkhand',
  'karnataka',
  'kerala',
  'lakshadweep',
  'madhya_pradesh',
  'maharashtra',
  'manipur',
  'meghalaya',
  'mizoram',
  'nagaland',
  'odisha',
  'pondicherry',
  'punjab',
  'rajasthan',
  'sikkim',
  'tamil_nadu',
  'tripura',
  'uttar_pradesh',
  'uttarakhand',
  'west_bengal',
];

async function fetchWithRetry(url, retries = 5, baseDelay = 3000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = baseDelay * (attempt + 1);
      console.log(`  ↻ retry ${attempt + 1}/${retries} in ${delay / 1000}s — ${err.message}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  let downloaded = 0;
  let cached = 0;

  for (const file of API_FILES) {
    const outPath = join(DATA_DIR, `${file}.json`);
    if (existsSync(outPath)) {
      cached++;
      continue;
    }

    process.stdout.write(`  ↓ ${file}...`);
    const res = await fetchWithRetry(`${API_BASE}/${file}.json`);
    const text = await res.text();
    // Strip control characters invalid inside JSON strings
    const clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
    JSON.parse(clean); // validate before writing
    await writeFile(outPath, clean, 'utf-8');
    process.stdout.write(' done\n');
    downloaded++;
  }

  console.log(`\nData ready: ${downloaded} downloaded, ${cached} from cache.`);
}

main().catch(err => {
  console.error('fetch-data failed:', err.message);
  process.exit(1);
});
