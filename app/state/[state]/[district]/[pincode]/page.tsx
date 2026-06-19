import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getPincodeData } from '@/lib/pincode';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';
import CopyButton from '@/components/CopyButton';
import ShareButtons from '@/components/ShareButtons';

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
  const title = `PIN Code ${pincode} — ${district.districtName}, ${state.stateName} | PincodeIN`;
  const desc = `PIN code ${pincode} covers ${group.offices.length} post offices in ${district.districtName}, ${state.stateName}. ${mainOffice ? `Main office: ${mainOffice.officeName}.` : ''} Find delivery status and address format.`;
  return {
    title,
    description: desc,
    keywords: `${pincode} pin code, pin code ${pincode}, ${district.districtName} pin code, ${pincode} area india, what is pin code ${pincode}, ${pincode} ${state.stateName}`,
    alternates: { canonical: `/state/${stateSlug}/${districtSlug}/${pincode}/` },
    openGraph: { title, description: desc },
  };
}

function typeKey(type: string) {
  if (type === 'H.O') return 'ho';
  if (type === 'S.O') return 'so';
  return 'bo';
}

export default async function PincodePage({ params }: Props) {
  const { state: stateSlug, district: districtSlug, pincode } = await params;
  const result = await getPincodeData(stateSlug, districtSlug, pincode);
  if (!result) notFound();

  const { state, district, group } = result;
  const info = STATES_BY_SLUG.get(stateSlug)!;
  const headOffice = group.offices.find(o => o.officeType === 'H.O');
  const mainOffice = headOffice ?? group.offices[0];
  const nearbyPincodes = district.pincodes.filter(p => p.pincode !== pincode).slice(0, 10);
  const otherStates = STATES.filter(s => s.slug !== stateSlug);

  const faqs = [
    { q: `What is PIN code ${pincode}?`, a: `PIN code ${pincode} is assigned to ${group.offices.length} post office${group.offices.length > 1 ? 's' : ''} in ${district.districtName}, ${state.stateName}, India.` },
    { q: `Which district does PIN code ${pincode} belong to?`, a: `PIN code ${pincode} belongs to ${district.districtName} district in ${state.stateName}, India.` },
    { q: `Which state is PIN code ${pincode} in?`, a: `PIN code ${pincode} is in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.${info.capital ? ` The capital is ${info.capital}.` : ''}` },
    { q: `How do I write an address using PIN code ${pincode}?`, a: `Write: [Recipient Name] / [Building/Street/Locality] / ${district.districtName}, ${state.stateName} — ${pincode} / INDIA` },
    { q: `Is PIN code ${pincode} a delivery PIN?`, a: group.offices.some(o => o.deliveryStatus === 'Delivery') ? `Yes, PIN code ${pincode} has post offices with active mail delivery.` : `PIN code ${pincode} is primarily a non-delivery administrative code.` },
    { q: `What are nearby PIN codes to ${pincode}?`, a: nearbyPincodes.length > 0 ? `Nearby PIN codes in ${district.districtName} include: ${nearbyPincodes.slice(0, 5).map(p => p.pincode).join(', ')}.` : `${pincode} is the only PIN code in ${district.districtName}.` },
    { q: `What does H.O mean for PIN code ${pincode}?`, a: `H.O stands for Head Office — the main post office of a district. ${headOffice ? `${headOffice.officeName} is the Head Office at PIN code ${pincode}.` : `PIN code ${pincode} does not have a Head Office.`}` },
    { q: `Can I use PIN code ${pincode} for courier deliveries?`, a: `Yes. PIN code ${pincode} in ${district.districtName}, ${state.stateName} is accepted by India Post and all major courier services including DTDC, Blue Dart, Delhivery, Amazon, and Flipkart Logistics.` },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      postalCode: pincode,
      addressLocality: district.districtName,
      addressRegion: state.stateName,
      addressCountry: 'IN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: state.stateName, href: `/state/${stateSlug}/` },
          { label: `${district.districtName} District`, href: `/state/${stateSlug}/${districtSlug}/` },
          { label: pincode },
        ]} />
      </div>

      {/* Hero — uses margin: 0 -16px to escape container and go full-width */}
      <section className="postal-detail">
        <div className="postal-code-hero">
          <div className="postal-code-label">PIN Code</div>
          <div className="postal-code-number">{pincode}</div>
          {mainOffice && (
            <span className={`type-badge-lg type-${typeKey(mainOffice.officeType)}`}>
              {mainOffice.officeType}
            </span>
          )}
          <div className="postal-hero-actions">
            <CopyButton text={pincode} label="Copy Code" variant="hero" />
          </div>
        </div>
        <div className="postal-info-grid">
          {mainOffice && (
            <div className="postal-info-row">
              <div className="postal-info-label">Office</div>
              <div className="postal-info-value">{mainOffice.officeName}</div>
            </div>
          )}
          <div className="postal-info-row">
            <div className="postal-info-label">District</div>
            <div className="postal-info-value">
              <Link href={`/state/${stateSlug}/${districtSlug}/`}>{district.districtName}</Link>
            </div>
          </div>
          <div className="postal-info-row">
            <div className="postal-info-label">State</div>
            <div className="postal-info-value">
              <Link href={`/state/${stateSlug}/`}>{state.stateName}</Link>
            </div>
          </div>
          {mainOffice?.divisionName && (
            <div className="postal-info-row">
              <div className="postal-info-label">Division</div>
              <div className="postal-info-value">{mainOffice.divisionName}</div>
            </div>
          )}
          {mainOffice?.circleName && (
            <div className="postal-info-row">
              <div className="postal-info-label">Circle</div>
              <div className="postal-info-value">{mainOffice.circleName}</div>
            </div>
          )}
          <div className="postal-info-row">
            <div className="postal-info-label">Country</div>
            <div className="postal-info-value">India</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Share this PIN Code
        </h2>
        <ShareButtons
          pincode={pincode}
          officeName={mainOffice?.officeName ?? pincode}
          districtName={district.districtName}
          stateName={state.stateName}
        />
      </section>

      <section className="section section-alt">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Address Format
        </h2>
        <div className="address-box">
          <div className="address-line">[Recipient Name]</div>
          <div className="address-line">[Building / Street / Locality]</div>
          <div className="address-line">{district.districtName}</div>
          <div className="address-line">{state.stateName} &mdash; <strong>{pincode}</strong></div>
          <div className="address-line">INDIA</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <CopyButton
            text={`${district.districtName}, ${state.stateName} - ${pincode}, INDIA`}
            label="Copy Full Address"
            variant="default"
          />
        </div>
      </section>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Post Offices with PIN Code {pincode}
        </h2>
        <div className="postal-table-wrap">
          <table className="postal-table">
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
                <tr key={i} className={o.officeType === 'H.O' ? 'row-ho' : ''}>
                  <td style={{ fontWeight: o.officeType === 'H.O' ? 700 : 400 }}>{o.officeName}</td>
                  <td><span className={`type-badge type-${typeKey(o.officeType)}`}>{o.officeType}</span></td>
                  <td>
                    {o.deliveryStatus === 'Delivery'
                      ? <span className="delivery-yes">Delivery</span>
                      : <span className="delivery-no">Non-Delivery</span>}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.taluk === 'NA' ? '—' : o.taluk}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{o.divisionName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {nearbyPincodes.length > 0 && (
        <section className="section section-alt">
          <h2 className="section-heading">
            <div className="accent-bar" />
            Other PIN Codes in {district.districtName}
          </h2>
          <div className="nearby-list">
            {nearbyPincodes.map(p => (
              <Link key={p.pincode} href={`/state/${stateSlug}/${districtSlug}/${p.pincode}/`} className="nearby-item">
                <span className="nearby-code">{p.pincode}</span>
                <span className="nearby-name">{p.offices[0]?.officeName ?? p.pincode}</span>
                {p.hasHeadOffice && <span className="nearby-meta type-badge type-ho">H.O</span>}
              </Link>
            ))}
          </div>
          <Link href={`/state/${stateSlug}/${districtSlug}/`} className="view-all-link">
            View all {district.pincodes.length} PIN codes in {district.districtName} →
          </Link>
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
        <Faq items={faqs} title={`FAQ: PIN Code ${pincode}`} />
      </section>
    </>
  );
}
