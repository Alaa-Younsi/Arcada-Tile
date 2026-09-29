import { m } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { variantHref } from '@/components/catalogue/ProductCard';
import { SEOHead } from '@/components/seo/SEOHead';
import { CATEGORIES, getCategory, getFeaturedFlatVariants } from '@/data/catalogue';
import { useHeroVideoSource } from '@/hooks/useHeroVideoSource';
import { useLang } from '@/hooks/useLang';
import { HIGH_FETCH_PRIORITY } from '@/lib/fetchPriority';

const FEATURED = getFeaturedFlatVariants().slice(0, 8);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } }),
};

const fromStart = { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true } };
const fromEnd = { initial: { opacity: 0, x: 20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true } };

const PILLAR_ICONS = ['◈', '◉', '◎'];

const eyebrowCls = 'font-sans text-[10px] uppercase tracking-[0.35em] text-accent mb-3';
const sectionTitleCls = 'font-display font-light text-[clamp(28px,4vw,52px)]';

export default function Home() {
  const { t } = useTranslation();
  const lang = useLang();

  const videoRef = useRef<HTMLVideoElement>(null);
  // Only resolves on connections that can afford the video, after first paint.
  const videoSrc = useHeroVideoSource();
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  // Mirrors the element's real state — autoplay can be refused (e.g. iOS Low Power Mode).
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const pillars = t('home.manufacturer.pillars', { returnObjects: true }) as { title: string; body: string }[];
  const manufacturerLines = t('home.manufacturer.lines', { returnObjects: true }) as string[];
  const aboutParagraphs = t('home.aboutParagraphs', { returnObjects: true }) as string[];

  return (
    <>
      <SEOHead
        title="ARCADA — Carreaux Céramiques | Fabricant Algérien Exclusif"
        description="ARCADA, premier et unique fabricant algérien de carreaux céramiques de prestige. 12 collections exclusives conçues, produites et vendues directement. Showroom à Sebala, Draria, Alger."
      />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-dark">
        {/* Poster: a still of the same footage, preloaded in index.html. It carries
            the hero until the video can play, and for good when it can't. */}
        <img
          src="/image1.webp"
          alt=""
          width={1440}
          height={1911}
          {...HIGH_FETCH_PRIORITY}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {videoSrc && !videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            src={videoSrc}
            onCanPlay={() => setVideoReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-dark/70 via-dark/40 to-dark/10" />

        {videoReady && !videoFailed && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t('hero.pauseVideo') : t('hero.playVideo')}
            className="absolute bottom-8 end-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors duration-200"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
        )}

        <div className="relative h-full flex flex-col justify-end px-6 lg:px-16 pb-20 max-w-screen-2xl mx-auto">
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-sans text-[10px] uppercase tracking-[0.4em] text-white/60 mb-5"
          >
            {t('hero.tagline')}
          </m.p>
          <m.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display font-light text-white mb-6 leading-[1.05] text-[clamp(44px,7vw,100px)]"
          >
            {t('hero.title')}
          </m.h1>
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="font-sans text-white/70 text-sm max-w-md tracking-wide leading-relaxed mb-10"
          >
            {t('hero.subtitle')}
          </m.p>
          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 items-start"
          >
            <Link
              to="/preview"
              className="inline-block rounded-2xl px-8 py-4 bg-white text-dark font-sans text-xs uppercase tracking-[0.25em] hover:bg-accent hover:text-white transition-colors duration-300"
            >
              {t('hero.ctaVisualizer')}
            </Link>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em] text-white/80 hover:text-white transition-colors group pt-4 sm:pt-0 sm:self-center"
            >
              {t('hero.ctaCatalogue')}
              <span className="w-6 h-px bg-current group-hover:w-12 transition-all duration-300" />
            </Link>
          </m.div>
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-8 font-sans text-white/40 text-xs tracking-widest"
          >
            <span aria-hidden="true">✦ </span>
            {t('hero.visualizerTeaser')}
          </m.p>
        </div>
      </section>

      {/* ─── EXCLUSIVE MANUFACTURER ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-dark">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">
          <m.div {...fromStart} transition={{ duration: 0.7 }} className="lg:w-1/2">
            <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-accent mb-6">
              {t('home.manufacturer.eyebrow')}
            </p>
            <h2 className="font-display font-light text-white leading-[1.05] mb-8 text-[clamp(36px,5.5vw,80px)]">
              {manufacturerLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="w-12 h-px bg-accent mb-8" />
            <p className="font-sans text-white/50 text-sm leading-relaxed tracking-wide max-w-md">
              {t('home.manufacturer.body')}
            </p>
          </m.div>

          <m.ul
            {...fromEnd}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:w-1/2 w-full grid grid-cols-1 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden"
          >
            {pillars.map(({ title, body }, i) => (
              <li key={title} className="bg-dark px-8 py-7 flex items-start gap-5">
                <span aria-hidden="true" className="text-accent text-xl mt-0.5 flex-shrink-0">
                  {PILLAR_ICONS[i]}
                </span>
                <div>
                  <h3 className="font-sans font-normal text-white text-xs uppercase tracking-[0.25em] mb-2">{title}</h3>
                  <p className="font-sans text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </m.ul>
        </div>
      </section>

      {/* ─── COLLECTIONS ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="px-6 lg:px-16 max-w-screen-2xl mx-auto mb-12 flex items-end justify-between">
          <div>
            <p className={eyebrowCls}>{t('nav.collections')}</p>
            <h2 className={`${sectionTitleCls} text-dark`}>
              {t('home.collectionsCount', { count: CATEGORIES.length })}
            </h2>
          </div>
          <Link
            to="/catalogue"
            className="hidden sm:inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.25em] text-muted hover:text-accent transition-colors group"
          >
            {t('common.viewAll')}
            <span className="w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
          </Link>
        </div>

        <div className="px-6 lg:px-16 overflow-x-auto">
          <ul className="flex gap-6 pb-4 min-w-max">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/catalogue/${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl w-72 sm:w-80 aspect-[3/4] bg-surface-warm"
                >
                  <img
                    src={cat.image}
                    alt={`Collection ${cat.name[lang]} — carreaux céramiques ${cat.shape} par ARCADA`}
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:opacity-0">
                    <p className="font-sans text-white/60 text-[10px] uppercase tracking-[0.3em] mb-2">{cat.shape}</p>
                    <h3 className="font-display font-light text-white text-2xl leading-tight">{cat.name[lang]}</h3>
                  </div>

                  {/* Hover detail — visual only; the heading above already names the link. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark/60"
                  >
                    <p className="font-sans text-white/60 text-[10px] uppercase tracking-[0.3em] mb-2">{cat.shape}</p>
                    <p className="font-display font-light text-white text-2xl leading-tight mb-3">{cat.name[lang]}</p>
                    <p className="font-sans text-white/70 text-xs leading-relaxed mb-4">{cat.description[lang]}</p>
                    <span className="font-sans text-white text-[10px] uppercase tracking-[0.25em]">
                      {t('home.view')} <span className="inline-block rtl:rotate-180">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-dark">
        <div className="px-6 lg:px-16 max-w-screen-2xl mx-auto mb-12">
          <p className={eyebrowCls}>{t('home.featuredEyebrow')}</p>
          <h2 className={`${sectionTitleCls} text-white`}>{t('home.featuredTitle')}</h2>
        </div>

        <div className="px-6 lg:px-16 overflow-x-auto">
          <ul className="flex gap-6 pb-4 min-w-max">
            {FEATURED.map((fv) => (
              <m.li
                key={fv.variantId}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-64 sm:w-72 group"
              >
                <Link to={variantHref(fv)} className="block">
                  <div className="aspect-[3/4] bg-surface overflow-hidden rounded-2xl">
                    <img
                      src={fv.image}
                      alt={`${fv.productName[lang]} ${fv.name[lang]} — carreau céramique ARCADA`}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent mb-1">
                      {getCategory(fv.categorySlug)?.name[lang]}
                    </p>
                    <h3 className="font-display font-light text-white text-xl mb-1">{fv.productName[lang]}</h3>
                    <p className="font-sans text-white/50 text-xs tracking-wide">{fv.name[lang]}</p>
                  </div>
                </Link>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── ABOUT ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 lg:px-16 bg-bg">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <m.div
            {...fromStart}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-warm"
          >
            <img
              src="/about.webp"
              alt="Showroom ARCADA à Sebala, Draria — collections de carreaux céramiques"
              width={900}
              height={1125}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </m.div>

          <m.div {...fromEnd} transition={{ duration: 0.7, delay: 0.1 }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent mb-5">
              {t('home.aboutEyebrow')}
            </p>
            <h2 className={`${sectionTitleCls} text-dark mb-8 leading-tight`}>{t('home.aboutTitle')}</h2>
            <div className="space-y-5 font-sans text-sm text-muted leading-relaxed tracking-wide">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* ─── VISUALIZER CTA ─────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-6 lg:px-16 bg-dark">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <m.div {...fromStart} transition={{ duration: 0.7 }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent mb-5">{t('visualizer.title')}</p>
            <h2 className="font-display font-light text-white mb-6 leading-tight text-[clamp(32px,5vw,64px)]">
              {t('home.visualizerTitle')}
            </h2>
            <p className="font-sans text-white/50 text-sm leading-relaxed tracking-wide mb-10 max-w-md">
              {t('visualizer.subtitle')}
            </p>
            <Link
              to="/preview"
              className="inline-block px-8 py-4 rounded-2xl border border-white/30 text-white font-sans text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-dark transition-all duration-300"
            >
              {t('hero.ctaVisualizer')}
            </Link>
          </m.div>

          <m.div
            {...fromEnd}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative aspect-square overflow-hidden rounded-2xl hidden lg:block"
          >
            <img
              src="/image6.webp"
              alt="Carreaux céramiques ARCADA dans un espace intérieur"
              width={1200}
              height={900}
              className="w-full h-full object-cover opacity-60"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-dark/60 to-transparent" />
          </m.div>
        </div>
      </section>

      {/* ─── MANIFESTO ──────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-36 overflow-hidden bg-bg">
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-display font-light text-border leading-none text-[clamp(160px,28vw,380px)]"
        >
          A
        </span>

        <m.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative max-w-screen-xl mx-auto px-6 lg:px-16 text-center"
        >
          <p
            aria-hidden="true"
            className="font-display text-accent/40 leading-none mb-2 select-none text-[clamp(60px,8vw,120px)]"
          >
            &ldquo;
          </p>
          <blockquote className="font-display font-light text-dark leading-[1.15] text-[clamp(28px,4.5vw,68px)]">
            <Trans
              i18nKey="home.manifesto"
              components={{
                accent: <em className="not-italic text-accent" />,
                br: <br className="hidden md:block" />,
              }}
            />
          </blockquote>
          <figcaption className="mt-10 flex items-center justify-center gap-6">
            <span className="flex-1 max-w-[120px] h-px bg-border" />
            <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-muted">ARCADA</span>
            <span className="flex-1 max-w-[120px] h-px bg-border" />
          </figcaption>
        </m.figure>
      </section>
    </>
  );
}
