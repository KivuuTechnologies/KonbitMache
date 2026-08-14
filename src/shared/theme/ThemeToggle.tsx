'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from '@/shared/i18n/useTranslations';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations();
  const isDark = resolvedTheme === 'dark';

  return (
    <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex min-h-12 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-te/10 focus:outline-none focus:ring-2 focus:ring-te focus:ring-offset-2 focus:ring-offset-papye dark:focus:ring-offset-[#171413] whitespace-nowrap" aria-label={isDark ? t.common.useLight : t.common.useDark}>
      {isDark ? <Sun className="h-5 w-5 text-te" aria-hidden="true" /> : <Moon className="h-5 w-5 text-te" aria-hidden="true" />}
      <span className="hidden sm:inline">{isDark ? t.common.light : t.common.dark}</span>
    </button>
  );
}
