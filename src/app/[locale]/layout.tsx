import { LocaleProviders } from './LocaleProviders';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { translations } from '@/shared/i18n/translations';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = translations[locale];
  return {
    description: t.site?.description ?? 'KonbitMache',
    alternates: { canonical: `/${locale}` },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = translations[locale];
  return <LocaleProviders locale={locale} t={t}>{children}</LocaleProviders>;
}
