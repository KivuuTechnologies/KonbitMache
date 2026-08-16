import { LocaleProviders } from './LocaleProviders';
import { isLocale, locales } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { translations } from '@/shared/i18n/translations';
import { siteConfig, buildAlternates } from '@/shared/config/site';
import type { Metadata } from 'next';

// Locale-to-OG locale mapping for Facebook / social crawlers
const OG_LOCALE: Record<string, string> = {
  ht: 'ht_HT',
  fr: 'fr_HT',
  es: 'es_419',
  en: 'en_US',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = translations[locale];
  const description = t.site?.description ?? siteConfig.description;
  const base = siteConfig.url.toString().replace(/\/$/, '');
  const pageUrl = `${base}/${locale}`;

  return {
    description,
    alternates: {
      canonical: pageUrl,
      ...buildAlternates(),
    },
    openGraph: {
      locale: OG_LOCALE[locale] ?? 'ht_HT',
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l] ?? l),
      url: pageUrl,
      description,
    },
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
  return (
    // Set the correct html lang per locale so search engines and screen readers
    // know the page language without waiting for JavaScript
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <LocaleProviders locale={locale} t={t}>
          {children}
        </LocaleProviders>
      </body>
    </html>
  );
}
