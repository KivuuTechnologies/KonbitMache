import { z } from 'zod';

// Helper to validate phone number structure
const phoneRegex = /^(\+?509\s?)?[2-589]\d{3}-?\d{4}$|^[0-9\s+()-]{8,15}$/;

function isValidPhone(val: string): boolean {
  if (!val) return false;
  const digitsOnly = val.replace(/\D/g, '');
  // Reject garbage like 123 - 000000 - 11111111
  if (digitsOnly.length < 8) return false;
  if (/^(\d)\1+$/.test(digitsOnly)) return false;
  if (digitsOnly === '12345678' || digitsOnly === '87654321') return false;
  return phoneRegex.test(val.trim());
}

export const onboardingStep1Schema = z.object({
  seller_type: z.literal('farmer'),
  business_name: z
    .string()
    .max(100, 'Name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
});

export const onboardingStep2Schema = z.object({
  department: z.string().min(1, 'Department is required'),
  commune: z.string().min(1, 'Commune is required'),
});

export const onboardingStep3Schema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhone(val), {
      message: 'Enter a valid phone number',
    }),
  sameAsWhatsapp: z.boolean().default(true),
  whatsapp: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || isValidPhone(val), {
      message: 'Enter a valid WhatsApp number',
    }),
});

export const onboardingStep4Schema = z.object({
  avatar_url: z.string().optional().or(z.literal('')),
});

export const completeOnboardingSchema = z.object({
  seller_type: z.literal('farmer'),
  business_name: z.string().optional(),
  department: z.string().min(1),
  commune: z.string().min(1),
  phone: z.string().refine((val) => isValidPhone(val)),
  whatsapp: z.string().refine((val) => isValidPhone(val)),
  avatar_url: z.string().optional(),
});

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;
export type CompleteOnboardingData = z.infer<typeof completeOnboardingSchema>;
