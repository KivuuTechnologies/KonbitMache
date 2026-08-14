import { translations } from '@/shared/i18n/translations';
import type { AuthErrorKey, AuthValidationKey, Locale } from '@/shared/i18n/types';

interface SupabaseErrorLike {
  code?: string;
  message?: string;
}

export function getAuthErrorMessage(locale: Locale, key: AuthErrorKey) {
  return translations[locale].auth.errors[key];
}

export function getAuthValidationMessage(locale: Locale, key: string) {
  const validationKey = key as AuthValidationKey;
  return translations[locale].auth.validation[validationKey] ?? translations[locale].auth.errors.generic;
}

/** Maps provider errors to safe, localized messages without exposing internals */
export function translateSupabaseAuthError(locale: Locale, error: SupabaseErrorLike | null) {
  const message = error?.message?.toLowerCase() ?? '';
  const code = error?.code?.toLowerCase() ?? '';

  let key: AuthErrorKey = 'generic';
  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) key = 'invalidCredentials';
  else if (message.includes('email not confirmed')) key = 'emailNotConfirmed';
  else if (message.includes('already registered') || message.includes('already exists') || code === 'user_already_exists') key = 'emailAlreadyRegistered';
  else if (message.includes('password') && (message.includes('least') || message.includes('weak') || message.includes('require'))) key = 'passwordRequirements';
  else if (message.includes('rate limit') || message.includes('too many requests')) key = 'rateLimited';
  else if (message.includes('session') || message.includes('token')) key = 'sessionExpired';
  else if (message.includes('provider') || message.includes('oauth')) key = 'oauthUnavailable';

  return getAuthErrorMessage(locale, key);
}
