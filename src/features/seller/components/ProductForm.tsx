'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { productSchema, type ProductFormData } from '@/features/seller/schemas';
import type { CategorySlug } from '@/features/seller/schemas';
import { updateProductAction } from '../actions/products';
import { productCategories, productUnits } from '../services/mocks';
import { useSellerCopy } from '../i18n/useSellerCopy';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { CategoryIcon } from '@/features/marketplace/components/CategoryIcon';
import { ProductImageUploader } from './ProductImageUploader';
import type { CategoryKey } from '@/shared/i18n/types';

interface ProductFormProps {
  /** Existing product data when editing. `id` must be present */
  initialData: Partial<ProductFormData> & { id: string };
  locale: string;
}

export function ProductForm({ initialData, locale }: ProductFormProps) {
  const c = useSellerCopy();
  const t = useTranslations();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData.name ?? '',
      description: initialData.description ?? '',
      category: (initialData.category ?? 'fruits') as CategorySlug,
      price: initialData.price ?? 0,
      unit: initialData.unit ?? '',
      quantity: initialData.quantity ?? 0,
      image_url: initialData.image_url ?? '',
      // Seed image_urls: use what was passed in, or wrap the legacy single URL,
      // so the uploader always shows existing photos on first render
      image_urls:
        initialData.image_urls && initialData.image_urls.length > 0
          ? initialData.image_urls
          : initialData.image_url
          ? [initialData.image_url]
          : [],
      status: initialData.status ?? 'active',
    },
  });

  const { formState: { errors } } = form;
  const selectedCategory = useWatch({ control: form.control, name: 'category' }) as CategorySlug;
  const currentImageUrls = (useWatch({ control: form.control, name: 'image_urls' }) as string[] | undefined) ?? [];

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateProductAction(initialData.id, data);
      if (!result.ok) {
        const msgKey = result.message as keyof typeof c.form | undefined;
        const msg = msgKey && msgKey in c.form ? (c.form[msgKey] as string) : c.form.errorGeneric;
        toast.error(msg);
        return;
      }
      toast.success(c.form.updatedToast);
      router.push(`/${locale}/dashboard/products`);
    } catch {
      toast.error(c.form.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>

      {/* Image uploader */}
      <div>
        <p className="mb-2 text-sm font-semibold">{c.form.images}</p>
        <ProductImageUploader
          currentImageUrls={currentImageUrls}
          productId={initialData.id}
          onImagesChange={(urls) => {
            form.setValue('image_urls', urls, { shouldValidate: true });
            form.setValue('image_url', urls[0] ?? '', { shouldValidate: false });
          }}
          disabled={isSubmitting}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="edit-name" className="mb-1.5 block text-sm font-semibold">
          {c.form.name}
        </label>
        <input
          id="edit-name"
          type="text"
          {...form.register('name')}
          className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.required}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="mb-2 text-sm font-semibold">{c.form.category}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {productCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                disabled={isSubmitting}
                onClick={() => form.setValue('category', cat, { shouldValidate: true })}
                className={[
                  'flex min-h-12 items-center gap-2.5 rounded-xl border-2 px-3 text-left text-sm font-semibold transition',
                  isSelected ? 'border-te bg-te/5' : 'border-surface-muted bg-surface hover:border-te/40',
                ].join(' ')}
              >
                <CategoryIcon category={cat as CategoryKey} className="h-5 w-5 shrink-0 text-te" />
                {t.categories[cat as CategoryKey]}
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.required}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="edit-desc" className="mb-1.5 block text-sm font-semibold">
          {c.form.description}
          <span className="ml-1.5 text-xs font-normal text-muted">({c.common.optional})</span>
        </label>
        <textarea
          id="edit-desc"
          {...form.register('description')}
          rows={3}
          className="w-full min-h-24 resize-none rounded-xl border bg-surface px-4 py-3 text-base outline-none focus:ring-2 focus:ring-te"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p role="alert" className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Price + Unit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-price" className="mb-1.5 block text-sm font-semibold">
            {c.form.price}
          </label>
          <input
            id="edit-price"
            type="number"
            min="0"
            step="0.01"
            {...form.register('price', { valueAsNumber: true })}
            className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
            disabled={isSubmitting}
          />
          {errors.price && (
            <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.positiveNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="edit-unit" className="mb-1.5 block text-sm font-semibold">
            {c.form.unit}
          </label>
          <select
            id="edit-unit"
            {...form.register('unit')}
            className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
            disabled={isSubmitting}
          >
            <option value="">{c.form.chooseUnit}</option>
            {productUnits.map((u) => (
              <option key={u} value={u}>{c.units[u] ?? u}</option>
            ))}
          </select>
          {errors.unit && (
            <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.required}</p>
          )}
        </div>
      </div>

      {/* Quantity + Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-qty" className="mb-1.5 block text-sm font-semibold">
            {c.form.quantity}
          </label>
          <input
            id="edit-qty"
            type="number"
            min="0"
            step="1"
            {...form.register('quantity', { valueAsNumber: true })}
            className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
            disabled={isSubmitting}
          />
          {errors.quantity && (
            <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.positiveNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="edit-status" className="mb-1.5 block text-sm font-semibold">
            {c.form.status}
          </label>
          <select
            id="edit-status"
            {...form.register('status')}
            className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
            disabled={isSubmitting}
          >
            <option value="active">{c.status.active}</option>
            <option value="paused">{c.status.paused}</option>
            <option value="sold_out">{c.status.sold_out}</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              {c.form.saving}
            </>
          ) : (
            c.form.save
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-black/10 bg-surface px-4 text-base font-semibold text-foreground transition hover:bg-surface-muted disabled:opacity-60"
        >
          {c.form.cancel}
        </button>
      </div>
    </form>
  );
}
