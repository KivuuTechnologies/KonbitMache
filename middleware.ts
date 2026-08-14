import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';
import { defaultLocale, isLocale, locales } from './src/i18n/config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  // Check if there's a cookie with the preferred locale
  const cookieLocale = request.cookies.get('konbit-language')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Check if there's a locale in the URL query param
  const urlLocale = request.nextUrl.searchParams.get('lang');
  if (urlLocale && isLocale(urlLocale)) {
    return urlLocale;
  }

  // Detect from Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const matchedLocale = matchLocale(languages, locales, defaultLocale);

  return matchedLocale;
}

export async function middleware(request: NextRequest) {
   try {
     const pathname = request.nextUrl.pathname;

     // Check if there is any supported locale in the pathname
     const pathnameIsMissingLocale = locales.every(
       (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
     );

     // Redirect if there is no locale
     if (pathnameIsMissingLocale) {
       const locale = getLocale(request);
       const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
       // Preserve query params (auth callback tokens, etc.) across the redirect
       redirectUrl.search = request.nextUrl.search;
       const response = NextResponse.redirect(redirectUrl, 307);
       response.cookies.set('konbit-language', locale, {
         maxAge: 60 * 60 * 24 * 365,
         path: '/',
         sameSite: 'lax',
       });
       return response;
     }

     // Update the cookie if the URL has a different locale
     const urlLocale = pathname.split('/')[1];
     if (urlLocale && isLocale(urlLocale)) {
       const cookieLocale = request.cookies.get('konbit-language')?.value;
       if (cookieLocale !== urlLocale) {
         const response = await updateSession(request);
         response.cookies.set('konbit-language', urlLocale, {
           maxAge: 60 * 60 * 24 * 365,
           path: '/',
           sameSite: 'lax',
         });
         return response;
       }
     }

     // Continue with Supabase middleware
     return await updateSession(request);
   } catch (error) {
     console.error('[Middleware] Error:', error);
     return NextResponse.next({ request });
   }
 }

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
