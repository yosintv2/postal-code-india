import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getDistrictData } from '@/lib/pincode';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';
import PrefetchLinks from '@/components/PrefetchLinks';

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
  const title = `${district.districtName} PIN Codes — ${state.stateName} | PinCodeFinder`;
  const desc = `All ${district.pincodes.length} PIN codes and ${district.totalOffices} post offices in ${district.districtName}, ${state.stateName}. Find head offices, delivery zones, and complete postal information.`;
  const keywords = [
    `${district.districtName} pin code`,
    `pin code ${district.districtName}`,
    `${district.districtName} postal code`,
    `${district.districtName} post office`,
    `pincode of ${district.districtName}`,
    `${district.districtName} ${state.stateName} pin code`,
    `${district.districtName} head office pin code`,
    `${district.districtName} pincode list`,
    `india post ${district.districtName}`,
    `${district.districtName} delivery pin code`,
  ].join(', ');
  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: `/state/${stateSlug}/${districtSlug}/` },
    openGraph: { title, description: desc },
  };
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
  const deliveryPins = district.pincodes.filter(p => p.offices.some(o => o.deliveryStatus === 'Delivery'));

  // Prefetch H.O pincode page and first few pincodes
  const prefetchUrls = district.pincodes.slice(0, 5).map(
    p => `/state/${stateSlug}/${districtSlug}/${p.pincode}/`,
  );

  const faqItems = [
    { q: `What is the PIN code of ${district.districtName}?`, a: headPin ? `The main Head Office (H.O) PIN code of ${district.districtName} is ${headPin.pincode}. The district has ${district.pincodes.length} total PIN codes ranging from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` : `${district.districtName} has ${district.pincodes.length} PIN codes ranging from ${district.pincodeRange.min} to ${district.pincodeRange.max}.` },
    { q: `Which state is ${district.districtName} in?`, a: `${district.districtName} is a district in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.${info.capital ? ` The state capital is ${info.capital}.` : ''}` },
    { q: `How many post offices are in ${district.districtName}?`, a: `${district.districtName} has ${district.totalOffices} post offices spread across ${district.pincodes.length} PIN codes, including ${district.pincodes.filter(p => p.hasHeadOffice).length} Head Office(s).` },
    { q: `How do I write the PIN code in an address for ${district.districtName}?`, a: `Write: [Recipient Name] / [Building / Street / Locality] / ${district.districtName}, ${state.stateName} — [6-digit PIN CODE] / INDIA. Replace the PIN code with the specific code for your area.` },
    { q: `What is the PIN code range in ${district.districtName}?`, a: `PIN codes in ${district.districtName} range from ${district.pincodeRange.min} to ${district.pincodeRange.max}. There are ${district.pincodes.length} distinct PIN codes in this district.` },
    { q: `How many delivery PIN codes are in ${district.districtName}?`, a: `${district.districtName} has ${deliveryPins.length} active delivery PIN codes out of ${district.pincodes.length} total PIN codes. Delivery status indicates whether India Post delivers mail to that specific locality.` },
    { q: `What is the Head Office (H.O) PIN code of ${district.districtName}?`, a: headPin ? `The Head Office PIN code of ${district.districtName} is ${headPin.pincode}. The Head Office is the main administrative post office of the district.` : `${district.districtName} PIN codes are managed by Sub Offices and Branch Offices in the district.` },
    { q: `Can I use ${district.districtName} PIN codes for courier deliveries?`, a: `Yes. All valid PIN codes in ${district.districtName} are accepted by India Post and major couriers like Blue Dart, DTDC, Delhivery, and FedEx for serviceability checks.` },
    { q: `What does S.O and B.O mean for ${district.districtName} post offices?`, a: `S.O (Sub Office) is a post office that reports to the district Head Office. B.O (Branch Office) is a smaller post office that reports to a nearby S.O. Together, H.O, S.O, and B.O form the three-tier India Post network in ${district.districtName}.` },
    { q: `How do I check if a PIN code in ${district.districtName} is for delivery?`, a: `On each PIN code detail page on PinCodeFinder, you can see the delivery status of every post office. Offices marked "Delivery" actively receive and distribute mail. "Non-Delivery" offices are administrative or relay offices.` },
  ];

  return (
    <>
      <PrefetchLinks hrefs={prefetchUrls} />

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
        <div className="district-overview">
          <p className="district-overview-text">
            {district.districtName} is a district in {state.stateName} with {district.pincodes.length} PIN codes
            covering {district.totalOffices} post offices. PIN codes here range from {district.pincodeRange.min} to {district.pincodeRange.max}.
            {headPin ? ` The Head Office (H.O) PIN code is ${headPin.pincode}, serving as the primary postal hub for the district.` : ''}
            {` All ${deliveryPins.length} delivery PIN codes accept mail from India Post and major couriers.`}
          </p>
        </div>
      </section>

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
                    <td>{mainType && <span className={`type-badge type-${typeKey}`}>{mainType}</span>}</td>
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
    </>
  );
}
