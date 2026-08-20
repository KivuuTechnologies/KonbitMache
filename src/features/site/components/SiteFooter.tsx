'use client';

import Link from 'next/link';
import { MessageCircle, Play, Sprout } from 'lucide-react';
import type { MarketplaceCopy } from '@/shared/i18n/types';
import { KofiSupportCard } from './KofiSupportCard';

interface SiteFooterProps {
  copy: MarketplaceCopy;
  locale: string;
}

interface FooterNavItem {
  label: string;
  href?: string;
}

export function SiteFooter({ copy, locale }: SiteFooterProps) {
  const columns: { title: string; links: FooterNavItem[] }[] = [
    {
      title: copy.footer.marketplace,
      links: [
        { label: copy.nav.marketplace, href: `/${locale}` },
        { label: copy.nav.categories, href: `/${locale}/categorias` },
        { label: copy.nav.farmers, href: `/${locale}/vendedores` },
      ],
    },
    {
      title: copy.footer.resources,
      links: [
        { label: copy.footer.about, href: `/${locale}/acerca-de` },
        { label: copy.footer.contact, href: `/${locale}/contacto` },
        { label: copy.footer.blog, href: `/${locale}/blog` },
      ],
    },
    {
      title: copy.footer.support,
      links: [
        { label: copy.footer.help, href: `/${locale}/ayuda` },
        { label: copy.footer.privacy, href: `/${locale}/privacidad` },
        { label: copy.footer.language, href: `/${locale}/idioma` },
      ],
    },
  ];

  return (
    <footer id="contacto" className="border-t border-border/50 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Support Banner across width */}
        <div className="mb-10 lg:mb-12">
          <KofiSupportCard copy={copy} />
        </div>

        {/* Main Grid: Brand + 3 Nav Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2" aria-label="KonbitMache">
              <Sprout className="h-6 w-6 text-fey" aria-hidden="true" />
              <span className="text-xl font-extrabold text-foreground">KonbitMache</span>
            </Link>
            <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted">{copy.site.description}</p>
          </div>

          {/* Navigation link columns */}
          {columns.map((column, idx) => (
            <div key={`${column.title}-${idx}`} className="col-span-1">
              <h2 className="text-sm font-extrabold text-foreground lg:text-base">{column.title}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href ?? link.label}>
                    <Link
                      href={link.href!}
                      className="inline-flex min-h-7 items-center text-xs font-semibold text-muted transition hover:text-foreground lg:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted/70">© 2026 KonbitMache · {copy.footer.rights}</p>
          <div className="flex items-center gap-2">
            <a href="https://www.facebook.com" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 text-muted transition hover:bg-surface-muted hover:text-foreground" aria-label="Facebook">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted transition hover:bg-surface-muted hover:text-foreground" aria-label="YouTube">
              <Play className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
