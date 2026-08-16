'use server';

import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getAuthenticatedUserId } from '../../../../utils/supabase/auth-helpers';
import { logError } from '@/utils/logger/server';
import type { SellerType, ProfileStatus } from '../types';
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
} from '../schemas/onboarding';

export interface OnboardingActionResult {
  ok: boolean;
  message?: string;
  avatar_url?: string;
}

export async function saveOnboardingStepAction(data: {
  seller_type?: SellerType;
  business_name?: string;
  department?: string;
  commune?: string;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
}): Promise<OnboardingActionResult> {
  if (!hasSupabaseEnvironment()) {
    return { ok: true };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { ok: false, message: '' };
  }

  if (data.seller_type !== undefined) {
    const v1 = onboardingStep1Schema.safeParse({
      seller_type: data.seller_type,
      business_name: data.business_name,
    });
    if (!v1.success) return { ok: false, message: '' };
  }
  if (data.department !== undefined || data.commune !== undefined) {
    const v2 = onboardingStep2Schema.safeParse({
      department: data.department,
      commune: data.commune,
    });
    if (!v2.success) return { ok: false, message: '' };
  }
  if (data.phone !== undefined) {
    const v3 = onboardingStep3Schema.safeParse({
      phone: data.phone,
      sameAsWhatsapp: false,
      whatsapp: data.whatsapp,
    });
    if (!v3.success) return { ok: false, message: '' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    return { ok: false, message: '' };
  }

  return { ok: true };
}

export async function completeOnboardingAction(data: {
  avatar_url?: string;
}): Promise<OnboardingActionResult> {
  if (!hasSupabaseEnvironment()) {
    return { ok: true };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { ok: false, message: '' };
  }

  const profileUpdate = {
    profile_status: 'active' as ProfileStatus,
    updated_at: new Date().toISOString(),
    ...(data.avatar_url ? { avatar_url: data.avatar_url } : {}),
  };

  const { error } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', userId);

  if (error) {
    return { ok: false, message: '' };
  }

  return { ok: true };
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<OnboardingActionResult> {
  if (!hasSupabaseEnvironment()) {
    return {
      ok: true,
      avatar_url:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { ok: false, message: '' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { ok: false, message: '' };
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { ok: false, message: '' };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, message: '' };
  }

  const filePath = `${userId}/avatar.webp`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, bytes, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (uploadError) {
    return { ok: false, message: '' };
  }

  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { ok: true, avatar_url: publicUrl };
}

export async function getDashboardTourCompletedAction(): Promise<{
  ok: boolean;
  completed: boolean;
}> {
  if (!hasSupabaseEnvironment()) {
    return { ok: true, completed: false };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, completed: false };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('profiles') as any)
    .select('has_completed_dashboard_tour')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, completed: false };
  }

  return { ok: true, completed: Boolean(data.has_completed_dashboard_tour) };
}

export async function setDashboardTourCompletedAction(): Promise<{
  ok: boolean;
}> {
  if (!hasSupabaseEnvironment()) {
    return { ok: true };
  }

  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({
      has_completed_dashboard_tour: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    logError('[setDashboardTourCompletedAction] Update error:', error.message);
    return { ok: false };
  }

  return { ok: true };
}
