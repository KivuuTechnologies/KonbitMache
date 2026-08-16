import type { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';

// Disallow crawling of private, auth and internal routes
// All public marketplace pages remain open to indexing
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Auth flow pages
          '/*/login',
          '/*/registro',
          '/*/forgot-password',
          '/*/reset-password',
          '/*/auth',
          '/*/onboarding',
          // Private seller area
          '/*/dashboard',
          // Admin panel
          '/*/admin',
          // Internal redirects
          '/*/cuenta-suspendida',
          '/*/idioma',
        ],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteConfig.url).toString(),
  };
}
