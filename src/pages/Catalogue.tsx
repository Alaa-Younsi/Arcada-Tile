import { m } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { CATEGORIES, getFlatVariantsByCategory } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';

const sidebarItemCls = (active: boolean) =>
  `block w-full text-start font-sans text-sm py-2.5 border-b border-border/60 transition-colors duration-200 ${
    active ? 'text-accent' : 'text-muted hover:text-dark'
  }`;

const chipCls = (active: boolean) =>
  `flex-shrink-0 font-sans text-xs px-4 py-2 rounded-full border transition-colors duration-200 ${
    active ? 'border-accent bg-accent text-white' : 'border-border text-muted hover:border-accent hover:text-accent'
  }`;

export default function Catalogue() {
  const { t } = useTranslation();
  const lang = useLang();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Every collection is always rendered; the filter jumps to it and highlights it.
  const showAll = () => {
    setActiveSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToCategory = (slug: string) => {
    setActiveSlug(slug);
    sectionRefs.current[slug]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEOHead
        title="Catalogue — 12 Collections de Carreaux Céramiques | ARCADA"
        description="Explorez tous les produits ARCADA. Découvrez les 12 collections — Silos, Atelier, Ducal, Leaf, Chic, Casbah et plus, fabriquées en Algérie."
        breadcrumbs={[
          { name: 'ARCADA', path: '/' },
          { name: t('nav.catalogue'), path: '/catalogue' },
        ]}
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 pt-32 pb-28 flex gap-16">
        {/* Desktop sidebar */}
        <aside className="w-52 flex-shrink-0 hidden lg:block">
          <nav aria-label={t('catalogue.filterBy')} className="sticky top-28">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted mb-6">
              {t('catalogue.filterBy')}
            </p>
            <button type="button" onClick={showAll} className={sidebarItemCls(activeSlug === null)}>
              {t('catalogue.allCollections')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => scrollToCategory(cat.slug)}
                className={sidebarItemCls(activeSlug === cat.slug)}
              >
                {cat.name[lang]}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t('catalogue.allCollections')}
            </p>
            <h1 className="font-display font-light text-dark mb-4 text-[clamp(36px,5vw,72px)]">
              {t('catalogue.title')}
            </h1>
            <p className="font-sans text-muted text-sm max-w-xl tracking-wide leading-relaxed">
              {t('catalogue.subtitle')}
            </p>
          </m.div>

          {/* Mobile filter chips */}
          <nav
            aria-label={t('catalogue.filterBy')}
            className="lg:hidden -mx-1 mb-12 flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            <button type="button" onClick={showAll} className={chipCls(activeSlug === null)}>
              {t('catalogue.allCollections')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => scrollToCategory(cat.slug)}
                className={chipCls(activeSlug === cat.slug)}
              >
                {cat.name[lang]}
              </button>
            ))}
          </nav>

          <div className="space-y-20">
            {CATEGORIES.map((cat) => {
              const flatVariants = getFlatVariantsByCategory(cat.slug);
              if (!flatVariants.length) return null;
              return (
                <section
                  key={cat.slug}
                  ref={(el) => {
                    sectionRefs.current[cat.slug] = el;
                  }}
                  aria-labelledby={`collection-${cat.slug}`}
                  className="scroll-mt-28"
                >
                  <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{cat.shape}</p>
                      <h2 id={`collection-${cat.slug}`} className="font-display font-light text-dark text-3xl">
                        {cat.name[lang]}
                      </h2>
                    </div>
                    <Link
                      to={`/catalogue/${cat.slug}`}
                      className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted hover:text-accent transition-colors hidden sm:inline-flex items-center gap-2 group"
                    >
                      {t('common.viewAll')}
                      <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-300" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {flatVariants.map((fv) => (
                      <ProductCard key={fv.variantId} variant={fv} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
