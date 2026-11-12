'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Plus } from 'lucide-react';
import { useApp } from './ClientProvider';
import { businessContact, genericEnquiryMessage, getWhatsAppUrl } from '@/lib/public-content';

/**
 * Persistent "Contact Us" entry point shown on every public page (not just
 * listing detail pages) -- a visitor should always be one tap away from
 * calling or WhatsApping, even with zero listings published.
 */
export default function ContactFab() {
  const pathname = usePathname();
  const { language } = useApp();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tamil = language === 'ta';

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (isAdmin) return null;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <a
          href={getWhatsAppUrl(genericEnquiryMessage[language])}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-full bg-green-600 py-3 pl-4 pr-5 text-sm font-bold text-white shadow-xl transition hover:bg-green-700"
        >
          <MessageCircle className="h-5 w-5" />
          {tamil ? 'வாட்ஸ்அப்' : 'WhatsApp'}
        </a>
        <a
          href={businessContact.phoneHref}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-3 pl-4 pr-5 text-sm font-bold text-gray-900 shadow-xl transition hover:bg-gray-50"
        >
          <Phone className="h-5 w-5" />
          {tamil ? 'அழைக்க' : 'Call us'}
        </a>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={tamil ? 'தொடர்பு கொள்ள' : 'Contact us'}
        aria-expanded={open}
        className="glow-accent flex h-16 w-16 items-center justify-center rounded-full gradient-accent-bg text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className={`h-7 w-7 transition-transform duration-200 ${open ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
}
