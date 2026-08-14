'use client';

import { useTranslations } from '@/shared/i18n/useTranslations';
import { Phone, MessageSquare } from 'lucide-react';

interface OnboardingStep3Props {
  phone: string;
  sameAsWhatsapp: boolean;
  whatsapp: string;
  onChangePhone: (phone: string) => void;
  onChangeSameAsWhatsapp: (same: boolean) => void;
  onChangeWhatsapp: (whatsapp: string) => void;
  errorPhone?: string;
  errorWhatsapp?: string;
}

export function OnboardingStep3({
  phone,
  sameAsWhatsapp,
  whatsapp,
  onChangePhone,
  onChangeSameAsWhatsapp,
  onChangeWhatsapp,
  errorPhone,
  errorWhatsapp,
}: OnboardingStep3Props) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.seller.onboarding.step3.title}
        </h2>
        <p className="mt-2 text-base text-foreground/75 sm:text-lg">
          {t.seller.onboarding.step3.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-lg font-bold text-foreground">
            {t.seller.onboarding.step3.phoneLabel} *
          </label>
          <p className="mt-1 text-sm text-foreground/75 leading-relaxed">
            {t.seller.onboarding.step3.phoneHelp}
          </p>
          <div className="relative mt-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </div>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+509 3700 0000"
              value={phone}
              onChange={(e) => onChangePhone(e.target.value)}
              className="w-full min-h-14 rounded-xl border-2 border-black/10 bg-surface pl-12 pr-4 text-lg font-medium text-foreground outline-none transition focus:border-te focus:ring-4 focus:ring-te/20"
            />
          </div>
          {errorPhone && (
            <p className="mt-1 text-base font-semibold text-red-600">{errorPhone}</p>
          )}
        </div>

        {/* WhatsApp Same Number Toggle */}
        <div className="rounded-2xl border border-surface-muted bg-surface-muted p-5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sameAsWhatsapp}
              onChange={(e) => {
                const checked = e.target.checked;
                onChangeSameAsWhatsapp(checked);
                if (checked) {
                  onChangeWhatsapp(phone);
                }
              }}
              className="h-6 w-6 rounded-md accent-te"
            />
            <span className="text-lg font-bold text-foreground">
              {t.seller.onboarding.step3.sameWhatsappLabel}
            </span>
          </label>

          {/* Distinct WhatsApp Input if check is false */}
          {!sameAsWhatsapp && (
            <div className="mt-4 pt-4 border-t border-black/10">
              <label htmlFor="whatsapp" className="block text-base font-bold text-foreground">
                {t.seller.onboarding.step3.whatsappLabel} *
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted">
                  <MessageSquare className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                </div>
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  placeholder="+509 3700 0000"
                  value={whatsapp}
                  onChange={(e) => onChangeWhatsapp(e.target.value)}
                  className="w-full min-h-14 rounded-xl border-2 border-black/10 bg-surface pl-12 pr-4 text-lg font-medium text-foreground outline-none transition focus:border-te focus:ring-4 focus:ring-te/20"
                />
              </div>
              {errorWhatsapp && (
                <p className="mt-1 text-base font-semibold text-red-600">{errorWhatsapp}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
