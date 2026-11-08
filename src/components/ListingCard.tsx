'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera, MapPin } from 'lucide-react';
import type { Listing } from '@/lib/listings';
import { formatPlotSize, formatPrice } from '@/lib/units';
import TiltCard from './TiltCard';
import type { Language } from '@/lib/i18n';

export default function ListingCard({ listing, language, viewDetailsLabel, priority = false }: {
  listing: Listing;
  language: Language;
  viewDetailsLabel: string;
  priority?: boolean;
}) {
  const photo = listing.media.find((m) => m.kind === 'photo');

  return (
    <TiltCard className="group rounded-2xl">
      <article className="h-full overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-md transition-shadow duration-200 group-hover:shadow-2xl dark:border-gray-800 dark:bg-surface-dark">
        <div className="relative h-48 bg-gray-100 dark:bg-[#282828]">
          {photo ? (
            <>
              <Image
                src={photo.url}
                alt={photo.caption[language] || listing.title[language]}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                priority={priority}
                className="object-cover"
                unoptimized
              />
              {photo.source === 'street_view' && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                  <Camera className="h-3 w-3" />
                  {photo.caption[language]}
                </span>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {language === 'ta' ? 'புகைப்படம் விரைவில் சேர்க்கப்படும்' : 'Photographs will be added soon'}
            </div>
          )}
          <StatusChip status={listing.status} language={language} />
        </div>
        <div className="space-y-3 p-6">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location[language]}
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{listing.title[language]}</h3>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {listing.description[language]}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {formatPlotSize(listing.plotSizeSqft, language)}
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {formatPrice(listing.priceOnRequest, listing.priceTotal, listing.pricePerSqft, language)}
            </span>
          </div>
          <Link
            href={`/projects/listing?slug=${listing.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
          >
            {viewDetailsLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </TiltCard>
  );
}

function StatusChip({ status, language }: { status: Listing['status']; language: Language }) {
  const labels: Record<Listing['status'], LocalizedLabel> = {
    available: { en: 'Available', ta: 'விற்பனைக்கு உள்ளது' },
    booked: { en: 'Booked', ta: 'முன்பதிவு செய்யப்பட்டது' },
    sold: { en: 'Sold', ta: 'விற்கப்பட்டது' },
  };
  const styles: Record<Listing['status'], string> = {
    available: 'bg-emerald-600',
    booked: 'bg-amber-600',
    sold: 'bg-red-600',
  };
  return (
    <span className={`absolute right-2 top-2 rounded-full ${styles[status]} px-2.5 py-1 text-[10px] font-bold uppercase text-white`}>
      {labels[status][language]}
    </span>
  );
}

type LocalizedLabel = { en: string; ta: string };
