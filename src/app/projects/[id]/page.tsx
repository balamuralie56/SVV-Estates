import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getPublishedListingBySlug, publishedListings } from '@/data/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';

type PageProps = { params: Promise<{ id: string }> };

export const dynamicParams = false;

const emptyCatalogueId = '__no-published-listing__';

export function generateStaticParams() {
  const params = publishedListings.filter((listing) => listing.published).map((listing) => ({ id: listing.slug }));
  return params.length > 0 ? params : [{ id: emptyCatalogueId }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getPublishedListingBySlug(id);
  return listing ? { title: listing.title.en, description: listing.description.en, alternates: { canonical: `/projects/${listing.slug}` } } : { title: 'Property listing' };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getPublishedListingBySlug(id);
  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">No published listing is available</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Verified property details will appear here after they are supplied and reviewed.</p>
        <Link href="/projects" className="mt-8 inline-block rounded-lg bg-charcoal px-5 py-3 text-sm font-bold text-white dark:bg-gold-dark dark:text-charcoal">View property catalogue</Link>
      </div>
    );
  }

  const message = `Hello SVV Estates, I would like to enquire about ${listing.title.en} in ${listing.location.en}. Please share the currently available details. I understand that sending this message starts a conversation and does not confirm an appointment.`;

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-charcoal py-16 text-white dark:bg-[#1E1E1E]"><div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8"><p className="flex items-center gap-2 text-sm font-semibold text-gold-light"><MapPin className="h-4 w-4" />{listing.location.en}</p><h1 className="text-3xl font-extrabold sm:text-4xl">{listing.title.en}</h1><p className="max-w-2xl text-gray-300">Public listing details are provided for enquiry and must be confirmed directly before any decision.</p></div></section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          {listing.photos.length > 0 ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{listing.photos.map((photo) => <div key={photo.src} className="relative h-64 overflow-hidden rounded-2xl"><Image src={photo.src} alt={photo.alt.en} fill className="object-cover" /></div>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-[#1E1E1E] dark:text-gray-400">Approved property photographs will be added when available.</div>}
          <div className="space-y-4 rounded-2xl border border-gray-200/70 bg-white p-6 dark:border-gray-800 dark:bg-card-dark"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">About this listing</h2><p className="leading-relaxed text-gray-600 dark:text-gray-300">{listing.description.en}</p><dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">{listing.area && <div><dt className="font-semibold text-gray-400">Area</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.area}</dd></div>}{listing.dimensions && <div><dt className="font-semibold text-gray-400">Dimensions</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.dimensions}</dd></div>}{listing.roadAccess && <div><dt className="font-semibold text-gray-400">Road access</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.roadAccess.en}</dd></div>}{listing.approval && <div><dt className="font-semibold text-gray-400">Approval information</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.approval.name.en} ({listing.approval.status.replace('_', ' ')})</dd></div>}</dl></div>
          {listing.mapUrl && <a href={listing.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-gold-light hover:underline"><MapPin className="h-4 w-4" />Open map location</a>}
        </div>
        <aside className="h-fit space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-card-dark lg:sticky lg:top-24"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Enquire about this property</h2><p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">Choose a contact action. Sending a WhatsApp message or making a call starts a conversation; it does not confirm a booking or visit.</p><a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />Send WhatsApp enquiry</a><a href={businessContact.phoneHref} className="flex items-center justify-center gap-2 rounded-lg bg-charcoal px-4 py-3 text-sm font-bold text-white dark:bg-gold-dark dark:text-charcoal"><Phone className="h-4 w-4" />Call {businessContact.phoneDisplay}</a><Link href={`/book-visit?listing=${listing.slug}`} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200"><Calendar className="h-4 w-4" />Request a site visit</Link></aside>
      </section>
    </div>
  );
}
