'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Home as HomeIcon, MapPin, MessageCircle, Phone, Search } from 'lucide-react';
import { useApp } from '@/components/ClientProvider';
import { publishedListings } from '@/data/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { translations } from '@/lib/i18n';

export default function HomePage() {
  const { language } = useApp();
  const t = translations[language];
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('all');
  const tamil = language === 'ta';

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (searchType !== 'all') params.set('type', searchType);
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,178,131,0.2),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-gold-light/40 bg-gold-light/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-light">
              {tamil ? 'தெளிவான சொத்து வழிகாட்டுதல்' : 'Clear property guidance'}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{t.heroTitle}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-300">{t.heroSubtitle}</p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link href="/projects" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-light px-7 py-3.5 font-bold text-gray-900 transition hover:bg-gold-hover">{t.exploreProjects}<ArrowRight className="h-5 w-5" /></Link>
              <Link href="/book-visit" className="rounded-lg border border-white/25 bg-white/10 px-7 py-3.5 text-center font-bold transition hover:bg-white/15">{t.bookFreeCab}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 mx-auto max-w-6xl px-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200/70 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-card-dark md:grid-cols-[1.2fr_1fr_auto] md:items-end">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{tamil ? 'இடம்' : 'Location'}<span className="relative mt-2 block"><MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input value={searchLocation} onChange={(event) => setSearchLocation(event.target.value)} placeholder={t.searchLocation} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-gold-light dark:border-gray-800 dark:bg-[#282828] dark:text-white" /></span></label>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t.projectType}<span className="relative mt-2 block"><HomeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><select value={searchType} onChange={(event) => setSearchType(event.target.value)} className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-gold-light dark:border-gray-800 dark:bg-[#282828] dark:text-white"><option value="all">{t.allTypes}</option><option value="residential_plot">{t.plots}</option><option value="villa">{t.villas}</option><option value="agricultural_land">{t.farmlands}</option></select></span></label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-charcoal px-6 py-3 text-sm font-bold text-white transition hover:bg-black dark:bg-gold-dark dark:text-charcoal dark:hover:bg-gold-hover"><Search className="h-5 w-5" />{t.searchBtn}</button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl space-y-3"><h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t.featuredTitle}</h2><p className="text-gray-500 dark:text-gray-400">{t.featuredSubtitle}</p></div>
        {publishedListings.length > 0 ? <div className="grid grid-cols-1 gap-8 md:grid-cols-3">{publishedListings.map((listing) => <article key={listing.id} className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-md dark:border-gray-800 dark:bg-card-dark"><div className="flex h-48 items-center justify-center bg-gray-100 px-6 text-center text-sm text-gray-500 dark:bg-[#282828] dark:text-gray-400">{listing.photos[0] ? listing.photos[0].alt[language] : (tamil ? 'புகைப்படம் விரைவில் சேர்க்கப்படும்' : 'Property photographs will be added after approval')}</div><div className="space-y-4 p-6"><div className="space-y-1"><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light"><MapPin className="h-3.5 w-3.5" />{listing.location[language]}</p><h3 className="text-xl font-bold text-gray-900 dark:text-white">{listing.title[language]}</h3></div><p className="line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{listing.description[language]}</p><Link href={`/projects/${listing.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-gold-light hover:underline">{t.viewDetails}<ArrowRight className="h-4 w-4" /></Link></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-card-dark"><h3 className="text-xl font-bold text-gray-900 dark:text-white">{tamil ? 'உறுதிப்படுத்தப்பட்ட பட்டியல்கள் விரைவில் சேர்க்கப்படும்' : 'Verified listings are being prepared'}</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'புன்னம்பட்டு குடியிருப்பு மனைகள் மற்றும் பிற சொத்துகளின் உண்மையான விலை, கிடைப்பு, புகைப்படங்கள் மற்றும் ஆவண நிலை உறுதிசெய்யப்பட்ட பிறகு மட்டுமே வெளியிடப்படும்.' : 'Punnampattu residential plots and other properties will be published after their real availability, pricing, photographs, and verification information are confirmed.'}</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-charcoal px-5 py-3 text-sm font-bold text-white dark:bg-gold-dark dark:text-charcoal"><Phone className="h-4 w-4" />{businessContact.phoneDisplay}</a><a href={getWhatsAppUrl('Hello SVV Estates, please share currently available property details. I understand that sending this message starts a conversation and does not confirm an appointment.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />{tamil ? 'வாட்ஸ்அப்பில் விசாரிக்க' : 'Enquire on WhatsApp'}</a></div></div>}
      </section>

      <section className="bg-white py-16 dark:bg-[#1E1E1E]"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8"><div className="space-y-3 lg:col-span-2"><h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{tamil ? 'அனுபவத்தை அடிப்படையாகக் கொண்ட தனிப்பட்ட வழிகாட்டுதல்' : 'Personal guidance shaped by experience'}</h2><p className="leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'SVV Estates என்பது உங்கள் குடும்பத்தின் சொத்து முடிவுகளை தெளிவாக புரிந்துகொள்ள உதவும் புதிய பிராண்ட். இந்த பணிக்கு என் தந்தையின் சொத்து ஆலோசனை மற்றும் விளம்பரத் துறையில் கிட்டத்தட்ட 20 ஆண்டுகால தனிப்பட்ட அனுபவம் வழிகாட்டுகிறது.' : "SVV Estates is a new brand focused on helping families understand property decisions clearly. The work is guided by my father's nearly 20 years of personal experience in property consulting and promotion."}</p><p className="leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'பொது தகவல்கள் சரிபார்க்கப்படும் வரை வெளியிடப்படாது. கிடைப்பு, விலை மற்றும் ஆவண நிலையை எந்த முடிவுக்கும் முன் நேரடியாக உறுதி செய்ய வேண்டும்.' : 'Public information is published only after review. Availability, pricing, and document status should always be confirmed directly before making a decision.'}</p></div><div className="space-y-4 rounded-2xl border border-gold-light/25 bg-gold-light/5 p-6 dark:bg-gold-dark/5">{[tamil ? 'உண்மையான தகவல்களை மட்டும் வெளியிடுதல்' : 'Publish only confirmed information', tamil ? 'வாடிக்கையாளர் முடிவுகளுக்கு தெளிவான வழிகாட்டுதல்' : 'Clear guidance for customer decisions', tamil ? 'நேரடி தொடர்பு மூலம் விசாரணைகள்' : 'Direct contact for enquiries'].map((item) => <div key={item} className="flex items-start gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" />{item}</div>)}</div></div></section>
    </div>
  );
}
