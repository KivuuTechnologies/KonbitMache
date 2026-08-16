'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Heart, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';
import type { Product } from '../data/catalog';
import { useTranslations } from '@/shared/i18n/useTranslations';

interface ProductDetailProps {
  product: Product;
  locale: string;
}

export function ProductDetail({ product, locale }: ProductDetailProps) {
  const t = useTranslations();

  return (
    <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-6 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-10" tabIndex={-1}>
      <nav aria-label="Breadcrumb" className="mb-5 flex min-h-12 min-w-0 items-center gap-1 text-sm font-semibold text-foreground/70">
        <Link href={`/${locale}`} className="shrink-0 rounded-md px-1 text-dlo hover:underline focus:outline-none focus:ring-2 focus:ring-te/30">
          {t.nav.marketplace}
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span aria-current="page" className="min-w-0 truncate">
          {product.name}
        </span>
      </nav>
      <article className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)] lg:gap-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-soley/10">
          <Image 
            src={product.image} 
            alt={`${product.name} - ${product.location}, ${product.department}`} 
            fill 
            priority 
            sizes="(min-width: 1024px) 60vw, 100vw" 
            className="object-cover"
          />
        </div>
        <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#24201e] sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-extrabold text-fey">{t.product.available}</p>
              <h1 className="mt-1 break-words text-[clamp(1.875rem,8vw,2.5rem)] font-extrabold tracking-tight">
                {product.name}
              </h1>
            </div>
            <button 
              type="button" 
              className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-te/30" 
              aria-label={`${t.product.save} ${product.name}`}
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-5 text-[clamp(1.75rem,7vw,2.25rem)] font-extrabold text-foreground">
            {product.price}
          </p>
          <dl className="mt-6 space-y-4 text-base">
            <div className="flex flex-col gap-1 border-b border-black/5 pb-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-semibold text-foreground/70">{t.product.quantity}</dt>
              <dd className="break-words font-bold">{product.quantity}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-black/5 pb-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
              <dt className="font-semibold text-foreground/70">{t.nav.farmers}</dt>
              <dd className="break-words font-bold">{product.farmer}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-semibold text-foreground/70">{t.hero.department}</dt>
              <dd className="flex min-w-0 items-start gap-1.5 break-words font-bold">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-dlo" aria-hidden="true" />
                <span>{product.location}, {product.department}</span>
              </dd>
            </div>
          </dl>
          <div className="mt-7 grid gap-3">
            <button 
              type="button" 
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-base font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/30"
              aria-label={`Contactar a ${product.farmer} por WhatsApp`}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {t.product.whatsapp}
            </button>
            <button 
              type="button" 
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-dlo/40 text-base font-extrabold text-dlo focus:outline-none focus:ring-2 focus:ring-dlo/30"
              aria-label={`Llamar a ${product.farmer}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {t.product.call}
            </button>
            <button 
              type="button" 
              className="flex min-h-12 items-center justify-center gap-2 text-base font-bold text-foreground/75 focus:outline-none focus:ring-2 focus:ring-foreground/30"
              aria-label={`Compartir ${product.name}`}
            >
              <Share2 className="h-5 w-5" aria-hidden="true" />
              {t.product.share}
            </button>
          </div>
        </section>
      </article>
    </main>
  );
}
