import { Suspense } from 'react';
import { MarketplaceHome } from '@/features/marketplace/MarketplaceHome';
import { getPublicProducts, getTopSellers } from '@/features/marketplace/services';
import { logError } from '@/utils/logger/server';
import { isLocale } from '@/i18n/config';
import { translations } from '@/shared/i18n/translations';
import { siteConfig, canonicalUrl, buildAlternates } from '@/shared/config/site';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { JsonLd, getWebSiteJsonLd } from '@/shared/seo/JsonLd';

export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}

// Per-locale home page titles with target keywords
const HOME_TITLES: Record<Locale, string> = {
  ht: 'Mache agrikòl Ayiti | Achte ak vann pwodui lokal',
  fr: 'Marché agricole Haïti | Achetez des produits locaux directement',
  es: 'Mercado agrícola de Haití | Compra y vende productos locales',
  en: 'Haiti Agricultural Marketplace | Buy & Sell Local Farm Products',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = translations[locale];
  const description = t.site?.description ?? siteConfig.description;
  const title = HOME_TITLES[locale];
  const url = canonicalUrl(locale);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...buildAlternates(),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `KonbitMache — ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  let products: Awaited<ReturnType<typeof getPublicProducts>> = [];
  let topSellers: Awaited<ReturnType<typeof getTopSellers>> = [];

  try {
    [products, topSellers] = await Promise.all([
      getPublicProducts(),
      getTopSellers(3),
    ]);
  } catch (err) {
    logError('[HomePage] Data fetch failed:', err);
  }

  const websiteSchema = getWebSiteJsonLd(
    canonicalUrl(locale),
    `${canonicalUrl(locale)}?category={search_term_string}`
  );

  return (
    <>
      <JsonLd id="website-schema" data={websiteSchema} />
      <Suspense>
        <MarketplaceHome
          locale={locale}
          products={products}
          activeCategory={category ?? null}
          topSellers={topSellers}
        />
      </Suspense>
    </>
  );
}
