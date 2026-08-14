import { SUPPORTED_LOCALES, type Locale } from './types';

export const LOCALE_COOKIE = 'konbit-language';

export function toSupportedLocale(value: string | null | undefined): Locale | undefined {
  if (!value) return undefined;

  const normalized = value
    .toLowerCase()
    .trim()
    .split(/[;,]/)[0]
    .split('-')[0];
  const locale = normalized as Locale;

  return SUPPORTED_LOCALES.includes(locale) ? locale : undefined;
}

export function detectLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return 'ht';

  const candidates = acceptLanguage
    .split(',')
    .map((lang) => lang.trim().split(';')[0].trim())
    .filter((lang) => lang.length > 0);

  for (const candidate of candidates) {
    const locale = toSupportedLocale(candidate);
    if (locale) return locale;
  }

  return 'ht';
}
