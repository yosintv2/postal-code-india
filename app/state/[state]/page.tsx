import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData } from '@/lib/pincode';
import { getStateContent } from '@/lib/stateContent';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';
import PrefetchLinks from '@/components/PrefetchLinks';

interface Props { params: Promise<{ state: string }> }

export async function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const info = STATES_BY_SLUG.get(slug);
  if (!info) return {};
  const title = `${info.name} PIN Codes — All Districts & Post Offices | PinCodeFinder`;
  const desc = `Find PIN codes for all districts in ${info.name}. Browse post offices, head offices, and delivery zones across every district of ${info.name}${info.capital ? ` (Capital: ${info.capital})` : ''}.`;
  const keywords = [
    `${info.name} pin code`,
    `pin code ${info.name}`,
    `${info.name} postal code`,
    `${info.name} post office pin code`,
    `pincode of ${info.name}`,
    `${info.name} district pin code`,
    `india post ${info.name}`,
    ...(info.capital ? [`${info.capital} pin code`, `pin code of ${info.capital}`] : []),
    `${info.name} pincode list`,
    `${info.name} pincode search`,
    `${info.name} all districts pincode`,
  ].join(', ');
  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: `/state/${slug}/` },
    openGraph: { title, description: desc },
  };
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = await getStateData(stateSlug);
  if (!stateData) notFound();

  const info = STATES_BY_SLUG.get(stateSlug)!;
  const content = getStateContent(stateSlug);
  const otherStates = STATES.filter(s => s.slug !== stateSlug);
  const totalPins = stateData.districts.reduce((s, d) => s + d.pincodes.length, 0);

  // Prefetch first 6 district pages
  const prefetchUrls = stateData.districts.slice(0, 6).map(
    d => `/state/${stateSlug}/${d.districtSlug}/`,
  );

  const faqItems = [
    { q: `What are the PIN codes in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalOffices.toLocaleString()} post offices across ${stateData.totalDistricts} districts, with ${totalPins.toLocaleString()} unique PIN codes. Browse the districts listed above to find specific PIN codes.` },
    { q: `How many districts are in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalDistricts} districts with postal coverage as per India Post records.` },
    { q: `What is the capital of ${stateData.stateName}?`, a: info.capital ? `The capital of ${stateData.stateName} is ${info.capital}.` : `${stateData.stateName} is a ${info.type === 'ut' ? 'union territory' : 'state'} of India.` },
    { q: `How do I find a PIN code in ${stateData.stateName}?`, a: `Click on any district above to see all PIN codes and post offices in that district of ${stateData.stateName}. You can also use the search bar on the homepage to search by office name or PIN code directly.` },
    { q: `Is ${stateData.stateName} a state or union territory?`, a: info.type === 'ut' ? `${stateData.stateName} is a Union Territory of India, administered directly by the central government.` : `${stateData.stateName} is a state of India with its own elected legislative assembly.` },
    { q: `How many PIN codes does ${stateData.stateName} have?`, a: `${stateData.stateName} has ${totalPins.toLocaleString()} unique PIN codes across its ${stateData.totalDistricts} districts.` },
    { q: `What is the PIN code format for ${stateData.stateName}?`, a: content ? `In ${stateData.stateName}, PIN codes begin with ${content.pinPrefix}. The first digit indicates the postal zone, the second digit represents the sub-zone (${stateData.stateName}), and the remaining four digits identify the sorting district and specific post office.` : `Indian PIN codes are 6 digits. The first two digits identify the state/region, and the remaining four identify the district and post office.` },
    { q: `How many post offices are in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalOffices.toLocaleString()} post offices, including Head Offices (H.O), Sub Offices (S.O), and Branch Offices (B.O).` },
    { q: `Can I use ${stateData.stateName} PIN codes for online shopping?`, a: `Yes. All valid PIN codes in ${stateData.stateName} are accepted by e-commerce platforms like Amazon, Flipkart, Myntra, and courier services like Blue Dart, DTDC, and Delhivery for delivery serviceability checks.` },
    { q: `What does "H.O" mean in ${stateData.stateName} post offices?`, a: `H.O stands for Head Office — the primary post office of a postal division. ${stateData.stateName} has one H.O per district that serves as the hub for all S.O (Sub Office) and B.O (Branch Office) post offices in that area.` },
  ];

  return (
    <>
      <PrefetchLinks hrefs={prefetchUrls} />

      <div className="page-head">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: stateData.stateName }]} />
        <h1 className="page-title">{stateData.stateName} PIN Codes</h1>
        <p className="page-sub">
          {info.type === 'ut' ? 'Union Territory' : 'State'}{info.capital ? ` · Capital: ${info.capital}` : ''} · {stateData.totalDistricts} Districts · {stateData.totalOffices.toLocaleString()} Post Offices · {totalPins.toLocaleString()} PIN Codes
        </p>
      </div>

      {content && (
        <section className="section">
          <div className="state-overview">
            <p className="state-overview-text">{content.overview}</p>
            <p className="state-overview-note">{content.postalNote}</p>
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Districts in {stateData.stateName}
        </h2>
        <div className="district-grid">
          {stateData.districts.map(d => {
            const headPin = d.pincodes.find(p => p.hasHeadOffice);
            return (
              <Link key={d.districtSlug} href={`/state/${stateSlug}/${d.districtSlug}/`} className="district-card">
                <div className="district-card-name">{d.districtName}</div>
                <div className="district-card-count">{d.pincodes.length} PIN codes · {d.totalOffices} offices</div>
                {headPin && <div className="district-card-dpo">H.O: {headPin.pincode}</div>}
                <span className="district-card-arrow">View PINs →</span>
              </Link>
            );
          })}
        </div>
      </section>

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
        <Faq items={faqItems} title={`FAQ: ${stateData.stateName} PIN Codes`} />
      </section>
    </>
  );
}
