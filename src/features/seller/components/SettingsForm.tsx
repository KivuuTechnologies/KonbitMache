'use client';

import { useTheme } from 'next-themes';
import { useLanguage } from '@/shared/i18n/LanguageProvider';
import { useTranslations } from '@/shared/i18n/useTranslations';
import { SUPPORTED_LOCALES } from '@/shared/i18n/types';
import { SignOutButton } from '@/features/auth/components/SignOutButton';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  locale: string;
}

export function SettingsForm({ locale }: SettingsFormProps) {
  void locale;
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const { locale: currentLocale, setLocale } = useLanguage();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as 'ht' | 'fr' | 'es' | 'en');
    router.push(`/${newLocale}/dashboard/settings`);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.settings.language}</h2>
        <div className="space-y-3">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-base font-semibold transition ${
                currentLocale === lang
                  ? 'bg-te text-white dark:text-background'
                  : 'bg-surface-muted text-foreground hover:bg-surface-muted/80'
              }`}
            >
              <span>{lang.toUpperCase()}</span>
              {currentLocale === lang && <span className="text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.settings.theme}</h2>
        <div className="space-y-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-base font-semibold transition ${
              theme === 'light'
                ? 'bg-te text-white dark:text-background'
                : 'bg-surface-muted text-foreground hover:bg-surface-muted/80'
            }`}
          >
            <span>{t.common.light}</span>
            {theme === 'light' && <span className="text-sm">✓</span>}
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-base font-semibold transition ${
              theme === 'dark'
                ? 'bg-te text-white dark:text-background'
                : 'bg-surface-muted text-foreground hover:bg-surface-muted/80'
            }`}
          >
            <span>{t.common.dark}</span>
            {theme === 'dark' && <span className="text-sm">✓</span>}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-surface p-6">
        <h2 className="mb-4 text-lg font-extrabold">{t.seller.settings.security}</h2>
        <SignOutButton />
      </div>
    </div>
  );
}
