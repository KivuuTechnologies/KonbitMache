'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MarketplaceCopy, CategoryKey } from '@/shared/i18n/types';
import type { PublicProduct } from '@/features/marketplace/services';
import { resolveCommuneCoordinates, normalizeName } from '@/data/haiti-communes-coordinates';

const HaitiMapCanvas = dynamic(() => import('./HaitiMapCanvas').then((module) => module.HaitiMapCanvas), {
  ssr: false,
});

export interface HaitiMapPoint {
  id: string;
  department: string;
  commune: string;
  longitude: number;
  latitude: number;
  /** Number of active offers in the commune */
  count: number;
  /** Dominant category among those offers (most frequent) */
  category: CategoryKey | null;
}

interface HaitiMapProps {
  copy: MarketplaceCopy;
  products: PublicProduct[];
  locale: string;
}

/**
 * Collapses all active offers into one point per commune
 * Offers with no seller department or commune or unresolvable ones are skipped
 */
function buildPoints(products: PublicProduct[]): HaitiMapPoint[] {
  const buckets = new Map<string, { count: number; department: string; commune: string; categories: Map<string, number> }>();

  for (const product of products) {
    const department = product.seller_location?.department;
    const commune = product.seller_location?.commune;
    if (!department || !commune) continue;

    const coords = resolveCommuneCoordinates(department, commune);
    if (!coords) continue;

    const key = `${normalizeName(department)}_${normalizeName(commune)}`;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { count: 0, department, commune, categories: new Map() };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    bucket.categories.set(product.category, (bucket.categories.get(product.category) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .map(([key, bucket]) => {
      const coords = resolveCommuneCoordinates(bucket.department, bucket.commune)!;
      const top = [...bucket.categories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return {
        id: key,
        department: bucket.department,
        commune: bucket.commune,
        longitude: coords.longitude,
        latitude: coords.latitude,
        count: bucket.count,
        category: (top ?? null) as CategoryKey | null,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function HaitiMap({ copy, products, locale }: HaitiMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const element = mapContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadMap(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const points = useMemo(() => buildPoints(products), [products]);
  const totalOffers = points.reduce((sum, p) => sum + p.count, 0);

  // Info panel always shows the commune with the most offers
  const mainPoint = points[0] ?? null;
  const mainCategory = mainPoint?.category ? (copy.categories[mainPoint.category] ?? mainPoint.category) : null;

  return (
    <section className="overflow-hidden rounded-3xl bg-[#203127] text-white">
      <div className="lg:grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f2b45b]">KonbitMache</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">{copy.sections.map}</h2>
          <p className="mt-4 max-w-md text-base leading-7 text-white/80">{copy.sections.mapDescription}</p>
          {mainPoint ? (
            <div className="mt-6 rounded-2xl border border-fey/50 bg-fey/15 p-4">
              <p className="text-sm font-extrabold text-[#b5de82]">1 · {mainPoint.commune} ({mainPoint.department})</p>
              {mainCategory ? <p className="mt-1 text-base font-bold">{copy.sections.dominantOffer}: {mainCategory}</p> : null}
              <p className="mt-1 text-sm text-white/75">
                {mainPoint.count} {copy.sections.mapOffers}
              </p>
            </div>
          ) : null}
          <div className="mt-5 flex min-h-12 items-center gap-2 text-base font-bold text-[#b5de82]">
            <MapPin className="h-5 w-5" aria-hidden="true" />
            {totalOffers} {copy.sections.mapOffers}
          </div>
        </div>
        <div ref={mapContainerRef} className="relative h-80 w-full lg:h-auto">
          <div className="absolute inset-0">
            {shouldLoadMap ? (
              <HaitiMapCanvas accessibleLabel={copy.sections.agriculturalZones} points={points} locale={locale} />
            ) : (
              <div className="h-full w-full animate-pulse bg-[#2d4736] rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none" aria-label={copy.sections.agriculturalZones} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


