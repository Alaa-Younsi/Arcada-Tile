import { AnimatePresence, m } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ScrollToTop() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <m.button
          key="scroll-to-top"
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('common.scrollTop')}
          className="fixed bottom-6 end-6 z-50 w-11 h-11 bg-dark text-white flex items-center justify-center hover:bg-accent transition-colors duration-300 shadow-lg rounded-full"
        >
          <ChevronUp size={18} strokeWidth={1.5} />
        </m.button>
      )}
    </AnimatePresence>
  );
}
