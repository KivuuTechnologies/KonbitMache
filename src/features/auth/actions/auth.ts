'use server';

import { cookies } from 'next/headers';
import { getAuthErrorMessage, getAuthValidationMessage, translateSupabaseAuthError } from '@/lib/auth/errors';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, type ForgotPasswordInput, type LoginInput, type RegisterInput, type ResetPasswordInput } from '@/schemas/auth';
import { translations } from '@/shared/i18n/translations';
import type { Locale } from '@/shared/i18n/types';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';

import { getProfileDestination } from '@/lib/auth/redirect';

export type AuthActionResult = { ok: true; message: string; redirectTo?: string } | { ok: false; message: string };

type LocalizedInput<T> = T & { locale: Locale };
const REMEMBER_ME_COOKIE = 'konbit-remember';
const REMEMBERED_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 8;

function invalidInput(locale: Locale, issueMessage?: string): AuthActionResult {
  return { ok: false, message: getAuthValidationMessage(locale, issueMessage ?? 'required') };
}

function unavailable(locale: Locale): AuthActionResult {
  return { ok: false, message: getAuthErrorMessage(locale, 'generic') };
}

function getApplicationUrl(path: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
    || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
    || 'http://localhost:3000';
  return new URL(path, configuredUrl).toString();
}

export async function signInAction(input: LocalizedInput<LoginInput>): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return invalidInput(input.locale, parsed.error.issues[0]?.message);
  if (!hasSupabaseEnvironment()) return unavailable(input.locale);

  const sessionCookieMaxAge = parsed.data.remember
    ? REMEMBERED_SESSION_MAX_AGE
    : SESSION_MAX_AGE;
  const supabase = await createClient({ sessionCookieMaxAge });
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { ok: false, message: translateSupabaseAuthError(input.locale, error) };
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_ME_COOKIE, parsed.data.remember ? '1' : '0', {
    maxAge: sessionCookieMaxAge,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  let redirectTo = `/${input.locale}/dashboard`;

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_status, is_admin')
      .eq('id', userId)
      .maybeSingle();
    redirectTo = getProfileDestination(profile, input.locale);
  }

  return { ok: true, message: translations[input.locale].auth.login.success, redirectTo };
}

export async function signUpAction(input: LocalizedInput<RegisterInput>): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return invalidInput(input.locale, parsed.error.issues[0]?.message);
  if (!hasSupabaseEnvironment()) return unavailable(input.locale);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, preferred_language: input.locale },
      emailRedirectTo: getApplicationUrl(`/${input.locale}/auth/callback?next=/login`),
    },
  });

  if (error) return { ok: false, message: translateSupabaseAuthError(input.locale, error) };
  if (data.session) await supabase.auth.signOut();
  return { ok: true, message: translations[input.locale].auth.register.success };
}

export async function signInWithGoogleAction(locale: Locale): Promise<{ ok: true; url: string } | AuthActionResult> {
  if (!hasSupabaseEnvironment()) return unavailable(locale);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: getApplicationUrl(`/${locale}/auth/callback?next=/dashboard`) },
  });

  if (error || !data.url) return { ok: false as const, message: translateSupabaseAuthError(locale, error) };
  return { ok: true, url: data.url };
}

export async function requestPasswordResetAction(input: LocalizedInput<ForgotPasswordInput>): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return invalidInput(input.locale, parsed.error.issues[0]?.message);
  if (!hasSupabaseEnvironment()) return unavailable(input.locale);

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: getApplicationUrl(`/${input.locale}/auth/callback?next=/reset-password`),
  });

  if (error) return { ok: false, message: translateSupabaseAuthError(input.locale, error) };
  return { ok: true, message: translations[input.locale].auth.forgotPassword.success };
}

export async function resetPasswordAction(input: LocalizedInput<ResetPasswordInput>): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return invalidInput(input.locale, parsed.error.issues[0]?.message);
  if (!hasSupabaseEnvironment()) return unavailable(input.locale);

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) return { ok: false, message: translateSupabaseAuthError(input.locale, error) };
  return { ok: true, message: translations[input.locale].auth.resetPassword.success };
}

export async function signOutAction(locale: Locale): Promise<AuthActionResult> {
  if (!hasSupabaseEnvironment()) return unavailable(locale);

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, message: translateSupabaseAuthError(locale, error) };
  const cookieStore = await cookies();
  cookieStore.set(REMEMBER_ME_COOKIE, '', { maxAge: 0, path: '/' });
  return { ok: true, message: translations[locale].auth.dashboard.signedOut };
}

export async function savePreferredLocaleAction(locale: Locale) {
  if (!hasSupabaseEnvironment()) return;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return;

  await supabase.from('profiles').update({ preferred_language: locale }).eq('id', userId);
}
