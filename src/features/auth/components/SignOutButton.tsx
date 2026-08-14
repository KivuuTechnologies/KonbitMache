'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { signOutAction } from '@/features/auth/actions/auth';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { useTranslations } from '@/shared/i18n/useTranslations';

export function SignOutButton() {
  const t = useTranslations();
  const { locale } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return <button type="button" disabled={isPending} onClick={() => startTransition(async () => { const result = await signOutAction(locale); if (!result.ok) { toast.error(result.message); return; } toast.success(result.message); router.replace(`/${locale}`); router.refresh(); })} className="min-h-12 rounded-xl border border-te/30 px-5 text-base font-extrabold text-te transition hover:bg-te/10 focus:outline-none focus:ring-4 focus:ring-te/20 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? t.auth.common.loading : t.auth.dashboard.signOut}</button>;
}
