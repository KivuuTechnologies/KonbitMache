import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Globe2 } from 'lucide-react';
import { isLocale } from '@/i18n/config';
import { SUPPORTED_LOCALES, type Locale } from '@/shared/i18n/types';
import { translations } from '@/shared/i18n/translations';
import { MarketplaceHeader } from '@/features/marketplace/components/MarketplaceHeader';
import { SiteFooter } from '@/features/site/components/SiteFooter';

const languageNames: Record<Locale, string> = { ht: 'Kreyòl Ayisyen', fr: 'Français', es: 'Español', en: 'English' };
const languageTaglines: Record<Locale, Record<Locale, string>> = {
  es: { ht: 'Lengua del país', fr: 'Lengua oficial', es: 'El idioma de la región', en: 'El idioma internacional' },
  ht: { ht: 'Lang peyi a', fr: 'Lang ofisyèl', es: 'Lang rejyon an', en: 'Lang entènasyonal' },
  fr: { ht: 'La langue du pays', fr: 'La langue officielle', es: 'La langue de la région', en: 'La langue internationale' },
  en: { ht: 'The country’s language', fr: 'The official language', es: 'The regional language', en: 'The international language' },
};

const languageCopy: Record<Locale, { title: string; subtitle: string }> = {
  es: { title: 'Elige tu idioma', subtitle: 'Selecciona el idioma en el que prefieres usar KonbitMache' },
  ht: { title: 'Chwazi lang ou', subtitle: 'Chwazi lang ou prefere pou itilize KonbitMache' },
  fr: { title: 'Choisissez votre langue', subtitle: 'Sélectionnez la langue dans laquelle vous préférez utiliser KonbitMache' },
  en: { title: 'Choose your language', subtitle: 'Select the language you prefer to use KonbitMache in' },
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = languageCopy[locale];
  return { title: copy.title, description: copy.subtitle };
}

export default async function LanguagePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = translations[locale];
  const copy = languageCopy[locale];
  const taglines = languageTaglines[locale];

  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <MarketplaceHeader copy={t} locale={locale} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-fey">KonbitMache</p>
        <h1 className="mt-2 text-[clamp(2rem,6vw,2.75rem)] font-extrabold tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{copy.subtitle}</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {SUPPORTED_LOCALES.map((code) => (
            <Link
              key={code}
              href={`/${code}/idioma`}
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-border/50 bg-surface-muted p-5 transition hover:border-fey/60 hover:bg-surface-muted/80"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fey/10 text-fey">
                <Globe2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-extrabold">{languageNames[code]}</span>
                <span className="mt-0.5 block text-sm text-muted">{taglines[code]}</span>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter copy={t} locale={locale} />
    </div>
  );
}
