'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from './ClientProvider';
import { translations } from '@/lib/i18n';
import { businessContact, getWhatsAppUrl } from '@/lib/public-content';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { language, theme } = useApp();
  const pathname = usePathname();

  const t = translations[language];

  // Don't show public footer in the admin panel
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <footer className="relative bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <Image
              src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
              alt="SVV Estates"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed">
              {language === 'en'
                ? 'SVV Estates is a property consulting brand built around careful communication, practical guidance, and reviewed public property information.'
                : 'SVV எஸ்டேட்ஸ் என்பது தெளிவான தகவல், நடைமுறை வழிகாட்டுதல் மற்றும் சரிபார்க்கப்பட்ட பொது சொத்து விவரங்களை அடிப்படையாகக் கொண்ட சொத்து ஆலோசனை நிறுவனம்.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.projects}
                </Link>
              </li>
              <li>
                <Link href="/book-visit" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.bookVisit}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Types */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {language === 'en' ? 'Our Properties' : 'எங்கள் சொத்துக்கள்'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/projects?type=plot" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.plots}
                </Link>
              </li>
              <li>
                <Link href="/projects?type=villa" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.villas}
                </Link>
              </li>
              <li>
                <Link href="/projects?type=farmland" className="text-sm hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {t.farmlands}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t.contact}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-light dark:text-gold-dark shrink-0 mt-0.5" />
                <span>
                  {language === 'en'
                    ? businessContact.address
                    : 'எண்.87, போந்திலியார் தெரு, பி.வி.களத்தூர், செங்கல்பட்டு - 603405'}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold-light dark:text-gold-dark shrink-0" />
                <a href={businessContact.phoneHref} className="hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {businessContact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold-light dark:text-gold-dark shrink-0" />
                <a href={`mailto:${businessContact.email}`} className="hover:text-gold-light dark:hover:text-gold-dark transition-colors">
                  {businessContact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
            {t.copyRight}
          </p>
          <div className="flex space-x-6 text-gray-500 dark:text-gray-500">
            <Link href="/privacy" className="hover:text-gold-light dark:hover:text-gold-dark">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-light dark:hover:text-gold-dark">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={getWhatsAppUrl('Hello SVV Estates, I would like to enquire about currently available properties. I understand that sending this message starts a conversation and does not confirm an appointment.')}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 fill-white text-green-500 group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-sm font-semibold transition-all duration-300 ease-out whitespace-nowrap">
          {t.whatsappChat}
        </span>
      </a>
    </footer>
  );
}
