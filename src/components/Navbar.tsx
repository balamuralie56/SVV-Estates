'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from './ClientProvider';
import { translations } from '@/lib/i18n';
import { Sun, Moon, Menu, X, Phone, Globe } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const t = translations[language];

  // Don't show public navbar in the admin panel
  const isAdmin = pathname?.startsWith('/admin');

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.about, href: '/about' },
    { name: t.projects, href: '/projects' },
    { name: t.bookVisit, href: '/book-visit' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ta' : 'en');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/80 dark:bg-[#242424]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
              alt="SVV Estates"
              width={160}
              height={50}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-gold-light dark:text-gold-dark border-b-2 border-gold-light dark:border-gold-dark pb-1'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gold-light dark:hover:text-gold-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Language, Theme, CTA) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              title={language === 'en' ? 'தமிழ் இணையதளத்திற்கு மாற்றவும்' : 'Switch to English Website'}
            >
              <Globe className="h-4 w-4" />
              <span>{t.languageName}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Quick Contact CTA */}
            <a
              href="tel:+919994115154"
              className="flex items-center space-x-2 bg-charcoal hover:bg-charcoal/95 dark:bg-gold-dark dark:hover:bg-gold-dark/90 text-white dark:text-charcoal px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            >
              <Phone className="h-4 w-4" />
              <span>+91 99941 15154</span>
            </a>
          </div>

          {/* Mobile Menu & Action Buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold"
            >
              {language === 'en' ? 'TA' : 'EN'}
            </button>

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#242424] px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                isActive(link.href)
                  ? 'bg-gold-light/10 text-gold-light dark:text-gold-dark font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-3">
            <a
              href="tel:+919994115154"
              className="flex items-center justify-center space-x-2 bg-charcoal dark:bg-gold-dark text-white dark:text-charcoal py-3 rounded-lg text-base font-semibold shadow-sm"
            >
              <Phone className="h-5 w-5" />
              <span>+91 99941 15154</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
