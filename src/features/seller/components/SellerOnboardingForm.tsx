'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import type { SellerProfile, SellerType } from '../types';
import { useTranslations } from '@/shared/i18n/useTranslations';
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
} from '../schemas/onboarding';
import {
  saveOnboardingStepAction,
  completeOnboardingAction,
} from '../actions/onboarding';

import { OnboardingStep1 } from './OnboardingStep1';
import { OnboardingStep2 } from './OnboardingStep2';
import { OnboardingStep3 } from './OnboardingStep3';
import { OnboardingStep4 } from './OnboardingStep4';

interface SellerOnboardingFormProps {
  locale: string;
  initialProfile?: Partial<SellerProfile>;
}

export function SellerOnboardingForm({ locale, initialProfile }: SellerOnboardingFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [sellerType, setSellerType] = useState<SellerType | undefined>(
    initialProfile?.seller_type
  );
  const [businessName, setBusinessName] = useState<string>(
    initialProfile?.business_name || ''
  );
  const [department, setDepartment] = useState<string>(
    initialProfile?.department || ''
  );
  const [commune, setCommune] = useState<string>(
    initialProfile?.commune || ''
  );
  const [phone, setPhone] = useState<string>(
    initialProfile?.phone || ''
  );
  const [sameAsWhatsapp, setSameAsWhatsapp] = useState<boolean>(
    !initialProfile?.whatsapp || initialProfile?.whatsapp === initialProfile?.phone
  );
  const [whatsapp, setWhatsapp] = useState<string>(
    initialProfile?.whatsapp || initialProfile?.phone || ''
  );
  const [avatarUrl, setAvatarUrl] = useState<string>(
    initialProfile?.avatar_url || ''
  );

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    setErrors({});
    if (step === 1) {
      const res = onboardingStep1Schema.safeParse({
        seller_type: sellerType,
        business_name: businessName,
      });
      if (!res.success) {
        const newErrors: Record<string, string> = {};
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    } else if (step === 2) {
      const res = onboardingStep2Schema.safeParse({
        department,
        commune,
      });
      if (!res.success) {
        const newErrors: Record<string, string> = {};
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    } else if (step === 3) {
      const activeWhatsapp = sameAsWhatsapp ? phone : whatsapp;
      const res = onboardingStep3Schema.safeParse({
        phone,
        sameAsWhatsapp,
        whatsapp: activeWhatsapp,
      });
      if (!res.success) {
        const newErrors: Record<string, string> = {};
        res.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Save current step data progressively to server
      const activeWhatsapp = sameAsWhatsapp ? phone : whatsapp;
      const stepData =
        currentStep === 1
          ? {
              seller_type: sellerType,
              business_name: businessName || undefined,
            }
          : currentStep === 2
          ? {
              department: department || undefined,
              commune: commune || undefined,
            }
          : {
              phone: phone || undefined,
              whatsapp: activeWhatsapp || undefined,
            };

      const result = await saveOnboardingStepAction(stepData);
      if (!result.ok) {
        toast.error(result.message || t.seller.onboarding.errors.saveStep);
        return;
      }

      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch {
      toast.error(t.seller.onboarding.errors.saveStep);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t.seller.onboarding.errors.complete);
      return;
    }

    setIsSubmitting(true);
    try {
      const finalData = {
        avatar_url: avatarUrl || undefined,
      };

      const result = await completeOnboardingAction(finalData);
      if (!result.ok) {
        toast.error(result.message || t.seller.onboarding.errors.complete);
        return;
      }

      // Clear tour completion flag so the dashboard tour auto-starts on first entry
      try {
        localStorage.removeItem('konbit-dashboard-tour-completed');
      } catch {
        // Ignore localStorage errors
      }

      toast.success(t.seller.productForm.success);
      router.replace(`/${locale}/dashboard`);
    } catch {
      toast.error(t.seller.onboarding.errors.complete);
    } finally {
      setIsSubmitting(false);
    }
  };


  const stepOfText = t.seller.onboarding.stepOf
    .replace('{current}', currentStep.toString())
    .replace('{total}', '4');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header and Progress Indicator */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm font-bold text-muted">
          <span>{stepOfText}</span>
          <span>{Math.round((currentStep / 4) * 100)}%</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full bg-fey transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step Circles */}
        <div className="flex justify-between pt-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-bold transition ${
                step < currentStep
                  ? 'bg-fey text-white dark:text-background'
                  : step === currentStep
                  ? 'border-2 border-dlo bg-dlo/10 text-dlo'
                  : 'bg-surface-muted text-muted'
              }`}
            >
              {step < currentStep ? <Check className="h-5 w-5" /> : step}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content Container */}
      <div className="rounded-3xl border border-black/5 bg-surface p-6 shadow-xl sm:p-8">
        {currentStep === 1 && (
          <OnboardingStep1
            selectedType={sellerType}
            businessName={businessName}
            onSelectType={(type) => {
              setSellerType(type);
              setErrors((prev) => ({ ...prev, seller_type: '' }));
            }}
            onChangeBusinessName={setBusinessName}
            errorType={errors.seller_type}
          />
        )}

        {currentStep === 2 && (
          <OnboardingStep2
            department={department}
            commune={commune}
            onChangeDepartment={(dept) => {
              setDepartment(dept);
              setErrors((prev) => ({ ...prev, department: '' }));
            }}
            onChangeCommune={(c) => {
              setCommune(c);
              setErrors((prev) => ({ ...prev, commune: '' }));
            }}
            errorDepartment={errors.department}
            errorCommune={errors.commune}
          />
        )}

        {currentStep === 3 && (
          <OnboardingStep3
            phone={phone}
            sameAsWhatsapp={sameAsWhatsapp}
            whatsapp={whatsapp}
            onChangePhone={(p) => {
              setPhone(p);
              if (sameAsWhatsapp) setWhatsapp(p);
              setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            onChangeSameAsWhatsapp={setSameAsWhatsapp}
            onChangeWhatsapp={(w) => {
              setWhatsapp(w);
              setErrors((prev) => ({ ...prev, whatsapp: '' }));
            }}
            errorPhone={errors.phone}
            errorWhatsapp={errors.whatsapp}
          />
        )}

        {currentStep === 4 && (
          <OnboardingStep4
            avatarUrl={avatarUrl}
            onChangeAvatarUrl={setAvatarUrl}
          />
        )}

        {/* Step Action Buttons */}
        <div className="mt-8 flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/10 bg-surface px-6 text-lg font-bold text-foreground transition hover:bg-surface-muted focus:ring-4 focus:ring-black/10 disabled:opacity-60 sm:w-auto"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              {t.seller.onboarding.back}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-te px-8 text-lg font-bold text-white dark:text-background shadow-lg transition hover:bg-te/90 focus:ring-4 focus:ring-te/30 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? t.seller.onboarding.saving : t.seller.onboarding.next}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-te px-8 text-lg font-extrabold text-white dark:text-background shadow-xl transition hover:bg-te/90 focus:ring-4 focus:ring-te/30 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? t.seller.onboarding.saving : t.seller.onboarding.finish}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
