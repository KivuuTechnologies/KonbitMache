import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/features/marketplace/components/ProductDetail';
import { getProductById, products } from '@/features/marketplace/data/catalog';
import { siteConfig, canonicalUrl, buildAlternates } from '@/shared/config/site';
import type { Locale } from '@/i18n/config';

interface ProductPageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function generateStaticParams() {
  return products.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const title = `${product.name} — ${product.location}`;
  const description = `${product.quantity} de ${product.name} disponible en ${product.location}, ${product.department}. Compra directa al productor en KonbitMache.`;
  const url = canonicalUrl(locale, `/ofertas/${product.id}`);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...buildAlternates(`/ofertas/${product.id}`),
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const productSchema = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, image: product.image, description: `${product.quantity} disponibles en ${product.location}.`, brand: { '@type': 'Brand', name: product.farmer }, offers: { '@type': 'Offer', priceCurrency: 'HTG', price: product.price.match(/[\d,]+/)?.[0]?.replace(',', '') ?? '0', availability: 'https://schema.org/InStock', url: new URL(`/ofertas/${product.id}`, siteConfig.url).toString() } };
  return (
    <>
      <ProductDetail product={product} locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    </>
  );
}
