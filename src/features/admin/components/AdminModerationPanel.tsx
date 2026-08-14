'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, MapPin, MessageCircle, Package, Phone, Search } from 'lucide-react';
import { toast } from 'sonner';
import { moderateProductAction, type ModerateProductResult } from '@/features/admin/actions/moderation';
import type { AdminCopy } from '@/features/admin/i18n/copy';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { LanguageSelector } from '@/shared/ui/LanguageSelector';
import type { PublicProduct } from '@/features/marketplace/services';
import { useTranslations } from '@/shared/i18n/useTranslations';
import type { CategoryKey } from '@/shared/i18n/types';
import type { Locale } from '@/i18n/config';

interface AdminModerationPanelProps {
  products: PublicProduct[];
  locale: Locale;
  copy: AdminCopy;
}

function withdrawMessage(result: ModerateProductResult, copy: AdminCopy): string {
  if (!result.ok && result.message === 'not_allowed') return copy.withdraw.notAllowed;
  if (!result.ok && result.message === 'reason_required') return copy.withdraw.reasonRequired;
  return copy.withdraw.error;
}

export function AdminModerationPanel({ products, locale, copy }: AdminModerationPanelProps) {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [withdrawnIds, setWithdrawnIds] = useState<Set<string>>(new Set());
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  function productImages(product: PublicProduct): string[] {
    const urls: string[] = [];
    for (const url of product.image_urls ?? []) {
      if (url && !urls.includes(url)) urls.push(url);
    }
    if (product.image_url && !urls.includes(product.image_url)) urls.push(product.image_url);
    return urls;
  }

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(
      (p) => !withdrawnIds.has(p.id) && (!query || p.name.toLowerCase().includes(query))
    );
  }, [products, search, withdrawnIds]);

  const selected = products.find((p) => p.id === selectedId) ?? null;
  const selectedImages = selected ? productImages(selected) : [];
  const safeImageIndex = Math.min(activeImageIndex, Math.max(selectedImages.length - 1, 0));
  const activeImage = selectedImages[safeImageIndex] ?? '';

  function categoryLabel(category: string): string {
    return t.categories[category as CategoryKey] ?? category;
  }

  function unitLabel(unit: string): string {
    return (t.units as Record<string, string>)[unit] ?? unit;
  }

  function formatDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(locale, { dateStyle: 'medium' });
  }

  function openWithdrawModal() {
    setReason('');
    setShowModal(true);
  }

  async function confirmWithdraw() {
    if (!selected) return;
    if (!reason.trim()) {
      toast.error(copy.withdraw.reasonRequired);
      return;
    }
    setSubmitting(true);
    const result = await moderateProductAction({
      productId: selected.id,
      reason,
      locale,
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(withdrawMessage(result, copy));
      return;
    }

    setWithdrawnIds((prev) => new Set(prev).add(selected.id));
    setShowModal(false);
    setSelectedId(null);
    toast.success(copy.withdraw.success);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{copy.page.title}</h1>
          <p className="mt-1 text-sm text-muted">{copy.page.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSelector />
          <SignOutButton />
        </div>
      </header>

      {visibleProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-surface-muted p-10 text-center">
          <p className="text-base font-semibold text-muted">{copy.page.empty}</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Product list */}
          <section className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 rounded-xl border bg-surface px-3">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={copy.page.search}
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>

            <ul className="space-y-2">
              {visibleProducts.map((product) => {
                const isActive = product.id === selectedId;
                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(product.id);
                        setActiveImageIndex(0);
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                        isActive
                          ? 'border-accent bg-surface-muted ring-1 ring-accent'
                          : 'border-transparent bg-surface hover:bg-surface-muted'
                      }`}
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                        {product.image_urls?.[0] ?? product.image_url ? (
                          <Image
                            src={product.image_urls?.[0] ?? product.image_url ?? ''}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted/40" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{product.name}</span>
                        <span className="block text-sm font-extrabold text-foreground">
                          {product.price.toLocaleString()} HTG
                          <span className="ml-1 text-xs font-semibold text-muted">
                            / {unitLabel(product.unit)}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Product detail */}
          <section className="lg:col-span-3">
            {!selected ? (
              <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed bg-surface-muted p-8 text-center">
                <p className="text-sm font-semibold text-muted">{copy.page.noSelection}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
                <div className="bg-surface-muted">
                <div className="relative flex h-56 w-full items-center justify-center">
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt={selected.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                      <Package className="h-16 w-16 text-muted/40" aria-hidden="true" />
                    )}
                  </div>
                  {selectedImages.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto p-3">
                      {selectedImages.map((url, index) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={copy.page.image + ' ' + (index + 1)}
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            index === safeImageIndex
                              ? 'border-accent'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={url} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold">{selected.name}</h2>
                      <p className="mt-1 text-xl font-extrabold tracking-tight text-foreground">
                        {selected.price.toLocaleString()} HTG
                        <span className="ml-1 text-sm font-semibold text-muted">
                          / {unitLabel(selected.unit)}
                        </span>
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-fey/10 px-3 py-1 text-xs font-bold text-fey">
                      {copy.product.published} {formatDate(selected.created_at)}
                    </span>
                  </div>

                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-surface-muted p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {copy.product.category}
                      </dt>
                      <dd className="mt-0.5 font-bold">{categoryLabel(selected.category)}</dd>
                    </div>
                    <div className="rounded-xl bg-surface-muted p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {copy.product.quantity}
                      </dt>
                      <dd className="mt-0.5 font-bold">
                        {selected.quantity} {unitLabel(selected.unit)}
                      </dd>
                    </div>
                    {selected.seller_location?.department || selected.seller_location?.commune ? (
                      <div className="rounded-xl bg-surface-muted p-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                          {copy.product.location}
                        </dt>
                        <dd className="mt-0.5 flex items-center gap-1.5 font-bold">
                          <MapPin className="h-4 w-4 text-muted" aria-hidden="true" />
                          {[selected.seller_location.department, selected.seller_location.commune]
                            .filter(Boolean)
                            .join(', ')}
                        </dd>
                      </div>
                    ) : null}
                    {selected.seller_whatsapp || selected.seller_phone ? (
                      <div className="rounded-xl bg-surface-muted p-3">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                          {copy.product.contact}
                        </dt>
                        <dd className="mt-0.5 flex items-center gap-2 font-bold">
                          {selected.seller_whatsapp ? (
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-fey" aria-hidden="true" />
                              {selected.seller_whatsapp}
                            </span>
                          ) : null}
                          {selected.seller_phone ? (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
                              {selected.seller_phone}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {selected.description ? (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {copy.product.description}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                        {selected.description}
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={openWithdrawModal}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/30"
                  >
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    {copy.withdraw.trigger}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Withdraw confirmation modal */}
      {showModal && selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={copy.withdraw.title}
        >
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
            <div className="flex items-center gap-3">
              {activeImage ? (
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  <Image src={activeImage} alt="" fill className="object-cover" />
                </span>
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Package className="h-7 w-7 text-muted/40" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-extrabold">{copy.withdraw.title}</h3>
                <p className="mt-0.5 truncate text-sm font-semibold text-muted">{selected.name}</p>
              </div>
            </div>

            <label className="mt-4 block text-sm font-bold">{copy.withdraw.reasonLabel}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={copy.withdraw.reasonPlaceholder}
              rows={4}
              className="mt-1.5 w-full rounded-xl border bg-surface-muted p-3 text-sm outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
            />

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowModal(false)}
                className="min-h-10 rounded-xl bg-surface-muted px-4 text-sm font-bold text-foreground transition hover:bg-surface-muted/80 disabled:opacity-60"
              >
                {copy.withdraw.cancel}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={confirmWithdraw}
                className="min-h-10 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? copy.withdraw.submitting : copy.withdraw.submit}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
