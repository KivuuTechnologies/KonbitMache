'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MarketplaceCopy, CategoryKey } from '@/shared/i18n/types';
import type { PublicProduct } from '@/features/marketplace/services';
import { departmentCoordinates } from '../data/haitiDepartments';

const HaitiMapCanvas = dynamic(() => import('./HaitiMapCanvas').then((module) => module.HaitiMapCanvas), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-b-3xl bg-[#2d4736]" aria-label="Cargando mapa" />,
});

export interface HaitiMapPoint {
  id: string;
  department: string;
  longitude: number;
  latitude: number;
  /** Number of active offers in the department */
  count: number;
  /** Dominant category among those offers (most frequent) */
  category: CategoryKey | null;
}

interface HaitiMapProps {
  copy: MarketplaceCopy;
  products: PublicProduct[];
}

/**
 * Collapses all active offers into one point per department. Offers with no
 * seller department are skipped. Point count = number of offers there
 */
function buildPoints(products: PublicProduct[]): HaitiMapPoint[] {
  const buckets = new Map<string, { count: number; categories: Map<string, number> }>();

  for (const product of products) {
    const department = product.seller_location?.department;
    if (!department) continue;
    const coords = departmentCoordinates[department];
    if (!coords) continue;

    let bucket = buckets.get(department);
    if (!bucket) {
      bucket = { count: 0, categories: new Map() };
      buckets.set(department, bucket);
    }
    bucket.count += 1;
    bucket.categories.set(product.category, (bucket.categories.get(product.category) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .map(([department, bucket]) => {
      const coords = departmentCoordinates[department];
      const top = [...bucket.categories.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      return {
        id: department,
        department,
        longitude: coords.longitude,
        latitude: coords.latitude,
        count: bucket.count,
        category: (top ?? null) as CategoryKey | null,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function HaitiMap({ copy, products }: HaitiMapProps) {
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

  // Info panel always shows the department with the most offers
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
              <p className="text-sm font-extrabold text-[#b5de82]">1 · {mainPoint.department}</p>
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
        <div ref={mapContainerRef} className="h-80 w-full lg:h-full lg:min-h-0">
          {shouldLoadMap ? (
            <HaitiMapCanvas accessibleLabel={copy.sections.agriculturalZones} points={points} />
          ) : (
            <div className="h-full w-full bg-[#2d4736]" aria-label={copy.sections.agriculturalZones} />
          )}
        </div>
      </div>
    </section>
  );
}
