import { useTranslation } from 'react-i18next';
import { LANGS, type Lang } from '@/types';

const isLang = (v: string | undefined): v is Lang => LANGS.some((l) => l === v);

/**
 * The active UI language, narrowed to one we ship content for. Indexing
 * `Localized` records with the raw `i18n.language` is unsafe: it can be a
 * regional tag (`fr-FR`) that has no entry.
 */
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return isLang(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'fr';
}
