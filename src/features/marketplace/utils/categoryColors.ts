import type { CategoryKey } from '@/shared/i18n/types';

/**
 * Category color mapping for badges. Deliberately uses the semantic family
 * colors (fey/dlo/soley/animal) instead of the CTA accent, so the orange is
 * reserved for interactive elements only. Pale tint as background, dark text
 * from the same family per the contrast guide
 */
export function categoryBadgeClasses(category: CategoryKey): string {
  switch (category) {
    case 'fruits':
    case 'grains':
    case 'spices':
      return 'bg-soley/10 text-soley';
    case 'vegetables':
    case 'seeds':
    case 'fertilizers':
      return 'bg-fey/10 text-fey';
    case 'livestock':
    case 'coffee':
      return 'bg-animal-bg text-animal';
    case 'drones':
    case 'irrigation':
    case 'agricultural_services':
      return 'bg-dlo/10 text-dlo';
    case 'tools':
    case 'agricultural_equipment':
    case 'machinery':
      return 'bg-muted/10 text-muted';
    default:
      return 'bg-muted/10 text-muted';
  }
}
