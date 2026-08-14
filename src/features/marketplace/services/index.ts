/**
 * Marketplace public service - reads data from Supabase WITHOUT authentication
 * Used exclusively by Server Components on the public-facing Landing pages
 *
 * Requires the RLS policy 'Public can read active products'
 * - status = active - TO anon - for product queries to return data
 */

import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import type { Product } from '../../seller/types';

const PAGE_LIMIT = 60;

export interface PublicProduct extends Product {
  /** Seller WhatsApp from profiles-whatsapp - null if not set */
  seller_whatsapp: string | null;
  /** Seller phone from profiles-phone - null if not set */
  seller_phone: string | null;
  /** Seller public location from profiles-department - profiles-commune - null if not set */
  seller_location?: {
    department: string | null;
    commune: string | null;
  };
}

export async function getPublicProducts(category?: string | null): Promise<PublicProduct[]> {
  if (!hasSupabaseEnvironment()) return [];

  // Anonymous client - no session cookies - avoids JWT issued at future errors
  // from server-side session tokens and uses the anon RLS policy
  const { createClient } = await import('@supabase/supabase-js');
  const { url, publishableKey } = await import('../../../../utils/supabase/env').then(
    (m) => m.getSupabaseEnvironment()
  );
  const supabase = createClient(url, publishableKey);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase.from('products') as any)
    .select(
      'id, seller_id, name, description, category, price, unit, quantity, image_url, image_urls, status, name_translations, desc_translations, source_locale, created_at, updated_at'
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(PAGE_LIMIT);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getPublicProducts] Supabase error:', error.message);
    return [];
  }

  const products = (data ?? []) as Product[];

  // Seller contact info is fetched in a second pass because the anon RLS
  // policy on products does not expose profiles via a join
  const sellerIds = [...new Set(products.map((p) => p.seller_id))];
  const contactBySeller = new Map<string, { phone: string | null; whatsapp: string | null }>();
  const locationBySeller = new Map<string, { department: string | null; commune: string | null }>();

  if (sellerIds.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profiles, error: profError } = await (supabase.from('profiles') as any)
      .select('id, phone, whatsapp, department, commune')
      .in('id', sellerIds);

    if (!profError && profiles) {
      for (const p of profiles as { id: string; phone: string | null; whatsapp: string | null; department: string | null; commune: string | null }[]) {
        contactBySeller.set(p.id, { phone: p.phone ?? null, whatsapp: p.whatsapp ?? null });
        locationBySeller.set(p.id, { department: p.department ?? null, commune: p.commune ?? null });
      }
    } else if (profError) {
      console.error('[getPublicProducts] profiles query error:', profError.message);
    }
  }

  return products.map((row) => {
    const contact = contactBySeller.get(row.seller_id);
    const location = locationBySeller.get(row.seller_id);
    return {
      ...row,
      seller_whatsapp: contact?.whatsapp ?? null,
      seller_phone: contact?.phone ?? null,
      seller_location: location
        ? { department: location.department, commune: location.commune }
        : undefined,
    };
  });
}

/**
 * Top farmers - the 3 sellers with the most active products
 * Tie-breaking favours the seller who published their latest product first
 * Uses two queries - products count + profiles - merged in JS because the
 * Supabase JS client v2 does not support GROUP BY directly
 */
export interface TopSeller {
  id: string;
  full_name: string | null;
  business_name: string | null;
  seller_type: 'farmer' | 'cooperative' | 'company';
  department: string | null;
  commune: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  active_product_count: number;
  /** ISO timestamp of profile creation for tiebreaking */
  created_at: string;
}

export async function getTopSellers(limit = 3): Promise<TopSeller[]> {
  if (!hasSupabaseEnvironment()) return [];

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { url, publishableKey } = await import('../../../../utils/supabase/env').then((m) => m.getSupabaseEnvironment());
    const supabase = createClient(url, publishableKey);

    const { data, error } = await supabase.rpc('get_top_sellers', { p_limit: limit });

    if (error) {
      console.error('[getTopSellers] RPC error:', error.message);
      return [];
    }

    if (!data) return [];

    return data as TopSeller[];
  } catch (err) {
    console.error('[getTopSellers] unexpected error:', err);
    return [];
  }
}

export interface MarketplaceDepartmentStat {
  /** Department name as stored in profiles-department - e.g. Artibonite */
  name: string;
  /** Number of active sellers of the requested type in that department */
  count: number;
}

/**
 * Contract of the future public RPC get_public_marketplace_stats
 * The RPC is a SECURITY DEFINER function in Supabase that returns ONLY
 * aggregates - never individual profile rows - so profiles RLS stays
 * closed to the anon role
 *
 * cooperatives and companies are optional - the RPC returns them once
 * those counters exist - Consumers must not display them when absent
 */
export interface MarketplaceStats {
  farmers: number;
  cooperatives?: number;
  companies?: number;
  departments: MarketplaceDepartmentStat[];
  interested?: number;
}

/**
 * Fetches the unique interested visitor count for a specific product
 * Uses the public RPC that returns COUNT-DISTINCT visitor_id
 */
export async function getProductInterestCount(productId: string): Promise<number | null> {
  if (!hasSupabaseEnvironment() || !productId) return null;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { url, publishableKey } = await import('../../../../utils/supabase/env').then(
      (m) => m.getSupabaseEnvironment()
    );
    const supabase = createClient(url, publishableKey);

    const { data, error } = await supabase.rpc('get_product_interest_count', {
      p_product_id: productId,
    });

    if (error) {
      // RPC might not exist if migration has not run
      if (error.code === 'PGRST202' || error.message?.includes('function')) {
        return null;
      }
      console.error('[getProductInterestCount] RPC error:', error.message);
      return null;
    }
    return data as number ?? null;
  } catch (err) {
    console.error('[getProductInterestCount] unexpected error:', err);
    return null;
  }
}

/**
 * Fetches the unique interested visitor count for a specific seller
 * Uses the public RPC that returns COUNT-DISTINCT visitor_id
 */
export async function getSellerInterestCount(sellerId: string): Promise<number | null> {
  if (!hasSupabaseEnvironment() || !sellerId) return null;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { url, publishableKey } = await import('../../../../utils/supabase/env').then(
      (m) => m.getSupabaseEnvironment()
    );
    const supabase = createClient(url, publishableKey);

    const { data, error } = await supabase.rpc('get_seller_interest_count', {
      p_seller_id: sellerId,
    });

    if (error) {
      // RPC might not exist if migration has not run
      if (error.code === 'PGRST202' || error.message?.includes('function')) {
        return null;
      }
      console.error('[getSellerInterestCount] RPC error:', error.message);
      return null;
    }
    return data as number ?? null;
  } catch (err) {
    console.error('[getSellerInterestCount] unexpected error:', err);
    return null;
  }
}