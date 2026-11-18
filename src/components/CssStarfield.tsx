import { useMemo } from 'react';
import { seededRandom } from '../lib/utils';

function shadows(n: number, seed: number, color: string): string {
  const r = seededRandom(seed);
  return Array.from({ length: n }, () => `${Math.round(r() * 2000)}px ${Math.round(r() * 2000)}px 0 ${color}`).join(',');
}

/** Beautiful pure-CSS starfield + nebula: used for low-end devices, reduced motion and WebGL failure. */
export function CssStarfield({ animate = true }: { animate?: boolean }) {
  const layers = useMemo(() => [shadows(140, 1, 'rgba(255,255,255,.9)'), shadows(70, 2, 'rgba(180,200,255,.85)'), shadows(30, 3, 'rgba(255,220,180,.9)')], []);
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 overflow-hidden bg-space">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 20% 25%, rgba(124,58,237,.28), transparent 70%), radial-gradient(50% 45% at 80% 70%, rgba(6,182,212,.18), transparent 70%), radial-gradient(40% 40% at 60% 15%, rgba(236,72,153,.13), transparent 70%)' }} />
      {layers.map((s, i) => (
        <div
          key={i}
          className="absolute left-0 top-0"
          style={{ width: i + 1, height: i + 1, borderRadius: '50%', boxShadow: s, animation: animate ? `tw ${4 + i * 2}s ease-in-out ${i}s infinite` : undefined }}
        />
      ))}
      <div className="absolute left-[72%] top-[42%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full opacity-45 blur-[2px]" style={{ background: 'radial-gradient(circle at 35% 35%, #ffd27a, #ff7a18 45%, #7a2a05 80%)', boxShadow: '0 0 120px 40px rgba(255,140,30,.35)', maxWidth: '46vw', maxHeight: '46vw' }} />
    </div>
  );
}
