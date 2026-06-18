import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getPincodeData } from '@/lib/pincode';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

interface Props { params: Promise<{ state: string; district: string; pincode: string }> }

export async function generateStaticParams() {
  const all: { state: string; district: string; pincode: string }[] = [];
  await Promise.allSettled(
    STATES.map(async s => {
      try {
        const data = await getStateData(s.slug);
        if (!data) return;
        data.districts.forEach(d =>
          d.pincodes.forEach(p =>
            all.push({ state: s.slug, district: d.districtSlug, pincode: p.pincode }),
          ),
        );
      } catch { /* skip */ }
    }),
  );
  return all;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, district: districtSlug, pincode } = await params;
  const result = await getPincodeData(stateSlug, districtSlug, pincode);
  if (!result) return {};
  const { state, district, group } = result;
  const mainOffice = group.offices.find(o => o.officeType === 'H.O') ?? group.offices[0];
  return {
    title: `PIN Code ${pincode} — ${district.districtName}, ${state.stateName}`,
    description: `PIN code ${pincode} covers ${group.offices.length} post offices in ${district.districtName}, ${state.stateName}. ${mainOffice ? `Main office: ${mainOffice.officeName}.` : ''} Find delivery status and full address format.`,
    alternates: { canonical: `/state/${stateSlug}/${districtSlug}/${pincode}/` },
  };
}

function officeBadge(type: string) {
  if (type === 'H.O') return <span className="office-badge badge-ho">H.O</span>;
  if (type === 'S.O') return <span className="office-badge badge-so">S.O</span>;
  return <span className="office-badge badge-bo">B.O</span>;
}

export default async function PincodePage({ params }: Props) {
  const { state: stateSlug, district: districtSlug, pincode } = await params;
  const result = await getPincodeData(stateSlug, districtSlug, pincode);
  if (!result) notFound();

  const { state, district, group } = result;
  const info = STATES_BY_SLUG.get(stateSlug)!;
  const headOffice = group.offices.find(o => o.officeType === 'H.O');
  const mainOffice = headOffice ?? group.offices[0];
  const nearbyPincodes = district.pincodes.filter(p => p.pincode !== pincode).slice(0, 12);

  const faqItems = [
    { q: `What is PIN code ${pincode}?`, a: `PIN code ${pincode} is assigned to ${group.offices.length} post office${group.offices.length > 1 ? 's' : ''} in ${district.districtName}, ${state.stateName}, India.` },
    { q: `Which district does PIN code ${pincode} belong to?`, a: `PIN code ${pincode} belongs to ${district.districtName} district in ${state.stateName}.` },
    { q: `Which state is PIN code ${pincode} in?`, a: `PIN code ${pincode} is in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.${info.capital ? ` The capital is ${info.capital}.` : ''}` },
    { q: `How do I write an address using PIN code ${pincode}?`, a: `Write: [Recipient Name] / [Building/Street] / [Locality] / ${district.districtName}, ${state.stateName} – ${pincode} / INDIA` },
    { q: `Is PIN code ${pincode} a delivery PIN?`, a: group.offices.some(o => o.deliveryStatus === 'Delivery') ? `Yes, PIN code ${pincode} has post offices with active mail delivery.` : `PIN code ${pincode} is primarily a non-delivery administrative code.` },
    { q: `What are nearby PIN codes to ${pincode}?`, a: nearbyPincodes.length > 0 ? `Nearby PIN codes in ${district.districtName} include: ${nearbyPincodes.slice(0, 5).map(p => p.pincode).join(', ')}.` : `${pincode} is the only PIN code in ${district.districtName}.` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PostalAddress',
    postalCode: pincode,
    addressLocality: district.districtName,
    addressRegion: state.stateName,
    addressCountry: 'IN',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: state.stateName, href: `/state/${stateSlug}/` },
        { label: district.districtName, href: `/state/${stateSlug}/${districtSlug}/` },
        { label: pincode },
      ]} />

      <div className="pin-hero">
        <div className="pin-hero-code">{pincode}</div>
        <p className="pin-hero-title">{district.districtName}, {state.stateName}</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card-label">PIN Code</div>
              <div className="info-card-value">{pincode}</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">District</div>
              <div className="info-card-value">{district.districtName}</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">State / UT</div>
              <div className="info-card-value">{state.stateName}</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">Country</div>
              <div className="info-card-value">India</div>
            </div>
            {mainOffice && (
              <div className="info-card">
                <div className="info-card-label">Division</div>
                <div className="info-card-value">{mainOffice.divisionName}</div>
              </div>
            )}
            {mainOffice && (
              <div className="info-card">
                <div className="info-card-label">Circle</div>
                <div className="info-card-value">{mainOffice.circleName}</div>
              </div>
            )}
          </div>

          <h2 style={{ marginBottom: '12px' }}>Address Format</h2>
          <div className="address-box">
            [Recipient Name]<br />
            [Building / Street / Locality]<br />
            <strong>{district.districtName}, {state.stateName} – {pincode}</strong><br />
            INDIA
          </div>

          <h2 style={{ marginBottom: '12px' }}>Post Offices with PIN Code {pincode}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Office Name</th>
                  <th>Type</th>
                  <th>Delivery</th>
                  <th>Taluk</th>
                  <th>Division</th>
                </tr>
              </thead>
              <tbody>
                {group.offices.map((o, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: o.officeType === 'H.O' ? 700 : 400 }}>{o.officeName}</td>
                    <td>{officeBadge(o.officeType)}</td>
                    <td>
                      <span className={`delivery-badge ${o.deliveryStatus === 'Delivery' ? 'delivery-yes' : 'delivery-no'}`}>
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{o.taluk === 'NA' ? '—' : o.taluk}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{o.divisionName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {nearbyPincodes.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2>Nearby PIN Codes in {district.districtName}</h2>
            <div className="state-pills">
              {nearbyPincodes.map(p => (
                <Link key={p.pincode} href={`/state/${stateSlug}/${districtSlug}/${p.pincode}/`} className="state-pill">
                  {p.pincode} {p.hasHeadOffice && <span style={{ color: 'var(--amber)' }}>★</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq items={faqItems} heading={`FAQs — PIN Code ${pincode}`} />
    </>
  );
}
