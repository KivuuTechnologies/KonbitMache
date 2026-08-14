'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Home, Package, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { signOutAction } from '@/features/auth/actions/auth';
import type { Locale } from '@/shared/i18n/types';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SellerSidebarProps {
  locale: string;
}

export function SellerSidebar({ locale }: SellerSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const result = await signOutAction(locale as Locale);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.replace(`/${locale}`);
      router.refresh();
    });
  }

  const items: SidebarItem[] = [
    { label: t.seller.sidebar.dashboard, href: `/${locale}/dashboard`, icon: Home },
    { label: t.seller.sidebar.myProducts, href: `/${locale}/dashboard/products`, icon: Package },
    { label: t.seller.sidebar.profile, href: `/${locale}/dashboard/profile`, icon: User },
    { label: t.seller.sidebar.settings, href: `/${locale}/dashboard/settings`, icon: Settings },
    { label: t.seller.sidebar.help, href: `/${locale}/dashboard/help`, icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;
    // Only section roots with sub-routes (e.g. /dashboard/products/*) stay
    // highlighted on their children. Plain exact-match everywhere else
    const isSectionRoot = href.endsWith('/products');
    return isSectionRoot && pathname.startsWith(href + '/');
  };

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-surface-muted">
      <div className="flex flex-col gap-2 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            // Add data-tour attributes for Driver.js targeting
            data-tour={item.href.endsWith('/dashboard') ? 'dashboard' : item.href.endsWith('/products') ? 'products' : item.href.endsWith('/profile') ? 'profile' : item.href.endsWith('/settings') ? 'settings' : item.href.endsWith('/help') ? 'help' : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition ${
              isActive(item.href)
                ? 'bg-accent text-white dark:text-background'
                : 'text-muted hover:bg-surface hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
        <div className="mt-4 pt-4 border-t">
          <button
            type="button"
            disabled={isPending}
            onClick={handleSignOut}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl px-4 text-base font-semibold text-muted transition hover:bg-surface hover:text-foreground disabled:opacity-60"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {t.seller.settings.signOut}
          </button>
        </div>
      </div>
    </aside>
  );
}
