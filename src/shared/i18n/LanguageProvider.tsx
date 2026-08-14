'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { savePreferredLocaleAction } from '@/features/auth/actions/auth';
import { LOCALE_COOKIE } from './locale';
import { type Locale } from './types';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const storageKey = 'konbit-language';

function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, locale);
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    persistLocale(locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        void savePreferredLocaleAction(nextLocale);
      },
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
