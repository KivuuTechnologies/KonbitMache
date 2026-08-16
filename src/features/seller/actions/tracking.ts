'use server';

import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { logError } from '@/utils/logger/server';

interface UntypedTable {
  select: (columns: string) => {
    eq: (column: string, value: unknown) => {
      maybeSingle: () => Promise<{ data: { seller_id?: string } | null }>;
    };
  };
  insert: (values: Record<string, unknown>) => {
    onConflict: (cols: string) => {
      ignore: () => Promise<unknown>;
    };
  } & Promise<unknown>;
}

async function getProductOwner(productId: string): Promise<string | null> {
  const supabase = await createClient();
  const table = supabase.from('products') as unknown as UntypedTable;
  const { data } = await table
    .select('seller_id')
    .eq('id', productId)
    .maybeSingle();
  return (data?.seller_id as string | undefined) ?? null;
}

export async function recordProductViewAction(productId: string): Promise<void> {
  if (!hasSupabaseEnvironment() || !productId) return;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const uid = data?.claims?.sub;
    const sellerId = await getProductOwner(productId);
    if (!sellerId) return;
    if (uid === sellerId) return;

    // Record views as interactions of type view in product_interactions
    // visitor_id must be UUID type so we use actual UID or random UUID
    const visitorId = uid || crypto.randomUUID();
    const table = supabase.from('product_interactions') as unknown as UntypedTable;
    await table
      .insert({
        product_id: productId,
        seller_id: sellerId,
        visitor_id: visitorId,
        interaction_type: 'view',
      })
      .onConflict('product_id,visitor_id,interaction_type')
      .ignore();
  } catch (error) {
    logError(
      '[recordProductViewAction] skipped:',
      (error as Error)?.message,
    );
  }
}

export async function recordProductContactAction(
  productId: string,
  channel: 'whatsapp' | 'call',
  visitorId: string,
): Promise<void> {
  if (!hasSupabaseEnvironment() || !productId || !visitorId) return;

  try {
    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const uid = claims?.claims?.sub;
    const sellerId = await getProductOwner(productId);
    if (!sellerId) return;
    if (uid === sellerId) return;

    // Direct insert to product_interactions table
    const table = supabase.from('product_interactions') as unknown as UntypedTable;
    await table.insert({
      product_id: productId,
      seller_id: sellerId,
      visitor_id: visitorId,
      interaction_type: channel === 'whatsapp' ? 'whatsapp' : 'phone',
    });
  } catch (error) {
    logError(
      '[recordProductContactAction] skipped:',
      (error as Error)?.message,
    );
  }
}
