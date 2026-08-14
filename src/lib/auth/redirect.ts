import type { ProfileStatus } from '@/features/seller/types';

export interface ProfileRedirectInfo {
  profile_status?: ProfileStatus | string | null;
  is_admin?: boolean;
}

export function getProfileDestination(
  profile: ProfileRedirectInfo | null | undefined,
  locale: string
): string {
  // A suspended account is blocked everywhere
  if (profile?.profile_status === 'suspended') {
    return `/${locale}/cuenta-suspendida`;
  }
  // Admins only use the admin panel
  if (profile?.is_admin) {
    return `/${locale}/admin`;
  }
  if (!profile?.profile_status || profile.profile_status === 'incomplete') {
    return `/${locale}/onboarding`;
  }
  return `/${locale}/dashboard`;
}
