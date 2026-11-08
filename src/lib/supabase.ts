import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set. ' +
      'Listings and the admin panel will not work until .env.local is configured.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ListingRow {
  id: string;
  slug: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  location_en: string;
  location_ta: string;
  map_url: string | null;
  plot_size_sqft: number | null;
  price_per_sqft: number | null;
  price_total: number | null;
  price_on_request: boolean;
  status: 'available' | 'booked' | 'sold';
  patta_status: string | null;
  ec_status: string | null;
  notes: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingMediaRow {
  id: string;
  listing_id: string;
  kind: 'photo' | 'video';
  source: 'owner_provided' | 'street_view';
  url: string;
  caption_en: string | null;
  caption_ta: string | null;
  sort_order: number;
  created_at: string;
}

export const LISTING_MEDIA_BUCKET = 'listing-media';

export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: 'book_visit' | 'listing_enquiry' | 'general';
  listing_slug: string | null;
  listing_title: string | null;
  message: string | null;
  marketing_opt_in: boolean;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}
