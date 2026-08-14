'use client';

import { LanguageProvider } from '@/shared/i18n/LanguageProvider';
import type { Locale } from '@/shared/i18n/types';
import { PwaRegistration } from '@/shared/pwa/PwaRegistration';
import { SkipLink } from '@/shared/ui/SkipLink';
import { Toaster } from 'sonner';

export function AppProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  return <LanguageProvider key={initialLocale} initialLocale={initialLocale}><SkipLink /><PwaRegistration />{children}<Toaster position="top-center" richColors closeButton /></LanguageProvider>;
}
