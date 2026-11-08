'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ArrowRight, Filter, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useApp } from '@/components/ClientProvider';
import { publishedListings, type ListingType } from '@/data/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { translations } from '@/lib/i18n';

const listingTypes: { id: ListingType | 'all'; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'residential_plot', label: 'Residential plots' },
  { id: 'agricultural_land', label: 'Agricultural land' },
  { id: 'commercial_property', label: 'Commercial property' },
  { id: 'villa', label: 'Villas' },
];

function ProjectsPageContent() {
  const { language } = useApp();
  const t = translations[language];
  const searchParams = useSearchParams();
  const [filterType, setFilterType] = useState<ListingType | 'all'>(() => {
    const type = searchParams.get('type');
    return listingTypes.some((item) => item.id === type) ? (type as ListingType) : 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('location') || '');
  const query = searchQuery.trim().toLowerCase();
  const filteredListings = publishedListings.filter((listing) => {
    const matchesType = filterType === 'all' || listing.type === filterType;
    const matchesSearch = !query || `${listing.title.en} ${listing.title.ta} ${listing.location.en} ${listing.location.ta}`.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-charcoal py-12 text-white dark:bg-[#1E1E1E]"><div className="mx-auto max-w-7xl space-y-2 px-4 text-center"><h1 className="text-3xl font-extrabold">{t.projects}</h1><p className="text-sm text-gray-400">Only confirmed public listings are shown here.</p></div></section>
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200/70 bg-white p-4 dark:border-gray-800 dark:bg-[#1E1E1E] md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{listingTypes.map((type) => <button key={type.id} onClick={() => setFilterType(type.id)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filterType === type.id ? 'bg-gold-light text-gray-900' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-[#282828] dark:text-gray-300'}`}><Filter className="mr-2 inline h-4 w-4" />{language === 'ta' && type.id === 'residential_plot' ? t.plots : language === 'ta' && type.id === 'agricultural_land' ? t.farmlands : language === 'ta' && type.id === 'villa' ? t.villas : type.label}</button>)}</div><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.searchLocation} className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none focus:border-gold-light dark:border-gray-800 dark:bg-[#282828] dark:text-white md:w-72" /></div>
        {filteredListings.length > 0 ? <div className="grid grid-cols-1 gap-8 md:grid-cols-3">{filteredListings.map((listing) => <article key={listing.id} className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-card-dark"><div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-light"><MapPin className="h-4 w-4" />{listing.location[language]}</div><h2 className="text-xl font-bold text-gray-900 dark:text-white">{listing.title[language]}</h2><p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{listing.description[language]}</p><Link href={`/projects/${listing.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-light hover:underline">{t.viewDetails}<ArrowRight className="h-4 w-4" /></Link></article>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-card-dark"><h2 className="text-xl font-bold text-gray-900 dark:text-white">No verified listings match this search</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">We are preparing the first public listings from confirmed business information. Contact SVV Estates directly for current availability.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-charcoal px-5 py-3 text-sm font-bold text-white dark:bg-gold-dark dark:text-charcoal"><Phone className="h-4 w-4" />{businessContact.phoneDisplay}</a><a href={getWhatsAppUrl('Hello SVV Estates, please share currently available property details.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />Enquire on WhatsApp</a></div></div>}
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  return <Suspense fallback={<div className="min-h-[50vh]" />}><ProjectsPageContent /></Suspense>;
}
