import { cookies } from 'next/headers';
import { createClient } from '../../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../../utils/supabase/env';
import { SellerSidebar } from '@/features/seller/components/SellerSidebar';
import { MobileNav } from '@/features/seller/components/MobileNav';
import { MobileHeader } from '@/features/seller/components/MobileHeader';
import { ProfileForm } from '@/features/seller/components/ProfileForm';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';
import type { ProfileFormData } from '@/features/seller/schemas';
import type { SellerType } from '@/features/seller/types';

export default async function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const localeCookie = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const t = translations[localeCookie];

  let initialProfile: Partial<ProfileFormData> = {};

  if (hasSupabaseEnvironment()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (userId) {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (dbProfile) {
          initialProfile = {
            full_name: dbProfile.full_name || '',
            seller_type: (dbProfile.seller_type as SellerType) || 'farmer',
            business_name: dbProfile.business_name || '',
            department: dbProfile.department || '',
            commune: dbProfile.commune || '',
            phone: dbProfile.phone || '',
            whatsapp: dbProfile.whatsapp || '',
            avatar_url: dbProfile.avatar_url || '',
          };
        }
      }
    } catch {
      // Fall back to empty initialProfile if fetch fails
    }
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-surface">
      <SellerSidebar locale={locale} />
      <div className="flex flex-1 flex-col min-w-0">
        <MobileHeader locale={locale} />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 data-tour="profile" className="text-2xl font-extrabold sm:text-3xl">{t.seller.profile.title}</h1>
            </div>
            <ProfileForm locale={locale} initialData={initialProfile} />
          </div>
        </main>
      </div>
      <MobileNav locale={locale} />
    </div>
  );
}
