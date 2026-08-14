import { cookies } from 'next/headers';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { HelpGuide } from '@/features/seller/components/HelpGuide';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function HelpPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const localeCookie = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const t = translations[localeCookie];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{t.seller.help.title}</h1>
              <p className="mt-2 text-base text-muted">
                Encuentra guías paso a paso para usar todas las funciones de tu panel de vendedor.
              </p>
            </div>
            <HelpGuide locale={locale} />
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
    </div>
  );
}
