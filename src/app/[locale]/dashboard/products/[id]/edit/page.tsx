import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { ProductForm } from '@/features/seller/components/ProductForm';
import { productService, dashboardService } from '@/features/seller/services';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { getSellerCopy } from '@/features/seller/i18n/copy';
import type { Locale } from '@/i18n/config';
import type { CategorySlug } from '@/features/seller/schemas';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const cookieStore = await cookies();
  const effectiveLocale = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const c = getSellerCopy(effectiveLocale);
  const product = await productService.getProductById(id);

  if (!product) notFound();

  // A product withdrawn by an admin can no longer be edited — only deleted and
  // republished correctly. Send the seller back to their product list.
  const moderations = await dashboardService.getProductModerations([product.id]);
  if (moderations[product.id]) redirect(`/${locale}/dashboard/products`);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{c.form.editTitle}</h1>
              <p className="mt-1 text-sm text-muted">{c.form.editSubtitle}</p>
            </div>
            <div className="rounded-2xl border bg-surface p-6 sm:p-8">
              <ProductForm
                initialData={{
                  id: product.id,
                  name: product.name,
                  description: product.description ?? '',
                  category: product.category as CategorySlug,
                  price: product.price,
                  unit: product.unit,
                  quantity: product.quantity,
                  image_url: product.image_url ?? '',
                  // Pass image_urls; fall back to wrapping the legacy image_url
                  // so the uploader always has something to show for existing products.
                  image_urls:
                    product.image_urls && product.image_urls.length > 0
                      ? product.image_urls
                      : product.image_url
                      ? [product.image_url]
                      : [],
                  status: product.status,
                }}
                locale={locale}
              />
            </div>
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
    </div>
  );
}
