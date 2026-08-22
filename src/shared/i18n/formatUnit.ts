import type { UnitSlug } from './types';

/**
 * Format a quantity with its localized unit, handling singular/plural
 *
 * Slugs are stored verbatim in products.unit (e.g. 'bag') and are never
 * translated in the DB. This helper picks the correct localized label based
 * on the current locale and the quantity:
 *
 *   1 bolsa   (quantity === 1  - singular label)
 *   10 bolsas (quantity !== 1  - plural label)
 *
 * Locale-aware pluralization rule:
 *   - ht:  no plural inflection - singular label is always used
 *   - fr, es, en: quantity === 1 uses singular, otherwise plural
 *
 * @param quantity  The product quantity (should be >= 1)
 * @param unitSlug  The stable unit slug stored in products.unit
 * @param units     Localized singular labels (t.units)
 * @param unitsPlural Localized plural labels (t.unitsPlural)
 * @param locale    The active locale code
 */
export function formatUnit(
  quantity: number,
  unitSlug: string,
  units: Record<UnitSlug, string>,
  unitsPlural: Record<UnitSlug, string>,
  locale: string,
): string {
  const slug = unitSlug as UnitSlug;
  const singular = units[slug] ?? unitSlug;
  const plural = unitsPlural[slug] ?? unitSlug;

  // Kreyòl does not inflect for plural - always use the singular label
  if (locale === 'ht') return singular;

  return quantity === 1 ? singular : plural;
}