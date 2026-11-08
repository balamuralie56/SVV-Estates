import { supabase, type ListingRow, type ListingMediaRow } from './supabase';

export interface LocalizedText {
  en: string;
  ta: string;
}

export interface ListingMediaItem {
  id: string;
  kind: 'photo' | 'video';
  source: 'owner_provided' | 'street_view';
  url: string;
  caption: LocalizedText;
}

export interface Listing {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  mapUrl: string | null;
  plotSizeSqft: number | null;
  pricePerSqft: number | null;
  priceTotal: number | null;
  priceOnRequest: boolean;
  status: 'available' | 'booked' | 'sold';
  pattaStatus: string | null;
  ecStatus: string | null;
  notes: string | null;
  published: boolean;
  media: ListingMediaItem[];
  lastUpdated: string;
}

const streetViewLabel: LocalizedText = {
  en: 'Area reference (Google Street View)',
  ta: 'பகுதி குறிப்பு (Google Street View)',
};

/**
 * Street View Static API requires NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY.
 * Without it we deliberately return null so the UI shows a labeled
 * placeholder instead of a broken/unauthorized image request.
 */
export function getStreetViewFallbackUrl(locationEn: string): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_STREET_VIEW_KEY;
  if (!apiKey || !locationEn) return null;
  const params = new URLSearchParams({
    size: '800x500',
    location: `${locationEn}, Tamil Nadu, India`,
    fov: '80',
    source: 'outdoor',
    key: apiKey,
  });
  return `https://maps.googleapis.com/maps/api/streetview?${params.toString()}`;
}

function toListing(row: ListingRow, mediaRows: ListingMediaRow[]): Listing {
  const ownerMedia = mediaRows
    .filter((m) => m.source === 'owner_provided')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map<ListingMediaItem>((m) => ({
      id: m.id,
      kind: m.kind,
      source: m.source,
      url: m.url,
      caption: { en: m.caption_en ?? '', ta: m.caption_ta ?? '' },
    }));

  let media = ownerMedia;

  if (ownerMedia.length === 0) {
    const streetViewUrl = getStreetViewFallbackUrl(row.location_en);
    if (streetViewUrl) {
      media = [
        {
          id: `street-view-${row.id}`,
          kind: 'photo',
          source: 'street_view',
          url: streetViewUrl,
          caption: streetViewLabel,
        },
      ];
    }
  }

  return {
    id: row.id,
    slug: row.slug,
    title: { en: row.title_en, ta: row.title_ta },
    description: { en: row.description_en, ta: row.description_ta },
    location: { en: row.location_en, ta: row.location_ta },
    mapUrl: row.map_url,
    plotSizeSqft: row.plot_size_sqft,
    pricePerSqft: row.price_per_sqft,
    priceTotal: row.price_total,
    priceOnRequest: row.price_on_request,
    status: row.status,
    pattaStatus: row.patta_status,
    ecStatus: row.ec_status,
    notes: row.notes,
    published: row.published,
    media,
    lastUpdated: row.updated_at,
  };
}

export async function getPublishedListings(): Promise<Listing[]> {
  const { data: listingRows, error } = await supabase
    .from('listings')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !listingRows) {
    if (error) console.error('Failed to load listings', error);
    return [];
  }

  const ids = listingRows.map((row) => row.id);
  const mediaRows = ids.length > 0 ? await getMediaForListings(ids) : [];

  return listingRows.map((row) =>
    toListing(row as ListingRow, mediaRows.filter((m) => m.listing_id === row.id)),
  );
}

export async function getPublishedListingBySlug(slug: string): Promise<Listing | null> {
  const { data: row, error } = await supabase
    .from('listings')
    .select('*')
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle();

  if (error || !row) {
    if (error) console.error('Failed to load listing', error);
    return null;
  }

  const mediaRows = await getMediaForListings([row.id]);
  return toListing(row as ListingRow, mediaRows);
}

async function getMediaForListings(listingIds: string[]): Promise<ListingMediaRow[]> {
  const { data, error } = await supabase
    .from('listing_media')
    .select('*')
    .in('listing_id', listingIds);

  if (error || !data) {
    if (error) console.error('Failed to load listing media', error);
    return [];
  }
  return data as ListingMediaRow[];
}
