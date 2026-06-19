import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/lib/states';
import { getStateData } from '@/lib/pincode';

export const metadata: Metadata = {
  title: 'India PIN Code Sitemap — All States, Districts & PIN Codes | PincodeIN',
  description: 'Complete HTML sitemap of all India PIN codes. Browse all 35 states and union territories, districts, and post offices with their 6-digit PIN codes.',
  alternates: { canonical: '/sitemap-html/' },
};

export default async function SitemapHtmlPage() {
  const stateDataList = await Promise.all(
    STATES.map(async state => {
      try {
        const data = await getStateData(state.slug);
        return { state, data };
      } catch {
        return { state, data: null };
      }
    }),
  );

  const totalDistricts = stateDataList.reduce((s, { data }) => s + (data?.totalDistricts ?? 0), 0);
  const totalPins = stateDataList.reduce((s, { data }) =>
    s + (data?.districts.reduce((ds, d) => ds + d.pincodes.length, 0) ?? 0), 0);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">India PIN Code — Full Sitemap</h1>
        <p className="page-sub">
          {STATES.length} States &amp; UTs &middot; {totalDistricts} Districts &middot; {totalPins.toLocaleString()} PIN Codes
        </p>
      </div>

      <section className="section">
        <div className="sitemap-grid">
          {stateDataList.map(({ state, data }) => (
            <div key={state.slug} className="sitemap-state">
              <Link href={`/state/${state.slug}/`} className="sitemap-state-link">
                <span className="sitemap-state-type">{state.type === 'ut' ? 'UT' : 'State'}</span>
                {state.name}
                {state.capital && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>{state.capital}</span>}
              </Link>

              {data && (
                <div className="sitemap-districts">
                  {data.districts.map(district => (
                    <details key={district.districtSlug} className="sitemap-district">
                      <summary className="sitemap-district-link">
                        <Link href={`/state/${state.slug}/${district.districtSlug}/`}>
                          {district.districtName}
                        </Link>
                        <span className="sitemap-count">{district.pincodes.length} PINs</span>
                      </summary>
                      <ul className="sitemap-locations">
                        {district.pincodes.map(p => {
                          const mainOffice = p.offices.find(o => o.officeType === 'H.O') ?? p.offices[0];
                          return (
                            <li key={p.pincode}>
                              <Link
                                href={`/state/${state.slug}/${district.districtSlug}/${p.pincode}/`}
                                className="sitemap-loc-link"
                              >
                                <span className="sitemap-loc-code">{p.pincode}</span>
                                <span className="sitemap-loc-name">{mainOffice?.officeName ?? p.pincode}</span>
                                {p.hasHeadOffice && (
                                  <span className="sitemap-loc-type type-badge type-ho">H.O</span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
