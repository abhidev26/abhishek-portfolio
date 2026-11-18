import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { scrollToTop } from '../lib/ui';

export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 0.7));
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" aria-label="Back to top" onClick={scrollToTop} initial={{ opacity: 0, y: 30, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -80, scale: 0.8 }} whileHover={{ y: -4 }} className="glass fixed bottom-5 right-4 z-40 grid h-12 w-12 place-items-center rounded-full text-cyan-200 sm:right-6">
          <Rocket className="h-5 w-5 -rotate-45" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
