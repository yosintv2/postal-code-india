import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { STATES } from '@/lib/states';
import { fetchStateOffices } from '@/lib/pincode';
import { toSlug } from '@/lib/utils';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://india.singhyogendra.com.np';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
  ];

  for (const state of STATES) {
    entries.push({
      url: `${siteUrl}/state/${state.slug}/`,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    try {
      const offices = await fetchStateOffices(state.apiFile);
      const seen = new Set<string>();

      for (const office of offices) {
        const districtSlug = toSlug(office.districtName?.trim() ?? '');
        const distKey = `${state.slug}/${districtSlug}`;
        if (!seen.has(distKey)) {
          seen.add(distKey);
          entries.push({
            url: `${siteUrl}/state/${distKey}/`,
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
        const pinKey = `${distKey}/${office.pincode?.trim()}`;
        if (!seen.has(pinKey)) {
          seen.add(pinKey);
          entries.push({
            url: `${siteUrl}/state/${pinKey}/`,
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    } catch {
      // skip state if API fails
    }
  }

  return entries;
}
