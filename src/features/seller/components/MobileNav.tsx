'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Plus, User } from 'lucide-react';
import { useTranslations } from '@/shared/i18n/useTranslations';

interface MobileNavProps {
  locale: string;
}

export function MobileNav({ locale }: MobileNavProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const mainNavItems = [
    { label: t.seller.sidebar.dashboard, href: `/${locale}/dashboard`, icon: Home },
    { label: t.seller.sidebar.myProducts, href: `/${locale}/dashboard/products`, icon: Package },
    { label: t.seller.sidebar.profile, href: `/${locale}/dashboard/profile`, icon: User },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;
    // Keep the Products tab highlighted on its sub-routes (new / edit)
    const isSectionRoot = href.endsWith('/products');
    return isSectionRoot && pathname.startsWith(href + '/');
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-surface px-2 py-2">
      <div className="flex items-center justify-around">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-tour={
              item.href.endsWith('/dashboard')
                ? 'dashboard'
                : item.href.endsWith('/products')
                  ? 'products'
                  : item.href.endsWith('/profile')
                    ? 'profile'
                    : undefined
            }
            className={`flex flex-col items-center gap-1 min-h-12 px-3 py-1 rounded-xl text-xs font-semibold transition ${
              isActive(item.href)
                ? 'text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            <span className="truncate max-w-16">{item.label}</span>
          </Link>
        ))}
        <Link
          href={`/${locale}/dashboard/products/new`}
          className="flex flex-col items-center gap-1 min-h-12 px-3 py-1 rounded-xl text-xs font-semibold bg-te text-white dark:text-background transition hover:bg-te/90"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="truncate max-w-16">{t.seller.dashboard.publishProduct}</span>
        </Link>
      </div>
    </nav>
  );
}
