'use client';

import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { sellerCopy, type SellerCopy } from './copy';

/**
 * Reactive access to Seller Portal copy on the client. Uses the existing
 * `LanguageProvider`, so switching language updates the portal live
 */
export function useSellerCopy(): SellerCopy {
  const { locale } = useLanguage();
  return sellerCopy[locale];
}
