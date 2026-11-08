import type { MetadataRoute } from 'next';
import { getPublishedListings } from '@/lib/listings';

export const dynamic = 'force-static';

const siteUrl = 'https://svvestates.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/about', '/projects', '/book-visit', '/privacy', '/terms'];
  // Fetched once at build time, same as the rest of this static export —
  // the sitemap reflects listings as of the last deploy.
  const listings = await getPublishedListings();
  const listingRoutes = listings.map((listing) => `/projects/listing?slug=${listing.slug}`);

  return [...staticRoutes, ...listingRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
