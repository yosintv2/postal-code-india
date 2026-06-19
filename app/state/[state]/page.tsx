import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { STATES, STATES_BY_SLUG } from '@/lib/states';
import { getStateData } from '@/lib/pincode';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

interface Props { params: Promise<{ state: string }> }

export async function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const info = STATES_BY_SLUG.get(slug);
  if (!info) return {};
  const title = `${info.name} PIN Codes — All Districts & Post Offices | PincodeIN`;
  const desc = `Find PIN codes for all districts in ${info.name}. Browse ${info.name} post offices, head offices, and delivery zones.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/state/${slug}/` },
    openGraph: { title, description: desc },
  };
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = await getStateData(stateSlug);
  if (!stateData) notFound();

  const info = STATES_BY_SLUG.get(stateSlug)!;
  const otherStates = STATES.filter(s => s.slug !== stateSlug);
  const totalPins = stateData.districts.reduce((s, d) => s + d.pincodes.length, 0);

  const faqItems = [
    { q: `What are the PIN codes in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalOffices.toLocaleString()} post offices across ${stateData.totalDistricts} districts. Browse the list above to find PIN codes for each district.` },
    { q: `How many districts are in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalDistricts} districts with postal coverage as per India Post records.` },
    { q: `What is the capital of ${stateData.stateName}?`, a: info.capital ? `The capital of ${stateData.stateName} is ${info.capital}.` : `${stateData.stateName} is a ${info.type === 'ut' ? 'union territory' : 'state'} of India.` },
    { q: `How do I find a PIN code in ${stateData.stateName}?`, a: `Click on any district in the table above to see all PIN codes and post offices in that district of ${stateData.stateName}.` },
    { q: `Is ${stateData.stateName} a state or union territory?`, a: info.type === 'ut' ? `${stateData.stateName} is a Union Territory of India, administered directly by the central government.` : `${stateData.stateName} is a state of India with its own elected government.` },
    { q: `How many PIN codes does ${stateData.stateName} have?`, a: `${stateData.stateName} has ${totalPins.toLocaleString()} unique PIN codes across its ${stateData.totalDistricts} districts.` },
  ];

  return (
    <>
      <div className="container">
        <div className="page-head">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: stateData.stateName }]} />
          <h1 className="page-title">{stateData.stateName} PIN Codes</h1>
          <p className="page-sub">
            {info.type === 'ut' ? 'Union Territory' : 'State'}{info.capital ? ` · Capital: ${info.capital}` : ''} · {stateData.totalDistricts} Districts · {stateData.totalOffices.toLocaleString()} Post Offices · {totalPins.toLocaleString()} PIN Codes
          </p>
        </div>

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
      </div>
    </>
  );
}
