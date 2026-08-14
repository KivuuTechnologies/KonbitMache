import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { getSupabaseEnvironment, hasSupabaseEnvironment } from './env';
import type { Database } from './types';
import { detectLocale, LOCALE_COOKIE, toSupportedLocale } from '../../src/shared/i18n/locale';

const REMEMBER_ME_COOKIE = 'konbit-remember';
const REMEMBERED_SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 8;

/**
 * Refreshes Supabase Auth cookies on requests. Do not add application logic
 * between createServerClient and getClaims: auth needs to control cookies
 */
export async function updateSession(request: NextRequest) {
  const initialLocale =
    toSupportedLocale(request.cookies.get(LOCALE_COOKIE)?.value) ??
    detectLocale(request.headers.get('accept-language'));

  if (!hasSupabaseEnvironment()) {
    const response = NextResponse.next({ request });
    response.cookies.set(LOCALE_COOKIE, initialLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  const { url, publishableKey } = getSupabaseEnvironment();
  let response = NextResponse.next({ request });
  const sessionCookieMaxAge = request.cookies.get(REMEMBER_ME_COOKIE)?.value === '1'
    ? REMEMBERED_SESSION_MAX_AGE
    : SESSION_MAX_AGE;

  const supabase = createServerClient<Database>(url, publishableKey, {
     cookieOptions: { maxAge: sessionCookieMaxAge },
     cookies: {
       getAll() {
         return request.cookies.getAll();
       },
       setAll(cookiesToSet) {
         cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
         response = NextResponse.next({ request });
         cookiesToSet.forEach(({ name, value, options }) =>
           response.cookies.set(name, value, options),
         );
       },
     },
   });

   let locale = initialLocale;
   try {
     const { data } = await supabase.auth.getClaims();
     const userId = data?.claims?.sub;

     if (userId) {
       const { data: profile } = await supabase
         .from('profiles')
         .select('preferred_language')
         .eq('id', userId)
         .maybeSingle();
       locale = toSupportedLocale(profile?.preferred_language) ?? initialLocale;
     }
   } catch (authError) {
     console.error('[updateSession] Auth error:', authError);
   }

  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
