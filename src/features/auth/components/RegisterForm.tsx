'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signInWithGoogleAction, signUpAction } from '@/features/auth/actions/auth';
import { getAuthValidationMessage } from '@/lib/auth/errors';
import { registerSchema, type RegisterInput } from '@/schemas/auth';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { AuthDivider } from './AuthDivider';
import { AuthInput } from './AuthInput';
import { GoogleAuthButton } from './GoogleAuthButton';
import type { Locale } from '@/i18n/config';

interface RegisterFormProps {
  locale: Locale;
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' }, shouldFocusError: true });

  function submit(values: RegisterInput) {
    startTransition(async () => {
      const result = await signUpAction({ ...values, locale });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(`/${locale}/auth/confirmacion`);
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

  const error = (field: keyof RegisterInput) => {
    const key = form.formState.errors[field]?.message;
    return key ? getAuthValidationMessage(locale, key) : undefined;
  };

  return <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-3"><GoogleAuthButton label={t.auth.common.continueWithGoogle} disabled={isPending} onClick={signInWithGoogle} /><AuthDivider label={t.auth.common.or} /><AuthInput id="fullName" label={t.auth.common.fullName} type="text" autoComplete="name" disabled={isPending} registration={form.register('fullName')} error={error('fullName')} /><AuthInput id="email" label={t.auth.common.email} type="email" inputMode="email" autoComplete="email" disabled={isPending} registration={form.register('email')} error={error('email')} /><AuthInput id="password" label={t.auth.common.password} type="password" autoComplete="new-password" disabled={isPending} registration={form.register('password')} error={error('password')} /><AuthInput id="confirmPassword" label={t.auth.common.confirmPassword} type="password" autoComplete="new-password" disabled={isPending} registration={form.register('confirmPassword')} error={error('confirmPassword')} /><button type="submit" disabled={isPending} className="min-h-11 w-full rounded-xl bg-te px-5 text-base font-extrabold text-white dark:text-background transition hover:bg-accent-strong focus:outline-none focus:ring-4 focus:ring-te/30 disabled:cursor-not-allowed disabled:opacity-60">{isPending ? t.auth.common.loading : t.auth.register.submit}</button><p className="text-center text-sm text-foreground/75">{t.auth.register.hasAccount} <Link href={`/${locale}/login`} className="font-extrabold text-dlo hover:underline">{t.auth.register.signIn}</Link></p></form>;
}
