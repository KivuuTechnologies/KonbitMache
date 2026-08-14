'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { resetPasswordAction } from '@/features/auth/actions/auth';
import { getAuthValidationMessage } from '@/lib/auth/errors';
import { resetPasswordSchema, type ResetPasswordInput } from '@/schemas/auth';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { AuthInput } from './AuthInput';
import type { Locale } from '@/i18n/config';

interface ResetPasswordFormProps {
  locale: Locale;
}

export function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '', confirmPassword: '' }, shouldFocusError: true });

  function submit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPasswordAction({ ...values, locale });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.replace(`/${locale}/dashboard`);
    });
  }

  const error = (field: keyof ResetPasswordInput) => {
    const key = form.formState.errors[field]?.message;
    return key ? getAuthValidationMessage(locale, key) : undefined;
  };

  return <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5"><AuthInput id="password" label={t.auth.common.password} type="password" autoComplete="new-password" disabled={isPending} registration={form.register('password')} error={error('password')} /><AuthInput id="confirmPassword" label={t.auth.common.confirmPassword} type="password" autoComplete="new-password" disabled={isPending} registration={form.register('confirmPassword')} error={error('confirmPassword')} /><button type="submit" disabled={isPending} className="min-h-12 w-full rounded-xl bg-te px-5 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-te/30 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? t.auth.common.loading : t.auth.resetPassword.submit}</button></form>;
}
