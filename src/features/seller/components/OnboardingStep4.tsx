'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import { AvatarUploader } from './AvatarUploader';

interface OnboardingStep4Props {
  avatarUrl?: string;
  onChangeAvatarUrl: (url: string) => void;
}

export function OnboardingStep4({ avatarUrl, onChangeAvatarUrl }: OnboardingStep4Props) {
  const t = useTranslations();

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.seller.onboarding.step4.title}
        </h2>
        <p className="mt-2 text-base text-foreground/75 sm:text-lg">
          {t.seller.onboarding.step4.subtitle}
        </p>
      </div>

      <AvatarUploader
        currentAvatarUrl={avatarUrl}
        onAvatarChange={onChangeAvatarUrl}
      />
    </div>
  );
}
