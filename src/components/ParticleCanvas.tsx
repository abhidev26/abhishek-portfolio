import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

interface Props { variant: 'constellation' | 'dust'; density?: number; className?: string }

/** Lightweight 2D canvas particles (constellation lines / drifting dust). Pauses when off-screen (IntersectionObserver). */
export function ParticleCanvas({ variant, density = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = prefersReducedMotion();
    let w = 0, h = 0, raf = 0, visible = false;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];
    const color = variant === 'constellation' ? '140,170,255' : '255,120,80';
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, (w * h) / (variant === 'constellation' ? 16000 : 12000)) * density);
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * (variant === 'dust' ? 0.5 : 0.18), vy: (Math.random() - 0.5) * (variant === 'dust' ? 0.2 : 0.18) - (variant === 'dust' ? 0.05 : 0), r: variant === 'dust' ? 0.6 + Math.random() * 1.6 : 0.8 + Math.random() * 1.4 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!still) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = `rgba(${color},${variant === 'dust' ? 0.45 : 0.8})`; ctx.fill();
      }
      if (variant === 'constellation') {
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = dx * dx + dy * dy;
          if (d < 14000) { ctx.strokeStyle = `rgba(${color},${(1 - d / 14000) * 0.28})`; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
      }
      if (visible && !still) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(draw); });
    io.observe(canvas); resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [variant, density]);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`} />;
}
