import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

/** Also rendered by the collection and product routes when their slug doesn't resolve. */
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead title="404 — Page introuvable | ARCADA" noIndex />

      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pt-24 text-center bg-bg">
        <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p
            aria-hidden="true"
            className="font-display font-light text-dark/10 text-[120px] md:text-[200px] leading-none select-none"
          >
            404
          </p>
          <h1 className="font-display text-dark font-light text-3xl mb-3">{t('common.notFound')}</h1>
          <p className="font-sans text-muted text-sm mb-8">{t('common.notFoundSub')}</p>
          <Link
            to="/"
            className="inline-block rounded-2xl px-8 py-4 bg-dark text-white font-sans text-xs uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-300"
          >
            {t('common.goHome')}
          </Link>
        </m.div>
      </div>
    </>
  );
}
