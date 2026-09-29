import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { LANGS } from '@/types';
import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

/** Keeps <html lang/dir> in step with the UI language (RTL for Arabic). */
const applyDocumentLanguage = (lng: string | undefined) => {
  const lang = lng ?? 'fr';
  document.documentElement.lang = lang;
  document.documentElement.dir = i18n.dir(lang);
};

i18n.on('languageChanged', applyDocumentLanguage);

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    supportedLngs: [...LANGS],
    // French is the site's primary language (metadata, <html lang>, sitemap).
    fallbackLng: 'fr',
    load: 'languageOnly',
    detection: {
      // An explicit choice wins, then the browser language (fr-DZ → fr, ar-DZ → ar).
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'arcada_lang',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => lng.split('-')[0],
    },
    interpolation: {
      // React already escapes rendered strings.
      escapeValue: false,
    },
  });

applyDocumentLanguage(i18n.resolvedLanguage);

export default i18n;
