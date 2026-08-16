'use client';

import { useCallback, useState } from 'react';
import { MarketplaceSearch, type SearchFilters } from './MarketplaceSearch';
import { ProductGrid } from './ProductGrid';
import type { PublicProduct } from '@/features/marketplace/services';

const INITIAL_FILTERS: SearchFilters = { query: '', department: null };

interface MarketplaceCatalogProps {
  locale: string;
  products: PublicProduct[];
  activeCategory: string | null;
}

export function MarketplaceCatalog({ locale, products, activeCategory }: MarketplaceCatalogProps) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const handleSearch = useCallback((nextFilters: SearchFilters) => setFilters(nextFilters), []);

  return (
    <>
      <MarketplaceSearch locale={locale} products={products} onSearch={handleSearch} activeFilters={filters} embedded showHero={false} />
      <section id="productos" aria-label="Productos">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <ProductGrid products={products} activeCategory={activeCategory} filters={filters} locale={locale} />
        </div>
      </section>
    </>
  );
}
