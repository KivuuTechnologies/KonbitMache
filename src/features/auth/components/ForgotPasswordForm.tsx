'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { requestPasswordResetAction } from '@/features/auth/actions/auth';
import { getAuthValidationMessage } from '@/lib/auth/errors';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/schemas/auth';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { AuthInput } from './AuthInput';
import type { Locale } from '@/i18n/config';

interface ForgotPasswordFormProps {
  locale: Locale;
}

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' }, shouldFocusError: true });

  function submit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await requestPasswordResetAction({ ...values, locale });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset();
    });
  }

  const error = form.formState.errors.email?.message;
  return <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5"><AuthInput id="email" label={t.auth.common.email} type="email" inputMode="email" autoComplete="email" disabled={isPending} registration={form.register('email')} error={error ? getAuthValidationMessage(locale, error) : undefined} /><button type="submit" disabled={isPending} className="min-h-12 w-full rounded-xl bg-te px-5 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-te/30 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? t.auth.common.loading : t.auth.forgotPassword.submit}</button></form>;
}
