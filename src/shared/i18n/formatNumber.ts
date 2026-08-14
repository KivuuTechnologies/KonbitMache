const SUPPORTED_LOCALES = ['es', 'en', 'fr', 'ht'];
const DEFAULT_LOCALE = 'es';

export function getSafeLocale(locale: string | undefined | null): string {
  if (!locale) return DEFAULT_LOCALE;

  const base = locale.split('-')[0].toLowerCase();

  if (SUPPORTED_LOCALES.includes(base)) return base;

  return DEFAULT_LOCALE;
}

export function formatCurrency(amount: number, locale: string): string {
  const safe = getSafeLocale(locale);
  try {
    return new Intl.NumberFormat(safe, { maximumFractionDigits: 2 }).format(amount);
  } catch {
    return amount.toFixed(2);
  }
}

export function formatNumber(amount: number, locale: string): string {
  const safe = getSafeLocale(locale);
  try {
    return new Intl.NumberFormat(safe).format(amount);
  } catch {
    return String(amount);
  }
}
