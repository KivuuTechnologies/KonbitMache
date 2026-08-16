'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft, Sprout } from 'lucide-react';
import { devError } from '@/utils/logger/client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const copy = {
  ht: {
    title: 'Yon erè rive',
    body: 'Yon pwoblèm inatandi rive Tanpri mete paj la ajou oswa retounen nan paj prensipal la',
    retry: 'Eseye ankò',
    home: 'Paj prensipal',
    code: 'Kòd erè',
  },
  fr: {
    title: 'Une erreur est survenue',
    body: 'Un problème inattendu est survenu Veuillez réessayer ou retourner à la page d\u2019accueil',
    retry: 'Réessayer',
    home: 'Page d\u2019accueil',
    code: 'Code d\u2019erreur',
  },
  es: {
    title: 'Ocurrió un error',
    body: 'Ocurrió un problema inesperado Inténtalo de nuevo o regresa a la página principal',
    retry: 'Intentar de nuevo',
    home: 'Página principal',
    code: 'Código de error',
  },
  en: {
    title: 'An error occurred',
    body: 'An unexpected problem occurred Please try again or return to the main homepage',
    retry: 'Try again',
    home: 'Home page',
    code: 'Error code',
  },
} as const;

type SupportedLocale = keyof typeof copy;

export default function LocaleError({ error, reset }: ErrorPageProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ht';
  const t = locale in copy ? copy[locale as SupportedLocale] : copy.ht;
  const homeHref = `/${locale}`;

  useEffect(() => {
    devError('[LocaleError]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center text-foreground">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fey/10">
        <Sprout className="h-8 w-8 text-fey" aria-hidden="true" />
      </div>

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger-bg">
        <AlertTriangle className="h-6 w-6 text-danger" aria-hidden="true" />
      </div>

      <p className="text-[clamp(4rem,16vw,7rem)] font-extrabold leading-none tracking-tighter text-foreground/10 select-none" aria-hidden="true">
        500
      </p>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-sm text-base leading-7 text-muted">
        {t.body}
      </p>

      {error.digest && (
        <p className="mt-2 rounded-lg bg-surface-muted px-3 py-1 font-mono text-xs text-muted/60">
          {t.code}: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="flex min-h-12 items-center gap-2 rounded-xl bg-accent px-6 text-base font-extrabold text-white shadow-sm transition hover:bg-accent-strong dark:text-background"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {t.retry}
        </button>
        <Link
          href={homeHref}
          className="flex min-h-12 items-center gap-2 rounded-xl border border-border px-6 text-base font-semibold text-muted transition hover:bg-surface-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t.home}
        </Link>
      </div>
    </div>
  );
}
