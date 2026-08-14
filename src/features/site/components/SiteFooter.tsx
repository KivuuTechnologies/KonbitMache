'use client';

import Link from 'next/link';
import { MessageCircle, Play, Sprout } from 'lucide-react';
import type { MarketplaceCopy } from '@/shared/i18n/types';
import { NewsletterForm } from './NewsletterForm';

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
        { label: copy.nav.cooperatives, href: `/${locale}/cooperativas` },
      ],
    },
    {
      title: copy.footer.company,
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
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="KonbitMache">
              <Sprout className="h-6 w-6 text-fey" aria-hidden="true" />
              <span className="text-xl font-extrabold">KonbitMache</span>
            </Link>
            <p className="mt-2 text-sm leading-5 text-muted">{copy.site.description}</p>
            <div className="mt-4 rounded-2xl border border-border/50 bg-surface-muted p-4 sm:p-5 opacity-70 lg:mt-6 lg:p-6">
              <h2 className="text-lg font-extrabold sm:text-xl lg:text-2xl">{copy.footer.newsletter.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted sm:text-base sm:leading-7 lg:text-base">{copy.footer.newsletter.description}</p>
              <NewsletterForm disabled />
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-extrabold lg:text-base">{column.title}</h2>
              <ul className="mt-2 space-y-1 lg:mt-3 lg:space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href!} className="flex min-h-8 items-center text-xs font-semibold text-muted transition hover:text-foreground lg:min-h-10 lg:text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between lg:mt-10 lg:pt-6">
          <p className="text-xs text-muted/70">© 2026 KonbitMache · {copy.footer.rights}</p>
          <div className="flex items-center gap-2">
            <a href="https://www.facebook.com" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted transition hover:bg-surface-muted hover:text-foreground lg:h-10 lg:w-10 lg:rounded-xl" aria-label="Facebook">
              <MessageCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted transition hover:bg-surface-muted hover:text-foreground lg:h-10 lg:w-10 lg:rounded-xl" aria-label="YouTube">
              <Play className="h-3.5 w-3.5 lg:h-4 lg:w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
