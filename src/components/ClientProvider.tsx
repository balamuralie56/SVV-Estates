'use client';

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { Language } from '@/lib/i18n';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'ta') return savedLanguage;
    return navigator.language.toLowerCase().includes('ta') ? 'ta' : 'en';
  });
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    // Load preferences from localStorage on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Avoid hydration flicker by rendering children only after mounting on the client
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }} className="min-h-screen bg-paper dark:bg-ink">
        {children}
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark bg-ink text-gray-100 min-h-screen transition-colors duration-300' : 'bg-paper text-gray-900 min-h-screen transition-colors duration-300'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    // Return a safe fallback context for SSR / Prerendering to avoid build crashes
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      theme: 'light',
      toggleTheme: () => {}
    };
  }
  return context;
}
