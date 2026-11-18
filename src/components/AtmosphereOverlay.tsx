import { useEffect, useRef } from 'react';
import { store } from '../lib/store';

/** Tinted atmospheric "portal" glow. The camera controller writes opacity/colour directly to this node. */
export function AtmosphereOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    store.overlayEl = ref.current;
    return () => { store.overlayEl = null; };
  }, []);
  return <div ref={ref} aria-hidden="true" className="atmo-overlay pointer-events-none fixed inset-0 z-[1] opacity-0" />;
}
