import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://india.singhyogendra.com.np';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'PincodeIN — India PIN Code Directory', template: '%s | PincodeIN' },
  description: 'Find PIN codes for any post office, district, or locality across all Indian states and union territories.',
  keywords: 'india pin code, pin code india, postal code india, india post pin code, pincode finder india, india pin code search',
  authors: [{ name: 'PincodeIN' }],
  openGraph: { siteName: 'PincodeIN', type: 'website', locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
  applicationName: 'PincodeIN',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'PincodeIN',
      url: siteUrl,
      description: 'India PIN code directory covering all states, districts, and post offices.',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'PincodeIN',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` },
    },
    {
      '@type': 'GovernmentOrganization',
      '@id': 'https://www.indiapost.gov.in/#organization',
      name: 'India Post',
      alternateName: 'Department of Posts, Ministry of Communications, Government of India',
      url: 'https://www.indiapost.gov.in',
      logo: 'https://www.indiapost.gov.in/images/logo.png',
      sameAs: [
        'https://en.wikipedia.org/wiki/India_Post',
        'https://www.wikidata.org/wiki/Q1796903',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dak Bhavan, Sansad Marg',
        addressLocality: 'New Delhi',
        postalCode: '110001',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Navbar />
        <div className="container">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
