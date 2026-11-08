'use client';

import { LayoutGrid, MessageCircle, Sparkles, Sprout, Waves } from 'lucide-react';
import { indicativeCategories } from '@/data/indicative-categories';
import { getWhatsAppUrl } from '@/lib/public-content';
import TiltCard from './TiltCard';
import type { Language } from '@/lib/i18n';

const ICONS = { plots: LayoutGrid, agriculture: Sprout, ecr: Waves } as const;

const ARTWORK: Record<keyof typeof ICONS, string> = {
  plots: 'from-accent/40 via-accent/10 to-transparent',
  agriculture: 'from-emerald-500/40 via-emerald-500/10 to-transparent',
  ecr: 'from-accent-2/40 via-accent-2/10 to-transparent',
};

export default function IndicativeCategories({ language }: { language: Language }) {
  const tamil = language === 'ta';

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {tamil ? 'நாங்கள் பொதுவாக கையாளும் வகைகள்' : 'What we generally deal in'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {tamil
            ? 'இவை குறிப்பிட்ட பட்டியல்கள் அல்ல — பொதுவான வகைகள் மற்றும் குறிப்பிட்ட விலை வரம்பு மட்டுமே. உறுதியான மனை, அளவு மற்றும் இறுதி விலையை வாட்ஸ்அப்பில் நேரடியாக பகிர்வோம்.'
            : "These are categories, not specific listings — a general area and price band only. Exact plots, sizes, and final pricing are shared directly over WhatsApp."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {indicativeCategories.map((category) => {
          const Icon = ICONS[category.icon];
          return (
            <TiltCard key={category.id} className="group rounded-2xl">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-md transition-shadow duration-200 group-hover:shadow-2xl dark:border-gray-800 dark:bg-surface-dark">
                <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${ARTWORK[category.icon]} dark:bg-ink-muted`}>
                  <Icon className="h-14 w-14 text-gray-700/70 dark:text-white/80" strokeWidth={1.25} />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    {tamil ? 'விளக்கப்படம் — உண்மையான புகைப்படம் அல்ல' : 'Illustrative — not an actual photo'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="inline-flex w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    {category.priceBand[language]}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.title[language]}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {category.description[language]}
                  </p>
                  <a
                    href={getWhatsAppUrl(category.whatsappMessage[language])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {tamil ? 'வாட்ஸ்அப்பில் விசாரிக்க' : 'Enquire on WhatsApp'}
                  </a>
                </div>
              </article>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
}
