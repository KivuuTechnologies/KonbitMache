import { Apple, Beaker, Beef, Coffee, Cog, Droplets, Drone, Leaf, LeafyGreen, Sprout, Tractor, Users, Wheat, Wrench } from 'lucide-react';
import type { CategoryKey } from '@/shared/i18n/types';

const icons: Record<CategoryKey, typeof Apple> = {
  fruits: Apple,
  grains: Wheat,
  vegetables: LeafyGreen,
  coffee: Coffee,
  livestock: Beef,
  spices: Leaf,
  seeds: Sprout,
  tools: Wrench,
  agricultural_equipment: Tractor,
  machinery: Cog,
  drones: Drone,
  fertilizers: Beaker,
  irrigation: Droplets,
  agricultural_services: Users,
};

export function CategoryIcon({ category, className = 'h-5 w-5' }: { category: CategoryKey; className?: string }) {
  const Icon = icons[category] ?? Sprout;
  return <Icon className={className} aria-hidden="true" />;
}
