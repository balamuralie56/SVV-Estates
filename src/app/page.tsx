'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, MapPin, MessageCircle, Phone, Search } from 'lucide-react';
import { useApp } from '@/components/ClientProvider';
import { getPublishedListings, type Listing } from '@/lib/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { translations } from '@/lib/i18n';
import ListingCard from '@/components/ListingCard';
import HeroScene from '@/components/HeroScene';
import IndicativeCategories from '@/components/IndicativeCategories';

export default function HomePage() {
  const { language } = useApp();
  const t = translations[language];
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const tamil = language === 'ta';

  useEffect(() => {
    getPublishedListings()
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    router.push(`/projects${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="space-y-16 pb-20">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 grid-backdrop" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.12),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:py-32">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              {tamil ? 'தெளிவான சொத்து வழிகாட்டுதல்' : 'Clear property guidance'}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-accent-text">{t.heroTitle}</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-300">{t.heroSubtitle}</p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link href="/projects" className="glow-accent inline-flex items-center justify-center gap-2 rounded-lg gradient-accent-bg px-7 py-3.5 font-bold text-white transition hover:brightness-110">{t.exploreProjects}<ArrowRight className="h-5 w-5" /></Link>
              <Link href="/book-visit" className="rounded-lg border border-white/25 bg-white/10 px-7 py-3.5 text-center font-bold backdrop-blur-sm transition hover:bg-white/15">{t.bookFreeCab}</Link>
            </div>
          </div>
          <HeroScene />
        </div>
      </section>

      <section className="relative z-10 -mt-8 mx-auto max-w-6xl px-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200/70 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-surface-dark md:grid-cols-[1fr_auto] md:items-end">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{tamil ? 'இடம்' : 'Location'}<span className="relative mt-2 block"><MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="home-search-location" name="location" autoComplete="off" value={searchLocation} onChange={(event) => setSearchLocation(event.target.value)} placeholder={t.searchLocation} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none focus:border-accent dark:border-gray-800 dark:bg-ink-muted dark:text-white" /></span></label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-black dark:bg-accent-2 dark:text-ink dark:hover:bg-accent-hover"><Search className="h-5 w-5" />{t.searchBtn}</button>
        </form>
      </section>

      <IndicativeCategories language={language} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl space-y-3"><h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t.featuredTitle}</h2><p className="text-gray-500 dark:text-gray-400">{t.featuredSubtitle}</p></div>
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-ink-muted" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {listings.map((listing, index) => (
              <ListingCard key={listing.id} listing={listing} language={language} viewDetailsLabel={t.viewDetails} priority={index === 0} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-surface-dark"><h3 className="text-xl font-bold text-gray-900 dark:text-white">{tamil ? 'உறுதிப்படுத்தப்பட்ட பட்டியல்கள் விரைவில் சேர்க்கப்படும்' : 'Verified listings are being prepared'}</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'புன்னம்பட்டு குடியிருப்பு மனைகள் மற்றும் பிற சொத்துகளின் உண்மையான விலை, கிடைப்பு, புகைப்படங்கள் மற்றும் ஆவண நிலை உறுதிசெய்யப்பட்ட பிறகு மட்டுமே வெளியிடப்படும்.' : 'Punnampattu residential plots and other properties will be published after their real availability, pricing, photographs, and verification information are confirmed.'}</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white dark:bg-accent-2 dark:text-ink"><Phone className="h-4 w-4" />{businessContact.phoneDisplay}</a><a href={getWhatsAppUrl('Hello SVV Estates, please share currently available property details. I understand that sending this message starts a conversation and does not confirm an appointment.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-bold text-white"><MessageCircle className="h-4 w-4" />{tamil ? 'வாட்ஸ்அப்பில் விசாரிக்க' : 'Enquire on WhatsApp'}</a></div></div>
        )}
      </section>

      <section className="bg-white py-16 dark:bg-ink-muted"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8"><div className="space-y-3 lg:col-span-2"><h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{tamil ? 'அனுபவத்தை அடிப்படையாகக் கொண்ட தனிப்பட்ட வழிகாட்டுதல்' : 'Personal guidance shaped by experience'}</h2><p className="leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'SVV Estates என்பது உங்கள் குடும்பத்தின் சொத்து முடிவுகளை தெளிவாக புரிந்துகொள்ள உதவும் புதிய பிராண்ட். இந்த பணிக்கு என் தந்தையின் சொத்து ஆலோசனை மற்றும் விளம்பரத் துறையில் கிட்டத்தட்ட 20 ஆண்டுகால தனிப்பட்ட அனுபவம் வழிகாட்டுகிறது.' : "SVV Estates is a new brand focused on helping families understand property decisions clearly. The work is guided by my father's nearly 20 years of personal experience in property consulting and promotion."}</p><p className="leading-relaxed text-gray-500 dark:text-gray-400">{tamil ? 'பொது தகவல்கள் சரிபார்க்கப்படும் வரை வெளியிடப்படாது. கிடைப்பு, விலை மற்றும் ஆவண நிலையை எந்த முடிவுக்கும் முன் நேரடியாக உறுதி செய்ய வேண்டும்.' : 'Public information is published only after review. Availability, pricing, and document status should always be confirmed directly before making a decision.'}</p></div><div className="space-y-4 rounded-2xl border border-accent/25 bg-accent/5 p-6 dark:bg-accent-2/5">{[tamil ? 'உண்மையான தகவல்களை மட்டும் வெளியிடுதல்' : 'Publish only confirmed information', tamil ? 'வாடிக்கையாளர் முடிவுகளுக்கு தெளிவான வழிகாட்டுதல்' : 'Clear guidance for customer decisions', tamil ? 'நேரடி தொடர்பு மூலம் விசாரணைகள்' : 'Direct contact for enquiries'].map((item) => <div key={item} className="flex items-start gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{item}</div>)}</div></div></section>
    </div>
  );
}
