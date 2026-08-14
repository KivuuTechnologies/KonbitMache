import { Suspense } from 'react';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.login.title} description={t.auth.login.description} locale={locale}>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm locale={locale} />
      </Suspense>
    </AuthPageShell>
  );
}
