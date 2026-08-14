import { mockSellerProfile } from './mocks';
import type { SellerProfile, ProfileFormData } from '../types';

// TODO - Replace mock with Supabase queries - select-update from `profiles`
// where id = auth-uid - Method signatures are the UI contract and must stay stable

// Module-level copy so edits made during a session are reflected while navigating
let profile: SellerProfile = { ...mockSellerProfile };

export async function getCurrentProfile(): Promise<SellerProfile> {
  return { ...profile };
}

export async function updateProfile(input: ProfileFormData): Promise<SellerProfile> {
  profile = {
    ...profile,
    ...input,
    profile_status: profile.profile_status === 'incomplete' ? 'active' : profile.profile_status,
    updated_at: new Date().toISOString(),
  };
  return { ...profile };
}