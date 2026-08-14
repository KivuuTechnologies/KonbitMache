'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';

export function SkipLink() {
  const t = useTranslations();
  return <a href="#main-content" className="sr-only z-50 rounded-md bg-te px-4 py-3 text-base font-bold text-white dark:text-background focus:not-sr-only focus:absolute focus:left-4 focus:top-4">{t.common.skipToContent}</a>;
}
