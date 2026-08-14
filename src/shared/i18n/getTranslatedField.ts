/**
 * Resolves a translated string from a product translation map
 *
 * Priority order:
 *   1. translations[locale]       - exact match for the current UI locale
 *   2. translations[sourceLocale] - the language the seller wrote in
 *   3. fallback                   - the raw DB value (name / description)
 *
 * Step 2 uses the known source locale, NOT an arbitrary available translation
 * This avoids showing, e.g., Spanish content to an English-speaking buyer
 * simply because Spanish happens to be populated but English is not yet ready
 *
 * The UI NEVER shows undefined, null, or [object Object]
 *
 * @param translations  The jsonb translation map from the DB row
 * @param locale        The current UI locale (buyer's chosen language)
 * @param sourceLocale  The locale the seller used when creating the product
 *                      Pass null/undefined when unknown (pre-migration products)
 * @param fallback      The original DB value to use when all else fails
 *
 * @example
 *   // Seller wrote in ht, buyer reads in en, no EN translation yet
 *   getTranslatedField({ ht: 'Kafe mòn' }, 'en', 'ht', 'Kafe mòn')
 *   // -> 'Kafe mòn'  (falls back to source_locale = ht, then to original)
 *
 * @example
 *   // Translation exists for buyer's locale
 *   getTranslatedField({ ht: 'Kafe mòn', en: 'Mountain Coffee' }, 'en', 'ht', 'Kafe mòn')
 *   // -> 'Mountain Coffee'
 */
export function getTranslatedField(
  translations: Record<string, string | undefined | null> | null | undefined,
  locale: string,
  sourceLocale: string | null | undefined,
  fallback: string
): string {
  if (!translations || typeof translations !== 'object') return fallback;

  // 1. Exact locale match - the buyer's current language
  const exact = translations[locale];
  if (exact && typeof exact === 'string' && exact.trim() !== '') return exact;

  // 2. Source locale - the language the seller originally used
  if (sourceLocale && sourceLocale !== locale) {
    const src = translations[sourceLocale];
    if (src && typeof src === 'string' && src.trim() !== '') return src;
  }

  // 3. Original DB value - always a safe non-empty string
  return fallback;
}
