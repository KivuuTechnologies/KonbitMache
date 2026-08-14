import { type NextRequest, NextResponse } from 'next/server';
import { LOCALE_COOKIE, toSupportedLocale } from '@/shared/i18n/locale';
import { createClient } from '../../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../../utils/supabase/env';

import { getProfileDestination } from '@/lib/auth/redirect';

type OtpType = 'email' | 'sms' | 'email_change' | 'recovery' | 'invite' | 'signup';

function getSafeNextPath(value: string | null, locale: string) {
  const safePath = value?.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
  if (!safePath.startsWith(`/${locale}/`)) {
    return `/${locale}${safePath.startsWith('/') ? '' : '/'}${safePath}`;
  }
  return safePath;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.pathname.split('/')[1] || 'ht';
  const params = request.nextUrl.searchParams;

  const loginUrl = new URL(`/${locale}/login?auth_error=sessionExpired`, request.url);
  const confirmedUrl = new URL(`/${locale}/login?confirmed=1`, request.url);
  if (!hasSupabaseEnvironment()) return NextResponse.redirect(loginUrl);

  const supabase = await createClient();

  // Link based flows (email confirmation, password recovery): GoTrue appends
  // `token_hash` + `type` to the redirect URL in the email
  const tokenHash = params.get('token_hash');
  if (tokenHash) {
    const type = (params.get('type') ?? 'email') as OtpType;
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (error) return NextResponse.redirect(loginUrl);

    if (type === 'recovery') {
      // Keep the session so the reset-password page can update the password
      return NextResponse.redirect(
        new URL(getSafeNextPath(params.get('next') ?? '/reset-password', locale), request.url)
      );
    }

    // Email confirmation — the user has no session on this browser yet
    await supabase.auth.signOut();
    return NextResponse.redirect(confirmedUrl);
  }

  const code = params.get('code');
  if (!code) return NextResponse.redirect(loginUrl);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(loginUrl);

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  const localeCookie = toSupportedLocale(request.cookies.get(LOCALE_COOKIE)?.value);

  if (userId) {
    if (localeCookie) {
      await supabase.from('profiles').update({ preferred_language: localeCookie }).eq('id', userId);
    }

    const nextParam = params.get('next');
    if (nextParam && nextParam.includes('reset-password')) {
      return NextResponse.redirect(new URL(getSafeNextPath(nextParam, locale), request.url));
    }

    // PKCE email confirmation: signUp redirects here with `next=/login`, meaning
    // the just-verified user must sign in explicitly with their password
    if (nextParam === '/login') {
      await supabase.auth.signOut();
      return NextResponse.redirect(confirmedUrl);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_status, is_admin')
      .eq('id', userId)
      .maybeSingle();

    const destination = getProfileDestination(profile, locale);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  const nextPath = getSafeNextPath(params.get('next'), locale);
  return NextResponse.redirect(new URL(nextPath, request.url));
}
