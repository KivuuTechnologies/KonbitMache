'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';

export type ModerateProductResult =
  | { ok: true; message: 'success' }
  | { ok: false; message: 'reason_required' | 'not_authenticated' | 'not_allowed' | 'unavailable' | 'not_found' | 'generic' };

interface ModerateProductInput {
  productId: string;
  reason: string;
  locale: string;
}

/**
 * Withdraws a product from the marketplace. Only admins can call this:
 * the `moderate_product` RPC enforces `is_admin` server-side
 */
export async function moderateProductAction(
  input: ModerateProductInput
): Promise<ModerateProductResult> {
  const productId = input.productId.trim();
  const reason = input.reason.trim();

  if (!productId) return { ok: false, message: 'not_found' };
  if (!reason) return { ok: false, message: 'reason_required' };
  if (!hasSupabaseEnvironment()) return { ok: false, message: 'unavailable' };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { ok: false, message: 'not_authenticated' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle();

  if (!profile?.is_admin) return { ok: false, message: 'not_allowed' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.rpc as any)('moderate_product', {
    p_product_id: productId,
    p_reason: reason,
  });

  if (error) {
    console.error('[moderateProductAction] RPC error:', error.message);
    return { ok: false, message: 'generic' };
  }

  revalidatePath(`/${input.locale}/admin`);
  return { ok: true, message: 'success' };
}
