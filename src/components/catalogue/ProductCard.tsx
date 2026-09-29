import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCategory } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';
import type { FlatVariant } from '@/types';

export const variantHref = (v: Pick<FlatVariant, 'categorySlug' | 'productSlug' | 'variantId'>) =>
  `/catalogue/${v.categorySlug}/${v.productSlug}?variant=${v.variantId}`;

export function ProductCard({ variant }: { variant: FlatVariant }) {
  const { t } = useTranslation();
  const lang = useLang();
  const catName = getCategory(variant.categorySlug)?.name[lang] ?? variant.categorySlug;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={variantHref(variant)} className="block">
        <div className="overflow-hidden bg-surface-warm aspect-[4/5] relative rounded-2xl">
          <img
            src={variant.image}
            alt={`${variant.productName[lang]} ${variant.name[lang]} — carreau céramique ARCADA`}
            width={800}
            height={800}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-dark/70 to-transparent"
          >
            <span className="font-sans text-white text-[10px] uppercase tracking-[0.2em]">
              {t('catalogue.viewDetails')}
            </span>
          </div>
        </div>
        <div className="pt-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent mb-1">{catName}</p>
          <h3 className="font-display text-dark font-light text-xl leading-tight mb-1">{variant.productName[lang]}</h3>
          <p className="font-sans text-muted text-xs tracking-wide">
            {variant.name[lang]} · {variant.size}
          </p>
        </div>
      </Link>
    </m.div>
  );
}
