import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { dashboardService, productService } from '../../services';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface ModerationAlertProps {
  locale: string;
  t: MarketplaceCopy;
}

/**
 * Banner shown on the seller dashboard when an admin has withdrawn at least
 * one of the seller's products. Links to the product list so the seller can
 * delete it and republish a corrected version
 */
export async function ModerationAlert({ locale, t }: ModerationAlertProps) {
  const products = await productService.getProducts();
  const moderations = await dashboardService.getProductModerations(products.map((p) => p.id));

  const withdrawnCount = products.filter((p) => p.status === 'paused' && moderations[p.id]).length;
  if (withdrawnCount === 0) return null;

  return (
    <div
      className="mb-8 flex flex-col gap-3 rounded-2xl border border-red-600/30 bg-red-600/5 p-4 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600/10">
          <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-extrabold text-foreground">
            {t.seller.dashboard.moderationAlertTitle}
          </p>
          <p className="mt-0.5 text-sm text-foreground/75">
            {t.seller.dashboard.moderationAlertBody}
          </p>
        </div>
      </div>
      <Link
        href={`/${locale}/dashboard/products`}
        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
      >
        {t.seller.dashboard.moderationViewProducts}
      </Link>
    </div>
  );
}
