import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

const item: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const group: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'p' | 'h2' | 'h3';
}

/** Scroll-triggered fade + slide-up + blur-to-focus (IntersectionObserver under the hood via whileInView). */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const M = motion[as] as ElementType;
  return (
    <M className={className} variants={item} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ delay }}>
      {children}
    </M>
  );
}

/** Container that staggers its <StaggerItem> children. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={group} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
