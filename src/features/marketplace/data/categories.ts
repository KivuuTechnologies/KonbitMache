// Product category slugs shared by browser UI and server validation
// Keep this module dependency-free so category navigation never loads Zod
export const ALLOWED_CATEGORIES = [
  'fruits', 'grains', 'vegetables', 'coffee', 'livestock', 'spices', 'seeds',
  'fertilizers', 'tools', 'agricultural_equipment', 'machinery', 'drones',
  'irrigation', 'agricultural_services',
] as const;

export type CategorySlug = (typeof ALLOWED_CATEGORIES)[number];
