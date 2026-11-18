import { forwardRef, useCallback, useRef, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '../lib/utils';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { GradientBorder } from './GradientBorder';

interface Props extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  lift?: number;
}

/**
 * Premium interactive card: 3D perspective tilt, lift, cursor spotlight, shine sweep, outer glow
 * and an animated gradient border. Pointer position is written straight to CSS variables / style
 * (no React state), and the effect only runs for mouse pointers.
 */
export const TiltCard = forwardRef<HTMLDivElement, Props>(function TiltCard({ max = 9, lift = 6, className, children, onPointerMove, onPointerLeave, ...rest }, fwd) {
  const local = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      local.current = node;
      if (typeof fwd === 'function') fwd(node);
      else if (fwd) fwd.current = node;
    },
    [fwd],
  );

  const move = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const el = local.current;
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-${lift}px) scale3d(1.02,1.02,1.02)`;
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    if (local.current) local.current.style.transform = '';
  };

  return (
    <div ref={setRef} className={cn('tilt-card gb-host', className)} onPointerMove={move} onPointerLeave={leave} {...rest}>
      <GradientBorder />
      <span className="tilt-spot" aria-hidden="true" />
      <span className="tilt-shine" aria-hidden="true" />
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
});
