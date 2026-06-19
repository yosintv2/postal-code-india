import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/lib/states';
import { fetchStateOffices } from '@/lib/pincode';
import { toSlug } from '@/lib/utils';
import SearchClient from '@/components/SearchClient';
import type { SearchEntry } from '@/components/SearchClient';
import Faq from '@/components/Faq';

export const metadata: Metadata = {
  title: 'PincodeIN — India PIN Code Finder | All States & Districts',
  description: 'Find PIN codes for any post office, district, or locality in India. Search across all 35 states and union territories. Free India PIN code lookup.',
  alternates: { canonical: '/' },
};

const HOME_FAQS = [
  { q: 'What is a PIN code in India?', a: 'PIN (Postal Index Number) code is a 6-digit number used by India Post to identify individual post offices and delivery zones. It was introduced in August 1972 and covers all of India.' },
  { q: 'How many digits are in an Indian PIN code?', a: 'Indian PIN codes are exactly 6 digits long. The first digit represents the postal zone (1–9), the second indicates the sub-zone, and the remaining digits identify the specific delivery post office.' },
  { q: 'What does H.O, S.O, and B.O mean in India Post?', a: 'H.O stands for Head Office (the main post office of a district), S.O stands for Sub Office (a branch serving a larger area), and B.O stands for Branch Office (the smallest unit, usually in a village or locality).' },
  { q: 'How do I find the PIN code of my area?', a: "Use the search box above to type your area name, post office name, or 6-digit PIN code. You can also browse by state using the 'All States' section below." },
  { q: 'Are Indian PIN codes the same as ZIP codes?', a: "They serve the same purpose but PIN codes are specific to India's postal system. You can use a PIN code wherever a ZIP code is asked for Indian addresses on international forms." },
  { q: 'How do I write an Indian address for international shipping?', a: 'Write: [Recipient Name] / [Building, Street, Locality] / [City/Town] / [District, State — PIN CODE] / INDIA. Always include the 6-digit PIN code to ensure correct delivery.' },
];

async function buildSearchIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  await Promise.allSettled(
    STATES.map(async state => {
      try {
        const offices = await fetchStateOffices(state.apiFile);
        for (const o of offices) {
          entries.push({
            pincode: o.pincode?.trim() ?? '',
            officeName: o.officeName?.trim() ?? '',
            districtName: o.districtName?.trim() ?? '',
            stateName: state.name,
            href: `/state/${state.slug}/${toSlug(o.districtName?.trim() ?? '')}/${o.pincode?.trim()}/`,
          });
        }
      } catch { /* skip */ }
    }),
  );
  return entries;
}

export default async function HomePage() {
  const [searchEntries, stateStats] = await Promise.all([
    buildSearchIndex(),
    Promise.allSettled(
      STATES.map(async state => {
        const offices = await fetchStateOffices(state.apiFile);
        const districts = new Set(offices.map(o => o.districtName?.trim()));
        const pins = new Set(offices.map(o => o.pincode?.trim()));
        return { slug: state.slug, districts: districts.size, offices: offices.length, pins: pins.size };
      }),
    ),
  ]);

  const statsMap = new Map<string, { districts: number; offices: number; pins: number }>();
  stateStats.forEach((r, i) => {
    if (r.status === 'fulfilled') statsMap.set(STATES[i].slug, r.value);
  });

  const indiaStates = STATES.filter(s => s.type === 'state');
  const uts = STATES.filter(s => s.type === 'ut');

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">India PIN Code Directory</h1>
          <p className="hero-sub">Find the PIN code for any post office in India — all states, districts &amp; localities</p>
          <SearchClient entries={searchEntries} />
        </div>
      </section>

      <section id="states" className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Browse by State
        </h2>
        <div className="province-grid">
          {indiaStates.map(s => {
            const stat = statsMap.get(s.slug);
            return (
              <Link key={s.slug} href={`/state/${s.slug}/`} className="province-card">
                <div className="province-card-num">State</div>
                <div className="province-card-name">{s.name}</div>
                {s.capital && <div className="province-card-capital">🏛 {s.capital}</div>}
                {stat && (
                  <div className="province-card-stats">
                    <span>{stat.districts} Districts</span>
                    <span>{stat.pins.toLocaleString()} PINs</span>
                  </div>
                )}
                {stat && <div className="province-card-range">{stat.offices.toLocaleString()} post offices</div>}
                <span className="province-card-arrow">View PINs →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-alt">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Union Territories
        </h2>
        <div className="province-grid">
          {uts.map(s => {
            const stat = statsMap.get(s.slug);
            return (
              <Link key={s.slug} href={`/state/${s.slug}/`} className="province-card">
                <div className="province-card-num">Union Territory</div>
                <div className="province-card-name">{s.name}</div>
                {s.capital && <div className="province-card-capital">🏛 {s.capital}</div>}
                {stat && (
                  <div className="province-card-stats">
                    <span>{stat.districts} Districts</span>
                    <span>{stat.pins.toLocaleString()} PINs</span>
                  </div>
                )}
                {stat && <div className="province-card-range">{stat.offices.toLocaleString()} post offices</div>}
                <span className="province-card-arrow">View PINs →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          How to Find Your PIN Code
        </h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <div className="step-title">Search by Name</div>
            <p className="step-desc">Type your post office name, locality, or district in the search box at the top.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div className="step-title">Browse by State</div>
            <p className="step-desc">Select your state from the grid above, then drill down to your district and post office.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-title">Enter PIN Directly</div>
            <p className="step-desc">Type a 6-digit PIN code in the search box to see which area and offices it belongs to.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <Faq items={HOME_FAQS} title="Frequently Asked Questions" />
      </section>
    </>
  );
}
