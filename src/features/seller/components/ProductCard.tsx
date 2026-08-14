import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, Edit, Package } from 'lucide-react';
import type { Product, ProductModeration } from '../types';
import { getSellerCopy } from '../i18n/copy';
import type { Locale } from '@/shared/i18n/types';
import { DeleteProductButton } from './DeleteProductButton';

interface ProductCardProps {
  product: Product;
  locale: string;
  moderation?: ProductModeration | null;
}

export function ProductCard({ product, locale, moderation }: ProductCardProps) {
  const c = getSellerCopy(locale as Locale);

  const statusColors: Record<Product['status'], string> = {
    active: 'bg-fey/10 text-fey',
    paused: 'bg-soley/10 text-soley',
    sold_out: 'bg-muted/10 text-muted',
  };

  const statusLabels: Record<Product['status'], string> = {
    active: c.status.active,
    paused: c.status.paused,
    sold_out: c.status.sold_out,
  };

  const isWithdrawn = product.status === 'paused' && !!moderation;

  return (
    <div className="overflow-hidden rounded-2xl border bg-surface shadow-sm transition hover:shadow-md">
      {/* Product image */}
      <div className="relative flex h-40 w-full items-center justify-center bg-surface-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <Package className="h-12 w-12 text-muted/40" aria-hidden="true" />
        )}
        {/* Status badge overlay */}
        <span
          className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[product.status]}`}
        >
          {statusLabels[product.status]}
        </span>
        {isWithdrawn ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {c.moderation.badge}
          </span>
        ) : null}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="truncate text-base font-extrabold leading-5">{product.name}</h3>
        <p className="mt-1 text-lg font-extrabold tracking-tight text-foreground">
          {product.price.toLocaleString()} HTG
          <span className="ml-1 text-xs font-semibold text-muted">/ {product.unit}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {c.form.quantity}: {product.quantity}
        </p>

        {isWithdrawn ? (
          <>
            <div className="mt-3 rounded-xl border border-red-600/30 bg-red-600/5 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                {c.moderation.badge}
              </p>
              <p className="mt-1 text-sm text-foreground/85">
                <span className="font-semibold">{c.moderation.reasonLabel} </span>
                {moderation.reason}
              </p>
              {moderation.created_at ? (
                <p className="mt-1 text-xs text-muted">
                  {c.moderation.dateLabel} {new Date(moderation.created_at).toLocaleDateString(locale)}
                </p>
              ) : null}
            </div>
            <p className="mt-3 rounded-xl bg-surface-muted p-3 text-sm font-semibold text-foreground/85">
              {c.moderation.note}
            </p>
            <DeleteProductButton productId={product.id} />
          </>
        ) : (
          <Link
            href={`/${locale}/dashboard/products/${product.id}/edit`}
            className="mt-3 flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-surface-muted px-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted/80"
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
            {c.products.edit}
          </Link>
        )}
      </div>
    </div>
  );
}
