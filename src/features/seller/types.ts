import type { UserLocale } from '../../../utils/supabase/types';

/**
 * Seller domain contracts
 *
 * Single source of truth for the Seller Portal frontend
 * Field names match the real Supabase `public.profiles` columns exactly
 * All legacy Spanish names have been removed
 */

/* Profile*/


export const SELLER_TYPES = ['farmer'] as const;
export type SellerType = (typeof SELLER_TYPES)[number];

export const PROFILE_STATUSES = ['incomplete', 'active', 'suspended'] as const;
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

/** Haiti departments - value strings match DB enum */
export const HAITI_DEPARTMENTS = [
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
] as const;
export type HaitiDepartment = (typeof HAITI_DEPARTMENTS)[number];

/**
 * Mirrors the definitive `public.profiles` row for a seller
 * Field names match the database columns exactly (snake_case)
 */
export interface SellerProfile {
  id: string;
  full_name: string;
  seller_type?: SellerType;
  business_name?: string | null;
  department?: string;
  commune?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  avatar_url?: string | null;
  preferred_language: UserLocale;
  profile_status: ProfileStatus;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

/** Editable subset of a profile submitted from the Profile form */
export interface ProfileFormData {
  full_name: string;
  seller_type: SellerType;
  business_name?: string;
  department: string;
  commune?: string;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Matches the real `products` table status values exactly
 * DB: active | paused | sold_out
 */
export const PRODUCT_STATUSES = ['active', 'paused', 'sold_out'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

/**
 * Shape of the jsonb translation columns added to `public.products`
 * Keys are locale codes; values are the translated strings
 * An empty object `{}` means no translations exist yet - use the original
 * `name` / `description` as fallback
 */
export interface ProductTranslations {
  [locale: string]: string | undefined;
  ht?: string;
  fr?: string;
  es?: string;
  en?: string;
}

/**
 * Mirrors the `public.products` row - field names match DB columns exactly
 */
export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  /**
   * Legacy single-image field - kept for backwards compatibility with products
   * that existed before the multi-image migration - Do NOT use for new writes
   * Read image_urls[0] instead for the primary image
   */
  image_url?: string | null;
  /**
   * Multi-image array - the authoritative field for all images going forward
   * index 0 = primary/thumbnail image
   * Max 5 entries enforced by DB constraint products_image_urls_max_5
   * Migrated products from image_url already have image_urls populated
   */
  image_urls: string[];
  status: ProductStatus;
  /**
   * The locale in which the seller originally wrote name/description
   * Used as the first fallback when a translation for the requested locale
   * does not exist yet - NULL for products created before this column existed
   */
  source_locale: string | null;
  /** jsonb: locale -> translated name - Empty object when no translations exist */
  name_translations: ProductTranslations;
  /** jsonb: locale -> translated description - Empty object when no translations exist */
  desc_translations: ProductTranslations;
  created_at: string;
  updated_at: string;
}

/** Subset submitted from the product form (no seller_id - server derives it) */
export interface ProductFormData {
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  /** Legacy single image URL - kept so existing edit forms compile */
  image_url?: string;
  /** Multi-image URLs - authoritative for new products - Optional in form, required in Product */
  image_urls?: string[];
  status: ProductStatus;
}

/* -------------------------------------------------------------------------- */
/* Moderation                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Mirrors a `product_moderation` row - a product withdrawn from the
 * marketplace by an admin - Matches the DB columns exactly
 */
export interface ProductModeration {
  id: string;
  product_id: string;
  admin_id: string | null;
  action: string;
  reason: string;
  created_at: string;
}

/* -------------------------------------------------------------------------- */
/* Activity                                                                   */
/* -------------------------------------------------------------------------- */export const ACTIVITY_TYPES = [
  'producto_publicado',
  'producto_editado',
  'producto_pausado',
  'producto_activado',
  'producto_retirado',
  'perfil_actualizado',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export interface Activity {
  id: string;
  tipo: ActivityType;
  /** Product display name - used to build the localized sentence in the UI */
  productName?: string;
  /** Legacy free-text description - Kept for backwards compatibility */
  descripcion: string;
  fecha: string;
}

/* -------------------------------------------------------------------------- */
/* Notifications                                                              */
/* -------------------------------------------------------------------------- */

export const NOTIFICATION_TYPES = [
  'contacto',
  'producto_vendido',
  'perfil',
  'sistema',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  contenido: string;
  leido: boolean;
  fecha: string;
}

/* -------------------------------------------------------------------------- */
/* Aggregated stats                                                           */
/* -------------------------------------------------------------------------- */

export interface SellerStats {
  /** Number of active products */
  productos_activos: number;
  /** Number of paused products */
  productos_pausados: number;
  /** Number of out-of-stock products */
  productos_agotados: number;
  /**
   * Total profile/listing views
   * `null` = the tracking table does not exist yet (not the same as 0)
   */
  visualizaciones: number | null;
  /**
   * Total contacts received
   * `null` = the tracking table does not exist yet (not the same as 0)
   */
  contactos_recibidos: number | null;
  /**
   * Unique interested visitors (contacted via WhatsApp or Phone)
   * `null` = the tracking table does not exist yet (not the same as 0)
   */
  visitantes_interesados: number | null;
}
