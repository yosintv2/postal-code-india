import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getDistrictData } from '@/lib/pincode';
import { toSlug } from '@/lib/utils';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

interface Props { params: Promise<{ state: string; district: string }> }

export async function generateStaticParams() {
  const all: { state: string; district: string }[] = [];
  await Promise.allSettled(
    STATES.map(async s => {
      try {
        const data = await getStateData(s.slug);
        if (!data) return;
        data.districts.forEach(d => all.push({ state: s.slug, district: d.districtSlug }));
      } catch { /* skip */ }
    }),
  );
  return all;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug } = await params;
  const result = await getDistrictData(stateSlug, districtSlug);
  if (!result) return {};
  const { state, district } = result;
  return {
    title: `${district.districtName} PIN Codes — ${state.stateName}`,
    description: `All ${district.pincodes.length} PIN codes and ${district.totalOffices} post offices in ${district.districtName}, ${state.stateName}. Find delivery zones and head offices.`,
    alternates: { canonical: `/state/${stateSlug}/${districtSlug}/` },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { state: stateSlug, district: districtSlug } = await params;
  const result = await getDistrictData(stateSlug, districtSlug);
  if (!result) notFound();

  const { state, district } = result;
  const info = STATES_BY_SLUG.get(stateSlug)!;
  const otherDistricts = state.districts.filter(d => d.districtSlug !== districtSlug);
  const dpoGroup = district.pincodes.find(p => p.hasHeadOffice);

  const faqItems = [
    { q: `What is the PIN code of ${district.districtName}?`, a: dpoGroup ? `The main HEAD Office (H.O) PIN code of ${district.districtName} is ${dpoGroup.pincode}. The district has ${district.pincodes.length} total PIN codes.` : `${district.districtName} has ${district.pincodes.length} PIN codes ranging from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` },
    { q: `Which state is ${district.districtName} in?`, a: `${district.districtName} is a district in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.` },
    { q: `How many post offices are in ${district.districtName}?`, a: `${district.districtName} has ${district.totalOffices} post offices spread across ${district.pincodes.length} PIN codes.` },
    { q: `How do I write the PIN code in an address for ${district.districtName}?`, a: `Write the recipient's name, building/street, locality, then "${district.districtName}, ${state.stateName} – [PINCODE]", followed by "INDIA".` },
    { q: `What is the PIN code range in ${district.districtName}?`, a: `PIN codes in ${district.districtName} range from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: district.districtName,
    containedInPlace: { '@type': 'State', name: state.stateName, containedInPlace: { '@type': 'Country', name: 'India' } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: state.stateName, href: `/state/${stateSlug}/` },
        { label: district.districtName },
      ]} />

      <div className="page-header">
        <div className="page-header-inner">
          <h1>{district.districtName} PIN Codes</h1>
          <p>{state.stateName} · {district.pincodes.length} PIN codes · {district.totalOffices} Post Offices</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="stats-strip">
            <div className="stat-item">
              <span className="stat-value">{district.pincodes.length}</span>
              <span className="stat-label">PIN Codes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{district.totalOffices}</span>
              <span className="stat-label">Post Offices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{district.pincodeRange.min}</span>
              <span className="stat-label">Lowest PIN</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{district.pincodeRange.max}</span>
              <span className="stat-label">Highest PIN</span>
            </div>
          </div>

          <h2>All PIN Codes in {district.districtName}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>PIN Code</th>
                  <th>Post Offices</th>
                  <th>Head Office</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {district.pincodes.map(p => {
                  const deliveryOffices = p.offices.filter(o => o.deliveryStatus === 'Delivery');
                  return (
                    <tr key={p.pincode}>
                      <td>
                        <Link href={`/state/${stateSlug}/${districtSlug}/${p.pincode}/`}>
                          <span className={`pin-badge${p.hasHeadOffice ? ' pin-badge--ho' : ''}`}>{p.pincode}</span>
                        </Link>
                      </td>
                      <td>{p.offices.length}</td>
                      <td>
                        {p.hasHeadOffice
                          ? <span className="office-badge badge-ho">H.O</span>
                          : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td>{deliveryOffices.length > 0
                        ? <span className="delivery-badge delivery-yes">{deliveryOffices.length} Delivery</span>
                        : <span className="delivery-badge delivery-no">Non-Delivery</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {otherDistricts.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2>Other Districts in {state.stateName}</h2>
            <div className="state-pills">
              {otherDistricts.map(d => (
                <Link key={d.districtSlug} href={`/state/${stateSlug}/${d.districtSlug}/`} className="state-pill">
                  {d.districtName}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq items={faqItems} heading={`FAQs — ${district.districtName} PIN Codes`} />
    </>
  );
}
