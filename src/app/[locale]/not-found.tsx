import Link from 'next/link';
import type { Metadata } from 'next';
import { Sprout, ArrowLeft } from 'lucide-react';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: '404 | KonbitMache',
  description: 'Page not found',
};

/** Translations for the 404 page across all 4 supported locales */
const copy = {
  ht: {
    code: 'Paj la pa jwenn',
    title: 'Paj la pa egziste',
    body: 'Lyen an pa bon oswa paj la pa la ankò Retounen nan paj prensipal la',
    back: 'Retounen',
    categories: 'Wè kategori yo',
  },
  fr: {
    code: 'Page introuvable',
    title: 'Cette page n\u2019existe pas',
    body: 'Le lien est incorrect ou la page a été supprimée Revenez à l\u2019accueil',
    back: 'Retour',
    categories: 'Voir les catégories',
  },
  es: {
    code: 'Página no encontrada',
    title: 'Esta página no existe',
    body: 'El enlace es incorrecto o la página fue eliminada Vuelve al inicio',
    back: 'Volver',
    categories: 'Ver categorías',
  },
  en: {
    code: 'Page not found',
    title: 'This page does not exist',
    body: 'The link is broken or the page was removed Go back to the homepage',
    back: 'Go back',
    categories: 'Browse categories',
  },
} as const;

type SupportedLocale = keyof typeof copy;

function isSupportedLocale(value: string): value is SupportedLocale {
  return value in copy;
}

interface PageProps { params?: Promise<{ locale: string }>; }

/**
 * Locale-scoped 404 page — rendered when notFound() is called inside [locale]
 * Picks the correct language from the URL segment
 * Falls back to Haitian Kreyòl if the locale is not recognised
 */
export default async function LocaleNotFound({ params }: PageProps) {
  let locale = params ? (await params)?.locale : undefined;

  if (!locale || !isSupportedLocale(locale)) {
    const headerStore = await headers();
    const headerLocale = headerStore.get('x-locale');
    if (headerLocale && isSupportedLocale(headerLocale)) {
      locale = headerLocale;
    } else {
      const pathname = headerStore.get('x-pathname') || headerStore.get('next-url') || '';
      const match = pathname.match(/^\/(ht|es|fr|en)(\/|$)/);
      locale = match && match[1] && isSupportedLocale(match[1]) ? match[1] : 'ht';
    }
  }

  const t = isSupportedLocale(locale) ? copy[locale] : copy.ht;
  const homeHref = `/${locale}`;
  const categoriesHref = `/${locale}/categorias`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center text-foreground">
      {/* brand mark */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fey/10">
        <Sprout className="h-8 w-8 text-fey" aria-hidden="true" />
      </div>

      {/* large decorative number */}
      <p
        className="text-[clamp(4rem,16vw,7rem)] font-extrabold leading-none tracking-tighter text-foreground/10 select-none"
        aria-hidden="true"
      >
        404
      </p>

      {/* human-readable label */}
      <p className="mt-1 text-sm font-bold uppercase tracking-widest text-muted">
        {t.code}
      </p>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-sm text-base leading-7 text-muted">{t.body}</p>

      {/* actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          id="not-found-home-link"
          href={homeHref}
          className="flex min-h-12 items-center gap-2 rounded-xl bg-accent px-6 text-base font-extrabold text-white shadow-sm transition hover:bg-accent-strong dark:text-background"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t.back}
        </Link>
        <Link
          id="not-found-categories-link"
          href={categoriesHref}
          className="flex min-h-12 items-center rounded-xl border border-border px-6 text-base font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground"
        >
          {t.categories}
        </Link>
      </div>
    </div>
  );
}
