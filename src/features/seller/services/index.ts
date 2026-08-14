/**
 * Seller Portal service layer - server-side only
 * Uses next-headers via createClient - so it must never be imported from
 * 'use client' components - Product reads happen in Server Component pages
 * and pass data down as props
 */

import * as profileServiceImpl from './profile.service';
import * as notificationsServiceImpl from './notifications.service';
import * as dashboardServiceImpl from './dashboard.service';
import { mockActivity, mockSellerStats, mockNotifications } from './mocks';

import type {
  SellerProfile,
  Product,
  ProductModeration,
  SellerStats,
  Activity,
  Notification,
  ProfileFormData,
} from '../types';

export const sellerService = {
  async getProfile(): Promise<SellerProfile> {
    return profileServiceImpl.getCurrentProfile();
  },
  async getStats(): Promise<SellerStats> {
    return mockSellerStats;
  },
  async getActivity(): Promise<Activity[]> {
    return [...mockActivity];
  },
  async updateProfile(data: ProfileFormData): Promise<SellerProfile> {
    return profileServiceImpl.updateProfile(data);
  },
};

export const dashboardService = {
  /** Real product counters + views-contacts - null when tracking tables missing */
  async getStats(userId: string): Promise<SellerStats> {
    return dashboardServiceImpl.getStats(userId);
  },
  /** Activity feed derived from real products - published - updated events */
  async getActivity(userId: string): Promise<Activity[]> {
    return dashboardServiceImpl.getActivity(userId);
  },
  /** All active products for the seller - newest first */
  async getActiveProducts(userId: string): Promise<Product[]> {
    return dashboardServiceImpl.getActiveProducts(userId);
  },
  /** Latest moderation record per product - keyed by product_id */
  async getProductModerations(productIds: string[]): Promise<Record<string, ProductModeration>> {
    return dashboardServiceImpl.getProductModerations(productIds);
  },
};

export const productService = {
  /** Returns all products for the currently authenticated seller */
  async getProducts(): Promise<Product[]> {
    // Dynamic import keeps next-headers out of the client bundle
    const [{ hasSupabaseEnvironment }, { createClient }] = await Promise.all([
      import('../../../../utils/supabase/env'),
      import('../../../../utils/supabase/server'),
    ]);
    if (!hasSupabaseEnvironment()) return [];

    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;
    if (!userId) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', userId)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data as Product[];
  },

  /** Returns a single product by id, scoped to the authenticated seller */
  async getProductById(id: string): Promise<Product | null> {
    const [{ hasSupabaseEnvironment }, { createClient }] = await Promise.all([
      import('../../../../utils/supabase/env'),
      import('../../../../utils/supabase/server'),
    ]);
    if (!hasSupabaseEnvironment()) return null;

    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;
    if (!userId) return null;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('seller_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as Product;
  },
};

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    return [...mockNotifications].sort(
      (a, b) => b.fecha.localeCompare(a.fecha)
    );
  },
  async getUnreadCount(): Promise<number> {
    return notificationsServiceImpl.getUnreadCount();
  },
  async markAsRead(id: string): Promise<void> {
    return notificationsServiceImpl.markAsRead(id);
  },
  async markAllAsRead(): Promise<void> {
    return notificationsServiceImpl.markAllAsRead();
  },
};

// Keep namespace exports for code that imports them directly
export { notificationsServiceImpl as notificationsService };
export { profileServiceImpl as profileService };