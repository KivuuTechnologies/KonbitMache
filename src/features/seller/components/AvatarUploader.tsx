'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, Trash2, RefreshCw, Upload } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';
import { uploadAvatarAction } from '../actions/onboarding';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  onAvatarChange: (url: string) => void;
}

export function AvatarUploader({ currentAvatarUrl, onAvatarChange }: AvatarUploaderProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t.seller.onboarding.step4.invalidFileType);
      return;
    }

    setIsUploading(true);

    try {
      // Compress client-side to respect the 2MB limit
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], 'avatar.webp', {
        type: 'image/webp',
      });

      if (compressedFile.size > 2 * 1024 * 1024) {
        toast.error(t.seller.onboarding.step4.fileTooBig);
        return;
      }

      const formData = new FormData();
      formData.append('file', compressedFile);

      const tempPreview = URL.createObjectURL(compressedBlob);
      setPreviewUrl(tempPreview);

      const result = await uploadAvatarAction(formData);

      if (!result.ok || !result.avatar_url) {
        toast.error(result.message || t.seller.onboarding.errors.upload);
        setPreviewUrl(currentAvatarUrl);
        return;
      }

      setPreviewUrl(result.avatar_url);
      onAvatarChange(result.avatar_url);
      toast.success(t.seller.productForm.success);
    } catch {
      toast.error(t.seller.onboarding.errors.upload);
      setPreviewUrl(currentAvatarUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onAvatarChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {/* Avatar preview */}
      <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-te/20 bg-surface-muted shadow-inner sm:h-44 sm:w-44">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Camera className="h-12 w-12 text-muted" aria-hidden="true" />
            <span className="text-xs font-semibold">{t.seller.onboarding.step4.optionalLabel}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {!previewUrl ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-te px-6 py-3 text-lg font-bold text-white dark:text-background shadow-md transition hover:bg-te/90 focus:ring-4 focus:ring-te/30 disabled:opacity-60"
          >
            <Upload className="h-6 w-6" aria-hidden="true" />
            {t.seller.onboarding.step4.uploadButton}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-te bg-surface px-5 py-3 text-base font-bold text-te transition hover:bg-te/10 focus:ring-4 focus:ring-te/30 disabled:opacity-60"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
              {t.seller.onboarding.step4.changeButton}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-base font-bold text-red-600 transition hover:bg-red-100 focus:ring-4 focus:ring-red-200 disabled:opacity-60"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
              {t.seller.onboarding.step4.removeButton}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
