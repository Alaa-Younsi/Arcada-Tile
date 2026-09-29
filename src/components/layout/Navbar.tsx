import { AnimatePresence, m } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CATEGORIES } from '@/data/catalogue';
import { useLang } from '@/hooks/useLang';

const MEGA_MENU_ID = 'collections-menu';
const MOBILE_MENU_ID = 'mobile-menu';

const linkBase =
  'font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 whitespace-nowrap';
const linkCls = (active = false) => `${linkBase} ${active ? 'text-accent' : 'text-dark hover:text-accent'}`;
const iconCls = 'text-dark hover:text-accent transition-colors';

export function Navbar() {
  const { t } = useTranslation();
  const lang = useLang();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const prevScrollY = useRef(0);

  // Any navigation closes both menus.
  // biome-ignore lint/correctness/useExhaustiveDependencies: must re-run on every route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Shrink once past the hero edge; hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const curr = window.scrollY;
      const isScrolled = curr > 80;
      setScrolled(isScrolled);
      setVisible(!isScrolled || curr < prevScrollY.current);
      prevScrollY.current = curr;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setMegaOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // The drawer covers the page; keep the page behind it from scrolling.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  // Links to the current page don't change the pathname, so they close the menus themselves.
  const closeMenus = () => {
    setMegaOpen(false);
    setMobileOpen(false);
  };

  const pageLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/catalogue', label: t('nav.catalogue') },
    { to: '/preview', label: t('nav.visualizer') },
  ];

  return (
    <>
      <m.div
        className="fixed z-[70] inset-x-0 top-0"
        animate={{ y: !visible && scrolled ? '-110%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="mx-3 mt-3">
          <header className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
            <div
              className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${
                scrolled ? 'h-[60px] px-5 lg:px-8' : 'h-[72px] px-6 lg:px-14'
              }`}
            >
              {/* Start: desktop links / mobile menu button */}
              <div className="flex items-center">
                <nav className="hidden lg:flex items-center gap-8">
                  <button
                    type="button"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                    onClick={() => setMegaOpen((o) => !o)}
                    aria-expanded={megaOpen}
                    aria-controls={MEGA_MENU_ID}
                    className={linkCls(megaOpen)}
                  >
                    {t('nav.collections')}
                  </button>
                  <NavLink to="/catalogue" end className={({ isActive }) => linkCls(isActive)}>
                    {t('nav.catalogue')}
                  </NavLink>
                  <NavLink to="/preview" className={({ isActive }) => linkCls(isActive)}>
                    {t('nav.visualizer')}
                  </NavLink>
                </nav>
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label={t('nav.openMenu')}
                  aria-expanded={mobileOpen}
                  aria-controls={MOBILE_MENU_ID}
                  className={`lg:hidden p-2 -ms-2 ${iconCls}`}
                >
                  <Menu size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Centre: logo */}
              <Link to="/" className="flex justify-center" aria-label="ARCADA — accueil">
                <img
                  src="/logo.webp"
                  alt=""
                  width={400}
                  height={400}
                  className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-9' : 'h-12'}`}
                />
              </Link>

              {/* End: language */}
              <div className="flex items-center justify-end">
                <LanguageSwitcher />
              </div>
            </div>
          </header>
        </div>

        {/* Collections mega menu (desktop) */}
        <AnimatePresence>
          {megaOpen && (
            <m.div
              id={MEGA_MENU_ID}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="hidden lg:block bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] mx-3 rounded-b-2xl border border-t-0 border-border"
            >
              <div className="max-w-screen-xl mx-auto px-14 py-12 grid grid-cols-[1fr_380px] gap-16">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-muted mb-8">
                    {t('nav.collections')}
                  </p>
                  <div className="grid grid-cols-2 gap-x-10">
                    {CATEGORIES.map((cat) => (
                      <Link
                        onClick={closeMenus}
                        key={cat.slug}
                        to={`/catalogue/${cat.slug}`}
                        className="group flex items-center justify-between py-4 border-b border-border/70"
                      >
                        <span className="font-display text-[22px] font-light text-dark group-hover:text-accent transition-colors duration-200 leading-none">
                          {cat.name[lang]}
                        </span>
                        <span className="w-0 group-hover:w-5 h-px bg-accent transition-all duration-300 ms-2 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    onClick={closeMenus}
                    to="/catalogue"
                    className="inline-flex items-center gap-3 mt-10 font-sans text-[10px] uppercase tracking-[0.28em] text-accent hover:text-accent-dark transition-colors group"
                  >
                    {t('common.viewAll')}
                    <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
                  </Link>
                </div>

                <div className="relative overflow-hidden min-h-[300px] bg-[url('/image6.webp')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-dark/55" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="font-sans text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2">
                      {t('hero.tagline')}
                    </p>
                    <p className="font-display text-white font-light leading-tight mb-5 text-[26px]">
                      {t('hero.title')}
                    </p>
                    <Link
                      onClick={closeMenus}
                      to="/catalogue"
                      className="inline-flex items-center gap-2 font-sans text-white/70 text-[10px] uppercase tracking-[0.25em] hover:text-white transition-colors group"
                    >
                      {t('common.discover')}
                      <span className="w-4 h-px bg-current group-hover:w-7 transition-all duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      {/* Mobile drawer — backdrop */}
      <div
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 bg-black/40 z-[75] transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer — panel. `invisible` (after the slide) removes it from tab order and the a11y tree. */}
      <div
        id={MOBILE_MENU_ID}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        className={`lg:hidden fixed top-0 bottom-0 start-0 w-[85vw] max-w-sm bg-white z-[80] flex flex-col transition-[transform,visibility] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileOpen ? 'translate-x-0 visible' : '-translate-x-full rtl:translate-x-full invisible'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <img src="/logo.webp" alt="ARCADA" width={400} height={400} className="h-10 w-auto object-contain" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={t('nav.closeMenu')}
            className={`p-1.5 ${iconCls}`}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          {pageLinks.map((item) => (
            <Link
              onClick={closeMenus}
              key={item.to}
              to={item.to}
              className="block font-display text-[36px] font-light text-dark hover:text-accent transition-colors py-3 border-b border-border/60 leading-none"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-8 pb-4">
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-muted mb-5">{t('nav.collections')}</p>
            {CATEGORIES.map((cat) => (
              <Link
                onClick={closeMenus}
                key={cat.slug}
                to={`/catalogue/${cat.slug}`}
                className="block font-sans text-sm text-text-main hover:text-accent transition-colors py-2.5 border-b border-border/40 tracking-wide"
              >
                {cat.name[lang]}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-6 py-5 border-t border-border">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
