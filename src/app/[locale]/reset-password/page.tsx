import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function ResetPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.resetPassword.title} description={t.auth.resetPassword.description} locale={locale}>
      <ResetPasswordForm locale={locale} />
    </AuthPageShell>
  );
}
