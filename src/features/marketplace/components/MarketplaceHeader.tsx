import Link from 'next/link';
import { CircleUserRound, Menu, Sprout, X } from 'lucide-react';
import { LanguageSelector } from '@/shared/ui/LanguageSelector';
import { ThemeToggle } from '@/shared/theme/ThemeToggle';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface MarketplaceHeaderProps {
  copy: MarketplaceCopy;
  locale: string;
}

export function MarketplaceHeader({ copy, locale }: MarketplaceHeaderProps) {
  const links = [
    { href: `/${locale}#productos`, label: copy.nav.marketplace },
    { href: `/${locale}#agricultores`, label: copy.nav.farmers },
  ];

  return (
    <header className="border-b bg-surface/95 pt-[env(safe-area-inset-top)] backdrop-blur dark:bg-surface/95">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-15 items-center gap-2">
          <Link href={`/${locale}`} className="flex shrink-0 min-h-12 items-center gap-2 rounded-xl text-lg font-extrabold tracking-tight" aria-label="KonbitMache">
            <span className="rounded-lg bg-fey/10 p-1.5 text-fey"><Sprout className="h-5 w-5" aria-hidden="true" /></span>
            <span>KonbitMache</span>
          </Link>
          <nav className="ml-6 hidden shrink-0 items-center gap-1 lg:flex" aria-label="Navegación principal">
            {links.map((link) => <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-base font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground">{link.label}</Link>)}
          </nav>
          <div className="ml-auto hidden shrink-0 items-center gap-1 lg:flex">
            <LanguageSelector />
            <ThemeToggle />
            <Link href={`/${locale}/login`} className="flex min-h-12 items-center rounded-xl bg-accent px-4 text-base font-bold text-white shadow-sm transition hover:bg-accent-strong dark:text-background">{copy.nav.publish}</Link>
          </div>
          <details className="group relative ml-auto lg:hidden">
            <summary className="flex min-h-12 min-w-12 cursor-pointer list-none items-center justify-center rounded-xl text-foreground marker:none hover:bg-surface-muted"><Menu className="h-6 w-6 group-open:hidden" aria-hidden="true" /><X className="hidden h-6 w-6 group-open:block" aria-hidden="true" /><span className="sr-only">{copy.nav.openMenu}</span></summary>
            <div className="absolute right-0 top-14 w-[min(19rem,calc(100vw-2rem))] rounded-2xl border bg-surface p-3 shadow-xl">
              <nav className="space-y-1" aria-label={copy.nav.openMenu}>
                {links.map((link) => <Link key={link.href} href={link.href} className="flex min-h-12 items-center rounded-xl px-3 text-base font-bold hover:bg-surface-muted">{link.label}</Link>)}
                <Link href={`/${locale}/login`} aria-label={copy.nav.signIn} className="flex min-h-12 items-center rounded-xl px-3 text-muted hover:bg-surface-muted"><CircleUserRound className="h-6 w-6" aria-hidden="true" /></Link>
              </nav>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t pt-2"><LanguageSelector /><ThemeToggle /></div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
