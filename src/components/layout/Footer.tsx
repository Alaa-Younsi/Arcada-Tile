import { Facebook, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AUTHOR_URL, PHONE_DISPLAY, PHONE_E164, SOCIAL_LINKS } from '@/config/site';
import { CATEGORIES } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';

const headingCls = 'font-sans text-xs uppercase tracking-[0.2em] text-white mb-5';
const linkCls = 'font-sans text-sm text-white/50 hover:text-accent transition-colors';
const socialCls =
  'w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 hover:border-accent hover:text-accent transition-colors';

export function Footer() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <footer className="bg-dark text-white/70">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img
              src="/logo.webp"
              alt="ARCADA"
              width={400}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto object-contain mb-6 brightness-0 invert"
            />
            <p className="font-sans text-sm text-white/50 leading-relaxed mb-3 tracking-wide">{t('footer.tagline')}</p>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-accent/80 mb-6">
              {t('footer.exclusive')}
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialCls}
              >
                <Instagram size={14} strokeWidth={1.5} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialCls}
              >
                <Facebook size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <nav aria-labelledby="footer-collections">
            <h2 id="footer-collections" className={headingCls}>
              {t('nav.collections')}
            </h2>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/catalogue/${cat.slug}`} className={linkCls}>
                    {cat.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pages */}
          <nav aria-labelledby="footer-navigation">
            <h2 id="footer-navigation" className={headingCls}>
              {t('footer.quickLinks')}
            </h2>
            <ul className="space-y-3">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/catalogue', label: t('nav.catalogue') },
                { to: '/preview', label: t('nav.visualizer') },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkCls}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className={headingCls}>{t('contact.title')}</h2>
            <address className="not-italic space-y-3">
              <p className="font-sans text-sm text-white/50 leading-relaxed">{t('contact.address')}</p>
              <a href={`tel:${PHONE_E164}`} dir="ltr" className={`block ${linkCls}`}>
                {PHONE_DISPLAY}
              </a>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-white/30 tracking-wide">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noopener"
            className="font-sans text-xs text-white/30 tracking-wide hover:text-accent transition-colors"
          >
            {t('footer.credit')}
          </a>
          <p className="font-sans text-xs text-white/20 uppercase tracking-[0.2em]">{t('footer.madeIn')}</p>
        </div>
      </div>
    </footer>
  );
}
