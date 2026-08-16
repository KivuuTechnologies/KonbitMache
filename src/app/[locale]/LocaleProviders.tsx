'use client';

import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { AppProviders } from '../providers';
import { siteConfig } from '@/shared/config/site';
import type { Locale, MarketplaceCopy } from '@/shared/i18n/types';
import { ObservabilityProvider } from '@/shared/observability/ObservabilityProvider';

const organizationSchema = ({ description }: { description: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url.toString(),
  logo: new URL('/icon.svg', siteConfig.url).toString(),
  description,
  areaServed: {
    '@type': 'Country',
    name: 'Haiti',
  },
  knowsLanguage: ['ht', 'fr', 'es', 'en'],
  sameAs: [
    'https://www.facebook.com',
    'https://www.youtube.com',
  ],
});

interface LocaleProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  t: MarketplaceCopy;
}

export function LocaleProviders({ children, locale, t }: LocaleProvidersProps) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AppProviders initialLocale={locale}>{children}</AppProviders>
      </ThemeProvider>
      <ObservabilityProvider />
      <Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema({ description: t.site?.description ?? 'KonbitMache' })) }} />
    </>
  );
}
