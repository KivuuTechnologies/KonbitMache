'use client';

import { Globe2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SUPPORTED_LOCALES, type Locale } from '@/shared/i18n/types';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { useTranslations } from '@/shared/i18n/useTranslations';

const localeLabels: Record<Locale, string> = { ht: 'Kreyòl', fr: 'Français', es: 'Español', en: 'English' };

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const segments = pathname.split('/');
    if (SUPPORTED_LOCALES.includes(segments[1] as Locale)) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }

    const nextPathname = segments.join('/') || `/${nextLocale}`;
    const nextSearch = searchParams.toString();

    setLocale(nextLocale);
    router.push(nextSearch ? `${nextPathname}?${nextSearch}` : nextPathname);
  };

  return (
    <div className="flex min-h-12 items-center gap-1.5">
      <Globe2 className="h-5 w-5 shrink-0 text-te" aria-hidden="true" />
      <label htmlFor="language" className="text-sm font-semibold text-foreground">{t.common.language}</label>
      <select id="language" value={locale} onChange={handleChange} className="min-h-12 min-w-0 max-w-32 cursor-pointer rounded-lg bg-transparent px-1 text-base font-medium text-foreground outline-none focus:ring-2 focus:ring-te focus:ring-offset-2 focus:ring-offset-papye dark:focus:ring-offset-[#171413]">
        {SUPPORTED_LOCALES.map((supportedLocale) => <option key={supportedLocale} value={supportedLocale}>{localeLabels[supportedLocale]}</option>)}
      </select>
    </div>
  );
}
