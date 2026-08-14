/**
 * ProductShelf - legacy shelf for demo/mock products from catalog.ts
 * Not used by the main landing page (which uses ProductGrid + real DB products)
 * Kept to support remaining demo flows without breaking existing imports
 */

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Phone, Share2 } from 'lucide-react';
import type { Product } from '../data/catalog';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface ProductShelfProps {
  title: string;
  products: Product[];
  copy: MarketplaceCopy;
  locale: string;
  priority?: boolean;
}

export function ProductShelf({ title, products, copy, locale, priority = false }: ProductShelfProps) {
  return (
    <section>
      <div className="mb-5 flex flex-col items-start gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <h2 className="text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold tracking-tight">{title}</h2>
        <button type="button" className="flex min-h-12 items-center gap-1 text-base font-bold text-muted">
          {copy.product.viewAll}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <CatalogProductCard
            key={product.id}
            product={product}
            copy={copy}
            locale={locale}
            priority={priority && index === 0}
          />
        ))}
      </div>
    </section>
  );
}

// Inline legacy card for catalog.ts demo products

interface CatalogProductCardProps {
  product: Product;
  copy: MarketplaceCopy;
  locale: string;
  priority?: boolean;
}

function CatalogProductCard({ product, copy, locale, priority = false }: CatalogProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-surface shadow-sm">
      <Link href={`/${locale}/ofertas/${product.id}`} className="relative block aspect-[16/10] overflow-hidden bg-surface-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 270px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold shadow-sm">
          {copy.product.available}
        </span>
      </Link>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-extrabold leading-snug">
          <Link href={`/${locale}/ofertas/${product.id}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.farmer} · {product.location}</p>
        <p className="mt-3 text-xl font-extrabold">{product.price}</p>
        <p className="mt-1 text-sm text-muted">{copy.product.quantity}: {product.quantity}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] text-sm font-bold text-white">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {copy.product.whatsapp}
          </button>
          <button type="button" className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-surface-muted text-sm font-bold">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {copy.product.call}
          </button>
        </div>
        <button type="button" className="mt-3 flex min-h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-foreground">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          {copy.product.share}
        </button>
      </div>
    </article>
  );
}
