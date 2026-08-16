import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';
import { defaultLocale, isLocale, locales } from './src/i18n/config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { logError } from './utils/logger/server';

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get('konbit-language')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const urlLocale = request.nextUrl.searchParams.get('lang');
  if (urlLocale && isLocale(urlLocale)) {
    return urlLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const matchedLocale = matchLocale(languages, locales, defaultLocale);

  return matchedLocale;
}

export async function middleware(request: NextRequest) {
   try {
     const pathname = request.nextUrl.pathname;

     const pathnameIsMissingLocale = locales.every(
       (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
     );

     if (pathnameIsMissingLocale) {
       const locale = getLocale(request);
       const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
       redirectUrl.search = request.nextUrl.search;
       const response = NextResponse.redirect(redirectUrl, 307);
       response.cookies.set('konbit-language', locale, {
         maxAge: 60 * 60 * 24 * 365,
         path: '/',
         sameSite: 'lax',
       });
       return response;
     }

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

     return await updateSession(request);
   } catch (error) {
     logError('[Middleware] Error:', error);
     return NextResponse.next({ request });
   }
 }

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
