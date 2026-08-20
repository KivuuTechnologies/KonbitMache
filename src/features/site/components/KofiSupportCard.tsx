'use client';

import { Heart, ExternalLink, Coffee } from 'lucide-react';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface KofiSupportCardProps {
  copy: MarketplaceCopy;
}

export function KofiSupportCard({ copy }: KofiSupportCardProps) {
  const support = copy.footer.supportUs;

  return (
    <div className="rounded-2xl border border-border/70 bg-surface-muted px-6 py-8 sm:px-10 sm:py-10 transition hover:border-[#5cb85c]/40">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 max-w-3xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5cb85c]/15 text-[#2e7d32] dark:text-[#5cb85c]">
            <Coffee className="h-6 w-6" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5cb85c]/10 px-2.5 py-0.5 text-xs font-bold text-[#2e7d32] dark:text-[#5cb85c]">
                <Heart className="h-3.5 w-3.5 fill-[#5cb85c] text-[#5cb85c]" aria-hidden="true" />
                {support.badge}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-extrabold text-foreground sm:text-xl">
              {support.title}
            </h2>

            <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
              {support.description}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <a
            href="https://ko-fi.com/konbitmache"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#5cb85c] px-7 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#4cae4c] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:ring-offset-2 sm:text-base dark:focus:ring-offset-[#171413]"
          >
            <Coffee className="h-5 w-5" aria-hidden="true" />
            <span>{support.buttonText}</span>
            <ExternalLink className="h-4 w-4 opacity-80" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
