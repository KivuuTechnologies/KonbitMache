'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Home, Package, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { signOutAction } from '@/features/auth/actions/auth';
import type { Locale } from '@/shared/i18n/types';

interface MobileHeaderProps {
  locale: string;
}

export function MobileHeader({ locale }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    setOpen(false);
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

  const items = [
    { label: t.seller.sidebar.dashboard, href: `/${locale}/dashboard`, icon: Home },
    { label: t.seller.sidebar.myProducts, href: `/${locale}/dashboard/products`, icon: Package },
    { label: t.seller.sidebar.profile, href: `/${locale}/dashboard/profile`, icon: User },
    { label: t.seller.sidebar.settings, href: `/${locale}/dashboard/settings`, icon: Settings },
    { label: t.seller.sidebar.help, href: `/${locale}/dashboard/help`, icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (pathname === href) return true;
    // Keep the Products entry highlighted on its sub-routes (new / edit)
    const isSectionRoot = href.endsWith('/products');
    return isSectionRoot && pathname.startsWith(href + '/');
  };

  return (
    <header className="lg:hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-surface">
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="p-2"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="font-bold">{t.seller.dashboard.welcome}</div>
        <div style={{ width: 32 }} />
      </div>

      {/* Slide-over drawer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div className="relative w-64 h-full bg-surface border-r border-surface-muted">
          <div className="flex items-center justify-between mb-6 p-4">
            <h2 className="text-lg font-bold">{t.seller.dashboard.welcome}</h2>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                data-tour={
                  item.href.endsWith('/dashboard')
                    ? 'dashboard'
                    : item.href.endsWith('/products')
                      ? 'products'
                      : item.href.endsWith('/profile')
                        ? 'profile'
                        : item.href.endsWith('/settings')
                          ? 'settings'
                          : item.href.endsWith('/help')
                            ? 'help'
                            : undefined
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-accent text-white dark:text-background'
                    : 'text-muted hover:bg-surface-muted hover:text-foreground'
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
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-muted transition hover:bg-surface-muted disabled:opacity-60"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                {t.seller.settings.signOut}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
