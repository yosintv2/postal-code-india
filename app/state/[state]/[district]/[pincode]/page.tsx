import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData, getPincodeData } from '@/lib/pincode';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';
import CopyButton from '@/components/CopyButton';
import ShareButtons from '@/components/ShareButtons';
import PincodeTracker from '@/components/PincodeTracker';
import PrefetchLinks from '@/components/PrefetchLinks';

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
  const title = `PIN Code ${pincode} — ${district.districtName}, ${state.stateName} | PinCodeFinder`;
  const desc = `PIN code ${pincode} covers ${group.offices.length} post office${group.offices.length > 1 ? 's' : ''} in ${district.districtName}, ${state.stateName}. ${mainOffice ? `Main office: ${mainOffice.officeName}.` : ''} Find delivery status, address format, and nearby PIN codes.`;
  const keywords = [
    `${pincode} pin code`,
    `pin code ${pincode}`,
    `${pincode} pincode`,
    `pincode ${pincode}`,
    `what is pin code ${pincode}`,
    `${pincode} post office`,
    `${pincode} india`,
    `${pincode} ${district.districtName}`,
    `${pincode} ${state.stateName}`,
    `${district.districtName} ${pincode} pin code`,
    `${state.stateName} ${pincode}`,
    ...(mainOffice ? [`${mainOffice.officeName} pin code`, `${mainOffice.officeName} pincode`] : []),
    `pin code of ${district.districtName}`,
    `${district.districtName} postal code`,
    `${pincode} area`,
    `${pincode} delivery status`,
  ].join(', ');
  return {
    title,
    description: desc,
    keywords,
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

  // Prefetch nearby PIN pages
  const prefetchUrls = nearbyPincodes.slice(0, 4).map(
    p => `/state/${stateSlug}/${districtSlug}/${p.pincode}/`,
  );

  const faqs = [
    { q: `What is PIN code ${pincode}?`, a: `PIN code ${pincode} is a 6-digit postal code assigned to ${group.offices.length} post office${group.offices.length > 1 ? 's' : ''} in ${district.districtName}, ${state.stateName}, India. It is used for addressing mail and identifying delivery zones.` },
    { q: `Which district does PIN code ${pincode} belong to?`, a: `PIN code ${pincode} belongs to ${district.districtName} district in ${state.stateName}, India.` },
    { q: `Which state is PIN code ${pincode} in?`, a: `PIN code ${pincode} is in ${state.stateName}, ${info.type === 'ut' ? 'a Union Territory' : 'a state'} of India.${info.capital ? ` The capital is ${info.capital}.` : ''}` },
    { q: `How do I write an address using PIN code ${pincode}?`, a: `Format your address as: [Recipient Name] / [Building / Street / Locality] / ${district.districtName}, ${state.stateName} — ${pincode} / INDIA` },
    { q: `Is PIN code ${pincode} a delivery PIN?`, a: group.offices.some(o => o.deliveryStatus === 'Delivery') ? `Yes, PIN code ${pincode} has active mail delivery. ${group.offices.filter(o => o.deliveryStatus === 'Delivery').length} out of ${group.offices.length} post offices here provide delivery service.` : `PIN code ${pincode} is a non-delivery code used for administrative or relay purposes in the postal system.` },
    { q: `What are nearby PIN codes to ${pincode}?`, a: nearbyPincodes.length > 0 ? `Nearby PIN codes in ${district.districtName} include: ${nearbyPincodes.slice(0, 6).map(p => p.pincode).join(', ')}. Browse all ${district.pincodes.length} PIN codes in ${district.districtName}.` : `${pincode} is the only PIN code in ${district.districtName}.` },
    { q: `What does H.O mean for PIN code ${pincode}?`, a: `H.O stands for Head Office — the primary post office of a postal division. ${headOffice ? `${headOffice.officeName} is the Head Office at PIN code ${pincode}, serving as the hub for sub offices and branch offices in the area.` : `PIN code ${pincode} does not have a Head Office.`}` },
    { q: `Can I use PIN code ${pincode} for courier deliveries?`, a: `Yes. PIN code ${pincode} in ${district.districtName}, ${state.stateName} is accepted by India Post and all major courier services including DTDC, Blue Dart, Delhivery, Amazon Logistics, and Flipkart Logistics.` },
    { q: `What circle does PIN code ${pincode} fall under?`, a: mainOffice?.circleName ? `PIN code ${pincode} falls under the ${mainOffice.circleName} postal circle. The circle is the highest administrative unit in India Post and oversees all post offices in the region.` : `PIN code ${pincode} is administered under the ${state.stateName} postal circle.` },
    { q: `What division manages PIN code ${pincode}?`, a: mainOffice?.divisionName ? `PIN code ${pincode} is managed by the ${mainOffice.divisionName} postal division, which oversees delivery and administrative operations for post offices in this area.` : `PIN code ${pincode} is managed under the ${district.districtName} division of ${state.stateName} postal circle.` },
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
      '@type': 'PostOffice',
      name: mainOffice?.officeName ?? `${district.districtName} Post Office`,
      identifier: pincode,
      address: {
        '@type': 'PostalAddress',
        postalCode: pincode,
        addressLocality: mainOffice?.taluk && mainOffice.taluk !== 'NA' ? mainOffice.taluk : district.districtName,
        addressRegion: state.stateName,
        addressCountry: 'IN',
      },
      ...(headOffice ? { additionalType: 'https://schema.org/GovernmentOffice' } : {}),
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

      <PrefetchLinks hrefs={prefetchUrls} />
      <PincodeTracker
        pincode={pincode}
        officeName={mainOffice?.officeName ?? pincode}
        districtName={district.districtName}
        stateName={state.stateName}
        stateSlug={stateSlug}
        districtSlug={districtSlug}
      />

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: state.stateName, href: `/state/${stateSlug}/` },
          { label: `${district.districtName} District`, href: `/state/${stateSlug}/${districtSlug}/` },
          { label: pincode },
        ]} />
      </div>

      {/* Hero */}
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
          <div className="postal-info-row postal-info-address-row">
            <div className="postal-info-label">Full Address</div>
            <div className="postal-info-value postal-info-address">
              {mainOffice?.officeName ?? district.districtName},{' '}
              {district.districtName},{' '}
              {state.stateName} &mdash; <strong style={{ color: 'var(--gold)' }}>{pincode}</strong>,{' '}
              India
            </div>
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

      {/* SVG Postal Info Card */}
      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Postal Info Card
        </h2>
        <div className="pin-card-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 200"
            className="pin-svg-card"
            role="img"
            aria-label={`PIN Code ${pincode} — ${mainOffice?.officeName ?? district.districtName}, ${district.districtName}, ${state.stateName}, India`}
          >
            <title>PIN Code {pincode} — {mainOffice?.officeName ?? district.districtName}, {district.districtName}, {state.stateName}, India · PinCodeFinder</title>
            <defs>
              <clipPath id={`cc-${pincode}`}>
                <rect width="800" height="200" rx="14" />
              </clipPath>
              <linearGradient id={`cg-${pincode}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
                <stop offset="70%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
              <clipPath id={`cr-${pincode}`}>
                <rect x="314" y="66" width="474" height="126" />
              </clipPath>
            </defs>

            {/* Card background */}
            <rect width="800" height="200" rx="14" fill="#0f172a" />
            <rect width="800" height="200" rx="14" fill={`url(#cg-${pincode})`} />

            {/* Orange left accent bar (clipped to card corners) */}
            <g clipPath={`url(#cc-${pincode})`}>
              <rect x="0" y="0" width="5" height="200" fill="#f97316" />
            </g>

            {/* Brand — top left */}
            <text x="22" y="33" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="15" fontWeight="700" fill="#f97316">PinCodeFinder</text>
            <text x="22" y="51" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="10" fill="#475569">India&apos;s PIN Code Directory</text>

            {/* Domain — top right */}
            <text x="786" y="33" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="11" fill="#475569" textAnchor="end">www.pincodefinder.net</text>

            {/* Location pin icon */}
            <circle cx="793" cy="44" r="4" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.5" />
            <circle cx="793" cy="44" r="1.5" fill="#f97316" opacity="0.5" />
            <line x1="793" y1="48" x2="793" y2="54" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

            {/* Horizontal separator */}
            <line x1="16" y1="62" x2="784" y2="62" stroke="#1e293b" strokeWidth="1" />

            {/* PIN Number — left panel */}
            <text x="156" y="94" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="11" fontWeight="600" fill="#64748b" textAnchor="middle" letterSpacing="3">PIN CODE</text>
            <text x="156" y="150" fontFamily="'Courier New','Lucida Console',monospace" fontSize="52" fontWeight="800" fill="#f97316" textAnchor="middle" letterSpacing="5">{pincode}</text>
            <text x="156" y="173" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="10" fill="#475569" textAnchor="middle" letterSpacing="3">INDIA POST</text>

            {/* Vertical divider */}
            <line x1="308" y1="70" x2="308" y2="190" stroke="#1e293b" strokeWidth="1" />

            {/* Info — right panel */}
            <g clipPath={`url(#cr-${pincode})`}>
              <text x="326" y="88" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="10" fontWeight="600" fill="#64748b" letterSpacing="2">POST OFFICE</text>
              <text
                x="326"
                y="113"
                fontFamily="'Segoe UI',system-ui,Arial,sans-serif"
                fontSize={(mainOffice?.officeName ?? district.districtName).length > 34 ? 14 : 19}
                fontWeight="700"
                fill="#f8fafc"
              >
                {mainOffice?.officeName ?? district.districtName}
              </text>
              <text x="326" y="138" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="13" fill="#94a3b8">
                {district.districtName} · {state.stateName}
              </text>
              <text x="326" y="161" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="11" fill="#475569">
                {mainOffice?.officeName ?? district.districtName}, {district.districtName}
              </text>
              <text x="326" y="179" fontFamily="'Segoe UI',system-ui,Arial,sans-serif" fontSize="11" fill="#475569">
                {state.stateName} {'—'} {pincode}, India
              </text>
            </g>
          </svg>
        </div>
      </section>

      <section className="section section-alt">
        <Faq items={faqs} title={`FAQ: PIN Code ${pincode}`} />
      </section>
    </>
  );
}
