// Single source of truth for brand, contact and URL constants. index.html,
// robots.txt and sitemap.xml are static and repeat SITE_URL — keep them in sync.

export const SITE_URL = 'https://www.arcadatile.com';
export const SITE_NAME = 'ARCADA';

export const PHONE_DISPLAY = '+213 550 24 24 54';
export const PHONE_E164 = '+213550242454';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/arcada_original_tile/',
  facebook: 'https://www.facebook.com/profile.php?id=61562889557376',
} as const;

export const AUTHOR_URL = 'https://alaayounsi.vercel.app/';

/** wa.me deep link, optionally pre-filled. The showroom team works in French. */
export function whatsAppUrl(message?: string): string {
  const base = `https://wa.me/${PHONE_E164.slice(1)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
