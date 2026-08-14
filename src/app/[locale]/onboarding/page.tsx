import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { SellerOnboardingForm } from '@/features/seller/components/SellerOnboardingForm';
import type { Locale } from '@/i18n/config';
import type { SellerProfile } from '@/features/seller/types';

export const metadata: Metadata = {
  title: 'Perfil de vendedor | KonbitMache',
  description: 'Completa tu información para comenzar a publicar tus productos agrícolas en KonbitMache',
};

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!hasSupabaseEnvironment()) {
    // Render form with default empty initial profile in mock mode
    return (
      <div className="min-h-screen bg-surface py-8">
        <SellerOnboardingForm locale={locale} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect(`/${locale}/login`);
  }

  // Fetch current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  // Route based on profile status
  if (profile?.is_admin) {
    redirect(`/${locale}/admin`);
  }

  if (profile?.profile_status === 'active') {
    redirect(`/${locale}/dashboard`);
  }

  if (profile?.profile_status === 'suspended') {
    redirect(`/${locale}/cuenta-suspendida`);
  }

  const initialProfile: Partial<SellerProfile> = profile
    ? {
        seller_type: profile.seller_type || undefined,
        business_name: profile.business_name || undefined,
        department: profile.department || undefined,
        commune: profile.commune || undefined,
        phone: profile.phone || undefined,
        whatsapp: profile.whatsapp || undefined,
        avatar_url: profile.avatar_url || undefined,
        preferred_language: profile.preferred_language ?? locale,
        profile_status: profile.profile_status ?? 'incomplete',
      }
    : {};

  return (
    <div className="min-h-screen bg-surface py-8">
      <SellerOnboardingForm locale={locale} initialProfile={initialProfile} />
    </div>
  );
}
