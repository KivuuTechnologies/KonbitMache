import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';
import { locales, defaultLocale } from '@/i18n/config';
import { products } from '@/features/marketplace/data/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.toString().replace(/\/$/, '');

  // Static public routes that exist for every locale
  const staticPaths = [
    { path: '', priority: 1.0 as const, changeFrequency: 'daily' as const },
    { path: '/categorias', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/vendedores', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/acerca-de', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/contacto', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/ayuda', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/privacidad', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Dynamic product routes
  const productPaths = products.map((p) => ({
    path: `/ofertas/${p.id}`,
    priority: 0.8,
    changeFrequency: 'daily' as const,
  }));

  const allPaths = [...staticPaths, ...productPaths];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, priority, changeFrequency } of allPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${base}/${l}${path}`])
            ),
            'x-default': `${base}/${defaultLocale}${path}`,
          },
        },
      });
    }
  }

  return entries;
}
