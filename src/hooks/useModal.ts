import { useEffect, type RefObject } from 'react';
import { store } from '../lib/store';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal behaviour: Escape to close, focus trap, focus restore, and page-scroll lock
 * (pauses Lenis while open).
 */
export function useModal(panelRef: RefObject<HTMLElement>, onClose: () => void): void {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    store.lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFirst = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      window.clearTimeout(focusFirst);
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      store.lenis?.start();
      previouslyFocused?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
