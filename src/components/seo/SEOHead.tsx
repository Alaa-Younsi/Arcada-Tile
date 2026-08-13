import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface Breadcrumb {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  /** Absolute URL or path. Defaults to the route currently being rendered. */
  url?: string;
  type?: string;
  noIndex?: boolean;
  breadcrumbs?: Breadcrumb[];
  productSchema?: {
    name: string;
    description: string;
    image: string;
    sku?: string;
  };
}

const SITE_URL    = 'https://www.arcadatile.com';
const SITE_NAME   = 'ARCADA';
// Crawlers (Facebook, WhatsApp, X) handle WebP unreliably — social previews
// point at a purpose-built 1200x630 JPEG instead of the site imagery.
const DEFAULT_IMG = '/og-image.jpg';

const DEFAULT_TITLE = 'ARCADA — Carreaux Céramiques | Fabricant Algérien Exclusif';
const DEFAULT_DESC  =
  "Premier et unique fabricant algérien de carreaux céramiques de prestige. 12 collections exclusives — conçues, produites et vendues directement par ARCADA depuis l'Algérie.";

const absolute = (v: string) => (v.startsWith('http') ? v : `${SITE_URL}${v}`);

export function SEOHead({
  title       = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  image       = DEFAULT_IMG,
  url,
  type        = 'website',
  noIndex     = false,
  breadcrumbs,
  productSchema,
}: SEOHeadProps) {
  const { pathname } = useLocation();

  // Canonicalise to the page actually being viewed. Defaulting this to the
  // site root would point every route at the homepage and drop the catalogue
  // and product pages out of the index.
  const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const fullUrl   = url ? absolute(url) : `${SITE_URL}${canonicalPath}`;
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

  const productJsonLd = productSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productSchema.name,
        description: productSchema.description,
        image: absolute(productSchema.image),
        sku: productSchema.sku,
        url: fullUrl,
        brand: { '@type': 'Brand', name: SITE_NAME },
        manufacturer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          availability: 'https://schema.org/InStock',
          priceCurrency: 'DZD',
          seller: { '@id': `${SITE_URL}/#organization` },
        },
      }
    : null;

  return (
    <Helmet>
      {/* Core */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />
      <meta name="author" content={SITE_NAME} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={fullImage} />
      <meta property="og:image:alt"   content={`${SITE_NAME} — carreaux céramiques`} />
      {/* Only declared for the known-size social card; a per-page override
          would make hardcoded dimensions wrong. */}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      <meta property="og:url"         content={fullUrl} />
      <meta property="og:locale"      content="fr_DZ" />

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={fullImage} />

      {/* Page-scoped structured data. Organization / WebSite / Store live in
          index.html so they are not re-declared on every route. */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
      {productJsonLd && (
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      )}
    </Helmet>
  );
}
