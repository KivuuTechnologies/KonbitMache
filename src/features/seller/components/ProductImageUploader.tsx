'use client';

// ProductImageUploader - multi-image uploader (1-5 images)
// Handles image compression, upload lifecycle, and storage deletion

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, Plus, RefreshCw, Star, Trash2 } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';
import {
  uploadProductImageAction,
  deleteProductImageAction,
  deleteOrphanImageAction,
} from '../actions/products';
import { useSellerCopy } from '../i18n/useSellerCopy';
import { toast } from 'sonner';

const MAX_IMAGES = 5;

interface ImageSlot {
  key: string;
  objectUrl: string | null;
  uploadedUrl: string | null;
  uploading: boolean;
  deleting: boolean;
}

interface ProductImageUploaderProps {
  currentImageUrls?: string[];
  productId?: string;
  onImagesChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ProductImageUploader({
  currentImageUrls = [],
  productId,
  onImagesChange,
  disabled = false,
}: ProductImageUploaderProps) {
  const c = useSellerCopy();
  const f = c.form;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [slots, setSlots] = useState<ImageSlot[]>(() =>
    currentImageUrls.map((url) => ({
      key: url,
      objectUrl: null,
      uploadedUrl: url,
      uploading: false,
      deleting: false,
    }))
  );

  // Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      slots.forEach((s) => {
        if (s.objectUrl) URL.revokeObjectURL(s.objectUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAtMax = slots.length >= MAX_IMAGES;
  const isAnyUploading = slots.some((s) => s.uploading);

  const emitChange = (updated: ImageSlot[]) => {
    onImagesChange(
      updated.map((s) => s.uploadedUrl).filter((u): u is string => u !== null)
    );
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (files.length === 0) return;

    const free = MAX_IMAGES - slots.length;
    if (files.length > free) toast.error(f.maxImagesReached);

    const toProcess = files.slice(0, free);
    if (toProcess.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of toProcess) {
      if (!validTypes.includes(file.type)) {
        toast.error(f.imageInvalidType);
        return;
      }
    }

    // Sequential - parallel uploads OOM on low-RAM devices
    for (const file of toProcess) {
      await uploadOneFile(file);
    }
  };

  const uploadOneFile = async (file: File) => {
    let compressedBlob: Blob;
    try {
      compressedBlob = await compressImage(file);
    } catch {
      toast.error(f.imageUploadError);
      return;
    }

    if (compressedBlob.size > 4 * 1024 * 1024) {
      toast.error(f.imageTooBig);
      return;
    }

    const compressedFile = new File([compressedBlob], 'product.webp', { type: 'image/webp' });
    const objectUrl = URL.createObjectURL(compressedBlob);
    const slotKey = crypto.randomUUID();

    setSlots((prev) => [
      ...prev,
      { key: slotKey, objectUrl, uploadedUrl: null, uploading: true, deleting: false },
    ]);

    try {
      const formData = new FormData();
      formData.append('file', compressedFile);
      const result = await uploadProductImageAction(formData);

      if (!result.ok || !result.image_url) {
        toast.error(f.imageUploadError);
        setSlots((prev) => {
          const failed = prev.find((s) => s.key === slotKey);
          if (failed?.objectUrl) URL.revokeObjectURL(failed.objectUrl);
          const next = prev.filter((s) => s.key !== slotKey);
          emitChange(next);
          return next;
        });
        return;
      }

      setSlots((prev) => {
        const next = prev.map((s) =>
          s.key === slotKey
            ? { ...s, uploadedUrl: result.image_url!, uploading: false }
            : s
        );
        emitChange(next);
        return next;
      });
    } catch {
      toast.error(f.imageUploadError);
      setSlots((prev) => {
        const failed = prev.find((s) => s.key === slotKey);
        if (failed?.objectUrl) URL.revokeObjectURL(failed.objectUrl);
        const next = prev.filter((s) => s.key !== slotKey);
        emitChange(next);
        return next;
      });
    }
  };

  const handleRemove = async (key: string) => {
    const slot = slots.find((s) => s.key === key);
    if (!slot || slot.uploading || slot.deleting) return;

    // Case C guard: slot not yet uploaded (shouldn't be reachable - button is
    // hidden while uploading - but handle defensively)
    if (!slot.uploadedUrl) {
      // Only a local preview exists; just remove the slot
      setSlots((prev) => {
        const s = prev.find((x) => x.key === key);
        if (s?.objectUrl) URL.revokeObjectURL(s.objectUrl);
        const next = prev.filter((x) => x.key !== key);
        emitChange(next);
        return next;
      });
      return;
    }

    // Mark this slot as deleting to disable its button and show spinner
    setSlots((prev) =>
      prev.map((s) => (s.key === key ? { ...s, deleting: true } : s))
    );

    try {
      let result: { ok: boolean; message?: string };

      if (productId) {
        // Case A: image is persisted in an existing product.
        // Server Action: UPDATE DB first, then DELETE from Storage
        result = await deleteProductImageAction(productId, slot.uploadedUrl);
      } else {
        // Case B: image was uploaded but no product row exists yet.
        // Server Action: DELETE from Storage only (no DB row to update)
        result = await deleteOrphanImageAction(slot.uploadedUrl);
      }

      if (!result.ok) {
        // Server refused - keep the slot, show error, clear deleting flag
        toast.error(f.imageUploadError);
        setSlots((prev) =>
          prev.map((s) => (s.key === key ? { ...s, deleting: false } : s))
        );
        return;
      }

      // Server confirmed deletion - remove the slot from the grid
      setSlots((prev) => {
        const removed = prev.find((s) => s.key === key);
        if (removed?.objectUrl) URL.revokeObjectURL(removed.objectUrl);
        const next = prev.filter((s) => s.key !== key);
        emitChange(next);
        return next;
      });
    } catch {
      toast.error(f.imageUploadError);
      setSlots((prev) =>
        prev.map((s) => (s.key === key ? { ...s, deleting: false } : s))
      );
    }
  };

  const triggerPicker = () => {
    if (!disabled && !isAnyUploading && !isAtMax) {
      fileInputRef.current?.click();
    }
  };

  const slotSrc = (slot: ImageSlot): string =>
    slot.uploadedUrl ?? slot.objectUrl ?? '';

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={handleFileSelect}
        disabled={disabled || isAnyUploading || isAtMax}
        aria-label={f.addImage}
      />

      {/* Image grid */}
      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {slots.map((slot, index) => {
            const isBusy = slot.uploading || slot.deleting;
            return (
              <div
                key={slot.key}
                className="relative aspect-square overflow-hidden rounded-xl border bg-surface-muted"
              >
                <Image
                  src={slotSrc(slot)}
                  alt={`${f.images ?? 'Image'} ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />

                {/* Primary badge on first slot */}
                {index === 0 && (
                  <span className="pointer-events-none absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-soley">
                    <Star className="h-3 w-3 text-background" aria-hidden="true" />
                  </span>
                )}

                {/* Busy overlay - uploading or deleting */}
                {isBusy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <RefreshCw className="h-6 w-6 animate-spin text-white" aria-hidden="true" />
                  </div>
                )}

                {/* Remove button - hidden while busy */}
                {!isBusy && !disabled && (
                  <button
                    type="button"
                    onClick={() => void handleRemove(slot.key)}
                    aria-label={f.removeImage}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add-more slot */}
          {!isAtMax && (
            <button
              type="button"
              onClick={triggerPicker}
              disabled={disabled || isAnyUploading}
              aria-label={f.addImage}
              title={f.addImage}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-surface-muted bg-surface text-muted transition hover:border-te/60 hover:text-te focus-visible:ring-4 focus-visible:ring-te/30 disabled:opacity-50"
            >
              <Plus className="h-7 w-7" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {slots.length === 0 && (
        <button
          type="button"
          onClick={triggerPicker}
          disabled={disabled}
          className="flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-surface-muted bg-surface-muted text-muted transition hover:border-te/60 hover:te focus-visible:ring-4 focus-visible:ring-te/30 disabled:opacity-50"
        >
          <Camera className="h-12 w-12 text-muted" aria-hidden="true" />
          <span className="text-sm font-semibold">
            {f.addImage}
            <br />
            <span className="text-xs font-normal opacity-60">{f.imageOptional}</span>
          </span>
        </button>
      )}

      {/* Persistent max-reached banner */}
      {isAtMax && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-surface-muted px-3 py-2 text-center text-sm font-semibold text-muted"
        >
          {f.maxImagesReached}
        </p>
      )}

      {/* Count indicator */}
      {slots.length > 0 && !isAtMax && (
        <p className="text-right text-xs text-muted" aria-live="polite">
          {slots.length} / {MAX_IMAGES}
        </p>
      )}
    </div>
  );
}
