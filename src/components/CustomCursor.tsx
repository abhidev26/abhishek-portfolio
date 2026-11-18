import { useEffect, useRef } from 'react';

/** Glowing dot + trailing ring. Mouse-only; never mounted on touch devices. */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.documentElement.classList.add('custom-cursor-on');
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, big = false, shown = false;
    const sel = 'a,button,[role="button"],input,textarea,select,label,summary';
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; dot.current?.style.setProperty('opacity', '1'); ring.current?.style.setProperty('opacity', '1'); }
      big = Boolean((e.target as Element | null)?.closest?.(sel));
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${big ? 1.9 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => { dot.current?.style.setProperty('opacity', '0'); ring.current?.style.setProperty('opacity', '0'); shown = false; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('custom-cursor-on');
    };
  }, []);

  return (
    <div aria-hidden="true" className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[200] h-9 w-9 rounded-full border border-cyan-300/60 opacity-0 transition-[opacity,transform] duration-200 mix-blend-screen" style={{ boxShadow: '0 0 18px rgba(6,182,212,.35)' }} />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[201] h-2 w-2 rounded-full bg-white opacity-0 shadow-[0_0_14px_4px_rgba(124,58,237,0.9)]" />
    </div>
  );
}
