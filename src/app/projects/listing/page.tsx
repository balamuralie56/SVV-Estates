'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Camera, Expand, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getPublishedListingBySlug, type Listing } from '@/lib/listings';
import { formatPlotSize, formatPrice } from '@/lib/units';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { useApp } from '@/components/ClientProvider';
import ImageLightbox from '@/components/ImageLightbox';

/**
 * Deliberately a static route (no [slug] dynamic segment). `output: 'export'`
 * requires every dynamic App Router segment to be fully known at build time,
 * which would mean a rebuild every time a listing is added or edited in the
 * admin panel. Reading the slug from a query string instead keeps listings
 * live (editable in Supabase without a redeploy) while keeping the static
 * export intact everywhere else on the site.
 */
function ListingDetailContent() {
  const { language } = useApp();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') ?? '';
  const [listing, setListing] = useState<Listing | null | 'loading'>('loading');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const result = slug ? getPublishedListingBySlug(slug) : Promise.resolve(null);
    result.then(setListing);
  }, [slug]);

  if (listing === 'loading') {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-400">Loading…</div>;
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">No published listing is available</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Verified property details will appear here after they are supplied and reviewed.</p>
        <Link href="/projects" className="mt-8 inline-block rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white dark:bg-accent-2 dark:text-ink">View property catalogue</Link>
      </div>
    );
  }

  const message = `Hello SVV Estates, I would like to enquire about ${listing.title.en} in ${listing.location.en}. Please share the currently available details. I understand that sending this message starts a conversation and does not confirm an appointment.`;

  return (
    <div className="space-y-12 pb-20">
      <section className="relative overflow-hidden bg-ink py-16 text-white dark:bg-ink-muted"><div className="absolute inset-0 grid-backdrop" /><div className="relative mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8"><p className="flex items-center gap-2 text-sm font-semibold text-accent"><MapPin className="h-4 w-4" />{listing.location[language]}</p><h1 className="text-3xl font-extrabold sm:text-4xl"><span className="gradient-accent-text">{listing.title[language]}</span></h1><p className="max-w-2xl text-gray-300">Public listing details are provided for enquiry and must be confirmed directly before any decision.</p></div></section>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          {listing.media.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listing.media.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative h-80 overflow-hidden rounded-2xl bg-gray-100 text-left dark:bg-ink-muted"
                >
                  {item.kind === 'video' ? (
                     
                    <video src={item.url} muted className="h-full w-full object-contain" />
                  ) : (
                    <Image
                      src={item.url}
                      alt={item.caption[language]}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      priority={index === 0}
                      className="object-contain"
                      unoptimized
                    />
                  )}
                  {item.source === 'street_view' && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                      <Camera className="h-3 w-3" />
                      {item.caption[language]}
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-gray-900">
                      <Expand className="h-4 w-4" />
                      {language === 'ta' ? 'பெரிதாக்கிப் பார்க்க' : 'View full size'}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-ink-muted dark:text-gray-400">Approved property photographs will be added when available.</div>
          )}
          <div className="space-y-4 rounded-2xl border border-gray-200/70 bg-white p-6 dark:border-gray-800 dark:bg-surface-dark">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About this listing</h2>
            <p className="leading-relaxed text-gray-600 dark:text-gray-300">{listing.description[language]}</p>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-gray-400">Plot size</dt><dd className="mt-1 text-gray-900 dark:text-white">{formatPlotSize(listing.plotSizeSqft, language)}</dd></div>
              <div><dt className="font-semibold text-gray-400">Price</dt><dd className="mt-1 text-gray-900 dark:text-white">{formatPrice(listing.priceOnRequest, listing.priceTotal, listing.pricePerSqft, language)}</dd></div>
              <div><dt className="font-semibold text-gray-400">Patta status</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.pattaStatus || 'To be confirmed'}</dd></div>
              <div><dt className="font-semibold text-gray-400">EC status</dt><dd className="mt-1 text-gray-900 dark:text-white">{listing.ecStatus || 'To be confirmed'}</dd></div>
            </dl>
          </div>
          {listing.mapUrl && <a href={listing.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"><MapPin className="h-4 w-4" />Open map location</a>}
        </div>
        <aside className="h-fit space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-surface-dark lg:sticky lg:top-24"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Enquire about this property</h2><p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">Choose a contact action. Sending a WhatsApp message or making a call starts a conversation; it does not confirm a booking or visit.</p><a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />Send WhatsApp enquiry</a><a href={businessContact.phoneHref} className="flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-accent-2 dark:text-ink"><Phone className="h-4 w-4" />Call {businessContact.phoneDisplay}</a><Link href={`/book-visit?listing=${listing.slug}`} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200"><Calendar className="h-4 w-4" />Request a site visit</Link></aside>
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          items={listing.media.map((m) => ({ url: m.url, kind: m.kind, caption: m.caption[language] }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

export default function ListingDetailPage() {
  return <Suspense fallback={<div className="min-h-[50vh]" />}><ListingDetailContent /></Suspense>;
}
