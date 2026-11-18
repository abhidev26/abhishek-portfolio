import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin gradient scroll-progress bar fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed left-0 right-0 top-0 z-[70] h-[3px] bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#EC4899] shadow-[0_0_14px_rgba(6,182,212,0.7)]"
    />
  );
}
