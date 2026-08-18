'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import type { SellerType } from '../types';

interface OnboardingStep1Props {
  selectedType?: SellerType;
  businessName?: string;
  onSelectType: (type: SellerType) => void;
  onChangeBusinessName: (name: string) => void;
  errorType?: string;
}

export function OnboardingStep1({
  selectedType,
  businessName = '',
  onSelectType,
  onChangeBusinessName,
  errorType,
}: OnboardingStep1Props) {
  const t = useTranslations();

  const sellerOptions: Array<{ type: SellerType; emoji: string; title: string; desc: string }> = [
    {
      type: 'farmer',
      emoji: '🌱',
      title: t.seller.onboarding.step1.farmer.title,
      desc: t.seller.onboarding.step1.farmer.desc,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.seller.onboarding.step1.title}
        </h2>
        <p className="mt-2 text-base text-foreground/75 sm:text-lg">
          {t.seller.onboarding.step1.subtitle}
        </p>
      </div>

      {/* Seller Type Selection Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {sellerOptions.map((opt) => {
          const isSelected = selectedType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onSelectType(opt.type)}
              className={`flex min-h-24 flex-col items-start rounded-2xl border-3 p-5 text-left transition-all sm:min-h-32 ${
                isSelected
                  ? 'border-te bg-te/10 shadow-md ring-2 ring-te/20'
                  : 'border-surface-muted bg-surface hover:border-te/40 hover:bg-surface-muted'
              }`}
            >
              <span className="text-3xl sm:text-4xl" role="img" aria-label={opt.title}>
                {opt.emoji}
              </span>
              <span className="mt-3 text-xl font-bold text-foreground">{opt.title}</span>
              <span className="mt-1 text-sm text-foreground/75 leading-relaxed">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      {errorType && <p className="text-base font-semibold text-red-600">{errorType}</p>}

      {/* Optional Business Name */}
      <div className="rounded-2xl border border-surface-muted bg-surface-muted p-5 sm:p-6">
        <label htmlFor="business_name" className="block text-lg font-bold text-foreground">
          {t.seller.onboarding.step1.businessNameLabel}
        </label>
        <p className="mt-1 text-sm text-foreground/75 leading-relaxed sm:text-base">
          {t.seller.onboarding.step1.businessNameHelp}
        </p>
        <input
          id="business_name"
          type="text"
          value={businessName}
          onChange={(e) => onChangeBusinessName(e.target.value)}
          placeholder={t.seller.onboarding.step1.businessNamePlaceholder}
          className="mt-3 w-full min-h-14 rounded-xl border-2 border-black/10 bg-surface px-4 text-base font-medium text-foreground outline-none transition focus:border-te focus:ring-4 focus:ring-te/20"
        />
      </div>
    </div>
  );
}
