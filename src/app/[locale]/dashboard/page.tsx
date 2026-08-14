import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { translations } from '@/shared/i18n/translations';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { DashboardHeader } from '@/features/seller/components/DashboardHeader';
import { DashboardTour } from '@/features/seller/components/DashboardTour';
import { DashboardStats } from '@/features/seller/components/dashboard/DashboardStats';
import { ActiveProducts } from '@/features/seller/components/dashboard/ActiveProducts';
import { RecentActivitySection } from '@/features/seller/components/dashboard/RecentActivitySection';
import { ModerationAlert } from '@/features/seller/components/dashboard/ModerationAlert';
import {
  StatsSkeleton,
  ActivitySkeleton,
  ProductsGridSkeleton,
} from '@/features/seller/components/dashboard/skeletons';
import type { SellerType, ProfileStatus } from '@/features/seller/types';
import type { UserLocale } from '../../../../utils/supabase/types';
import type { Locale } from '@/i18n/config';

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  if (!hasSupabaseEnvironment()) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(`/${locale}/login`);

  const { data: dbProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (dbProfile?.profile_status === 'incomplete' || !dbProfile?.profile_status) {
    redirect(`/${locale}/onboarding`);
  }

  if (dbProfile?.profile_status === 'suspended') {
    redirect(`/${locale}/cuenta-suspendida`);
  }

  const cookieStore = await cookies();
  const localeCookie = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const t = translations[localeCookie];

  const profile = {
    id: dbProfile.id,
    full_name: dbProfile.full_name ?? '',
    seller_type: (dbProfile.seller_type as SellerType) ?? undefined,
    business_name: dbProfile.business_name ?? undefined,
    department: dbProfile.department ?? '',
    commune: dbProfile.commune ?? undefined,
    phone: dbProfile.phone ?? undefined,
    whatsapp: dbProfile.whatsapp ?? undefined,
    avatar_url: dbProfile.avatar_url ?? undefined,
    preferred_language: (dbProfile.preferred_language as UserLocale) ?? locale,
    profile_status: (dbProfile.profile_status as ProfileStatus) ?? 'active',
    is_admin: dbProfile.is_admin ?? false,
    created_at: dbProfile.created_at ?? new Date().toISOString(),
    updated_at: dbProfile.updated_at ?? new Date().toISOString(),
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main id="main-content" className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" data-tour="dashboard">
            <DashboardHeader profile={profile} t={t} />

            {/* CTA Principal */}
            <div className="mb-8">
              <Link
                href={`/${locale}/dashboard/products/new`}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 text-xl font-bold text-white dark:text-background transition hover:bg-accent-strong sm:text-2xl"
                data-tour="publish"
              >
                <Plus className="h-6 w-6" aria-hidden="true" />
                {t.seller.dashboard.publishProduct}
              </Link>
              <Link
                href={`/${locale}/dashboard/products`}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-surface-muted bg-surface-muted px-6 py-3 text-base font-semibold text-foreground transition hover:bg-surface"
                data-tour="products"
              >
                <Package className="h-5 w-5" aria-hidden="true" />
                {t.seller.dashboard.viewProducts}
              </Link>
            </div>

            {/* Alerta de moderación — visible cuando un admin retiró un producto */}
            <Suspense fallback={null}>
              <ModerationAlert locale={locale} t={t} />
            </Suspense>

            {/* Estadísticas — real data; skeleton while loading, "—" when the
                tracking tables are not migrated, "0" for a real zero. */}
            <div className="mb-8" data-tour="stats">
              <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats userId={userId} t={t} />
              </Suspense>
            </div>

            {/* Productos activos */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold sm:text-xl">{t.seller.dashboard.activeListTitle}</h2>
                <Link
                  href={`/${locale}/dashboard/products`}
                  className="shrink-0 text-sm font-semibold text-accent transition hover:text-accent-strong"
                >
                  {t.seller.dashboard.viewProducts}
                </Link>
              </div>
              <Suspense fallback={<ProductsGridSkeleton />}>
                <ActiveProducts userId={userId} locale={locale} t={t} />
              </Suspense>
            </section>

            {/* Actividad reciente */}
            <section className="mb-8" data-tour="activity">
              <h2 className="mb-4 text-lg font-extrabold sm:text-xl">{t.seller.dashboard.activityTitle}</h2>
              <Suspense fallback={<ActivitySkeleton />}>
                <RecentActivitySection userId={userId} t={t} />
              </Suspense>
            </section>
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
      <DashboardTour />
    </div>
  );
}
