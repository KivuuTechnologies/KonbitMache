import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getPublicProducts } from '@/features/marketplace/services';
import { AdminModerationPanel } from '@/features/admin/components/AdminModerationPanel';
import { getAdminCopy } from '@/features/admin/i18n/copy';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import type { Locale } from '@/i18n/config';

export default async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  if (!hasSupabaseEnvironment()) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  if (!profile?.is_admin) redirect(`/${locale}/dashboard`);

  const cookieStore = await cookies();
  const localeCookie = toSupportedLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? locale;
  const copy = getAdminCopy(localeCookie);
  const products = await getPublicProducts();

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminModerationPanel products={products} locale={localeCookie} copy={copy} />
      </div>
    </main>
  );
}
