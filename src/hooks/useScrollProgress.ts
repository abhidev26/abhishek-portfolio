import { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { SECTIONS } from '../data/personal';

/**
 * Keeps the shared store (scroll position + measured section ranges) in sync with the DOM and
 * returns the index of the active section. React state only changes when the active section changes.
 */
export function useScrollProgress(): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      store.vh = window.innerHeight;
      store.vw = window.innerWidth;
      const sy = window.scrollY;
      store.sections = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { top: 0, bottom: 0 };
        const r = el.getBoundingClientRect();
        return { top: r.top + sy, bottom: r.bottom + sy };
      });
      store.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    let last = -1;
    const onScroll = () => {
      store.scrollY = window.scrollY;
      const probe = window.scrollY + window.innerHeight * 0.45;
      let idx = 0;
      for (let i = 0; i < store.sections.length; i++) if (probe >= store.sections[i].top) idx = i;
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };

    const onPointer = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    onScroll();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('load', measure);
    void document.fonts?.ready.then(measure);
    const t = window.setTimeout(measure, 1200);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('load', measure);
    };
  }, []);

  return active;
}
