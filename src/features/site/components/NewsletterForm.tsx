'use client';

import { useState } from 'react';
import { MailCheck } from 'lucide-react';
import { useTranslations } from '@/shared/i18n/useTranslations';

type NewsletterStatus = 'idle' | 'success' | 'error';

interface NewsletterFormProps {
  /** Newsletter is not live yet: shown dimmed and input locked */
  disabled?: boolean;
}

export function NewsletterForm({ disabled }: NewsletterFormProps) {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setStatus(valid ? 'success' : 'error');
  };

  if (status === 'success') {
    return (
      <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-fey">
        <MailCheck className="h-4 w-4" aria-hidden="true" />
        {t.footer.newsletter.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mt-4 flex flex-col gap-3 sm:mt-3 sm:flex-row sm:gap-2">
        <label htmlFor="newsletter-email" className="sr-only">{t.footer.newsletter.emailPlaceholder}</label>
        <input
          id="newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder={t.footer.newsletter.emailPlaceholder}
          disabled={disabled}
          className="h-16 min-w-0 flex-1 rounded-2xl border border-border bg-surface px-5 text-lg text-foreground placeholder:text-base placeholder:text-muted/80 outline-none focus:border-fey disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:rounded-xl sm:px-4 sm:text-base"
        />
        <button
          type="submit"
          disabled={disabled}
          className="h-16 shrink-0 rounded-2xl bg-fey px-6 text-lg font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 dark:text-background sm:h-14 sm:rounded-xl sm:px-6 sm:text-base"
        >
          {t.footer.newsletter.subscribe}
        </button>
      </div>
      {disabled ? (
        <p className="mt-3 text-base font-semibold text-muted sm:mt-2 sm:text-sm">{t.footer.comingSoon}</p>
      ) : null}
      {status === 'error' && !disabled ? (
        <p className="mt-3 text-base font-semibold text-red-500 sm:mt-2 sm:text-sm">{t.footer.newsletter.error}</p>
      ) : null}
    </form>
  );
}
