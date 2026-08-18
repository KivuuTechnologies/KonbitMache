import type { Metadata } from 'next';
import { locales, defaultLocale } from '@/i18n/config';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://konbitmache.ht';

export const siteConfig = {
  name: 'KonbitMache',
  description: 'Mache agrikòl Ayiti konekte peyizan ak achte yo',
  url: new URL(configuredSiteUrl),
  locale: 'ht_HT',
  twitterHandle: '@konbitmache',
  ogImage: '/og-image.png',
} as const;

// Build canonical URL for a given locale and path suffix
export function canonicalUrl(locale: string, path = ''): string {
  const base = siteConfig.url.toString().replace(/\/$/, '');
  return `${base}/${locale}${path}`;
}

// Build full hreflang alternates map with Kreyòl Ayisyen as default
export function buildAlternates(path = ''): Metadata['alternates'] {
  const base = siteConfig.url.toString().replace(/\/$/, '');
  return {
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
      'x-default': `${base}/${defaultLocale}${path}`,
    },
  };
}

interface PageMetadataOptions {
  title: string;
  description: string;
  locale: string;
  path: string;
  image?: string;
}

// DRY helper to generate complete standardized page metadata across all routes
export function buildPageMetadata({
  title,
  description,
  locale,
  path,
  image = siteConfig.ogImage,
}: PageMetadataOptions): Metadata {
  const url = canonicalUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...buildAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
