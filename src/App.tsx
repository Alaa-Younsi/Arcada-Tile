import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const Home = lazy(() => import('@/pages/Home'));
const Catalogue = lazy(() => import('@/pages/Catalogue'));
const Category = lazy(() => import('@/pages/Category'));
const Product = lazy(() => import('@/pages/Product'));
const Preview = lazy(() => import('@/pages/Preview'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Loader = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <p className="font-display text-dark/30 text-3xl font-light tracking-[0.3em] animate-pulse">ARCADA</p>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      {/* `m` components + only the DOM animation features keep framer-motion's
          share of the bundle small; `strict` flags any full `motion` import.
          reducedMotion honours the OS "reduce motion" setting everywhere. */}
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="catalogue" element={<Catalogue />} />
                  <Route path="catalogue/:categorySlug" element={<Category />} />
                  <Route path="catalogue/:categorySlug/:productSlug" element={<Product />} />
                  <Route path="preview" element={<Preview />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </MotionConfig>
      </LazyMotion>
    </HelmetProvider>
  );
}
