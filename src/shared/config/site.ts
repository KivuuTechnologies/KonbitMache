const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://konbitmache.ht';

export const siteConfig = {
  name: 'KonbitMache',
  description: 'Mache agrikòl Ayiti konekte peyizan, koperativ ak achte yo',
  url: new URL(configuredSiteUrl),
  locale: 'ht_HT',
} as const;
