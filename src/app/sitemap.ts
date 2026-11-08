import type { MetadataRoute } from 'next';
import { publishedListings } from '@/data/listings';

export const dynamic = 'force-static';

const siteUrl = 'https://svvestates.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/projects', '/book-visit', '/privacy', '/terms'];
  const listingRoutes = publishedListings
    .filter((listing) => listing.published)
    .map((listing) => `/projects/${listing.slug}`);

  return [...staticRoutes, ...listingRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));
}
