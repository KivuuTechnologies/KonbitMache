'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import type { TopSeller } from '@/features/marketplace/services';
import { SellerAvatar } from './components/SellerAvatar';
import { MapPin } from 'lucide-react';

interface SellersPageProps {
  sellers: TopSeller[] | undefined;
}

export function SellersPage({ sellers }: SellersPageProps) {
  const t = useTranslations();

  const sellerList = sellers ?? [];

  const displayName = (s: TopSeller) => s.business_name ?? s.full_name ?? '—';

  const displayPlace = (s: TopSeller) =>
    [s.commune, s.department].filter(Boolean).join(' · ') || '—';

  const sellerTypeLabel = (type: TopSeller['seller_type']) => {
    switch (type) {
      case 'farmer':
        return t.filters.farmer;
      case 'cooperative':
        return t.filters.cooperative;
      case 'company':
        return t.filters.company;
      default:
        return type;
    }
  };

  return (
    <main className="min-h-screen bg-surface text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">KonbitMache</p>
          <h1 className="mt-2 text-[clamp(1.875rem,6vw,2.5rem)] font-extrabold tracking-tight">
            {t.sections.featuredSellers}
          </h1>
          <p className="mt-3 text-base text-muted">
            {sellerList.length === 0
              ? 'No hay vendedores registrados por ahora.'
              : `${sellerList.length} vendedor${sellerList.length !== 1 ? 'es' : ''} registrados`}
          </p>
        </div>

        {sellerList.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-surface-muted px-6 py-14 text-center">
            <MapPin className="h-12 w-12 text-muted/40" aria-hidden="true" />
            <p className="text-lg font-extrabold">{t.sections.featuredSellers}</p>
            <p className="max-w-sm text-sm text-muted">
              No hay vendedores registrados en este momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellerList.map((seller) => (
              <article
                key={seller.id}
                className="flex min-w-0 items-start gap-4 rounded-2xl bg-surface-muted p-4 sm:p-5 transition hover:shadow-md"
              >
                <SellerAvatar
                  avatarUrl={seller.avatar_url}
                  name={displayName(seller)}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="break-words text-base font-extrabold">{displayName(seller)}</h3>
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                      {sellerTypeLabel(seller.seller_type)}
                    </span>
                  </div>
                  <p className="mt-1 flex min-w-0 items-start gap-1 text-sm text-muted">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="break-words">{displayPlace(seller)}</span>
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {seller.active_product_count} {seller.active_product_count === 1 ? t.product.product : t.product.products}
                    {' '}
                    <span className="font-normal text-muted">activo{seller.active_product_count !== 1 ? 's' : ''}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}