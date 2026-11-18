import { useEffect } from 'react';
import Lenis from 'lenis';
import { store } from '../lib/store';
import { prefersReducedMotion } from './useReducedMotion';

/**
 * Smooth scrolling. Lenis drives the *native* scroll position, so keyboard, touch, trackpad and
 * browser find/anchor behaviour keep working, and the 3D camera simply reads window.scrollY.
 * It is disabled for visitors who prefer reduced motion.
 */
export function useLenis(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    store.lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      store.lenis = null;
    };
  }, []);
}
