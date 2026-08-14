import Link from 'next/link';
import { PackagePlus } from 'lucide-react';
import { dashboardService } from '../../services';
import { ProductCard } from '../ProductCard';
import { EmptyState } from '../ui/EmptyState';
import { DashboardError } from './skeletons';
import type { Product } from '../../types';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface ActiveProductsProps {
  userId: string;
  locale: string;
  t: MarketplaceCopy;
}

/** Grid of the seller's real active products (server component) */
export async function ActiveProducts({ userId, locale, t }: ActiveProductsProps) {
  let products: Product[];
  try {
    products = await dashboardService.getActiveProducts(userId);
  } catch {
    return <DashboardError message={t.seller.dashboard.loadError} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackagePlus}
        title={t.seller.dashboard.noActiveProducts}
        action={
          <Link
            href={`/${locale}/dashboard/products/new`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-extrabold text-white transition hover:bg-accent-strong dark:text-background"
          >
            {t.seller.dashboard.publishProduct}
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
