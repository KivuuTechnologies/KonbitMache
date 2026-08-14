import Link from 'next/link';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.forgotPassword.title} description={t.auth.forgotPassword.description} locale={locale}>
      <ForgotPasswordForm locale={locale} />
      <Link href={`/${locale}/login`} className="mt-4 flex min-h-12 items-center justify-center rounded-xl text-base font-bold text-dlo hover:underline">{t.auth.common.backToLogin}</Link>
    </AuthPageShell>
  );
}
