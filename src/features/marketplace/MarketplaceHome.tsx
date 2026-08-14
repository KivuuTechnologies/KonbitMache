'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, MapPin, Sprout } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { MarketplaceSearch, type SearchFilters } from './components/MarketplaceSearch';
import { ProductGrid } from './components/ProductGrid';
import { MarketplaceStats } from './components/MarketplaceStats';
import { HaitiMap } from './components/HaitiMap';
import { SiteFooter } from '@/features/site/components/SiteFooter';
import { useTranslations } from '@/shared/i18n/useTranslations';
import type { TopSeller, PublicProduct } from '@/features/marketplace/services';

interface MarketplaceHomeProps {
  locale: string;
  products: PublicProduct[];
  activeCategory: string | null;
  topSellers: TopSeller[];
}

const INITIAL_FILTERS: SearchFilters = { query: '', department: null };

export function MarketplaceHome({
  locale,
  products,
  activeCategory: initialCategory,
  topSellers,
}: MarketplaceHomeProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? initialCategory;

  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);

  const handleSearch = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <MarketplaceHeader copy={t} locale={locale} />
      <MarketplaceSearch
        locale={locale}
        products={products}
        onSearch={handleSearch}
        activeFilters={filters}
      />

      <section id="productos" aria-label={t.hero.category}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            filters={filters}
            locale={locale}
          />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-9 sm:px-6 sm:pb-14">
        <FeaturedSellersSection copy={t} sellers={topSellers} locale={locale} />
        <div className="mt-14 sm:mt-16">
          <HaitiMap copy={t} products={products} />
        </div>
        <MarketplaceStats title={t.sections.stats} />
        <CtaSection copy={t} locale={locale} />
      </main>

      <SiteFooter copy={t} locale={locale} />
    </div>
  );
}

function FeaturedSellersSection({
  copy,
  sellers,
  locale,
}: {
  copy: ReturnType<typeof useTranslations>;
  sellers: TopSeller[];
  locale: string;
}) {
  const initials = (s: TopSeller) => {
    const src = s.business_name ?? s.full_name ?? '?';
    return src
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  };

  const displayName = (s: TopSeller) => s.business_name ?? s.full_name ?? '—';

  const displayPlace = (s: TopSeller) =>
    [s.commune, s.department].filter(Boolean).join(' · ') || '—';

  const sellerTypeLabel = (type: TopSeller['seller_type']) => {
    switch (type) {
      case 'farmer':
        return copy.filters.farmer;
      case 'cooperative':
        return copy.filters.cooperative;
      case 'company':
        return copy.filters.company || copy.filters.buyer;
      default:
        return type;
    }
  };

  return (
    <section id="vendedores-destacados" className="mt-14 sm:mt-16">
      <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-muted">KonbitMache</p>
          <h2 className="mt-1 text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold tracking-tight">
            {copy.sections.featuredSellers}
          </h2>
        </div>
        <a
          href={`/${locale}/vendedores`}
          className="flex min-h-12 items-center gap-1 text-base font-bold text-muted hover:text-foreground"
        >
          {copy.product.viewAll}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>

      {sellers.length === 0 ? (
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {sellers.map((seller) => (
            <article
              key={seller.id}
              className="flex min-w-0 items-center gap-4 rounded-2xl bg-surface-muted p-4 sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted/10 font-extrabold text-muted select-none">
                {initials(seller)}
              </div>
              <div className="min-w-0">
                <h3 className="break-words text-base font-extrabold">{displayName(seller)}</h3>
                <p className="mt-1 text-xs text-muted">{sellerTypeLabel(seller.seller_type)}</p>
                <p className="mt-1 flex min-w-0 items-start gap-1 text-sm text-muted">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="break-words">{displayPlace(seller)}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {seller.active_product_count}{' '}
                  {seller.active_product_count === 1
                    ? copy.product.product
                    : copy.product.products}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CtaSection({ copy, locale }: { copy: ReturnType<typeof useTranslations>; locale: string }) {
  return (
    <section className="mt-14 overflow-hidden rounded-3xl bg-[#0f1a0d] px-6 py-8 text-white sm:mt-16 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Sprout className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-[clamp(1.75rem,7vw,2.25rem)] font-extrabold tracking-tight">
            {copy.sections.ctaTitle}
          </h2>
          <p className="mt-3 text-base leading-7 text-white/75">{copy.sections.ctaDescription}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/registro`}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong"
          >
            <Leaf className="h-5 w-5" aria-hidden="true" />
            {copy.nav.publish}
          </Link>
        </div>
      </div>
    </section>
  );
}
