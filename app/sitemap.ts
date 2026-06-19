import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import { STATES } from '@/lib/states';
import { fetchStateOffices } from '@/lib/pincode';
import { toSlug } from '@/lib/utils';
import { BLOG_POSTS } from '@/lib/blog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pincodefinder.net';

// Date the India Post data was last synced
const DATA_UPDATED = new Date('2025-01-01');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const latestBlogDate = BLOG_POSTS.reduce<Date>((max, p) => {
    const d = new Date(p.date);
    return d > max ? d : max;
  }, new Date('2000-01-01'));

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1, lastModified: latestBlogDate },
    { url: `${siteUrl}/blog/`, changeFrequency: 'weekly', priority: 0.9, lastModified: latestBlogDate },
    ...BLOG_POSTS.map(p => ({
      url: `${siteUrl}/blog/${p.slug}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: new Date(p.date),
    })),
  ];

  for (const state of STATES) {
    entries.push({
      url: `${siteUrl}/state/${state.slug}/`,
      changeFrequency: 'monthly',
      priority: 0.8,
      lastModified: DATA_UPDATED,
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
            lastModified: DATA_UPDATED,
          });
        }
        const pinKey = `${distKey}/${office.pincode?.trim()}`;
        if (!seen.has(pinKey)) {
          seen.add(pinKey);
          entries.push({
            url: `${siteUrl}/state/${pinKey}/`,
            changeFrequency: 'monthly',
            priority: 0.6,
            lastModified: DATA_UPDATED,
          });
        }
      }
    } catch {
      // skip state if API fails
    }
  }

  return entries;
}
