import { translations } from './translations';
import { useLanguage } from './LanguageProvider';

export function useTranslations() {
  const { locale } = useLanguage();
  return translations[locale];
}
