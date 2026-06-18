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
  const { state: stateSlug } = await params;
  const info = STATES_BY_SLUG.get(stateSlug);
  if (!info) return {};
  return {
    title: `${info.name} PIN Codes — All Districts`,
    description: `Browse all districts and PIN codes in ${info.name}. Find post offices, HEAD offices, and delivery zones across ${info.name}.`,
    alternates: { canonical: `/state/${stateSlug}/` },
    openGraph: { title: `${info.name} PIN Codes`, description: `All districts and post offices in ${info.name}.` },
  };
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const stateData = await getStateData(stateSlug);
  if (!stateData) notFound();

  const info = STATES_BY_SLUG.get(stateSlug)!;
  const otherStates = STATES.filter(s => s.slug !== stateSlug);

  const faqItems = [
    { q: `What are the PIN codes in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalOffices.toLocaleString()} post offices across ${stateData.totalDistricts} districts. Browse the list above to find PIN codes for each district.` },
    { q: `How many districts are in ${stateData.stateName}?`, a: `${stateData.stateName} has ${stateData.totalDistricts} districts with postal coverage as per India Post records.` },
    { q: `What is the capital of ${stateData.stateName}?`, a: info.capital ? `The capital of ${stateData.stateName} is ${info.capital}.` : `${stateData.stateName} is a ${info.type === 'ut' ? 'union territory' : 'state'} of India.` },
    { q: `How do I find a PIN code in ${stateData.stateName}?`, a: `Click on any district in the table above to see all PIN codes and post offices in that district of ${stateData.stateName}.` },
    { q: `Is ${stateData.stateName} a state or union territory?`, a: info.type === 'ut' ? `${stateData.stateName} is a Union Territory of India, administered directly by the central government.` : `${stateData.stateName} is a state of India with its own elected government.` },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: stateData.stateName,
    containedInPlace: { '@type': 'Country', name: 'India' },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/state/${stateSlug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: stateData.stateName }]} />

      <div className="page-header">
        <div className="page-header-inner">
          <h1>{stateData.stateName} PIN Codes</h1>
          <p>
            {info.type === 'ut' ? 'Union Territory' : 'State'} · {info.capital && `Capital: ${info.capital} · `}
            {stateData.totalDistricts} Districts · {stateData.totalOffices.toLocaleString()} Post Offices
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="stats-strip">
            <div className="stat-item">
              <span className="stat-value">{stateData.totalDistricts}</span>
              <span className="stat-label">Districts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stateData.totalOffices.toLocaleString()}</span>
              <span className="stat-label">Post Offices</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stateData.districts.reduce((s, d) => s + d.pincodes.length, 0).toLocaleString()}</span>
              <span className="stat-label">PIN Codes</span>
            </div>
          </div>

          <h2>Districts in {stateData.stateName}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>District</th>
                  <th>PIN Codes</th>
                  <th>Post Offices</th>
                  <th>PIN Range</th>
                </tr>
              </thead>
              <tbody>
                {stateData.districts.map((d, i) => (
                  <tr key={d.districtSlug}>
                    <td style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</td>
                    <td>
                      <Link href={`/state/${stateSlug}/${d.districtSlug}/`}>{d.districtName}</Link>
                    </td>
                    <td><span className="pin-badge">{d.pincodes.length}</span></td>
                    <td>{d.totalOffices}</td>
                    <td style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', fontSize: '0.8rem' }}>
                      {d.pincodeRange.min}{d.pincodeRange.min !== d.pincodeRange.max ? ` – ${d.pincodeRange.max}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Other States &amp; Union Territories</h2>
          <div className="state-pills">
            {otherStates.map(s => (
              <Link key={s.slug} href={`/state/${s.slug}/`} className="state-pill">{s.name}</Link>
            ))}
          </div>
        </div>
      </section>

      <Faq items={faqItems} heading={`FAQs — ${stateData.stateName} PIN Codes`} />
    </>
  );
}
