import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { SitePageLayout } from '@/features/site/components/SitePageLayout';
import { sitePages } from '@/features/site/content';
import { buildPageMetadata } from '@/shared/config/site';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = sitePages.help[locale];
  return buildPageMetadata({
    title: content.title,
    description: content.subtitle,
    locale,
    path: '/ayuda',
  });
}

export default async function HelpPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SitePageLayout locale={locale} content={sitePages.help[locale]} />;
}
