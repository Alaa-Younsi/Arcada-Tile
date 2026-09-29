import { AnimatePresence, m } from 'framer-motion';
import {
  Bath,
  type LucideIcon,
  Maximize2,
  MessageCircle,
  RotateCcw,
  ShoppingBag,
  Sofa,
  Utensils,
  UtensilsCrossed,
  Waves,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { whatsAppUrl } from '@/config/site';
import { PRODUCTS, skuOf } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';
import type { Localized } from '@/types';

type PlaceId = 'pool' | 'livingroom' | 'bathroom' | 'shop' | 'kitchen' | 'restaurant';

const PLACES: ReadonlyArray<{ id: PlaceId; Icon: LucideIcon }> = [
  { id: 'pool', Icon: Waves },
  { id: 'livingroom', Icon: Sofa },
  { id: 'bathroom', Icon: Bath },
  { id: 'shop', Icon: ShoppingBag },
  { id: 'kitchen', Icon: UtensilsCrossed },
  { id: 'restaurant', Icon: Utensils },
];

const sceneImage = (place: PlaceId) => `/scenes/${place}.webp`;

/** Rendered scenes in public/previews/combinations/{place}-{sku}.webp */
const RENDERED: Record<PlaceId, readonly string[]> = {
  bathroom: [
    'ARC-ATL-003',
    'ARC-ATL-007',
    'ARC-ATL-008',
    'ARC-ATL-009',
    'ARC-ATL-010',
    'ARC-CHI-011',
    'ARC-DUC-009',
    'ARC-LEA-001',
    'ARC-LEA-003',
    'ARC-LEA-010',
    'ARC-SIL-012',
  ],
  kitchen: ['ARC-DUC-006', 'ARC-LEA-010', 'ARC-LEA-011', 'ARC-SIL-005'],
  livingroom: ['ARC-DUC-007', 'ARC-DUC-011', 'ARC-SIL-005'],
  pool: ['ARC-AND-001', 'ARC-AZA-001', 'ARC-LEA-001'],
  restaurant: ['ARC-DUC-006', 'ARC-DUC-007', 'ARC-LEA-009', 'ARC-SIL-011'],
  shop: ['ARC-CHI-003', 'ARC-DUC-007', 'ARC-DUC-011', 'ARC-LEA-009', 'ARC-LEA-011', 'ARC-SIL-011'],
};

interface Combination {
  place: PlaceId;
  sku: string;
  variantId: string;
  image: string;
  productName: Localized;
  variantName: Localized;
  hex: string;
}

const VARIANTS_BY_SKU = new Map(
  PRODUCTS.flatMap((product) =>
    product.variants.map((variant) => [skuOf(variant.image), { product, variant }] as const),
  ),
);

const COMBINATIONS: readonly Combination[] = PLACES.flatMap(({ id: place }) =>
  RENDERED[place].flatMap((sku) => {
    const match = VARIANTS_BY_SKU.get(sku);
    if (!match) return [];
    return [
      {
        place,
        sku,
        variantId: match.variant.id,
        image: `/previews/combinations/${place}-${sku}.webp`,
        productName: match.product.name,
        variantName: match.variant.name,
        hex: match.variant.hex,
      },
    ];
  }),
);

const isSameCombo = (a: Combination | null, b: Combination) => a?.sku === b.sku && a.place === b.place;

const listFade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export default function Preview() {
  const { t } = useTranslation();
  const lang = useLang();
  const [searchParams] = useSearchParams();

  // Arriving from a product page (?variant=…) opens its first rendered scene, if any.
  const [initialCombo] = useState(() => COMBINATIONS.find((c) => c.variantId === searchParams.get('variant')) ?? null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceId>(initialCombo?.place ?? 'bathroom');
  const [selectedCombo, setSelectedCombo] = useState<Combination | null>(initialCombo);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const placeCombinations = useMemo(() => COMBINATIONS.filter((c) => c.place === selectedPlace), [selectedPlace]);
  const placeLabel = t(`visualizer.places.${selectedPlace}`);
  const displayImage = selectedCombo?.image ?? sceneImage(selectedPlace);
  const displayAlt = selectedCombo
    ? `${selectedCombo.productName[lang]} · ${selectedCombo.variantName[lang]} — ${placeLabel}`
    : placeLabel;

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsFullscreen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isFullscreen]);

  // On stacked (mobile) layouts the image is above the list — bring it into view.
  const scrollToImageOnMobile = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectPlace = (placeId: PlaceId) => {
    setSelectedPlace(placeId);
    setSelectedCombo(null);
    scrollToImageOnMobile();
  };

  const handleComboSelect = (combo: Combination) => {
    const isActive = isSameCombo(selectedCombo, combo);
    setSelectedCombo(isActive ? null : combo);
    if (!isActive) scrollToImageOnMobile();
  };

  const whatsAppHref = selectedCombo
    ? whatsAppUrl(
        [
          'Bonjour ARCADA,',
          '',
          'Je suis intéressé par le produit suivant :',
          `- ${selectedCombo.productName.fr} · ${selectedCombo.variantName.fr}`,
          `- Espace : ${t(`visualizer.places.${selectedPlace}`, { lng: 'fr' })}`,
          '',
          'Merci de me contacter pour un devis.',
        ].join('\n'),
      )
    : whatsAppUrl();

  return (
    <>
      <SEOHead
        title="Visualiseur d'Espace — Carreaux Céramiques | ARCADA"
        description="Prévisualisez les carreaux céramiques ARCADA dans une salle de bain, une cuisine, un salon, une piscine, une boutique ou un restaurant avec le visualiseur ARCADA."
      />

      <div className="min-h-screen bg-bg pt-28 pb-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16">
          <header className="mb-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-accent mb-3">
              {t('visualizer.title')}
            </p>
            <h1 className="font-display font-light text-dark text-[clamp(28px,4vw,52px)]">
              {t('visualizer.subtitle')}
            </h1>
          </header>

          {/* Step 1: space */}
          <div className="mb-10">
            <h2 className="font-sans font-normal text-[10px] uppercase tracking-[0.35em] text-accent mb-4">
              {t('visualizer.stepSpace')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PLACES.map(({ id, Icon }) => {
                const isActive = selectedPlace === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSelectPlace(id)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2.5 px-4 py-4 border transition-all duration-200 text-start ${
                      isActive ? 'border-dark bg-dark text-white' : 'border-border bg-white text-dark hover:border-dark'
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.5} className="flex-shrink-0" aria-hidden="true" />
                    <span className="font-sans text-[11px] uppercase tracking-[0.12em] leading-tight">
                      {t(`visualizer.places.${id}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-10">
            {/* Step 2: combination */}
            <aside className="lg:w-[38%] flex-shrink-0 space-y-6">
              <div>
                <h2 className="font-sans font-normal text-[10px] uppercase tracking-[0.35em] text-accent mb-4">
                  {t('visualizer.stepCombination')}
                </h2>

                <AnimatePresence mode="wait">
                  <m.div
                    key={selectedPlace}
                    variants={listFade}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pe-1"
                  >
                    {placeCombinations.map((combo) => {
                      const isActive = isSameCombo(selectedCombo, combo);
                      return (
                        <button
                          key={combo.sku}
                          type="button"
                          onClick={() => handleComboSelect(combo)}
                          aria-pressed={isActive}
                          className={`flex items-center gap-3 px-4 py-3 border text-start transition-all duration-200 ${
                            isActive
                              ? 'border-dark bg-dark text-white'
                              : 'border-border bg-white text-dark hover:border-dark'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                            style={{ backgroundColor: combo.hex }}
                          />
                          <span className="min-w-0">
                            <span className="block font-sans text-sm leading-snug truncate">
                              {combo.productName[lang]}
                            </span>
                            <span
                              className={`block font-sans text-[10px] tracking-wider mt-0.5 uppercase ${
                                isActive ? 'text-white/70' : 'text-muted'
                              }`}
                            >
                              {combo.variantName[lang]}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </m.div>
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {selectedCombo && (
                  <m.div
                    key="cta"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border pt-6 space-y-4"
                  >
                    <div className="flex items-center gap-3 p-4 bg-surface-warm">
                      <span
                        aria-hidden="true"
                        className="w-8 h-8 rounded-full flex-shrink-0 border border-border"
                        style={{ backgroundColor: selectedCombo.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-dark text-lg font-light leading-tight truncate">
                          {selectedCombo.productName[lang]}
                        </p>
                        <p className="font-sans text-xs text-muted mt-0.5">
                          {selectedCombo.variantName[lang]} · {placeLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedCombo(null)}
                        className="flex items-center gap-2 px-4 py-3 border border-border font-sans text-[10px] uppercase tracking-wider text-muted hover:border-dark hover:text-dark transition-colors"
                      >
                        <RotateCcw size={11} aria-hidden="true" />
                        {t('visualizer.reset')}
                      </button>
                      <a
                        href={whatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white font-sans text-[10px] uppercase tracking-wider hover:bg-dark transition-colors duration-300"
                      >
                        <MessageCircle size={12} aria-hidden="true" />
                        {t('contact.cta')}
                      </a>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </aside>

            {/* Viewer */}
            <div className="lg:flex-1 min-w-0">
              <div className="lg:sticky lg:top-28">
                {/* Fixed 4:3 frame: renders come in 4:3, square and wide, and letting each
                    set the height made the page jump (layout shift) on every switch. */}
                <div ref={imageRef} className="relative w-full aspect-[4/3] overflow-hidden bg-surface-warm">
                  <AnimatePresence initial={false}>
                    <m.img
                      key={displayImage}
                      src={displayImage}
                      alt={displayAlt}
                      className="absolute inset-0 w-full h-full object-contain"
                      decoding="async"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>

                  {!selectedCombo && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark/15 pointer-events-none">
                      <p className="font-sans text-white text-xs uppercase tracking-[0.4em] text-center px-8 drop-shadow">
                        {t('visualizer.choosePrompt')}
                      </p>
                    </div>
                  )}

                  {selectedCombo && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 start-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2"
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
                        style={{ backgroundColor: selectedCombo.hex }}
                      />
                      <span className="font-sans text-[11px] text-dark tracking-wide">
                        {selectedCombo.productName[lang]} · {selectedCombo.variantName[lang]}
                      </span>
                      <span className="font-sans text-[10px] text-accent uppercase tracking-wider ms-1">
                        — {placeLabel}
                      </span>
                    </m.div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    aria-label={t('visualizer.fullscreen')}
                    title={t('visualizer.fullscreen')}
                    className="absolute top-4 start-4 z-10 w-9 h-9 flex items-center justify-center bg-dark/40 text-white backdrop-blur-sm hover:bg-dark/60 transition-all duration-200"
                  >
                    <Maximize2 size={15} strokeWidth={1.5} />
                  </button>

                  {/* Quick place switch — from sm up; on phones the space picker sits right above
                      and the six-icon column would overflow the frame. */}
                  <div className="absolute top-4 end-4 z-10 hidden sm:flex flex-col gap-1.5">
                    {PLACES.map(({ id, Icon }) => {
                      const isActive = selectedPlace === id;
                      const label = t(`visualizer.places.${id}`);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSelectPlace(id)}
                          aria-label={label}
                          aria-pressed={isActive}
                          title={label}
                          className={`w-9 h-9 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                            isActive ? 'bg-white text-dark shadow-md' : 'bg-dark/40 text-white hover:bg-dark/60'
                          }`}
                        >
                          <Icon size={15} strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-3 font-sans text-[10px] text-muted/50 text-center tracking-[0.2em]">
                  {t('visualizer.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={displayAlt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              type="button"
              // biome-ignore lint/a11y/noAutofocus: focus must move into the dialog so Escape/Enter work immediately
              autoFocus
              onClick={() => setIsFullscreen(false)}
              aria-label={t('visualizer.closeFullscreen')}
              className="absolute top-5 end-5 w-10 h-10 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <m.img
              src={displayImage}
              alt={displayAlt}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedCombo && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-5 py-2.5">
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedCombo.hex }}
                />
                <span className="font-sans text-[11px] text-white tracking-wide">
                  {selectedCombo.productName[lang]} · {selectedCombo.variantName[lang]}
                </span>
                <span className="font-sans text-[10px] text-white/60 uppercase tracking-wider ms-1">
                  — {placeLabel}
                </span>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
