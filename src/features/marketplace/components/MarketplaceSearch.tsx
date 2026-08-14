'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { ALLOWED_CATEGORIES } from '@/features/seller/schemas';
import { useCallback, useEffect, useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import type { CategoryKey } from '@/shared/i18n/types';
import type { PublicProduct } from '@/features/marketplace/services';

const DEPARTMENTS = [
  'Artibonite',
  "Grand'Anse",
  'Nord',
  'Centre',
  'Sud-Est',
  'Sud',
  'Nippes',
  'Nord-Est',
  'Ouest',
  'Nord-Ouest',
] as const;

interface MarketplaceSearchProps {
  locale: string;
  products: PublicProduct[];
  onSearch: (filters: SearchFilters) => void;
  activeFilters: SearchFilters;
}

export interface SearchFilters {
  query: string;
  department: string | null;
}

export function MarketplaceSearch({ locale, onSearch, activeFilters }: MarketplaceSearchProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(activeFilters.query);
  const [department, setDepartment] = useState<string | null>(activeFilters.department);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ query: query.trim(), department });
    }, 150);
    return () => clearTimeout(timer);
  }, [query, department, onSearch]);

  const handleSelectCategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set('category', slug);
      } else {
        params.delete('category');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleClear = () => {
    setQuery('');
    setDepartment(null);
    onSearch({ query: '', department: null });
  };

  const hasActiveFilters = query || department;

  return (
    <section id="buscar" className="border-b bg-surface py-7 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-muted">{t.hero.eyebrow}</p>
          <h1 className="max-w-2xl text-[clamp(2rem,8vw,3.35rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{t.hero.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg">{t.hero.subtitle}</p>
        </div>

        <div
          className="mt-7 flex flex-col gap-1 rounded-2xl border bg-surface p-1.5 shadow-sm md:grid md:grid-cols-[minmax(0,1fr)_auto]"
          role="search"
        >
          <label className="flex min-h-14 min-w-0 items-center gap-2 rounded-xl px-3 focus-within:bg-surface-muted">
            <svg className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              placeholder={t.hero.searchPlaceholder}
              aria-label={t.hero.searchPlaceholder}
            />
          </label>

          <label className="flex min-h-14 shrink-0 items-center gap-2 border-t px-3 md:border-l md:border-t-0">
            <svg className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <select
              value={department ?? ''}
              onChange={(e) => setDepartment(e.target.value || null)}
              className="min-w-0 flex-1 bg-transparent text-base outline-none cursor-pointer"
              aria-label={t.hero.department}
            >
              <option value="">{t.hero.department}</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-foreground transition"
          >
            <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>
            Limpiar filtros
          </button>
        )}

        <div className="mt-6">
          <div
            className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={t.hero.category}
          >
            <button
              type="button"
              role="tab"
              aria-selected={!searchParams.get('category')}
              onClick={() => handleSelectCategory(null)}
              className={[
                'flex shrink-0 min-h-10 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                !searchParams.get('category')
                  ? 'bg-accent text-white dark:text-background shadow-sm'
                  : 'bg-surface-muted text-foreground hover:bg-accent/10 hover:text-accent',
              ].join(' ')}
            >
              {t.hero.allCategories}
            </button>

            {ALLOWED_CATEGORIES.map((slug) => {
              const isActive = searchParams.get('category') === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectCategory(slug)}
                  className={[
                    'flex shrink-0 min-h-10 items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'bg-accent text-white dark:text-background shadow-sm'
                      : 'bg-surface-muted text-foreground hover:bg-accent/10 hover:text-accent',
                  ].join(' ')}
                >
                  <CategoryIcon category={slug as CategoryKey} className="h-4 w-4 shrink-0" />
                  <span>{t.categories[slug as CategoryKey]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 lg:hidden">
          <a
            href={`/${locale}/login`}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-accent/8 px-6 text-base font-bold text-accent transition hover:bg-accent hover:text-white dark:hover:text-background"
          >
            <svg className="h-5 w-5 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 22h20M6 18V11M10 18V11M14 18V11M18 18V11M12 2 2 8v2h20V8z" /></svg>
            {t.nav.publish}
          </a>
        </div>
      </div>
    </section>
  );
}
