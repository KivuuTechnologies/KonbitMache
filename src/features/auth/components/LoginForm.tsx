'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signInAction, signInWithGoogleAction } from '@/features/auth/actions/auth';
import { getAuthValidationMessage } from '@/lib/auth/errors';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { AuthDivider } from './AuthDivider';
import { AuthInput } from './AuthInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import type { Locale } from '@/i18n/config';

interface LoginFormProps {
  locale: Locale;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '', remember: true }, shouldFocusError: true });

  useEffect(() => {
    if (searchParams.get('auth_error')) toast.error(t.auth.errors.sessionExpired);
    if (searchParams.get('confirmed')) toast.success(t.auth.common.emailConfirmed);
  }, [searchParams, t.auth.errors.sessionExpired, t.auth.common.emailConfirmed]);

  function submit(values: LoginInput) {
    startTransition(async () => {
      const result = await signInAction({ ...values, locale });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.replace(result.redirectTo ?? `/${locale}/dashboard`);
    });
  }

  function signInWithGoogle() {
    startTransition(async () => {
      const result = await signInWithGoogleAction(locale);
      if ('url' in result) {
        window.location.href = result.url;
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-3"><GoogleAuthButton label={t.auth.common.continueWithGoogle} disabled={isPending} onClick={signInWithGoogle} /><AuthDivider label={t.auth.common.or} /><AuthInput id="email" label={t.auth.common.email} type="email" inputMode="email" autoComplete="email" disabled={isPending} registration={form.register('email')} error={emailError ? getAuthValidationMessage(locale, emailError) : undefined} /><AuthInput id="password" label={t.auth.common.password} type="password" autoComplete="current-password" disabled={isPending} registration={form.register('password')} error={passwordError ? getAuthValidationMessage(locale, passwordError) : undefined} /><label className="flex min-h-10 items-center gap-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-te" disabled={isPending} {...form.register('remember')} />{t.auth.common.rememberMe}</label><div className="flex flex-col gap-2"><button type="submit" disabled={isPending} className="min-h-11 rounded-xl bg-te px-5 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-te/30 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? t.auth.common.loading : t.auth.login.submit}</button><Link href={`/${locale}/forgot-password`} className="flex min-h-10 items-center justify-center rounded-xl text-sm font-bold text-dlo hover:underline">{t.auth.login.forgotPassword}</Link></div><p className="text-center text-sm text-foreground/75">{t.auth.login.noAccount} <Link href={`/${locale}/registro`} className="font-extrabold text-dlo hover:underline">{t.auth.login.createAccount}</Link></p></form>;
}
