'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarPlus, Calendar, CheckCircle2, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getPublishedListings, type Listing } from '@/lib/listings';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { useApp } from '@/components/ClientProvider';
import { submitLead } from '@/lib/leads';
import { downloadIcsEvent } from '@/lib/ics';

const TIME_SLOTS = [
  { label: 'Morning (10:00 AM - 01:00 PM)', startHour: 10, endHour: 13 },
  { label: 'Afternoon (01:00 PM - 04:00 PM)', startHour: 13, endHour: 16 },
  { label: 'Evening (04:00 PM - 07:00 PM)', startHour: 16, endHour: 19 },
] as const;

const inputClass =
  'mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 dark:border-gray-800 dark:bg-ink-muted dark:text-white';
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-gray-500';

function VisitRequestForm() {
  const { language } = useApp();
  const searchParams = useSearchParams();
  const [listingSlug, setListingSlug] = useState(searchParams.get('listing') || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState<(typeof TIME_SLOTS)[number]['label']>(TIME_SLOTS[0].label);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pickup, setPickup] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    getPublishedListings().then(setListings);
  }, []);

  const listing = listings.find((item) => item.slug === listingSlug);
  const tamil = language === 'ta';

  const optInLine = marketingOptIn
    ? ' I would also like to be notified by WhatsApp/email about similar new properties.'
    : '';
  const message = `Hello SVV Estates, I would like to request a site visit${listing ? ` for ${listing.title.en} in ${listing.location.en}` : ''}. Name: ${name || '[your name]'}. Phone: ${phone || '[your number]'}. Preferred date: ${date || '[date]'}. Preferred time: ${time}. Pickup or meeting details: ${pickup || '[details to discuss]'}.${optInLine} I understand this message is a request and is not a confirmed appointment.`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await submitLead({
      name,
      phone,
      email: email || null,
      source: 'book_visit',
      listingSlug: listing?.slug ?? null,
      listingTitle: listing?.title.en ?? null,
      message: `Preferred date: ${date || 'not specified'}. Preferred time: ${time}. Pickup/meeting: ${pickup || 'not specified'}.`,
      marketingOptIn,
    });
    setSaving(false);
    setPrepared(true);
  };

  const handleAddToCalendar = () => {
    const slot = TIME_SLOTS.find((s) => s.label === time) ?? TIME_SLOTS[0];
    const base = date ? new Date(`${date}T00:00:00`) : new Date();
    const start = new Date(base);
    start.setHours(slot.startHour, 0, 0, 0);
    const end = new Date(base);
    end.setHours(slot.endHour, 0, 0, 0);

    downloadIcsEvent({
      title: `SVV Estates site visit${listing ? ` — ${listing.title.en}` : ''}`,
      description: `Requested via svvestates.in. ${listing ? `Property: ${listing.title.en} (${listing.location.en}). ` : ''}This is a request only — not a confirmed appointment until SVV Estates replies on WhatsApp.`,
      start,
      end,
    });
  };

  return (
    <div className="space-y-12 pb-20">
      <section className="relative overflow-hidden bg-ink py-12 text-white dark:bg-ink-muted">
        <div className="absolute inset-0 grid-backdrop" />
        <div className="relative mx-auto max-w-7xl space-y-2 px-4 text-center">
          <h1 className="text-3xl font-extrabold">
            <span className="gradient-accent-text">{tamil ? 'தள பார்வை கோரிக்கை' : 'Request a site visit'}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-400">
            {tamil
              ? 'விவரங்களைத் தேர்ந்தெடுத்து வாட்ஸ்அப்பில் செய்தியை நீங்களே அனுப்புங்கள்.'
              : 'Choose your preferred details, then send the prepared WhatsApp message yourself.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-surface-dark md:p-10">
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-gray-700 dark:text-gray-200">
            <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p>
              {tamil
                ? 'இந்த தளம் கோரிக்கையை சேமிக்காது அல்லது உறுதி செய்யாது. வாட்ஸ்அப்பில் Send அழுத்திய பிறகு SVV Estates நேரடியாக பதிலளிக்கும்.'
                : 'This website does not confirm the request itself. After you press Send in WhatsApp, SVV Estates can reply directly to confirm availability and timing.'}
            </p>
          </div>

          {prepared ? (
            <div className="space-y-6 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your message is ready</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                WhatsApp will open with your request. Send it to start the conversation.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href={getWhatsAppUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-bold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open WhatsApp and send
                </a>
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Add to calendar
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPrepared(false)}
                className="mx-auto block text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                Edit request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className={labelClass}>
                Property (optional)
                <select
                  id="visit-listing"
                  name="listing"
                  value={listingSlug}
                  onChange={(event) => setListingSlug(event.target.value)}
                  className={inputClass}
                >
                  <option value="">I am enquiring generally</option>
                  {listings.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.title.en} — {item.location.en}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Your name
                <input
                  id="visit-name"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Mobile number
                  <input
                    id="visit-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 9XXXXXXXXX"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Email (optional)
                  <input
                    id="visit-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Preferred date
                  <input
                    id="visit-date"
                    name="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  <Clock className="mr-1 inline h-4 w-4" />
                  Preferred time
                  <select
                    id="visit-time"
                    name="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value as typeof time)}
                    className={inputClass}
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.label}>{slot.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={labelClass}>
                <MapPin className="mr-1 inline h-4 w-4" />
                Pickup or meeting details (optional)
                <textarea
                  id="visit-pickup"
                  name="pickup"
                  rows={3}
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  placeholder="Share a general meeting or pickup area; avoid sending sensitive documents."
                  className={inputClass}
                />
              </label>

              <label className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="marketing_opt_in"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  {tamil
                    ? 'ஆம், இதே போன்ற புதிய சொத்துகள் கிடைக்கும்போது எனக்கு வாட்ஸ்அப்/மின்னஞ்சல் மூலம் தெரிவிக்கவும்.'
                    : 'Yes, notify me by WhatsApp/email when similar new properties become available.'}
                </span>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-ink px-4 py-3.5 text-sm font-bold text-white transition disabled:opacity-60 dark:bg-accent-2 dark:text-ink"
              >
                {saving ? 'Saving…' : 'Prepare WhatsApp request'}
              </button>
            </form>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 text-center text-sm dark:border-gray-800 sm:flex-row sm:justify-center">
            <a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 font-bold text-gray-700 dark:text-gray-200">
              <Phone className="h-4 w-4 text-accent" />
              Call {businessContact.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BookVisitPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <VisitRequestForm />
    </Suspense>
  );
}
