import type { Activity, Product, ProductModeration, SellerStats } from '../types';
import type { createClient as createServerClient } from '../../../../utils/supabase/server';
import { createSupabaseOrNull, isRelationMissing } from '../../../../utils/supabase/client-helpers';
import { logError } from '@/utils/logger/server';

type ServerClient = Awaited<ReturnType<typeof createServerClient>>;

const EMPTY_STATS: SellerStats = {
  productos_activos: 0,
  productos_pausados: 0,
  productos_agotados: 0,
  visualizaciones: null,
  contactos_recibidos: null,
  visitantes_interesados: null,
};

async function countWhere(
  supabase: ServerClient,
  table: string,
  column: string,
  value: string,
): Promise<number | null> {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, value);

  if (isRelationMissing(error)) return null;
  if (error) {
    logError(`[dashboardService] count ${table} error:`, error.message);
    return null;
  }
  return count ?? 0;
}

async function getSellerInterestCountRpc(
  supabase: ServerClient,
  userId: string,
): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('get_seller_interest_count', {
      p_seller_id: userId,
    });
    if (error) {
      if (error.code === 'PGRST202' || error.message?.includes('function')) {
        return null;
      }
      logError(
        '[dashboardService] get_seller_interest_count RPC error:',
        error.message,
      );
      return null;
    }
    return (data as number) ?? null;
  } catch (err) {
    logError(
      '[dashboardService] get_seller_interest_count unexpected error:',
      err,
    );
    return null;
  }
}

export async function getStats(userId: string): Promise<SellerStats> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return { ...EMPTY_STATS };

  const { data: rows, error } = await supabase
    .from('products')
    .select('status')
    .eq('seller_id', userId);

  if (error) {
    logError('[dashboardService.getStats] products query error:', error.message);
    throw new Error('dashboard:products_load_failed');
  }

  const statusCounts = (rows ?? []).reduce<Record<string, number>>((acc, row) => {
    const status = (row as { status: string }).status;
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  const productos_activos = statusCounts['active'] ?? 0;
  const productos_pausados = statusCounts['paused'] ?? 0;
  const productos_agotados = statusCounts['sold_out'] ?? 0;

  const [visualizaciones, contactos_recibidos, visitantes_interesados] =
    await Promise.all([
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

const CREATED_UPDATED_GAP_MS = 60 * 1000;

export async function getActivity(userId: string): Promise<Activity[]> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return [];

  const { data: rows, error } = await supabase
    .from('products')
    .select('id, name, status, created_at, updated_at')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logError(
      '[dashboardService.getActivity] products query error:',
      error.message,
    );
    throw new Error('dashboard:products_load_failed');
  }

  const products = (rows ?? []) as {
    id: string;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];

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
    if (
      !Number.isNaN(created) &&
      !Number.isNaN(updated) &&
      updated - created > CREATED_UPDATED_GAP_MS
    ) {
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
      events.push({
        id: `${row.id}-withdrawn`,
        tipo: 'producto_retirado',
        productName: row.name,
        descripcion: row.name,
        fecha: moderation.created_at,
      });
    } else if (row.status === 'paused') {
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

export async function getActiveProducts(userId: string): Promise<Product[]> {
  const supabase = await createSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    logError(
      '[dashboardService.getActiveProducts] products query error:',
      error.message,
    );
    throw new Error('dashboard:products_load_failed');
  }

  return (data ?? []) as Product[];
}

export async function getProductModerations(
  productIds: string[],
): Promise<Record<string, ProductModeration>> {
  if (productIds.length === 0) return {};
  const supabase = await createSupabaseOrNull();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('product_moderation')
    .select('*')
    .in('product_id', productIds)
    .order('created_at', { ascending: false });

  if (error) {
    logError(
      '[dashboardService.getProductModerations] error:',
      error.message,
    );
    return {};
  }

  const latest: Record<string, ProductModeration> = {};
  for (const row of (data ?? []) as ProductModeration[]) {
    if (!latest[row.product_id]) latest[row.product_id] = row;
  }
  return latest;
}
