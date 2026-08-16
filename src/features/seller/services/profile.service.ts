import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getAuthenticatedUserId } from '../../../../utils/supabase/auth-helpers';
import { mockSellerProfile } from './mocks';
import type { SellerProfile, ProfileFormData } from '../types';

export async function getCurrentProfile(): Promise<SellerProfile> {
  if (!hasSupabaseEnvironment()) {
    return { ...mockSellerProfile };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return { ...mockSellerProfile };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return { ...mockSellerProfile };

  // data comes from an untyped Supabase query (types not yet generated),
  // so we cast via unknown to satisfy the strict SellerProfile contract.
  const row = data as Record<string, unknown>;

  return {
    id: row.id as string,
    full_name: (row.full_name as string | null) || '',
    seller_type: (row.seller_type as SellerProfile['seller_type']) ?? undefined,
    business_name: (row.business_name as string | null) ?? null,
    department: (row.department as string | null) ?? undefined,
    commune: (row.commune as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
    preferred_language: (row.preferred_language as SellerProfile['preferred_language']) || 'ht',
    profile_status: (row.profile_status as SellerProfile['profile_status']) || 'incomplete',
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function updateProfile(input: ProfileFormData): Promise<SellerProfile> {
  if (!hasSupabaseEnvironment()) {
    return {
      ...mockSellerProfile,
      ...input,
      profile_status: mockSellerProfile.profile_status === 'incomplete' ? 'active' : mockSellerProfile.profile_status,
      updated_at: new Date().toISOString(),
    };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) return { ...mockSellerProfile };

  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.full_name,
      seller_type: input.seller_type,
      business_name: input.business_name,
      department: input.department,
      commune: input.commune,
      phone: input.phone,
      whatsapp: input.whatsapp,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return { ...mockSellerProfile };
  }

  // Return updated profile
  return getCurrentProfile();
}