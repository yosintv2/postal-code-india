import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/lib/states';
import { fetchStateOffices } from '@/lib/pincode';
import { toSlug } from '@/lib/utils';
import SearchClient from '@/components/SearchClient';
import Faq from '@/components/Faq';

export const metadata: Metadata = {
  title: 'PincodeIN — India PIN Code Finder',
  description: 'Find PIN codes for any post office, district, or locality in India. Search across all 36 states and union territories.',
  alternates: { canonical: '/' },
};

interface SearchEntry {
  pincode: string;
  officeName: string;
  districtName: string;
  stateName: string;
  stateSlug: string;
  districtSlug: string;
}

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
            stateSlug: state.slug,
            districtSlug: toSlug(o.districtName?.trim() ?? ''),
          });
        }
      } catch { /* skip */ }
    }),
  );
  return entries;
}

const faqItems = [
  {
    q: 'What is a PIN code in India?',
    a: 'PIN (Postal Index Number) code is a 6-digit number used by India Post to identify individual post offices and delivery zones. It was introduced in 1972 and covers all of India.',
  },
  {
    q: 'How many digits are in an Indian PIN code?',
    a: 'Indian PIN codes are exactly 6 digits long. The first digit represents the postal zone (1–9), the second indicates the sub-zone, and the remaining digits identify the specific post office.',
  },
  {
    q: 'What does H.O, S.O, and B.O mean?',
    a: 'H.O stands for Head Office (the main post office of a district), S.O stands for Sub Office (a branch serving a larger area), and B.O stands for Branch Office (the smallest unit, usually in a village or locality).',
  },
  {
    q: 'How do I find the PIN code of my area?',
    a: 'Use the search box above to type your area name, post office name, or 6-digit PIN code. You can also browse by state and district using the navigation above.',
  },
  {
    q: 'Are Indian PIN codes the same as ZIP codes?',
    a: 'They serve the same purpose — identifying postal delivery areas — but PIN codes are specific to India\'s postal system, while ZIP codes are used in the United States.',
  },
];

export default async function HomePage() {
  const [searchEntries, stateStats] = await Promise.all([
    buildSearchIndex(),
    Promise.allSettled(
      STATES.map(async state => {
        const offices = await fetchStateOffices(state.apiFile);
        const districts = new Set(offices.map(o => o.districtName?.trim()));
        return { slug: state.slug, districts: districts.size, offices: offices.length };
      }),
    ),
  ]);

  const statsMap = new Map<string, { districts: number; offices: number }>();
  stateStats.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      statsMap.set(STATES[i].slug, { districts: r.value.districts, offices: r.value.offices });
    }
  });

  const states = STATES.filter(s => s.type === 'state');
  const uts = STATES.filter(s => s.type === 'ut');

  return (
    <>
      <section className="hero">
        <div className="hero-flag">
          <span className="flag-saffron" />
          <span className="flag-white" />
          <span className="flag-green" />
        </div>
        <h1>India <span>PIN Code</span> Directory</h1>
        <p>Search any post office, locality, or 6-digit PIN code across all Indian states and union territories.</p>
        <SearchClient entries={searchEntries} />
      </section>

      <section className="section">
        <div className="container">
          <h2>Browse by State</h2>
          <div className="states-grid">
            {states.map(s => {
              const stat = statsMap.get(s.slug);
              return (
                <Link key={s.slug} href={`/state/${s.slug}/`} className="state-card">
                  <div className="state-card-name">{s.name}</div>
                  <div className="state-card-meta">
                    {s.capital && <span>🏛 {s.capital}</span>}
                    {stat && (
                      <>
                        <span><strong>{stat.districts}</strong> districts</span>
                        <span><strong>{stat.offices.toLocaleString()}</strong> offices</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Union Territories</h2>
          <div className="states-grid">
            {uts.map(s => {
              const stat = statsMap.get(s.slug);
              return (
                <Link key={s.slug} href={`/state/${s.slug}/`} className="state-card state-card--ut">
                  <div className="state-card-name">{s.name}</div>
                  <div className="state-card-meta">
                    {s.capital && <span>🏛 {s.capital}</span>}
                    {stat && (
                      <>
                        <span><strong>{stat.districts}</strong> districts</span>
                        <span><strong>{stat.offices.toLocaleString()}</strong> offices</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How to Find Your PIN Code</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Search by Name</h3>
              <p>Type your post office name, locality, or district in the search box at the top of this page.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Browse by State</h3>
              <p>Select your state from the grid above, then drill down to your district and post office.</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Enter PIN Directly</h3>
              <p>If you have a PIN code and want to know which area it belongs to, type the 6-digit code in the search box.</p>
            </div>
          </div>
        </div>
      </section>

      <Faq items={faqItems} />
    </>
  );
}
