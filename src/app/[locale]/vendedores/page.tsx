import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/i18n/config';
import { buildPageMetadata } from '@/shared/config/site';
import { SellersPage } from '@/features/marketplace/SellersPage';
import { getTopSellers } from '@/features/marketplace/services';
import { logError } from '@/utils/logger/server';

const SELLERS_COPY: Record<Locale, { title: string; description: string }> = {
  ht: {
    title: 'Peyizan ak Vandè Agrikòl Ayiti',
    description: 'Dekouvri kiltivatè ak pwodiktè lokal nan tout depatman Ayiti',
  },
  fr: {
    title: 'Agriculteurs et Vendeurs Agricoles en Haïti',
    description: 'Découvrez les agriculteurs et producteurs locaux dans tous les départements d\'Haïti',
  },
  es: {
    title: 'Agricultores y Vendedores Agrícolas en Haití',
    description: 'Descubre agricultores y productores locales en todos los departamentos de Haití',
  },
  en: {
    title: 'Farmers & Agricultural Sellers in Haiti',
    description: 'Discover local farmers and agricultural producers across all departments of Haiti',
  },
};

export const revalidate = 60;

interface SellersPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: SellersPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = SELLERS_COPY[locale] ?? SELLERS_COPY.ht;
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    locale,
    path: '/vendedores',
  });
}

export default async function SellersRoutePage({ params }: SellersPageProps) {
  await params;

  let allSellers: Awaited<ReturnType<typeof getTopSellers>> = [];

  try {
    allSellers = await getTopSellers(1000);
  } catch (err) {
    logError('[SellersRoutePage] Data fetch failed:', err);
    allSellers = [];
  }

  return <SellersPage sellers={allSellers} />;
}
