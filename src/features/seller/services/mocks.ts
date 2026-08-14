import type {
  SellerProfile,
  Product,
  SellerStats,
  Activity,
  Notification,
} from '../types';

export const mockSellerProfile: SellerProfile = {
  id: 'seller-1',
  full_name: '',
  seller_type: 'farmer',
  business_name: undefined,
  department: '',
  commune: undefined,
  phone: undefined,
  whatsapp: undefined,
  avatar_url: null,
  preferred_language: 'ht',
  profile_status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockProducts: Product[] = [];

export const CURRENT_SELLER_ID = 'seller-1';

export const mockSellerStats: SellerStats = {
  productos_activos: 0,
  productos_pausados: 0,
  productos_agotados: 0,
  visualizaciones: 0,
  contactos_recibidos: 0,
  visitantes_interesados: 0,
};

export const mockActivity: Activity[] = [];

export const mockNotifications: Notification[] = [];

// Stable English slugs stored in DB - match the Zod schema and CategoryKey type
export const productCategories = [
  'fruits',
  'grains',
  'vegetables',
  'coffee',
  'livestock',
  'spices',
  'seeds',
  'fertilizers',
  'tools',
  'agricultural_equipment',
  'machinery',
  'drones',
  'irrigation',
  'agricultural_services',
] as const;

// Simple text values stored in products.unit
export const productUnits = [
  'kg',
  'lb',
  'unit',
  'bag',
  'box',
  'liter',
  'ton',
] as const;

export const haitiDepartments = [
  'Artibonite',
  'Centre',
  "Grand'Anse",
  'Nippes',
  'Nord',
  'Nord-Est',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Est',
];