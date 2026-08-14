import { Suspense } from 'react';
import { MarketplaceHome } from '@/features/marketplace/MarketplaceHome';
import {
  getPublicProducts,
  getTopSellers,
} from '@/features/marketplace/services';
import type { Locale } from '@/i18n/config';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
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
    console.error('[HomePage] Data fetch failed:', err);
    // Continue with empty defaults — page renders without data instead of 404
  }

  return (
    <Suspense>
      <MarketplaceHome
        locale={locale}
        products={products}
        activeCategory={category ?? null}
        topSellers={topSellers}
      />
    </Suspense>
  );
}
