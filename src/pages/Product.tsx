import { m } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { whatsAppUrl } from '@/config/site';
import { getCategory, getFlatVariantsByCategory, getProduct } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';
import { HIGH_FETCH_PRIORITY } from '@/lib/fetchPriority';
import type { CatalogueProduct, ColorVariant, Lang } from '@/types';
import NotFound from './NotFound';

interface SwatchesProps {
  product: CatalogueProduct;
  selected: ColorVariant;
  lang: Lang;
  label: string;
  onSelect: (v: ColorVariant) => void;
}

function Swatches({ product, selected, lang, label, onSelect }: SwatchesProps) {
  return (
    <>
      <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted mb-4">
        {label} — <span className="text-dark normal-case">{selected.name[lang]}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {product.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v)}
            title={v.name[lang]}
            aria-label={v.name[lang]}
            aria-pressed={selected.id === v.id}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              selected.id === v.id ? 'border-dark scale-110' : 'border-border'
            }`}
            // Swatch colour is catalogue data, not a design token.
            style={{ backgroundColor: v.hex }}
          />
        ))}
      </div>
    </>
  );
}

export default function Product() {
  const { categorySlug = '', productSlug = '' } = useParams<{ categorySlug: string; productSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const lang = useLang();

  const product = getProduct(categorySlug, productSlug);
  const category = getCategory(categorySlug);
  if (!product || !category) return <NotFound />;

  // The URL is the source of truth for the selected colour: it survives
  // reloads, is shareable, and stays correct when navigating between products
  // (the route component is reused, so local state would carry over).
  const selectedVariant = product.variants.find((v) => v.id === searchParams.get('variant')) ?? product.variants[0];

  const selectVariant = (v: ColorVariant, scrollToImage = false) => {
    setSearchParams({ variant: v.id }, { replace: true, preventScrollReset: true });
    if (scrollToImage) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const related = getFlatVariantsByCategory(categorySlug)
    .filter((fv) => fv.productSlug !== productSlug)
    .slice(0, 3);

  const productPath = `/catalogue/${categorySlug}/${productSlug}`;
  const whatsAppMessage = `Bonjour ARCADA,\n\nJe suis intéressé par : ${product.name.fr} · ${selectedVariant.name.fr}\n\nMerci de me contacter.`;

  return (
    <>
      <SEOHead
        title={`${product.name.fr} ${selectedVariant.name.fr} — ${product.size} | ARCADA`}
        description={`${product.description.fr} Format ${product.size}, finition ${product.finish}. Fabriqué en Algérie par ARCADA.`}
        type="product"
        breadcrumbs={[
          { name: 'ARCADA', path: '/' },
          { name: t('nav.catalogue'), path: '/catalogue' },
          { name: category.name[lang], path: `/catalogue/${categorySlug}` },
          { name: product.name[lang], path: productPath },
        ]}
        productSchema={{
          name: product.name.fr,
          description: product.description.fr,
          image: product.variants[0].image,
          sku: product.slug,
        }}
      />

      <nav
        aria-label={t('common.breadcrumb')}
        className="pt-28 px-6 lg:px-16 max-w-screen-2xl mx-auto flex flex-wrap items-center gap-2 font-sans text-xs text-muted tracking-wide"
      >
        <Link to="/catalogue" className="hover:text-accent transition-colors">
          {t('nav.catalogue')}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={`/catalogue/${categorySlug}`} className="hover:text-accent transition-colors">
          {category.name[lang]}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-dark">
          {product.name[lang]}
        </span>
      </nav>

      <section className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <m.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square bg-surface-warm overflow-hidden rounded-2xl">
              <img
                key={selectedVariant.id}
                src={selectedVariant.image}
                alt={`${product.name[lang]} ${selectedVariant.name[lang]} — carreau céramique ARCADA ${product.size}`}
                width={800}
                height={800}
                className="w-full h-full object-cover"
                {...HIGH_FETCH_PRIORITY}
                decoding="async"
              />
            </div>
          </m.div>

          {/* Details */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:sticky lg:top-28"
          >
            <Link
              to={`/catalogue/${categorySlug}`}
              className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.25em] text-accent hover:text-dark transition-colors mb-6"
            >
              <ChevronLeft size={12} className="rtl:rotate-180" />
              {category.name[lang]}
            </Link>

            <h1 className="font-display font-light text-dark mb-2 leading-tight text-[clamp(28px,4vw,52px)]">
              {product.name[lang]}
            </h1>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent mb-6">
              ✦&nbsp;{t('catalogue.madeBy')}
            </p>

            {/* On phones the colours sit right under the title, next to the image they change. */}
            <div className="mb-6 lg:hidden">
              <Swatches
                product={product}
                selected={selectedVariant}
                lang={lang}
                label={t('catalogue.variants')}
                onSelect={(v) => selectVariant(v, true)}
              />
            </div>

            <p className="font-sans text-muted text-sm leading-relaxed mb-8 tracking-wide">
              {product.description[lang]}
            </p>

            <dl className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-border">
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted mb-1">
                  {t('catalogue.size')}
                </dt>
                <dd className="font-sans text-sm text-dark">{product.size}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted mb-1">
                  {t('catalogue.finish')}
                </dt>
                <dd className="font-sans text-sm text-dark">{product.finish}</dd>
              </div>
            </dl>

            <div className="mb-10 hidden lg:block">
              <Swatches
                product={product}
                selected={selectedVariant}
                lang={lang}
                label={t('catalogue.variants')}
                onSelect={(v) => selectVariant(v)}
              />
            </div>

            <Link
              to={`/preview?variant=${selectedVariant.id}`}
              className="block w-full rounded-2xl py-4 bg-dark text-white font-sans text-xs uppercase tracking-[0.25em] text-center hover:bg-dark/80 transition-colors mb-4"
            >
              {t('catalogue.previewInRoom')}
            </Link>

            <a
              href={whatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl py-4 border border-dark text-dark font-sans text-xs uppercase tracking-[0.25em] text-center hover:bg-surface-warm transition-colors"
            >
              {t('contact.cta')}
            </a>
          </m.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-20 border-t border-border">
          <h2 className="font-display font-light text-dark text-3xl mb-10">{t('catalogue.relatedProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((fv) => (
              <ProductCard key={fv.variantId} variant={fv} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
