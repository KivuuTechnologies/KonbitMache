import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { siteConfig } from '@/shared/config/site';

export const viewport: Viewport = {
  themeColor: '#2e7d32',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  title: { default: 'KonbitMache | Mache agrikòl Ayiti', template: '%s | KonbitMache' },
  description: 'Mache agrikòl Ayiti konekte peyizan, koperativ ak achte yo',
  alternates: {
    canonical: '/',
    languages: {
      ht: '/ht',
      fr: '/fr',
      es: '/es',
      en: '/en',
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ht" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
