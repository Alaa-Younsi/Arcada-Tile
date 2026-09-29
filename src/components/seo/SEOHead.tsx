import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, SITE_URL } from '@/config/site';

interface Breadcrumb {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product';
  noIndex?: boolean;
  breadcrumbs?: Breadcrumb[];
  productSchema?: {
    name: string;
    description: string;
    image: string;
    sku?: string;
  };
}

// Crawlers (Facebook, WhatsApp, X) handle WebP unreliably — social previews
// point at a purpose-built 1200x630 JPEG instead of the site imagery.
const DEFAULT_IMG = '/og-image.jpg';

const DEFAULT_TITLE = 'ARCADA — Carreaux Céramiques | Fabricant Algérien Exclusif';
const DEFAULT_DESC =
  "Premier et unique fabricant algérien de carreaux céramiques de prestige. 12 collections exclusives — conçues, produites et vendues directement par ARCADA depuis l'Algérie.";

const absolute = (v: string) => (v.startsWith('http') ? v : `${SITE_URL}${v}`);

/**
 * Per-route <head>. Organization / WebSite / Store JSON-LD live in index.html
 * so they are not re-declared on every route; this adds the page-scoped parts.
 */
export function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image = DEFAULT_IMG,
  type = 'website',
  noIndex = false,
  breadcrumbs,
  productSchema,
}: SEOHeadProps) {
  const { pathname } = useLocation();

  // Canonicalise to the route being viewed, without query string (so every
  // ?variant= of a product consolidates onto the product URL).
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  const fullImage = absolute(image);
  const isDefaultImage = image === DEFAULT_IMG;

  const breadcrumbJsonLd = breadcrumbs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: absolute(crumb.path),
        })),
      }
    : null;

  // No `offers`: prices are quoted on request, and an Offer without a price is
  // a hard error in Google's rich-result validation.
  const productJsonLd = productSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productSchema.name,
        description: productSchema.description,
        image: absolute(productSchema.image),
        sku: productSchema.sku,
        url: canonical,
        brand: { '@type': 'Brand', name: SITE_NAME },
        manufacturer: { '@id': `${SITE_URL}/#organization` },
      }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={`${SITE_NAME} — carreaux céramiques`} />
      {/* Dimensions are only known for the default social card. */}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="fr_DZ" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {breadcrumbJsonLd && <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>}
      {productJsonLd && <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>}
    </Helmet>
  );
}
