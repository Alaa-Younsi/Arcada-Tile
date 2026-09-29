import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function Layout() {
  const { pathname } = useLocation();

  // A new page starts at the top. 'instant' bypasses the global smooth
  // scroll-behavior so route changes don't animate through the old page.
  // biome-ignore lint/correctness/useExhaustiveDependencies: must re-run on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
