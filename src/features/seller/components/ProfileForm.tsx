'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { profileSchema, type ProfileFormData } from '@/features/seller/schemas';
import { haitiDepartments } from '@/features/seller/services/mocks';
import { getDepartmentLabel } from '@/shared/data/haitiDepartmentLabels';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { createClient } from '../../../../utils/supabase/client';
import type { SellerType } from '@/features/seller/types';

interface ProfileFormProps {
  locale: string;
  initialData?: Partial<ProfileFormData>;
}

export function ProfileForm({ locale, initialData }: ProfileFormProps) {
  void locale;
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      seller_type: initialData?.seller_type ?? 'farmer',
      business_name: initialData?.business_name ?? '',
      department: initialData?.department ?? '',
      commune: initialData?.commune ?? '',
      phone: initialData?.phone ?? '',
      whatsapp: initialData?.whatsapp ?? '',
      avatar_url: initialData?.avatar_url ?? '',
    },
  });

  // If no initialData was passed (no SSR), load from Supabase client-side
  useEffect(() => {
    if (initialData && Object.values(initialData).some(v => v)) {
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          form.reset({
            full_name: profile.full_name || '',
            seller_type: (profile.seller_type as SellerType) || 'farmer',
            business_name: profile.business_name || '',
            department: profile.department || '',
            commune: profile.commune || '',
            phone: profile.phone || '',
            whatsapp: profile.whatsapp || '',
            avatar_url: profile.avatar_url || '',
          });
        }
      } catch {
        // Silently fail; user can still edit manually
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset form when initialData arrives (SSR path)
  useEffect(() => {
    if (initialData && Object.values(initialData).some(v => v)) {
      form.reset({
        full_name: initialData.full_name ?? '',
        seller_type: initialData.seller_type ?? 'farmer',
        business_name: initialData.business_name ?? '',
        department: initialData.department ?? '',
        commune: initialData.commune ?? '',
        phone: initialData.phone ?? '',
        whatsapp: initialData.whatsapp ?? '',
        avatar_url: initialData.avatar_url ?? '',
      });
      // Defer setIsLoading to avoid calling setState synchronously in effect body
      const timer = setTimeout(() => setIsLoading(false), 0);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          seller_type: data.seller_type,
          business_name: data.business_name || null,
          department: data.department,
          commune: data.commune || null,
          phone: data.phone || null,
          whatsapp: data.whatsapp || null,
          avatar_url: data.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success(t.seller.profile.success);
    } catch {
      toast.error(t.seller.profile.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.profile.account}</h2>
        <div>
          <label className="mb-2 block text-base font-semibold">{t.seller.profile.fullName}</label>
          <input
            type="text"
            {...form.register('full_name')}
            className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
            disabled={isSubmitting}
          />
          {form.formState.errors.full_name && (
            <p className="mt-1 text-sm text-red-500">{form.formState.errors.full_name.message}</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.profile.sellerType}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.profile.sellerType}</label>
            <select
              {...form.register('seller_type')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            >
              <option value="farmer">{t.seller.profile.type.farmer}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.onboarding.step1.businessNameLabel}</label>
            <input
              type="text"
              placeholder={t.seller.onboarding.step1.businessNamePlaceholder}
              {...form.register('business_name')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            />
            {form.formState.errors.business_name && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.business_name.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.profile.contact}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.profile.department}</label>
            <select
              {...form.register('department')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            >
              <option value="">{t.seller.profile.department}</option>
              {haitiDepartments.map((dept) => (
                <option key={dept} value={dept}>{getDepartmentLabel(dept)}</option>
              ))}
            </select>
            {form.formState.errors.department && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.profile.commune}</label>
            <input
              type="text"
              {...form.register('commune')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            />
            {form.formState.errors.commune && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.commune.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.profile.phone}</label>
            <input
              type="tel"
              {...form.register('phone')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            />
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-base font-semibold">{t.seller.profile.whatsapp}</label>
            <input
              type="tel"
              {...form.register('whatsapp')}
              className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              disabled={isSubmitting}
            />
            {form.formState.errors.whatsapp && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.whatsapp.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t.auth.common.loading}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              {t.seller.profile.save}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
