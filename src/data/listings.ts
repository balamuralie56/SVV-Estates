export type ListingType =
  | 'residential_plot'
  | 'agricultural_land'
  | 'commercial_property'
  | 'villa'
  | 'other';

export type AvailabilityStatus =
  | 'available'
  | 'on_request'
  | 'unavailable';

export interface LocalizedText {
  en: string;
  ta: string;
}

export interface ListingPhoto {
  src: string;
  alt: LocalizedText;
}

export interface Listing {
  id: string;
  slug: string;
  type: ListingType;
  title: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  mapUrl?: string;
  plotNumbers?: string[];
  dimensions?: string;
  area?: string;
  price?: {
    amount: number;
    unit:
    | 'total'
    | 'per_sqft'
    | 'per_cent'
    | 'per_acre'
    | 'on_request';
    display: LocalizedText;
  };
  availability: AvailabilityStatus;
  photos: ListingPhoto[];
  roadAccess?: LocalizedText;
  amenities?: LocalizedText[];
  approval?: {
    name: LocalizedText;
    status:
    | 'verified'
    | 'seller_provided'
    | 'under_review'
    | 'not_applicable';
  };
  enquiryPhone: string;
  enquiryWhatsApp: string;
  published: boolean;
  lastAvailabilityConfirmed?: string;
}

/**
 * Add a listing only after confirming:
 * - public property details
 * - approved photographs
 * - current availability
 * - public pricing
 * - enquiry contact details
 * - verification wording
 *
 * Keep seller details, customer information, deeds, signatures,
 * internal notes, and confidential documents out of this file.
 */
const listing: Listing = {
  id: 'replace-with-confirmed-internal-id',

  slug: 'punnampattu-residential-plot-01',

  type: 'residential_plot',

  title: {
    en: 'Replace with confirmed property title',
    ta: 'உறுதிப்படுத்தப்பட்ட சொத்து தலைப்பை இங்கே சேர்க்கவும்',
  },

  description: {
    en: 'Replace with an accurate public description of the property.',
    ta: 'சொத்தின் துல்லியமான பொதுவான விளக்கத்தை இங்கே சேர்க்கவும்.',
  },

  location: {
    en: 'Punnampattu, Chengalpattu district',
    ta: 'புன்னம்பட்டு, செங்கல்பட்டு மாவட்டம்',
  },

  // Use the approved public map location.
  mapUrl: 'https://maps.google.com/?q=REPLACE_WITH_APPROVED_LOCATION',

  // Add these only when confirmed.
  plotNumbers: [],

  dimensions: 'Replace with confirmed dimensions',

  area: 'Replace with confirmed area',

  price: {
    // Keep amount as 0 when the price is genuinely on request.
    amount: 0,

    unit: 'on_request',

    display: {
      en: 'Price available on request',
      ta: 'விலை தொடர்புக்கு',
    },
  },

  availability: 'on_request',

  photos: [
    {
      // Store approved real photographs under public/listings/.
      src: '/listings/punnampattu-residential-plot-01/front-road.jpg',

      alt: {
        en: 'Road-facing view of the property',
        ta: 'சொத்தின் சாலை பகுதி காட்சி',
      },
    },
  ],

  roadAccess: {
    en: 'Replace with confirmed public road information.',
    ta: 'உறுதிப்படுத்தப்பட்ட சாலை தகவலை இங்கே சேர்க்கவும்.',
  },

  amenities: [],

  approval: {
    name: {
      en: 'Replace with the applicable public verification description',
      ta: 'பொருந்தக்கூடிய பொதுவான சரிபார்ப்பு விளக்கத்தை சேர்க்கவும்',
    },

    // Use "verified" only when documented confirmation exists.
    status: 'under_review',
  },

  // Replace these with the approved public enquiry details.
  enquiryPhone: '+91 9994115154',
  enquiryWhatsApp: '+91 9994115154',

  // Keep false until every field has been reviewed.
  published: false,

  // Use the actual confirmation date in YYYY-MM-DD format.
  lastAvailabilityConfirmed: '2026-10-14',
};

export const publishedListings: readonly Listing[] = [
  listing,
];

export function getPublishedListingBySlug(
  slug: string,
): Listing | undefined {
  return publishedListings.find(
    (property) =>
      property.published && property.slug === slug,
  );
}