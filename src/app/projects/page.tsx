'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Filter, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '@/components/ClientProvider';
import { getPublishedListings, type Listing } from '@/lib/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { translations } from '@/lib/i18n';
import ListingCard from '@/components/ListingCard';

type StatusFilter = Listing['status'] | 'all';

const statusFilters: { id: StatusFilter; labelEn: string; labelTa: string }[] = [
  { id: 'all', labelEn: 'All', labelTa: 'அனைத்தும்' },
  { id: 'available', labelEn: 'Available', labelTa: 'விற்பனைக்கு உள்ளது' },
  { id: 'booked', labelEn: 'Booked', labelTa: 'முன்பதிவு' },
  { id: 'sold', labelEn: 'Sold', labelTa: 'விற்கப்பட்டது' },
];

function ProjectsPageContent() {
  const { language } = useApp();
  const t = translations[language];
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('location') || '');

  useEffect(() => {
    getPublishedListings()
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredListings = listings.filter((listing) => {
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    const matchesSearch =
      !query ||
      `${listing.title.en} ${listing.title.ta} ${listing.location.en} ${listing.location.ta}`
        .toLowerCase()
        .includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-20">
      <section className="relative overflow-hidden bg-ink py-12 text-white dark:bg-ink-muted"><div className="absolute inset-0 grid-backdrop" /><div className="relative mx-auto max-w-7xl space-y-2 px-4 text-center"><h1 className="text-3xl font-extrabold"><span className="gradient-accent-text">{t.projects}</span></h1><p className="text-sm text-gray-400">Only confirmed public listings are shown here.</p></div></section>
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200/70 bg-white p-4 dark:border-gray-800 dark:bg-ink-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.id}
                onClick={() => setFilterStatus(status.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filterStatus === status.id ? 'bg-accent text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-ink-muted dark:text-gray-300'}`}
              >
                <Filter className="mr-2 inline h-4 w-4" />
                {language === 'ta' ? status.labelTa : status.labelEn}
              </button>
            ))}
          </div>
          <input
            id="projects-search-location"
            name="location"
            autoComplete="off"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.searchLocation}
            className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-accent dark:border-gray-800 dark:bg-ink-muted dark:text-white md:w-72"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-ink-muted" />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {filteredListings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} language={language} viewDetailsLabel={t.viewDetails} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-surface-dark"><h2 className="text-xl font-bold text-gray-900 dark:text-white">No verified listings match this search</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">We are preparing the first public listings from confirmed business information. Contact SVV Estates directly for current availability.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white dark:bg-accent-2 dark:text-ink"><Phone className="h-4 w-4" />{businessContact.phoneDisplay}</a><a href={getWhatsAppUrl('Hello SVV Estates, please share currently available property details.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />Enquire on WhatsApp</a></div></div>
        )}
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return <Suspense fallback={<div className="min-h-[50vh]" />}><ProjectsPageContent /></Suspense>;
}
