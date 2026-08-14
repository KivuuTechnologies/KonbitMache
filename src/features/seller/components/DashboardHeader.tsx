'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import type { SellerProfile } from '../types';
import type { MarketplaceCopy } from '@/shared/i18n/types';

interface DashboardHeaderProps {
  profile: SellerProfile;
  t: MarketplaceCopy;
}

/**
 * Maps DB seller_type values to localized display strings using existing i18n
 */
function getSellerTypeLabel(
  sellerType: SellerProfile['seller_type'],
  t: MarketplaceCopy
): string {
  if (sellerType === 'farmer') return t.seller.profile.type.farmer;
  if (sellerType === 'cooperative') return t.seller.profile.type.cooperative;
  if (sellerType === 'company') return t.seller.profile.type.company;
  return '';
}

export function DashboardHeader({ profile, t }: DashboardHeaderProps) {
  const subtitle = profile.business_name || getSellerTypeLabel(profile.seller_type, t);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-surface-muted">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || 'Avatar'}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <User className="h-8 w-8 text-muted" aria-hidden="true" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t.seller.dashboard.welcome}, {profile.full_name}
          </h1>
          {subtitle && (
            <p className="text-base text-muted sm:text-lg">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
