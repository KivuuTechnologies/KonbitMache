import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getAuthenticatedUserId } from '../../../../utils/supabase/auth-helpers';
import type { SellerStats } from '../types';

const emptyStats: SellerStats = {
  productos_activos: 0,
  productos_pausados: 0,
  productos_agotados: 0,
  visualizaciones: null,
  contactos_recibidos: null,
  visitantes_interesados: null,
};

export async function getSellerStats(): Promise<SellerStats> {
  if (!hasSupabaseEnvironment()) {
    const { mockSellerStats } = await import('./mocks');
    return { ...mockSellerStats };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return { ...emptyStats };

  const supabase = await createClient();

  const [{ count: active }, { count: paused }, { count: soldOut }] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)
      .eq('status', 'active'),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)
      .eq('status', 'paused'),
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)
      .eq('status', 'sold_out'),
  ]);

  return {
    productos_activos: active ?? 0,
    productos_pausados: paused ?? 0,
    productos_agotados: soldOut ?? 0,
    // Tracking tables may not exist yet — callers check for null vs 0
    visualizaciones: null,
    contactos_recibidos: null,
    visitantes_interesados: null,
  };
}
