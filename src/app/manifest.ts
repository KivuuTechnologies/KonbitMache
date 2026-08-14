import type { MetadataRoute } from 'next';
import { translations } from '@/shared/i18n/translations';
import { toSupportedLocale, LOCALE_COOKIE } from '@/shared/i18n/locale';
import { cookies, headers } from 'next/headers';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const acceptLanguage = (await headers()).get('accept-language');
  const locale = toSupportedLocale(cookieLocale ?? acceptLanguage) ?? 'es';
  const t = translations[locale] ?? translations.es;
  return {
    name: 'KonbitMache',
    short_name: 'KonbitMache',
    description: t.site?.description ?? 'KonbitMache',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f3ea',
    theme_color: '#2e7d32',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
