import { Suspense } from 'react';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { translations } from '@/shared/i18n/translations';
import { isLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.login.title} description={t.auth.login.description} locale={locale}>
      <Suspense fallback={<div aria-live="polite">{t.auth.common.loading}</div>}>
        <LoginForm locale={locale} />
      </Suspense>
    </AuthPageShell>
  );
}

