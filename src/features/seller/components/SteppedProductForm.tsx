'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Package } from 'lucide-react';
import Image from 'next/image';
import { productSchema, ALLOWED_CATEGORIES } from '@/features/seller/schemas';
import { createProductAction } from '../actions/products';
import { productUnits } from '../services/mocks';
import { useSellerCopy } from '../i18n/useSellerCopy';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { CategoryIcon } from '@/features/marketplace/components/CategoryIcon';
import { ProductImageUploader } from './ProductImageUploader';
import type { CategoryKey } from '@/shared/i18n/types';
import type { Product } from '../types';

const CATEGORY_GROUPS: { labelKey: 'products' | 'inputs' | 'equipment' | 'services'; slugs: CategoryKey[] }[] = [
  {
    labelKey: 'products',
    slugs: ['fruits', 'grains', 'vegetables', 'coffee', 'livestock', 'spices', 'seeds'],
  },
  {
    labelKey: 'inputs',
    slugs: ['fertilizers'],
  },
  {
    labelKey: 'equipment',
    slugs: ['tools', 'agricultural_equipment', 'machinery', 'drones', 'irrigation'],
  },
  {
    labelKey: 'services',
    slugs: ['agricultural_services'],
  },
];

// Step labels index: 1=Category 2=Info 3=Pricing 4=Photo 5=Preview
const TOTAL_STEPS = 5;

interface SteppedProductFormProps {
  locale: string;
}

export function SteppedProductForm({ locale }: SteppedProductFormProps) {
  const c = useSellerCopy();
  const t = useTranslations();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState<Product | null>(null);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'fruits' as (typeof ALLOWED_CATEGORIES)[number],
      price: 0,
      unit: '',
      quantity: 0,
      image_url: '',
      image_urls: [] as string[],
      status: 'active' as const,
    },
  });

  const { setValue, getValues, formState: { errors } } = form;
  const selectedCategory = useWatch({ control: form.control, name: 'category' }) as CategoryKey;
  const selectedUnit = useWatch({ control: form.control, name: 'unit' }) as string;
  const imageUrls: string[] = (useWatch({ control: form.control, name: 'image_urls' }) as string[] | undefined) ?? [];

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleCategorySelect = (cat: CategoryKey) => {
    setValue('category', cat, { shouldValidate: true });
    setTimeout(goNext, 150);
  };

  const validateAndNext = async () => {
    type FormKey = 'name' | 'category' | 'price' | 'unit' | 'quantity' | 'image_urls';
    const fieldsByStep: FormKey[][] = [
      ['category'],
      ['name'],
      ['price', 'unit', 'quantity'],
      [],
    ];
    const fields = fieldsByStep[step - 1] ?? [];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (valid) goNext();
  };

  const handlePublish = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    setIsSubmitting(true);
    try {
      const data = getValues();
      // Pass the current UI locale so the action seeds name_translations
      // with the original text in the seller's language
      const sourceLocale = (['ht', 'fr', 'es', 'en'] as const).includes(locale as 'ht' | 'fr' | 'es' | 'en')
        ? (locale as 'ht' | 'fr' | 'es' | 'en')
        : 'ht';
      const result = await createProductAction(data, sourceLocale);

      if (!result.ok || !result.product) {
        const msgKey = result.message as keyof typeof c.form | undefined;
        const errorMsg =
          msgKey && msgKey in c.form ? (c.form[msgKey] as string) : c.form.errorGeneric;
        form.setError('root', { message: errorMsg });
        return;
      }

      setPublishedProduct(result.product);
    } catch {
      form.setError('root', { message: c.form.errorGeneric });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    c.form.stepCategory,
    c.form.stepDetails,
    c.form.stepPricing,
    c.form.stepPhoto,
    c.form.stepPreview,
  ];

  // Reuse existing i18n keys - no dedicated group labels exist
  const groupLabels: Record<string, string> = {
    products: t.hero.category, // "Category" - reuse existing key
    inputs: t.filters.category,
    equipment: t.categories.tools,
    services: t.categories.agricultural_services,
  };

  if (publishedProduct) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-fey" aria-hidden="true" />
        <div>
          <h2 className="text-2xl font-extrabold">{c.form.successTitle}</h2>
          <p className="mt-2 text-base text-muted">{c.form.successBody}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/dashboard/products`}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-black/10 bg-surface px-4 text-base font-semibold text-foreground transition hover:bg-surface-muted"
          >
            {c.form.myProducts}
          </Link>
          <button
            type="button"
            onClick={() => {
              setPublishedProduct(null);
              setStep(1);
              form.reset();
            }}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90"
          >
            {c.nav.publish}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Progress indicator */}
      <div aria-label="Form progress" className="space-y-2">
        <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={[
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                s < step ? 'bg-fey' : s === step ? 'bg-fey/60' : 'bg-surface-muted',
              ].join(' ')}
            />
          ))}
        </div>
        <p className="text-xs font-semibold text-muted">
          {stepLabels[step - 1]} — {step} / {TOTAL_STEPS}
        </p>
      </div>

      {/* Root error */}
      {errors.root && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {errors.root.message}
        </div>
      )}

      {/* STEP 1 - Category */}
      {step === 1 && (
        <section aria-labelledby="step1-title" data-tour="form-category">
          <h2 id="step1-title" className="mb-5 text-xl font-extrabold">
            {t.seller.productForm.step1}
          </h2>

          <div className="space-y-5">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.labelKey}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                  {groupLabels[group.labelKey]}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.slugs.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={[
                        'flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 text-left transition focus-visible:ring-4 focus-visible:ring-te/30',
                        selectedCategory === cat
                          ? 'border-te bg-te/5'
                          : 'border-surface-muted bg-surface hover:border-te/40',
                      ].join(' ')}
                    >
                      <CategoryIcon category={cat} className="h-5 w-5 shrink-0 text-te" />
                      <span className="text-base font-semibold">
                        {t.categories[cat]}
                      </span>
                      {selectedCategory === cat && (
                        <Check className="ml-auto h-4 w-4 shrink-0 text-te" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {errors.category && (
            <p role="alert" className="mt-2 text-sm text-red-500">{c.validation.required}</p>
          )}
        </section>
      )}

      {/* STEP 2 - Name + Description */}
      {step === 2 && (
        <section aria-labelledby="step2-title" data-tour="form-details">
          <h2 id="step2-title" className="mb-5 text-xl font-extrabold">
            {t.seller.productForm.step4}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-name" className="mb-1.5 block text-sm font-semibold">
                {c.form.name}
              </label>
              <input
                id="product-name"
                type="text"
                {...form.register('name')}
                placeholder={c.form.namePlaceholder}
                className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
                autoFocus
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.required}</p>
              )}
            </div>
            <div>
              <label htmlFor="product-desc" className="mb-1.5 block text-sm font-semibold">
                {c.form.description}
                <span className="ml-1.5 text-xs font-normal text-muted">({c.common.optional})</span>
              </label>
              <textarea
                id="product-desc"
                {...form.register('description')}
                placeholder={c.form.descriptionPlaceholder}
                rows={3}
                className="w-full min-h-24 resize-none rounded-xl border bg-surface px-4 py-3 text-base outline-none focus:ring-2 focus:ring-te"
              />
              {errors.description && (
                <p role="alert" className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 - Price, Unit, Quantity */}
      {step === 3 && (
        <section aria-labelledby="step3-title" data-tour="form-pricing">
          <h2 id="step3-title" className="mb-5 text-xl font-extrabold">
            {t.seller.productForm.step3}
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="product-price" className="mb-1.5 block text-sm font-semibold">
                {c.form.price}
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                {...form.register('price', { valueAsNumber: true })}
                className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
                autoFocus
              />
              {errors.price && (
                <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.positiveNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="product-unit" className="mb-1.5 block text-sm font-semibold">
                {c.form.unit}
              </label>
              <select
                id="product-unit"
                {...form.register('unit')}
                className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
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

            <div>
              <label htmlFor="product-qty" className="mb-1.5 block text-sm font-semibold">
                {c.form.quantity}
              </label>
              <input
                id="product-qty"
                type="number"
                min="0"
                step="0.01"
                {...form.register('quantity', { valueAsNumber: true })}
                className="w-full min-h-12 rounded-xl border bg-surface px-4 text-base outline-none focus:ring-2 focus:ring-te"
              />
              {errors.quantity && (
                <p role="alert" className="mt-1 text-sm text-red-500">{c.validation.positiveNumber}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* STEP 4 - Photo (optional) */}
      {step === 4 && (
        <section aria-labelledby="step4-title" data-tour="form-photo">
          <h2 id="step4-title" className="mb-1 text-xl font-extrabold">
            {t.seller.productForm.step4}
          </h2>
          <p className="mb-4 text-sm text-muted">{c.form.imageOptional}</p>
          <ProductImageUploader
            currentImageUrls={imageUrls}
            onImagesChange={(urls) => {
              setValue('image_urls', urls, { shouldValidate: true });
              setValue('image_url', urls[0] ?? '', { shouldValidate: false });
            }}
          />
        </section>
      )}

      {/* STEP 5 - Preview & Publish */}
      {step === 5 && (
        <section aria-labelledby="step5-title" data-tour="form-preview">
          <h2 id="step5-title" className="mb-4 text-xl font-extrabold">
            {c.form.previewTitle}
          </h2>

          <div className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
            {/* Image */}
            <div className="relative flex h-48 w-full items-center justify-center bg-surface-muted sm:h-56">
              {imageUrls[0] ? (
                <Image
                  src={imageUrls[0]}
                  alt={getValues('name')}
                  fill
                  className="object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-muted/40" aria-hidden="true" />
              )}
            </div>

            {/* Details */}
            <div className="space-y-3 p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {t.categories[getValues('category') as CategoryKey]}
                </p>
                <h3 className="mt-0.5 text-xl font-extrabold leading-6">{getValues('name')}</h3>
              </div>

              <p className="text-2xl font-extrabold tracking-tight">
                {getValues('price').toLocaleString()} HTG
                <span className="ml-1.5 text-sm font-semibold text-muted">
                  / {c.units[selectedUnit] ?? selectedUnit}
                </span>
              </p>

              <div className="flex items-center gap-2 text-sm text-muted">
                <span className="font-semibold">{c.form.quantity}:</span>
                <span>{getValues('quantity')}</span>
              </div>

              {getValues('description') && (
                <p className="text-sm leading-6 text-muted">{getValues('description')}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={goPrev}
            disabled={isSubmitting}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-surface px-4 text-base font-semibold text-foreground transition hover:bg-surface-muted disabled:opacity-60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {c.common.back}
          </button>
        )}

        {step < TOTAL_STEPS ? (
          step === 1 ? (
            // Step 1 - tiles auto-advance; show Continue for keyboard users
            <button
              type="button"
              onClick={validateAndNext}
              disabled={isSubmitting}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90 disabled:opacity-60"
            >
              {c.form.save}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={validateAndNext}
              disabled={isSubmitting}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90 disabled:opacity-60"
            >
              {c.form.save}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            data-tour="form-publish"
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-te px-4 text-base font-extrabold text-white dark:text-background transition hover:bg-te/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                {c.form.publishing}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                {c.form.previewPublish}
              </>
            )}
          </button>
        )}
      </div>

      {/* Cancel - only on step 1 */}
      {step === 1 && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/dashboard/products`)}
            className="text-sm font-semibold text-muted hover:text-foreground"
          >
            {c.form.cancel}
          </button>
        </div>
      )}
    </div>
  );
}
