import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AlertOctagon, HelpCircle, LogOut } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { translations } from '@/shared/i18n/translations';
import { signOutAction } from '@/features/auth/actions/auth';
import type { Locale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Cuenta suspendida | KonbitMache',
  description: 'Tu cuenta de vendedor en KonbitMache ha sido suspendida temporalmente',
};

export default async function CuentaSuspendidaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = translations[locale];

  if (hasSupabaseEnvironment()) {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;

    if (!userId) {
      redirect(`/${locale}/login`);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_status')
      .eq('id', userId)
      .maybeSingle();

    if (profile?.profile_status === 'active') {
      redirect(`/${locale}/dashboard`);
    }

    if (profile?.profile_status === 'incomplete') {
      redirect(`/${locale}/onboarding`);
    }
  }

  async function handleSignOut() {
    'use server';
    await signOutAction(locale);
    redirect(`/${locale}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-surface p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertOctagon className="h-10 w-10" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.seller.suspended.title}
        </h1>

        <p className="mt-4 text-base text-foreground/80 leading-relaxed sm:text-lg">
          {t.seller.suspended.description}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <a
            href="mailto:support@konbitmache.ht"
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-te px-6 text-lg font-bold text-white dark:text-background shadow-md transition hover:bg-te/90 focus:ring-4 focus:ring-te/30"
          >
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
            {t.seller.suspended.contactSupport}
          </a>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-black/10 bg-surface px-6 text-lg font-bold text-foreground transition hover:bg-surface-muted focus:ring-4 focus:ring-black/10"
            >
              <LogOut className="h-6 w-6" aria-hidden="true" />
              {t.seller.suspended.signOut}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
