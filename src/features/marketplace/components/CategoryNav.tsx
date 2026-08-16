'use client';

/**
 * CategoryNav - horizontal scrollable category filter bar for the marketplace
 *
 * - Renders ALL 14 categories from ALLOWED_CATEGORIES (single source of truth)
 * - Displays translated labels via useTranslations() (locale-aware)
 * - Highlights the active category and "All" button
 * - Scroll is confined to this element; the page never gets horizontal overflow
 * - On mobile: touch-swipe horizontally. Scrollbar hidden visually
 * - Sync with URL searchParam ?category=<slug> via router.push (shallow)
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { ALLOWED_CATEGORIES } from '@/features/marketplace/data/categories';
import type { CategoryKey } from '@/shared/i18n/types';

interface CategoryNavProps {
  /** Currently active category slug, or null/undefined for "all" */
  activeCategory?: string | null;
}

export function CategoryNav({ activeCategory }: CategoryNavProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set('category', slug);
      } else {
        params.delete('category');
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const isAll = !activeCategory;

  return (
    // overflow-hidden on the outer wrapper prevents the outer page from getting
    // a horizontal scrollbar. The inner div scrolls independently
    <div className="relative border-b bg-surface">
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6"
        // Prevent page-level horizontal overflow while allowing inner scroll
      >
        <div
          className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={t.hero.category}
        >
          {/* "All" button */}
          <button
            type="button"
            role="tab"
            aria-selected={isAll}
            onClick={() => handleSelect(null)}
            className={[
              'flex shrink-0 min-h-12 items-center gap-2 rounded-2xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              isAll
                ? 'bg-accent text-white dark:text-background shadow-sm'
                : 'bg-surface-muted text-foreground hover:bg-accent/10 hover:text-accent',
            ].join(' ')}
          >
            {t.hero.allCategories}
          </button>

          {ALLOWED_CATEGORIES.map((slug) => {
            const isActive = activeCategory === slug;
            return (
              <button
                key={slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelect(slug)}
                className={[
                  'flex shrink-0 min-h-12 items-center gap-2 rounded-2xl px-4 py-2.5 text-base font-bold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  isActive
                    ? 'bg-accent text-white dark:text-background shadow-sm'
                    : 'bg-surface-muted text-foreground hover:bg-accent/10 hover:text-accent',
                ].join(' ')}
              >
                <CategoryIcon
                  category={slug as CategoryKey}
                  className="h-5 w-5 shrink-0"
                />
                <span>{t.categories[slug as CategoryKey]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
