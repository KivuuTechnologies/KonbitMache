import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { siteConfig } from '@/shared/config/site';

export const viewport: Viewport = {
  themeColor: '#2e7d32',
  width: 'device-width',
  initialScale: 1,
};

// Base metadata — every page inherits and overrides these
export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: 'KonbitMache | Mache agrikòl Ayiti',
    template: '%s | KonbitMache',
  },
  description: siteConfig.description,
  keywords: [
    'marketplace agricole Haiti',
    'mache agrikol Ayiti',
    'produits agricoles Haiti',
    'vendre agriculture Haiti',
    'pwodiksyon lokal Haiti',
    'konbit mache',
    'peyizan Haiti',
  ],
  authors: [{ name: 'KonbitMache', url: siteConfig.url.toString() }],
  creator: 'KonbitMache',
  publisher: 'KonbitMache',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: '/',
    languages: { ht: '/ht', fr: '/fr', es: '/es', en: '/en', 'x-default': '/ht' },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'KonbitMache | Mache agrikòl Ayiti',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'KonbitMache | Mache agrikòl Ayiti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: 'KonbitMache | Mache agrikòl Ayiti',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang is overridden per-locale by the [locale] layout via <html lang={locale}>
    // Using "mul" here as fallback for the root shell (no locale detected yet)
    <html lang="mul" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://storage.ko-fi.com" />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
