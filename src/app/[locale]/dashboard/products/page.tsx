import Link from 'next/link';
import { cookies } from 'next/headers';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { ProductCard } from '@/features/seller/components/ProductCard';
import { dashboardService, productService } from '@/features/seller/services';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const localeCookie = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const t = translations[localeCookie];
  const products = await productService.getProducts();
  const moderations = await dashboardService.getProductModerations(products.map((p) => p.id));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{t.seller.products.title}</h1>
              </div>
              <Link
                href={`/${locale}/dashboard/products/new`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background sm:w-auto"
              >
                {t.seller.products.create}
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-surface-muted p-8 text-center">
                <p className="text-lg font-semibold text-muted">{t.seller.products.noProducts}</p>
                <Link
                  href={`/${locale}/dashboard/products/new`}
                  className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background"
                >
                  {t.seller.products.publishFirst}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    moderation={moderations[product.id] ?? null}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
    </div>
  );
}
