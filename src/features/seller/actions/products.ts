'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../../../utils/supabase/server';
import { hasSupabaseEnvironment } from '../../../../utils/supabase/env';
import { getAuthenticatedUserId } from '../../../../utils/supabase/auth-helpers';
import { productSchema } from '../schemas';
import { storagePathFromUrl, storagePathsFromUrls } from '../utils/storage';
import type { ProductFormData, Product, ProductStatus } from '../types';

/** Invalidate the Router Cache app-wide after any product mutation so the
 *  dashboard counters - lists and products pages never show stale data
 */
function revalidateDashboard(): void {
  revalidatePath('/', 'layout');
}

export interface ProductActionResult {
  ok: boolean;
  message?: string;
  product?: Product;
}

export interface ImageUploadResult {
  ok: boolean;
  message?: string;
  image_url?: string;
}

const IMAGE_BUCKET = 'product-images';
const MAX_IMAGES = 5;

async function removeStorageFiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paths: string[]
): Promise<void> {
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(paths);

  if (error) {
    // A missing file must not block product deletion
    console.error('[removeStorageFiles] Storage remove error:', {
      paths,
      message: error.message,
    });
  }
}

/**
 * Uploads one product image to product-images/{user_id}/{imageId}{ext}
 * The imageId is generated server-side - never trusted from the client
 */
export async function uploadProductImageAction(
  formData: FormData
): Promise<ImageUploadResult> {
  if (!hasSupabaseEnvironment()) {
    return {
      ok: true,
      image_url:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    };
  }

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, message: 'notAuthenticated' };
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return { ok: false, message: 'noFile' };
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    console.error('[uploadProductImageAction] Invalid MIME type:', file.type);
    return { ok: false, message: 'invalidFileType' };
  }

  // 4 MB hard limit - matches the product-images bucket configuration
  const MAX_BYTES = 4 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    console.error('[uploadProductImageAction] File too large:', file.size);
    return { ok: false, message: 'fileTooBig' };
  }

  const imageId = crypto.randomUUID();
  const ext =
    file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg';
  const filePath = `${userId}/${imageId}.${ext}`;
  const bytes = await file.arrayBuffer();

  console.log('[uploadProductImageAction] Uploading:', {
    userId,
    imageId,
    filePath,
    fileType: file.type,
    fileSize: file.size,
    bucketName: IMAGE_BUCKET,
  });

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, bytes, {
      contentType: file.type,
      upsert: false, // each upload is a new UUID - no collision possible
    });

  if (uploadError) {
    console.error('[uploadProductImageAction] Storage upload error:', {
      message: uploadError.message,
      statusCode: (uploadError as unknown as Record<string, unknown>)?.statusCode,
      filePath,
    });
    return { ok: false, message: 'uploadError' };
  }

  const { data: urlData } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return { ok: true, image_url: urlData.publicUrl };
}

export async function createProductAction(
  input: ProductFormData,
  sourceLocale: 'ht' | 'fr' | 'es' | 'en' = 'ht'
): Promise<ProductActionResult> {
  if (!hasSupabaseEnvironment()) {
    const now = new Date().toISOString();
    return {
      ok: true,
      product: {
        ...input,
        id: `demo-${Math.random().toString(36).slice(2, 9)}`,
        seller_id: 'demo-seller',
        source_locale: sourceLocale,
        image_urls: input.image_urls ?? [],
        created_at: now,
        updated_at: now,
        name_translations: { [sourceLocale]: input.name },
        desc_translations: input.description ? { [sourceLocale]: input.description } : {},
      },
    };
  }

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, profile_status')
    .eq('id', userId)
    .maybeSingle();

  if (profileError || !profile) return { ok: false, message: 'profileNotFound' };
  if (profile.profile_status === 'suspended') return { ok: false, message: 'accountSuspended' };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'validationError' };

  const imageUrls = (parsed.data.image_urls ?? []).slice(0, MAX_IMAGES);

  const name_translations = { [sourceLocale]: parsed.data.name };
  const desc_translations = parsed.data.description
    ? { [sourceLocale]: parsed.data.description }
    : {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .insert({
      seller_id: userId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      price: parsed.data.price,
      unit: parsed.data.unit,
      quantity: parsed.data.quantity,
      image_urls: imageUrls,
      // Keep image_url pointing to first image for legacy compatibility
      image_url: imageUrls[0] ?? null,
      status: 'active',
      source_locale: sourceLocale,
      name_translations,
      desc_translations,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[createProductAction] Insert error:', error?.message);
    return { ok: false, message: 'insertError' };
  }

  revalidateDashboard();
  return { ok: true, product: data as Product };
}

export async function updateProductAction(
  id: string,
  input: ProductFormData,
  sourceLocale?: 'ht' | 'fr' | 'es' | 'en'
): Promise<ProductActionResult> {
  if (!hasSupabaseEnvironment()) {
    const now = new Date().toISOString();
    return {
      ok: true,
      product: {
        ...input,
        id,
        seller_id: 'demo-seller',
        source_locale: sourceLocale ?? null,
        image_urls: input.image_urls ?? [],
        created_at: now,
        updated_at: now,
        name_translations: {},
        desc_translations: {},
      },
    };
  }

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'validationError' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase.from('products') as any)
    .select('name, description, name_translations, desc_translations, source_locale')
    .eq('id', id)
    .single();

  const nameChanged = !existing || existing.name !== parsed.data.name;
  const descChanged = !existing || existing.description !== (parsed.data.description ?? null);

  const updatedNameTranslations = nameChanged
    ? sourceLocale ? { [sourceLocale]: parsed.data.name } : {}
    : (existing?.name_translations ?? {});
  const updatedDescTranslations = descChanged
    ? sourceLocale && parsed.data.description ? { [sourceLocale]: parsed.data.description } : {}
    : (existing?.desc_translations ?? {});

  const imageUrls = (parsed.data.image_urls ?? []).slice(0, MAX_IMAGES);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('products') as any)
    .update({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      category: parsed.data.category,
      price: parsed.data.price,
      unit: parsed.data.unit,
      quantity: parsed.data.quantity,
      image_urls: imageUrls,
      image_url: imageUrls[0] ?? null,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
      ...(sourceLocale ? { source_locale: sourceLocale } : {}),
      name_translations: updatedNameTranslations,
      desc_translations: updatedDescTranslations,
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('[updateProductAction] Update error:', error?.message);
    return { ok: false, message: 'updateError' };
  }

  revalidateDashboard();
  return { ok: true, product: data as Product };
}

/**
 * Removes one image from an existing product
 * DB is updated first - Storage second - if the DB update fails the file
 * stays intact - if Storage fails the file is orphaned but the product
 * remains consistent - The client sends only productId - imageUrl - the
 * Storage path is derived server-side
 */
export async function deleteProductImageAction(
  productId: string,
  imageUrl: string
): Promise<ProductActionResult> {
  if (!hasSupabaseEnvironment()) return { ok: true };

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  // RLS policy Sellers can view their own products already scopes this query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product, error: fetchError } = await (supabase.from('products') as any)
    .select('image_urls, image_url, seller_id')
    .eq('id', productId)
    .single();

  if (fetchError || !product) return { ok: false, message: 'notFound' };

  // Explicit ownership check on top of RLS
  if (product.seller_id !== userId) {
    console.error('[deleteProductImageAction] seller_id mismatch', { productId, userId });
    return { ok: false, message: 'notAuthenticated' };
  }

  // Prevent the client from passing an arbitrary URL
  const currentUrls = (product.image_urls as string[]) ?? [];
  if (!currentUrls.includes(imageUrl)) {
    console.error('[deleteProductImageAction] URL not in product.image_urls', {
      productId,
      imageUrl,
    });
    return { ok: false, message: 'notFound' };
  }

  const storagePath = storagePathFromUrl(imageUrl, IMAGE_BUCKET);
  if (storagePath !== null) {
    // First path segment must match the authenticated user id
    if (!storagePath.startsWith(`${userId}/`)) {
      console.error('[deleteProductImageAction] Storage path not owned by user', {
        userId,
        storagePath,
      });
      return { ok: false, message: 'notAuthenticated' };
    }
  }

  const updatedUrls = currentUrls.filter((u) => u !== imageUrl);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: updatedProduct, error: updateError } = await (supabase.from('products') as any)
    .update({
      image_urls: updatedUrls,
      // Keep legacy image_url pointing to the new first image - or null
      image_url: updatedUrls[0] ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single();

  if (updateError || !updatedProduct) {
    console.error('[deleteProductImageAction] DB update failed - Storage untouched:', {
      productId,
      error: updateError?.message,
    });
    return { ok: false, message: 'updateError' };
  }

  if (storagePath !== null) {
    const { error: storageError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([storagePath]);

    if (storageError) {
      // Non-fatal - DB is already consistent - Log for manual cleanup
      console.error('[deleteProductImageAction] Storage delete failed - DB already updated -', {
        storagePath,
        message: storageError.message,
      });
    }
  }

  revalidateDashboard();
  return { ok: true, product: updatedProduct as Product };
}

/**
 * Deletes an image uploaded to Storage but not yet associated with a product
 * row - Paso 4 scenario - The path is derived server-side and must start with
 * id from the authenticated user - No DB row exists yet - so nothing is touched
 */
export async function deleteOrphanImageAction(
  imageUrl: string
): Promise<{ ok: boolean; message?: string }> {
  if (!hasSupabaseEnvironment()) return { ok: true };

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  const storagePath = storagePathFromUrl(imageUrl, IMAGE_BUCKET);
  if (storagePath === null) {
    // URL does not belong to our bucket - e.g. external CDN - legacy URL
    console.warn('[deleteOrphanImageAction] URL not in product-images bucket - ignoring', imageUrl);
    return { ok: true };
  }

  if (!storagePath.startsWith(`${userId}/`)) {
    console.error('[deleteOrphanImageAction] Attempt to delete file owned by another user:', {
      userId,
      storagePath,
    });
    return { ok: false, message: 'notAuthenticated' };
  }

  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([storagePath]);
  if (error) {
    console.error('[deleteOrphanImageAction] Storage delete failed:', {
      storagePath,
      message: error.message,
    });
    return { ok: false, message: 'uploadError' };
  }

  return { ok: true };
}

export async function setProductStatusAction(
  id: string,
  status: ProductStatus
): Promise<ProductActionResult> {
  if (!hasSupabaseEnvironment()) return { ok: true };

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  // Verify ownership before updating - defense in depth
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product } = await (supabase.from('products') as any)
    .select('seller_id')
    .eq('id', id)
    .maybeSingle();

  if (!product || product.seller_id !== userId) {
    console.error('[setProductStatusAction] seller_id mismatch', { productId: id, userId });
    return { ok: false, message: 'notAuthenticated' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any)
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { ok: false, message: 'updateError' };
  revalidateDashboard();
  return { ok: true };
}

/**
 * Deletes a product and all its images from Storage
 * Storage failures are logged but not fatal - the product row is the
 * source of truth - RLS enforces ownership on the row delete
 */
export async function deleteProductAction(id: string): Promise<ProductActionResult> {
  if (!hasSupabaseEnvironment()) return { ok: true };

  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();
  if (!userId) return { ok: false, message: 'notAuthenticated' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product } = await (supabase.from('products') as any)
    .select('image_urls, image_url, seller_id')
    .eq('id', id)
    .single();

  if (product) {
    // Only delete files that belong to this seller
    if (product.seller_id === userId) {
      const allUrls: string[] = [
        ...((product.image_urls as string[]) ?? []),
        ...(product.image_url ? [product.image_url as string] : []),
      ];
      const uniqueUrls = [...new Set(allUrls)];
      const paths = storagePathsFromUrls(uniqueUrls, IMAGE_BUCKET).filter((p) =>
        p.startsWith(`${userId}/`)
      );
      await removeStorageFiles(supabase, paths);
    } else {
      console.error('[deleteProductAction] seller_id mismatch - skipping Storage delete');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('products') as any).delete().eq('id', id);
  if (error) {
    console.error('[deleteProductAction] Delete error:', error.message);
    return { ok: false, message: 'deleteError' };
  }
  revalidateDashboard();
  return { ok: true };
}