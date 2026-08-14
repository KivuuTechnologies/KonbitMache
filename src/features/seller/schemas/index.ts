import { z } from 'zod';

/**
 * Allowed product category slugs - must match the CategoryKey type and
 * what the UI passes - These are English internal values - translated labels
 * are shown in the UI but never stored in the DB
 */
export const ALLOWED_CATEGORIES = [
  'fruits', 'grains', 'vegetables', 'coffee', 'livestock', 'spices', 'seeds',
  'fertilizers',
  'tools', 'agricultural_equipment', 'machinery', 'drones', 'irrigation',
  'agricultural_services',
] as const;

export type CategorySlug = (typeof ALLOWED_CATEGORIES)[number];

/**
 * Product schema - field names match the real public-products table columns
 * status values - active | paused | sold_out
 * price - numeric >= 0 - DB allows 0
 * quantity - numeric >= 0
 */
export const productSchema = z.object({
  name: z.string().trim().min(1, 'required').max(100, 'tooLong'),
  description: z.string().trim().max(500, 'tooLong').optional().or(z.literal('')),
  category: z.enum(ALLOWED_CATEGORIES),
  price: z.number().min(0, 'positiveNumber'),
  unit: z.string().min(1, 'required'),
  quantity: z.number().min(0, 'positiveNumber'),
  /** Legacy single image - optional - kept for compatibility */
  image_url: z.string().url('invalidUrl').optional().or(z.literal('')),
  /** Multi-image array - max 5 entries enforced by DB constraint */
  image_urls: z.array(z.string().url('invalidUrl')).max(5, 'tooManyImages').optional().transform((v) => v ?? []),
  status: z.enum(['active', 'paused', 'sold_out']),
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Profile Schema - uses real Supabase column names
 * No frecuencia_venta - sale_frequency - does not exist in DB
 * business_name is optional
 */
export const profileSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required').max(100, 'Name is too long'),
  seller_type: z.enum(['farmer', 'cooperative', 'company']),
  business_name: z.string().trim().max(100, 'Business name is too long').optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required'),
  commune: z.string().trim().max(50, 'Commune is too long').optional().or(z.literal('')),
  phone: z.string().trim().max(20, 'Phone is too long').optional().or(z.literal('')),
  whatsapp: z.string().trim().max(20, 'WhatsApp is too long').optional().or(z.literal('')),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
