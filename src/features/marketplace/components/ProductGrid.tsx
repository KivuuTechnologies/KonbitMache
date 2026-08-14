'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import { ProductCard } from './ProductCard';
import type { PublicProduct } from '@/features/marketplace/services';
import type { CategoryKey } from '@/shared/i18n/types';
import type { SearchFilters } from './MarketplaceSearch';

interface ProductGridProps {
  products: PublicProduct[];
  activeCategory?: string | null;
  filters: SearchFilters;
  locale: string;
  loading?: boolean;
  error?: string | null;
}

export function ProductGrid({
  products,
  activeCategory,
  filters,
  locale,
  loading = false,
  error = null,
}: ProductGridProps) {
  const t = useTranslations();

  // Filter client-side by activeCategory slug + search query + department
  const filtered = products.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (filters.department && p.seller_location?.department !== filters.department) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const name = p.name?.toLowerCase() ?? '';
      const desc = p.description?.toLowerCase() ?? '';
      if (!name.includes(q) && !desc.includes(q)) return false;
    }
    return true;
  });

  if (error) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-surface-muted px-6 py-10 text-center">
        <p className="text-base font-semibold text-muted">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-surface">
            <div className="aspect-[16/10] bg-surface-muted" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-16 rounded bg-surface-muted" />
              <div className="h-5 w-3/4 rounded bg-surface-muted" />
              <div className="h-3 w-full rounded bg-surface-muted" />
              <div className="h-6 w-1/2 rounded bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    const categoryLabel = activeCategory
      ? t.categories[activeCategory as CategoryKey] ?? activeCategory
      : null;

    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-surface-muted px-6 py-10 text-center">
        <svg className="h-12 w-12 text-muted/40" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <p className="text-lg font-extrabold">
          {filters.query
            ? `"${filters.query}"`
            : categoryLabel ?? t.hero.allCategories}
        </p>
        <p className="max-w-sm text-sm text-muted">
          {t.seller.products.noProducts}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-muted">
        {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}
