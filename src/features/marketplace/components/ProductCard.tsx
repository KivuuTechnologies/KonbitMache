'use client';

/**
 * ProductCard - marketplace variant with multi-image carousel
 *
 * Only the active image is mounted to keep DOM/GPU memory low on 2 GB phones
 * Inactive slides are skipped entirely (display:none would prevent preloading);
 * the next slide is preloaded via a hidden eager Image. The active image gets
 * LCP priority when above the fold
 *
 * Responsive is CSS-only (pointer-coarse / group-hover) - no JS device detection
 *
 * Contact UX:
 *   - WhatsApp: wa.me click-to-chat; the browser/OS opens the app or Web
 *   - Call: explanatory modal on all devices; the user must explicitly click
 *     "Llamar ahora" (tel:) — nothing is dialed automatically.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { getTranslatedField } from '@/shared/i18n/getTranslatedField';
import { formatUnit } from '@/shared/i18n/formatUnit';
import { formatCurrency } from '@/shared/i18n/formatNumber';
import {
  recordProductContactAction,
  recordProductViewAction,
} from '@/features/seller/actions/tracking';
import { getOrCreateVisitorId } from '../utils/visitorId';
import { getProductInterestCount } from '../services';
import { CategoryIcon } from './CategoryIcon';
import { categoryBadgeClasses } from '../utils/categoryColors';
import type { PublicProduct } from '@/features/marketplace/services';
import type { CategoryKey } from '@/shared/i18n/types';

const AUTOPLAY_MS = 4000;
const RESUME_AFTER_INTERACTION_MS = 6000;

interface ProductCardProps {
  product: PublicProduct;
  locale: string;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations();
  const { locale: currentLocale } = useLanguage();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [interestCount, setInterestCount] = useState<number | null>(null);
  const [interestLoading, setInterestLoading] = useState(false);

  // WhatsApp and phone are independent - each uses only its own field
  // Numbers are normalized only for hrefs; the DB values are never mutated
  // wa.me requires digits only; tel: keeps the leading + for international
  const normalizeDigits = (raw: string | null): string | null => {
    if (!raw) return null;
    const digits = raw.replace(/[^\d+]/g, '');
    return digits || null;
  };

  const waNumber = normalizeDigits(product.seller_whatsapp);
  const telNumber = normalizeDigits(product.seller_phone);

  const whatsappUrl = waNumber ? `https://wa.me/${waNumber.replace('+', '')}` : null;
  const telHref = telNumber ? `tel:${telNumber}` : null;

  // A) Dynamic content - translations
  const displayName = getTranslatedField(
    product.name_translations,
    currentLocale,
    product.source_locale,
    product.name
  );
  const displayDescription = product.description
    ? getTranslatedField(
        product.desc_translations,
        currentLocale,
        product.source_locale,
        product.description
      )
    : null;

  // B) Slugs - i18n only, never AI
  const categoryLabel =
    t.categories[product.category as CategoryKey] ?? product.category;

  // Singular/plural unit labels based on the active locale
  // Quantity line: "10 bolsas" / "1 bolsa" / "5 sacs" / "1 sac"
  const unitForQuantity = formatUnit(
    product.quantity,
    product.unit,
    t.units,
    t.unitsPlural,
    currentLocale
  );
  // Price line: always singular - "1000 HTG / bolsa" (price is per unit)
  const unitPerPrice = formatUnit(
    1,
    product.unit,
    t.units,
    t.unitsPlural,
    currentLocale
  );

  // C) Numeric data - locale-aware formatting
  const priceFormatted = formatCurrency(product.price, currentLocale);

  // Prefer image_urls, fall back to legacy image_url
  const images: string[] = (() => {
    if (product.image_urls && product.image_urls.length > 0) return product.image_urls;
    if (product.image_url) return [product.image_url];
    return [];
  })();

  const total = images.length;
  const isCarousel = total >= 2;

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  const clearAutoplay = () => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  };
  const clearResume = () => {
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  };

  const scheduleAutoplay = useCallback(() => {
    clearAutoplay();
    if (!isCarousel || isPausedRef.current) return;
    autoplayRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
  }, [isCarousel, total]);

  useEffect(() => {
    scheduleAutoplay();
    return clearAutoplay;
  }, [index, scheduleAutoplay]);

  // Full cleanup on unmount - prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      clearAutoplay();
      clearResume();
    };
  }, []);

  const pauseAndScheduleResume = () => {
    isPausedRef.current = true;
    clearAutoplay();
    clearResume();
    resumeRef.current = setTimeout(() => {
      isPausedRef.current = false;
      scheduleAutoplay();
    }, RESUME_AFTER_INTERACTION_MS);
  };

  /** Navigate to a specific index with a brief transition lock */
  const navigateTo = (nextIndex: number) => {
    if (isTransitioning || nextIndex === index) return;
    pauseAndScheduleResume();
    setIsTransitioning(true);
    setIndex(nextIndex);
    // Unlock after the CSS transition duration (200 ms)
    setTimeout(() => setIsTransitioning(false), 220);
  };

  const prev = () => navigateTo((index - 1 + total) % total);
  const next = () => navigateTo((index + 1) % total);
  const goTo = (i: number) => navigateTo(i);

  // Track a view when the buyer opens the detail modal. Best-effort: a missing
  // tracking table or transient failure never blocks opening the modal.
  const openDetail = () => {
    setShowDetailModal(true);
    setInterestLoading(true);
    setInterestCount(null);
    void recordProductViewAction(product.id).catch(() => {});
    getProductInterestCount(product.id)
      .then((count) => {
        setInterestCount(count);
        setInterestLoading(false);
      })
      .catch(() => {
        setInterestLoading(false);
      });
  };

  const trackContact = (channel: 'whatsapp' | 'call') => {
    const visitorId = getOrCreateVisitorId();
    void recordProductContactAction(product.id, channel, visitorId ?? '').catch(() => {});
  };

  // Pointer events detect horizontal swipes without blocking vertical scroll
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    pointerStartY.current = e.clientY;
    isDragging.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current === null || pointerStartY.current === null) return;
    const dx = Math.abs(e.clientX - pointerStartX.current);
    const dy = Math.abs(e.clientY - pointerStartY.current);
    // Only classify as a drag if horizontal movement dominates
    if (dx > 8 && dx > dy) isDragging.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    if (isDragging.current && isCarousel && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    pointerStartX.current = null;
    pointerStartY.current = null;
    isDragging.current = false;
  };

  // Client-only - never touches document during SSR
  useEffect(() => {
    if (showDetailModal || showCallModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [showDetailModal, showCallModal]);

  // Client-only - never touches window during SSR
  useEffect(() => {
    if (!showDetailModal && !showCallModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDetailModal(false);
        setShowCallModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDetailModal, showCallModal]);

  return (
    <>
      <article
        className="group cursor-pointer overflow-hidden rounded-2xl border bg-surface shadow-sm transition duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg"
        onClick={openDetail}
      >

        {/* Image area */}
        <div
          className="relative aspect-[16/10] overflow-hidden bg-surface-muted select-none"
          onPointerDown={isCarousel ? onPointerDown : undefined}
          onPointerMove={isCarousel ? onPointerMove : undefined}
          onPointerUp={isCarousel ? onPointerUp : undefined}
          // pan-y: allow vertical scroll while we handle horizontal swipes
          style={{ touchAction: 'pan-y' }}
        >
          {total === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted/40">
              <Package className="h-12 w-12" aria-hidden="true" />
            </div>
          ) : (
            <>
              {/* Only the active image is mounted - at most 1 <img> per card */}
              <div
                key={index}
                className="absolute inset-0 animate-fadeIn"
              >
                <Image
                  src={images[index]}
                  alt={`${displayName}${total > 1 ? ` — ${index + 1}/${total}` : ''}`}
                  fill
                  priority={priority && index === 0}
                  // Lazy-load slides that are not the first — the browser will
                  // NOT lazy-load if priority is true, so index > 0 is safe
                  loading={priority && index === 0 ? 'eager' : 'lazy'}
                  sizes="(min-width: 1280px) 270px, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Preload the next slide only - hidden eager Image, 1-slide look-ahead */}
              {isCarousel && (
                <span className="sr-only" aria-hidden="true">
                  <Image
                    src={images[(index + 1) % total]}
                    alt=""
                    fill
                    loading="eager"
                    sizes="1px"
                    className="opacity-0 pointer-events-none"
                    unoptimized
                  />
                </span>
              )}
            </>
          )}

          {/* Available badge */}
          {total > 0 && (
            <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-foreground shadow-sm dark:bg-black/80">
              {t.product.available}
            </span>
          )}

          {/* CSS-only responsive: always visible on touch, hover/focus on fine pointer */}
          {isCarousel && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label={t.product.previousImage}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition
                  opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                  pointer-coarse:opacity-100
                  hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white
                  sm:h-8 sm:w-8"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label={t.product.nextImage}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition
                  opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                  pointer-coarse:opacity-100
                  hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white
                  sm:h-8 sm:w-8"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {isCarousel && (
            <div
              className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
              role="tablist"
              aria-label={`${index + 1} / ${total}`}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1} / ${total}`}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className={[
                    'h-1.5 rounded-full transition-all duration-200',
                    i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/90',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5">
          {/* Category badge */}
          <div className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${categoryBadgeClasses(product.category as CategoryKey)}`}>
            <CategoryIcon
              category={product.category as CategoryKey}
              className="h-3.5 w-3.5 shrink-0"
            />
            <span>{categoryLabel}</span>
          </div>

          {/* Name */}
          <h3 className="min-w-0 break-words text-lg font-extrabold leading-snug">
            {displayName}
          </h3>

          {/* Description preview */}
          {displayDescription && (
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">
              {displayDescription}
            </p>
          )}

          {/* Price - localized format, unit always singular (per unit) */}
          <p className="mt-3 text-xl font-extrabold tracking-tight text-foreground">
            {priceFormatted} HTG
            <span className="ml-1 text-sm font-semibold text-muted">
              / {unitPerPrice}
            </span>
          </p>

          {/* Quantity - singular/plural aware */}
          <p className="mt-1 text-sm font-medium text-muted">
            {t.product.quantity}: {product.quantity} {unitForQuantity}
          </p>

          {/* Seller location - from profile department/commune */}
          {product.seller_location && (product.seller_location.department || product.seller_location.commune) && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted truncate">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {product.seller_location.commune && product.seller_location.department
                  ? `${product.seller_location.commune}, ${product.seller_location.department}`
                  : product.seller_location.commune || product.seller_location.department}
              </span>
            </p>
          )}

          {/* CTA buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* WhatsApp - click-to-chat via wa.me on any device */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  trackContact('whatsapp');
                }}
                className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.product.whatsapp}</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/40 px-2 text-sm font-bold text-white cursor-not-allowed"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.product.whatsapp}</span>
              </button>
            )}

            {/* Call - opens the explanatory modal on ALL devices.
                The modal requires an explicit click on "Llamar ahora"
                (<a href="tel:...">) before any call is initiated */}
            {telNumber ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowCallModal(true); }}
                className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-surface-muted px-2 text-sm font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-accent/20"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.product.call}</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex min-h-12 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-surface-muted/60 px-2 text-sm font-bold text-muted cursor-not-allowed"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.product.call}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex min-h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {t.product.share}
          </button>
        </div>

      </article>

      {/* Call modal - all devices. Requires explicit click on "Llamar ahora" */}
      {showCallModal && telNumber && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.product.callModalTitle}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCallModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-extrabold">{t.product.callModalTitle}</h2>
              <button
                type="button"
                onClick={() => setShowCallModal(false)}
                aria-label={t.product.callModalClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-2 text-sm text-muted">{t.product.callModalHint}</p>

            <p className="mt-4 select-all rounded-xl bg-surface-muted px-4 py-3 text-center text-2xl font-extrabold tracking-widest">
              {telNumber}
            </p>

            {/* Explicit user action - never auto-dials.
                telHref is non-null here because the modal is only rendered
                when telNumber is truthy */}
            <a
              href={telHref ?? undefined}
              onClick={() => trackContact('call')}
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-bold text-white transition hover:bg-accent-strong dark:text-background focus:outline-none focus:ring-4 focus:ring-accent/30"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
              {t.product.callNow}
            </a>

            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              className="mt-2 w-full rounded-xl px-4 py-3 text-base font-semibold text-muted transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {t.product.callModalClose}
            </button>
          </div>
        </div>
      )}

      {/* Detail modal - opens when clicking the card */}
      {showDetailModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={displayName}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              aria-label={t.product.callModalClose}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto">
              {/* Large image area */}
              <div className="relative aspect-[16/9] w-full bg-surface-muted select-none">
                {total === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-muted/40">
                    <Package className="h-20 w-20" aria-hidden="true" />
                  </div>
                ) : (
                  <>
                    <div key={index} className="absolute inset-0 animate-fadeIn">
                      <Image
                        src={images[index]}
                        alt={`${displayName}${total > 1 ? ` — ${index + 1}/${total}` : ''}`}
                        fill
                        sizes="(min-width: 768px) 768px, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {isCarousel && (
                      <>
                        <button
                          type="button"
                          onClick={prev}
                          aria-label={t.product.previousImage}
                          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={next}
                          aria-label={t.product.nextImage}
                          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <ChevronRight className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Available badge */}
                {total > 0 && (
                  <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-foreground shadow-sm dark:bg-black/80">
                    {t.product.available}
                  </span>
                )}

                {/* Dot indicators */}
                {isCarousel && (
                  <div
                    className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2"
                    role="tablist"
                    aria-label={`${index + 1} / ${total}`}
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`${i + 1} / ${total}`}
                        onClick={() => goTo(i)}
                        className={[
                          'h-2 rounded-full transition-all duration-200',
                          i === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/90',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Large content area */}
              <div className="p-6 sm:p-8">
                {/* Category badge */}
                <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm font-bold uppercase tracking-wider ${categoryBadgeClasses(product.category as CategoryKey)}`}>
                  <CategoryIcon
                    category={product.category as CategoryKey}
                    className="h-4 w-4 shrink-0"
                  />
                  <span>{categoryLabel}</span>
                </div>

                {/* Name - large */}
                <h2 className="break-words text-2xl font-extrabold leading-tight sm:text-3xl">
                  {displayName}
                </h2>

                {/* Price - large, unit always singular (per unit) */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {priceFormatted} HTG
                  </p>
                  <span className="text-lg font-semibold text-muted">
                    / {unitPerPrice}
                  </span>
                </div>

                {/* Quantity - singular/plural aware */}
                <p className="mt-2 text-base font-medium text-muted">
                  {t.product.quantity}: {product.quantity} {unitForQuantity}
                </p>

                {/* Seller location - from profile department/commune */}
                {product.seller_location && (product.seller_location.department || product.seller_location.commune) && (
                  <p className="mt-2 flex items-center gap-2 text-base text-muted">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {product.seller_location.commune && product.seller_location.department
                        ? `${product.seller_location.commune}, ${product.seller_location.department}`
                        : product.seller_location.commune || product.seller_location.department}
                    </span>
                  </p>
                )}

                {/* Interested visitors count */}
                <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {interestLoading ? (
                    <span className="animate-pulse">—</span>
                  ) : interestCount !== null ? (
                    <>
                      <span className="font-bold">{interestCount.toLocaleString()}</span>
                      <span>{t.stats.interested}</span>
                    </>
                  ) : null}
                </div>

                {/* Full description */}
                {displayDescription && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
                      {t.product.description}
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground">
                      {displayDescription}
                    </p>
                  </div>
                )}

                {/* CTA buttons - large */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* WhatsApp */}
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackContact('whatsapp')}
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-base font-bold text-white transition hover:bg-[#1fb959] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
                    >
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t.product.whatsapp}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366]/40 px-4 text-base font-bold text-white cursor-not-allowed"
                    >
                      <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t.product.whatsapp}
                    </button>
                  )}

                  {/* Call - opens the explanatory modal on ALL devices */}
                  {telNumber ? (
                    <button
                      type="button"
                      onClick={() => setShowCallModal(true)}
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-surface-muted px-4 text-base font-bold text-foreground transition hover:bg-surface-muted/80 focus:outline-none focus:ring-4 focus:ring-accent/20"
                    >
                      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t.product.call}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-surface-muted/60 px-4 text-base font-bold text-muted cursor-not-allowed"
                    >
                      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t.product.call}
                    </button>
                  )}
                </div>

                {/* Share */}
                <button
                  type="button"
                  className="mt-4 flex min-h-12 items-center gap-2 text-base font-semibold text-muted transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                  {t.product.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}