import { hasSupabaseEnvironment, getSupabaseEnvironment } from '../../../../utils/supabase/env';
import { logError } from '@/utils/logger/server';
import type { Product } from '../../seller/types';

const PAGE_LIMIT = 60;

export interface PublicProduct extends Product {
  seller_whatsapp: string | null;
  seller_phone: string | null;
  seller_location?: {
    department: string | null;
    commune: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

type AnonSupabaseClient = Awaited<
  ReturnType<typeof import('@supabase/supabase-js').createClient>
>;

async function createAnonSupabaseClient(): Promise<AnonSupabaseClient | null> {
  if (!hasSupabaseEnvironment()) return null;
  const { createClient } = await import('@supabase/supabase-js');
  const { url, publishableKey } = getSupabaseEnvironment();
  return createClient(url, publishableKey);
}

function isRpcMissing(error: { code?: string; message?: string }): boolean {
  return error.code === 'PGRST202' || !!error.message?.includes('function');
}

async function fetchInterestCountRpc(
  supabase: AnonSupabaseClient,
  rpcName: 'get_product_interest_count' | 'get_seller_interest_count',
  idParam: string,
  idValue: string,
): Promise<number | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)(rpcName, {
      [idParam]: idValue,
    });

    if (error) {
      if (isRpcMissing(error)) return null;
      logError(`[marketplace] ${rpcName} RPC error:`, error.message);
      return null;
    }
    return (data as number) ?? null;
  } catch (err) {
    logError(`[marketplace] ${rpcName} unexpected error:`, err);
    return null;
  }
}

export async function getPublicProducts(
  category?: string | null,
): Promise<PublicProduct[]> {
  if (!hasSupabaseEnvironment()) return [];

  const supabase = await createAnonSupabaseClient();
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select(
      'id, seller_id, name, description, category, price, unit, quantity, image_url, image_urls, status, name_translations, desc_translations, source_locale, created_at, updated_at',
    )
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(PAGE_LIMIT);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    logError('[getPublicProducts] Supabase error:', error.message);
    return [];
  }

  const products = (data ?? []) as Product[];

  const sellerIds = [...new Set(products.map((p) => p.seller_id))];
  const contactBySeller = new Map<
    string,
    { phone: string | null; whatsapp: string | null }
  >();
  const locationBySeller = new Map<
    string,
    { department: string | null; commune: string | null }
  >();

  if (sellerIds.length > 0) {
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id, phone, whatsapp, department, commune')
      .in('id', sellerIds);

    if (!profError && profiles) {
      for (const p of profiles as {
        id: string;
        phone: string | null;
        whatsapp: string | null;
        department: string | null;
        commune: string | null;
      }[]) {
        contactBySeller.set(p.id, {
          phone: p.phone ?? null,
          whatsapp: p.whatsapp ?? null,
        });
        locationBySeller.set(p.id, {
          department: p.department ?? null,
          commune: p.commune ?? null,
        });
      }
    } else if (profError) {
      logError('[getPublicProducts] profiles query error:', profError.message);
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
  created_at: string;
}

export async function getTopSellers(limit = 3): Promise<TopSeller[]> {
  if (!hasSupabaseEnvironment()) return [];

  try {
    const supabase = await createAnonSupabaseClient();
    if (!supabase) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('get_top_sellers', {
      p_limit: limit,
    });

    if (error) {
      logError('[getTopSellers] RPC error:', error.message);
      return [];
    }

    if (!data) return [];

    return data as TopSeller[];
  } catch (err) {
    logError('[getTopSellers] unexpected error:', err);
    return [];
  }
}

export interface MarketplaceDepartmentStat {
  name: string;
  count: number;
}

export interface MarketplaceStats {
  farmers: number;
  cooperatives?: number;
  companies?: number;
  departments: MarketplaceDepartmentStat[];
  interested?: number;
}

export async function getPublicMarketplaceStats(): Promise<MarketplaceStats | null> {
  if (!hasSupabaseEnvironment()) return null;

  try {
    const supabase = await createAnonSupabaseClient();
    if (!supabase) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('get_public_marketplace_stats');

    if (error || !data) return null;
    if (typeof data.farmers !== 'number' || !Array.isArray(data.departments))
      return null;

    return data as MarketplaceStats;
  } catch {
    return null;
  }
}

export async function getProductInterestCount(
  productId: string,
): Promise<number | null> {
  if (!hasSupabaseEnvironment() || !productId) return null;
  const supabase = await createAnonSupabaseClient();
  if (!supabase) return null;
  return fetchInterestCountRpc(
    supabase,
    'get_product_interest_count',
    'p_product_id',
    productId,
  );
}

export async function getSellerInterestCount(
  sellerId: string,
): Promise<number | null> {
  if (!hasSupabaseEnvironment() || !sellerId) return null;
  const supabase = await createAnonSupabaseClient();
  if (!supabase) return null;
  return fetchInterestCountRpc(
    supabase,
    'get_seller_interest_count',
    'p_seller_id',
    sellerId,
  );
}
