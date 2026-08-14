import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';
import { products } from '@/features/marketplace/data/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [{ url: siteConfig.url.toString(), lastModified: now, changeFrequency: 'daily', priority: 1 }, ...products.map((product) => ({ url: new URL(`/ofertas/${product.id}`, siteConfig.url).toString(), lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }))];
}
