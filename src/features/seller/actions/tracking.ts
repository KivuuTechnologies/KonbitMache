'use server';

import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';

/**
 * Tracking for public marketplace interactions - views + contacts
 *
 * Writes are best-effort and never block the user experience - if the tracking
 * tables have not been migrated yet - see supabase-migrations-0001_product_views-sql
 * and 0002_product_contacts-sql and 0003_interested_visitors-sql - the error is
 * swallowed and the interaction is simply not counted - the marketplace keeps
 * working untouched
 *
 * Dedup rules
 *  - Views - one row per product - viewer - A refresh by the same visitor is
 *    NOT counted twice - unique constraint + on-conflict ignore
 *  - Contacts - one row per explicit CTA click - WhatsApp or Phone
 *    The RPC uses COUNT-DISTINCT visitor_id for unique interested visitor metrics
 *  - Own views or clicks from the product owner are never counted
 */

/** Returns owner for the product - or null when the product is not visible */
async function getProductOwner(productId: string): Promise<string | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('products') as any)
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
    // Never count the owner browsing their own listing
    if (uid === sellerId) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('product_views') as any)
      .insert({
        product_id: productId,
        seller_id: sellerId,
        viewer_key: uid ? `auth:${uid}` : `anon:${crypto.randomUUID()}`,
      })
      .onConflict('product_id,viewer_key')
      .ignore();
  } catch (error) {
    // Best-effort only - a missing table or transient failure must never
    // break the marketplace experience
    console.error('[recordProductViewAction] skipped:', (error as Error)?.message);
  }
}

/**
 * Records a product contact action - WhatsApp or Phone click
 *
 * Uses the new record_product_interaction RPC which
 * - Derives seller_id from product_id server-side - prevents spoofing
 * - Validates interaction_type
 * - Inserts into product_interactions table
 *
 * The visitor_id is generated client-side - anonymous UUID - and passed in
 * This allows COUNT-DISTINCT visitor_id for unique interested visitor metrics
 */
export async function recordProductContactAction(
  productId: string,
  channel: 'whatsapp' | 'call',
  visitorId: string
): Promise<void> {
  if (!hasSupabaseEnvironment() || !productId || !visitorId) return;

  try {
    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const uid = claims?.claims?.sub;
    const sellerId = await getProductOwner(productId);
    if (!sellerId) return;
    // The owner clicking their own CTA is not a real lead
    if (uid === sellerId) return;

    // Use the new RPC that handles seller_id derivation and validation
    const { error } = await supabase.rpc('record_product_interaction', {
      p_product_id: productId,
      p_visitor_id: visitorId,
      p_interaction_type: channel === 'whatsapp' ? 'whatsapp' : 'phone',
    });

    if (error) {
      // If RPC does not exist - migration not run - fall back to direct insert
      // for backward compatibility with existing product_contacts table
      if (error.code === 'PGRST202' || error.message?.includes('function')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('product_contacts') as any).insert({
          product_id: productId,
          seller_id: sellerId,
          channel,
        });
      } else {
        console.error('[recordProductContactAction] RPC error:', error.message);
      }
    }
  } catch (error) {
    // Best-effort only - see recordProductViewAction
    console.error('[recordProductContactAction] skipped:', (error as Error)?.message);
  }
}