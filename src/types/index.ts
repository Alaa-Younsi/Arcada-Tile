export const LANGS = ['fr', 'en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export type Localized = Record<Lang, string>;

export interface ColorVariant {
  /** Unique slug, e.g. 'silos-terracota'. Used in `?variant=` URLs. */
  id: string;
  name: Localized;
  /** Representative swatch colour. */
  hex: string;
  /** e.g. '/products/ARC-SIL-001.webp' — the file name is the SKU. */
  image: string;
}

export interface CatalogueProduct {
  categorySlug: string;
  slug: string;
  name: Localized;
  description: Localized;
  /** e.g. '10×30 cm' */
  size: string;
  /** e.g. 'Glazed' | 'Metallic' | 'Matte' */
  finish: string;
  variants: ColorVariant[];
  isFeatured?: boolean;
}

export interface CatalogueCategory {
  slug: string;
  name: Localized;
  description: Localized;
  /** Hero / card image for the collection. */
  image: string;
  /** Shape and format, e.g. 'Picket · 10×30 cm' */
  shape: string;
}

/** A single colour variant flattened with its product, rendered as its own card. */
export interface FlatVariant {
  variantId: string;
  productSlug: string;
  categorySlug: string;
  name: Localized;
  productName: Localized;
  image: string;
  hex: string;
  size: string;
  isFeatured: boolean;
}
