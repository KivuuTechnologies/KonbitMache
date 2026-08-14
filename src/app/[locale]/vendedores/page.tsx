import { SellersPage } from '@/features/marketplace/SellersPage';
import { getTopSellers } from '@/features/marketplace/services';
import type { Locale } from '@/i18n/config';

interface SellersPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function SellersRoutePage({ params }: SellersPageProps) {
  await params;

  let allSellers: Awaited<ReturnType<typeof getTopSellers>> = [];

  try {
    // Get all sellers for the full listing page
    allSellers = await getTopSellers(1000);
  } catch (err) {
    console.error('[SellersRoutePage] Data fetch failed:', err);
    allSellers = [];
  }

  return <SellersPage sellers={allSellers} />;
}