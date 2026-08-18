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
import { SellerAvatar } from './components/SellerAvatar';
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
          <HaitiMap copy={t} products={products} locale={locale} />
        </div>
        <MarketplaceStats copy={t} title={t.sections.stats} />
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
  const displayName = (s: TopSeller) => s.business_name ?? s.full_name ?? '—';

  const displayPlace = (s: TopSeller) =>
    [s.commune, s.department].filter(Boolean).join(' · ') || '—';

  const sellerTypeLabel = (_type: TopSeller['seller_type']) => {
    return copy.filters.farmer;
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
        <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface-muted p-6 text-center text-sm text-muted">
          <p>{copy.sections.farmers}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
            <article
              key={seller.id}
              className="flex min-w-0 items-center gap-4 rounded-2xl border border-border/40 bg-surface-muted p-4 sm:p-5 transition hover:border-border"
            >
              <SellerAvatar
                avatarUrl={seller.avatar_url}
                name={displayName(seller)}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold">{displayName(seller)}</h3>
                <p className="mt-0.5 text-xs font-semibold text-muted">{sellerTypeLabel(seller.seller_type)}</p>
                <p className="mt-1 flex min-w-0 items-start gap-1 text-sm text-muted">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{displayPlace(seller)}</span>
                </p>
                <p className="mt-1 text-xs font-bold text-foreground">
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
    <section className="mt-14 overflow-hidden rounded-2xl bg-[#0f1a0d] px-6 py-10 text-white sm:mt-16 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-row items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Sprout className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
              {copy.sections.ctaTitle}
            </h2>
            <p className="mt-0.5 text-sm text-white/65 leading-snug">{copy.sections.ctaDescription}</p>
          </div>
        </div>
        <Link
          href={`/${locale}/registro`}
          className="flex w-full shrink-0 min-h-10 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-extrabold text-white dark:text-background transition hover:bg-accent-strong sm:w-auto"
        >
          <Leaf className="h-4 w-4" aria-hidden="true" />
          {copy.nav.publish}
        </Link>
      </div>
    </section>
  );
}
