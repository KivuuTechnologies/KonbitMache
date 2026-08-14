import Link from 'next/link';
import { AuthPageShell } from '@/features/auth/components/AuthPageShell';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/i18n/config';

export default async function EmailConfirmationPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <AuthPageShell title={t.auth.register.confirmationTitle} description={t.auth.register.confirmationDescription} locale={locale}>
      <Link href={`/${locale}/login`} className="flex min-h-12 items-center justify-center rounded-xl bg-te px-5 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-te/30">{t.auth.common.backToLogin}</Link>
    </AuthPageShell>
  );
}
