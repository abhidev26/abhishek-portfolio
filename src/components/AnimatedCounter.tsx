import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

/** Counts up when scrolled into view. Writes to the DOM node directly: zero React re-renders. */
export function AnimatedCounter({ to, decimals = 0, suffix = '' }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const c = animate(0, to, { duration: 1.8, ease: 'easeOut', onUpdate: (v) => { node.textContent = v.toFixed(decimals) + suffix; } });
    return () => c.stop();
  }, [inView, to, decimals, suffix]);
  return <span ref={ref}>{(0).toFixed(decimals)}{suffix}</span>;
}
