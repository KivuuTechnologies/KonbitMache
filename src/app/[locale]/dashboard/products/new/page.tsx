import { cookies } from 'next/headers';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { SteppedProductForm } from '@/features/seller/components/SteppedProductForm';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { getSellerCopy } from '@/features/seller/i18n/copy';
import type { Locale } from '@/i18n/config';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const effectiveLocale = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const c = getSellerCopy(effectiveLocale);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{c.form.newTitle}</h1>
              <p className="mt-1 text-sm text-muted">{c.form.newSubtitle}</p>
            </div>
            <div className="rounded-2xl border bg-surface p-6 sm:p-8">
              <SteppedProductForm locale={locale} />
            </div>
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
    </div>
  );
}
