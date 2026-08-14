import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { translations } from '@/shared/i18n/translations';
import { MarketplaceHeader } from '@/features/marketplace/components/MarketplaceHeader';
import { SiteFooter } from '@/features/site/components/SiteFooter';
import { SitePage } from '@/features/site/components/SitePage';
import { sitePages } from '@/features/site/content';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = sitePages.privacy[locale];
  return { title: content.title, description: content.subtitle };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translations[locale];
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <MarketplaceHeader copy={t} locale={locale} />
      <SitePage content={sitePages.privacy[locale]} />
      <SiteFooter copy={t} locale={locale} />
    </div>
  );
}
