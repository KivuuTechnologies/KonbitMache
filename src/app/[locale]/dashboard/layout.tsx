import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { DashboardTour } from '@/features/seller/components/DashboardTour';
import { WorkflowTour } from '@/features/seller/components/WorkflowTour';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Admins only use the admin panel — redirect them away from the whole
  // seller dashboard. The real authorization lives in Supabase; this is UX.
  if (hasSupabaseEnvironment()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();
      if (profile?.is_admin) redirect(`/${locale}/admin`);
    }
  }

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <DashboardTour />
        <WorkflowTour />
      </Suspense>
    </>
  );
}
