import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Sitelinks Searchbox JSON-LD schema
export function getWebSiteJsonLd(siteUrl: string, searchUrlTemplate: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KonbitMache',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// BreadcrumbList JSON-LD schema
export function getBreadcrumbsJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
