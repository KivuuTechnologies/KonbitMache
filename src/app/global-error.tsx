'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Sprout } from 'lucide-react';
import { devError } from '@/utils/logger/client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const copy = {
  ht: {
    title: 'Yon erè kritik rive',
    body: 'Yon pwoblèm inatandi rive nan nivo aplikasyon an. Tanpri rafrechi paj la.',
    retry: 'Eseye ankò',
    codeLabel: 'Kòd',
  },
  fr: {
    title: 'Une erreur critique est survenue',
    body: 'Un problème inattendu est survenu au niveau de l\u2019application. Veuillez rafraîchir la page.',
    retry: 'Réessayer',
    codeLabel: 'Code',
  },
  es: {
    title: 'Ocurrió un error crítico',
    body: 'Ocurrió un problema inesperado en la aplicación. Actualiza la página.',
    retry: 'Intentar de nuevo',
    codeLabel: 'Código',
  },
  en: {
    title: 'A critical error occurred',
    body: 'An unexpected problem happened at the application level. Please refresh the page.',
    retry: 'Try again',
    codeLabel: 'Code',
  },
} as const;

type SupportedLocale = keyof typeof copy;

function isSupportedLocale(value: string): value is SupportedLocale {
  return value in copy;
}

function detectClientLocale(): string {
  if (typeof window === 'undefined') return 'ht';

  const pathMatch = window.location.pathname.match(/^\/(ht|es|fr|en)(\/|$)/);
  if (pathMatch && pathMatch[1] && isSupportedLocale(pathMatch[1])) {
    return pathMatch[1];
  }

  const cookieMatch = document.cookie.match(/(?:^|;\s*)konbit-language=([^;]+)/);
  if (cookieMatch && cookieMatch[1] && isSupportedLocale(cookieMatch[1])) {
    return cookieMatch[1];
  }

  const navLang = navigator.language?.toLowerCase() ?? '';
  if (navLang.startsWith('ht') || navLang.startsWith('cre')) return 'ht';
  if (navLang.startsWith('fr')) return 'fr';
  if (navLang.startsWith('es')) return 'es';
  if (navLang.startsWith('en')) return 'en';

  return 'ht';
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [locale] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined') {
      const detected = detectClientLocale();
      if (isSupportedLocale(detected)) return detected;
    }
    return 'ht';
  });

  useEffect(() => {
    devError('[GlobalError]', error);
  }, [error]);

  const t = copy[locale];

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f6f3ea] px-6 text-center text-[#171413]">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2e7d32]/10">
          <Sprout className="h-8 w-8 text-[#2e7d32]" aria-hidden="true" />
        </div>

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>

        <p
          className="text-[clamp(4rem,16vw,7rem)] font-extrabold leading-none tracking-tighter text-[#171413]/10 select-none"
          aria-hidden="true"
        >
          500
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          {t.title}
        </h1>
        <p className="mt-3 max-w-sm text-base leading-7 text-[#726d66]">
          {t.body}
        </p>

        {error.digest && (
          <p className="mt-2 rounded-lg bg-black/5 px-3 py-1 font-mono text-xs text-[#726d66]/60">
            {t.codeLabel}: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-8 flex min-h-12 items-center gap-2 rounded-xl bg-[#2e7d32] px-6 text-base font-extrabold text-white shadow-sm transition hover:bg-[#1b5e20]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {t.retry}
        </button>
      </body>
    </html>
  );
}
