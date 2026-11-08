import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';

type PageProps = { params: Promise<{ campaign: string }> };

const staticCampaigns = ['property-enquiry'];

export const dynamicParams = false;

export function generateStaticParams() {
  return staticCampaigns.map((campaign) => ({ campaign }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { campaign } = await params;
  return { title: `Property enquiry — ${campaign}`, robots: { index: false, follow: false } };
}

export default async function CampaignLandingPage({ params }: PageProps) {
  const { campaign } = await params;
  const message = `Hello SVV Estates, I came from the ${campaign} campaign and would like to enquire about currently available properties. Please share confirmed details. I understand that sending this message starts a conversation and does not confirm an appointment.`;

  return <div className="min-h-[70vh] bg-gray-50 px-4 py-16 dark:bg-ink"><div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-800 dark:bg-surface-dark md:p-12"><p className="text-xs font-bold uppercase tracking-wider text-accent">SVV Estates</p><h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">Talk to us about currently available property</h1><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-500 dark:text-gray-400">This campaign page does not publish unverified prices, approvals, amenities, photographs, or availability. Contact the property team and ask for the information relevant to your requirement.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold text-white"><MessageCircle className="h-5 w-5" />Start WhatsApp enquiry</a><a href={businessContact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 font-bold text-white dark:bg-accent-2 dark:text-ink"><Phone className="h-5 w-5" />Call {businessContact.phoneDisplay}</a></div><Link href="/projects" className="mt-8 inline-block text-sm font-semibold text-accent hover:underline">View confirmed public listings</Link></div></div>;
}
