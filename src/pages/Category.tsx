import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { CATEGORIES, getCategory, getFlatVariantsByCategory } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';
import { HIGH_FETCH_PRIORITY } from '@/lib/fetchPriority';
import NotFound from './NotFound';

export default function Category() {
  const { categorySlug = '' } = useParams<{ categorySlug: string }>();
  const { t } = useTranslation();
  const lang = useLang();

  const category = getCategory(categorySlug);
  if (!category) return <NotFound />;

  const flatVariants = getFlatVariantsByCategory(categorySlug);

  return (
    <>
      <SEOHead
        title={`Collection ${category.name.fr} — Carreaux ${category.shape} | ARCADA`}
        description={`${category.description.fr} ${flatVariants.length} coloris disponibles, fabriqués en Algérie par ARCADA.`}
        breadcrumbs={[
          { name: 'ARCADA', path: '/' },
          { name: t('nav.catalogue'), path: '/catalogue' },
          { name: category.name[lang], path: `/catalogue/${categorySlug}` },
        ]}
      />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img
          src={category.image}
          alt={`Collection ${category.name[lang]} — carreaux céramiques ${category.shape} par ARCADA`}
          width={800}
          height={1000}
          {...HIGH_FETCH_PRIORITY}
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/50" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-16 max-w-screen-2xl mx-auto">
          <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/60 mb-3">
              {t('product.category')}
            </p>
            <h1 className="font-display font-light text-white mb-3 text-[clamp(36px,5vw,72px)]">
              {category.name[lang]}
            </h1>
            <p className="font-sans text-white/70 text-sm max-w-xl leading-relaxed tracking-wide mb-2">
              {category.description[lang]}
            </p>
            <p className="font-sans text-white/40 text-xs tracking-widest uppercase">{category.shape}</p>
          </m.div>
        </div>
      </div>

      <nav
        aria-label={t('common.breadcrumb')}
        className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-6 flex items-center gap-2 font-sans text-xs text-muted tracking-wide"
      >
        <Link to="/catalogue" className="hover:text-accent transition-colors">
          {t('nav.catalogue')}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-dark">
          {category.name[lang]}
        </span>
      </nav>

      <section className="max-w-screen-2xl mx-auto px-6 lg:px-16 pb-28">
        {flatVariants.length === 0 ? (
          <p className="font-sans text-muted text-sm py-20 text-center">{t('catalogue.emptyCollection')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {flatVariants.map((fv) => (
              <ProductCard key={fv.variantId} variant={fv} />
            ))}
          </div>
        )}
      </section>

      {/* Other collections */}
      <section className="bg-surface-warm py-16 px-6 lg:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="font-sans font-normal text-[10px] uppercase tracking-[0.3em] text-muted mb-8">
            {t('common.discover')}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {CATEGORIES.filter((c) => c.slug !== categorySlug).map((cat) => (
              <Link key={cat.slug} to={`/catalogue/${cat.slug}`} className="flex-shrink-0 group">
                <div className="w-40 h-40 overflow-hidden bg-surface relative rounded-xl">
                  <img
                    src={cat.image}
                    alt=""
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/10 transition-colors" />
                </div>
                <p className="font-sans text-xs text-dark mt-2 tracking-wide">{cat.name[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
