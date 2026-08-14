'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProductAction } from '../actions/products';
import { useSellerCopy } from '../i18n/useSellerCopy';

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const c = useSellerCopy();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    const result = await deleteProductAction(productId);
    setIsDeleting(false);

    if (!result.ok) {
      toast.error(result.message === 'deleteError' ? c.form.errorGeneric : c.form.errorNotAuthenticated);
      return;
    }

    setIsOpen(false);
    toast.success(c.moderation.deleted);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/30"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {c.moderation.deleteButton}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={c.moderation.deleteConfirm}
        >
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-extrabold">{c.moderation.deleteConfirm}</h3>
            <p className="mt-1 text-sm text-muted">{c.moderation.note}</p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="min-h-10 rounded-xl bg-surface-muted px-4 text-sm font-bold text-foreground transition hover:bg-surface-muted/80 disabled:opacity-60"
              >
                {c.form.cancel}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="min-h-10 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? c.form.saving : c.products.delete}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
