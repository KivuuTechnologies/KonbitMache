/**
 * Dashboard service - server-side only
 *
 * Returns REAL numbers from Supabase - Nothing here is mocked
 *  - Product counters come from the `products` table
 *  - Views / contacts come from the `product_views` / `product_contacts`
 *    tracking tables when they exist - When a tracking table is missing the
 *    metric is `null` (rendered as "-"), never a fake 0
 *  - Activity is derived from real `products.created_at` / `products.updated_at`
 *  - Interested visitors come from the secure RPC `get_seller_interest_count`
 *    which returns COUNT(DISTINCT visitor_id) from product_interactions
 *
 * Only products-activity failures throw (so the UI can show an error state)
 * a missing tracking table never throws - it degrades to `null`
 */

import type { Activity, Product, ProductModeration, SellerStats } from '../types';

// Type-only import - erased at build time - keeps next-headers out of bundles
import type { createClient as createServerClient } from '../../../../utils/supabase/server';
import { createSupabaseOrNull, isRelationMissing, RELATION_MISSING_CODES } from '../../../../utils/supabase/client-helpers';

type ServerClient = Awaited<ReturnType<typeof createServerClient>>;

const EMPTY_STATS: SellerStats = {
  productos_activos: 0,
  productos_pausados: 0,
  productos_agotados: 0,
  visualizaciones: null,
  contactos_recibidos: null,
  visitantes_interesados: null,
};

/**
 * Counts rows of `table` where `column = value`
 * Returns `null` when the table does not exist - feature not migrated yet
 */
async function countWhere(
  supabase: ServerClient,
  table: string,
  column: string,
  value: string
): Promise<number | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count, error } = await (supabase.from(table) as any)
    .select('id', { count: 'exact', head: true })
    .eq(column, value);

  if (isRelationMissing(error)) return null;
  if (error) {
    console.error(`[dashboardService] count ${table} error:`, error.message);
    return null;
  }
  return count ?? 0;
}

/**
 * Fetches unique interested visitor count for a seller using the secure RPC
 * This avoids exposing the raw product_interactions table and only returns
 * the aggregate number - COUNT DISTINCT visitor_id
 */
async function getSellerInterestCountRpc(supabase: ServerClient, userId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('get_seller_interest_count', {
      p_seller_id: userId,
    });
    if (error) {
      // RPC might not exist if migration has not run
      if (error.code === 'PGRST202' || error.message?.includes('function')) {
        return null;
      }
      console.error('[dashboardService] get_seller_interest_count RPC error:', error.message);
      return null;
    }
    return data as number ?? null;
  } catch (err) {
    console.error('[dashboardService] get_seller_interest_count unexpected error:', err);
    return null;
  }
}

export async function getStats(userId: string): Promise<SellerStats> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return { ...EMPTY_STATS };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows, error } = await (supabase.from('products') as any)
    .select('status')
    .eq('seller_id', userId);

  if (error) {
    console.error('[dashboardService.getStats] products query error:', error.message);
    throw new Error('dashboard:products_load_failed');
  }

  let productos_activos = 0;
  let productos_pausados = 0;
  let productos_agotados = 0;

  for (const row of (rows ?? []) as { status: string }[]) {
    if (row.status === 'active') productos_activos += 1;
    else if (row.status === 'paused') productos_pausados += 1;
    else if (row.status === 'sold_out') productos_agotados += 1;
  }

  const [visualizaciones, contactos_recibidos, visitantes_interesados] = await Promise.all([
    countWhere(supabase, 'product_views', 'seller_id', userId),
    countWhere(supabase, 'product_contacts', 'seller_id', userId),
    getSellerInterestCountRpc(supabase, userId),
  ]);

  return {
    productos_activos,
    productos_pausados,
    productos_agotados,
    visualizaciones,
    contactos_recibidos,
    visitantes_interesados,
  };
}

/** Minimum gap - ms - between created_at and updated_at to surface an updated event */
const CREATED_UPDATED_GAP_MS = 60 * 1000;

/**
 * Activity feed derived from products for the seller
 * - Every product yields a published event at `created_at`
 * - If `updated_at` is meaningfully later than `created_at`, an updated
 *   event is added too - on the dashboard all `updated_at` changes come from
 *   explicit seller actions - edit - pause - activate - never background writes
 * - A product withdrawn by an admin surfaces a retirado event at the
 *   moderation time - so sellers see the removal in their activity feed
 */
export async function getActivity(userId: string): Promise<Activity[]> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rows, error } = await (supabase.from('products') as any)
    .select('id, name, status, created_at, updated_at')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[dashboardService.getActivity] products query error:', error.message);
    throw new Error('dashboard:products_load_failed');
  }

  const products = (rows ?? []) as {
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];

  // Latest moderation record per product so we can tell a pause apart from an
  // admin withdrawal - Read-only - degrades to {} when RLS blocks the read
  const moderations = await getProductModerations(products.map((p) => p.id));

  const events: Activity[] = [];

  for (const row of products) {
    events.push({
      id: `${row.id}-published`,
      tipo: 'producto_publicado',
      productName: row.name,
      descripcion: row.name,
      fecha: row.created_at,
    });

    const created = new Date(row.created_at).getTime();
    const updated = new Date(row.updated_at).getTime();
    if (!Number.isNaN(created) && !Number.isNaN(updated) && updated - created > CREATED_UPDATED_GAP_MS) {
      events.push({
        id: `${row.id}-updated`,
        tipo: 'producto_editado',
        productName: row.name,
        descripcion: row.name,
        fecha: row.updated_at,
      });
    }

    const moderation = moderations[row.id];
    if (moderation) {
      // Admin withdrawal - use the moderation timestamp so the event appears
      // right when the removal happened - not when the seller last touched it
      events.push({
        id: `${row.id}-withdrawn`,
        tipo: 'producto_retirado',
        productName: row.name,
        descripcion: row.name,
        fecha: moderation.created_at,
      });
    } else if (row.status === 'paused') {
      // A paused product is a real - current DB state - surface it as a
      // paused event using updated_at from the product
      events.push({
        id: `${row.id}-paused`,
        tipo: 'producto_pausado',
        productName: row.name,
        descripcion: row.name,
        fecha: row.updated_at,
      });
    }
  }

  return events.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** All currently active products for the seller - newest first */
export async function getActiveProducts(userId: string): Promise<Product[]> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .select('*')
    .eq('seller_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[dashboardService.getActiveProducts] products query error:', error.message);
    throw new Error('dashboard:products_load_failed');
  }

  return (data ?? []) as Product[];
}

/**
 * Latest moderation record per product - keyed by product_id
 *
 * This reads the `product_moderation` table as the authenticated seller - It
 * depends on an RLS policy that lets a seller read moderation rows for THEIR
 * OWN products only - If the current policies do not allow that read the query
 * errors and we degrade to an empty map - no moderation is shown - we never
 * bypass RLS here
 */
export async function getProductModerations(
  productIds: string[]
): Promise<Record<string, ProductModeration>> {
  if (productIds.length === 0) return {};
  const supabase = await createSupabaseOrNull();
  if (!supabase) return {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('product_moderation') as any)
    .select('*')
    .in('product_id', productIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[dashboardService.getProductModerations] error:', error.message);
    return {};
  }

  const latest: Record<string, ProductModeration> = {};
  for (const row of (data ?? []) as ProductModeration[]) {
    if (!latest[row.product_id]) latest[row.product_id] = row;
  }
  return latest;
}
