import React from 'react';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';
import { MarketplaceHeader } from '@/features/marketplace/components/MarketplaceHeader';
import { SiteFooter } from '@/features/site/components/SiteFooter';
import { SitePage } from './SitePage';
import type { SitePageContent } from '../content';

interface SitePageLayoutProps {
  locale: Locale;
  content?: SitePageContent;
  children?: React.ReactNode;
}

// Reusable standard shell for public informational pages (DRY and Single Responsibility)
export function SitePageLayout({ locale, content, children }: SitePageLayoutProps) {
  const t = translations[locale];

  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <MarketplaceHeader copy={t} locale={locale} />
      {content ? <SitePage content={content} /> : children}
      <SiteFooter copy={t} locale={locale} />
    </div>
  );
}
