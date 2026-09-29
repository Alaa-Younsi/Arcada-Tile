import { useTranslation } from 'react-i18next';
import { useLang } from '@/hooks/useLang';
import type { Lang } from '@/types';

// The 'ع' glyph uses the system font so a French/English page doesn't
// download the Arabic webfont just to draw one letter.
const OPTIONS: ReadonlyArray<{ code: Lang; label: string; name: string; fontCls: string }> = [
  { code: 'en', label: 'EN', name: 'English', fontCls: 'font-sans' },
  { code: 'fr', label: 'FR', name: 'Français', fontCls: 'font-sans' },
  { code: 'ar', label: 'ع', name: 'العربية', fontCls: 'font-[family-name:system-ui]' },
];

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = useLang();

  // Persistence and <html lang/dir> are handled by the i18n setup.
  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{t('nav.language')}</legend>
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          lang={opt.code}
          onClick={() => void i18n.changeLanguage(opt.code)}
          aria-label={opt.name}
          aria-pressed={current === opt.code}
          className={`px-2 py-1 ${opt.fontCls} text-[11px] uppercase tracking-[0.2em] transition-colors ${
            current === opt.code ? 'text-accent border-b border-accent' : 'text-muted hover:text-dark'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </fieldset>
  );
}
