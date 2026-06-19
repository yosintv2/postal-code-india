import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getDistrictData } from '@/lib/pincode';
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
  const title = `${district.districtName} PIN Codes — ${state.stateName} | PincodeIN`;
  const desc = `All ${district.pincodes.length} PIN codes and ${district.totalOffices} post offices in ${district.districtName}, ${state.stateName}. Find head offices and delivery zones.`;
  return { title, description: desc, alternates: { canonical: `/state/${stateSlug}/${districtSlug}/` } };
}

export default async function DistrictPage({ params }: Props) {
  const { state: stateSlug, district: districtSlug } = await params;
  const result = await getDistrictData(stateSlug, districtSlug);
  if (!result) notFound();

  const { state, district } = result;
  const info = STATES_BY_SLUG.get(stateSlug)!;
  const otherDistricts = state.districts.filter(d => d.districtSlug !== districtSlug);
  const otherStates = STATES.filter(s => s.slug !== stateSlug);
  const headPin = district.pincodes.find(p => p.hasHeadOffice);

  const faqItems = [
    { q: `What is the PIN code of ${district.districtName}?`, a: headPin ? `The main Head Office (H.O) PIN code of ${district.districtName} is ${headPin.pincode}. The district has ${district.pincodes.length} total PIN codes.` : `${district.districtName} has ${district.pincodes.length} PIN codes ranging from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` },
    { q: `Which state is ${district.districtName} in?`, a: `${district.districtName} is a district in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.` },
    { q: `How many post offices are in ${district.districtName}?`, a: `${district.districtName} has ${district.totalOffices} post offices spread across ${district.pincodes.length} PIN codes.` },
    { q: `How do I write the PIN code in an address for ${district.districtName}?`, a: `Write: [Recipient Name] / [Building/Street/Locality] / ${district.districtName}, ${state.stateName} — [PINCODE] / INDIA` },
    { q: `What is the PIN code range in ${district.districtName}?`, a: `PIN codes in ${district.districtName} range from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` },
  ];

  return (
    <>
      <div className="container">
        <div className="page-head">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: state.stateName, href: `/state/${stateSlug}/` },
            { label: `${district.districtName} District` },
          ]} />
          <h1 className="page-title">{district.districtName} PIN Codes</h1>
          <p className="page-sub">{state.stateName} · {district.pincodes.length} PIN codes · {district.totalOffices} Post Offices</p>
        </div>

        <section className="section">
          <h2 className="section-heading">
            <div className="accent-bar" />
            All PIN Codes in {district.districtName}
          </h2>
          <div className="postal-table-wrap">
            <table className="postal-table">
              <thead>
                <tr>
                  <th>PIN Code</th>
                  <th>Post Offices</th>
                  <th>Type</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {district.pincodes.map(p => {
                  const deliveryCount = p.offices.filter(o => o.deliveryStatus === 'Delivery').length;
                  const mainType = p.offices.find(o => o.officeType === 'H.O')?.officeType
                    ?? p.offices.find(o => o.officeType === 'S.O')?.officeType
                    ?? p.offices[0]?.officeType ?? '';
                  const typeKey = mainType.replace('.', '').toLowerCase();
                  return (
                    <tr key={p.pincode} className={p.hasHeadOffice ? 'row-ho' : ''}>
                      <td>
                        <Link href={`/state/${stateSlug}/${districtSlug}/${p.pincode}/`} className="postal-badge">
                          {p.pincode}
                        </Link>
                      </td>
                      <td>{p.offices.length}</td>
                      <td>
                        {mainType && (
                          <span className={`type-badge type-${typeKey}`}>{mainType}</span>
                        )}
                      </td>
                      <td>
                        {deliveryCount > 0
                          ? <span className="delivery-yes">{deliveryCount} Delivery</span>
                          : <span className="delivery-no">Non-Delivery</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {otherDistricts.length > 0 && (
          <section className="section section-alt">
            <h2 className="section-heading">
              <div className="accent-bar" />
              Other Districts in {state.stateName}
            </h2>
            <div className="district-pill-list">
              {otherDistricts.map(d => (
                <Link key={d.districtSlug} href={`/state/${stateSlug}/${d.districtSlug}/`} className="district-pill">
                  {d.districtName}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="section section-alt">
          <h2 className="section-heading">
            <div className="accent-bar" />
            Other States &amp; Union Territories
          </h2>
          <div className="province-links">
            {otherStates.map(s => (
              <Link key={s.slug} href={`/state/${s.slug}/`} className="province-link-pill">{s.name}</Link>
            ))}
          </div>
        </section>

        <section className="section">
          <Faq items={faqItems} title={`FAQ: ${district.districtName} PIN Codes`} />
        </section>
      </div>
    </>
  );
}
