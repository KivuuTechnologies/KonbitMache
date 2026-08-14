import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.register.title} description={t.auth.register.description} locale={locale}>
      <RegisterForm locale={locale} />
    </AuthPageShell>
  );
}
