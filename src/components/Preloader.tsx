import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loadStore } from '../lib/store';
import { PLANETS } from '../three/orbit';
import { seededRandom } from '../lib/utils';

const COLORS = ['#a8a29e', '#e8c07a', '#4f8cff', '#e0613a', '#d9a066', '#e8d5a0', '#7de3ea', '#4666ff'];

/**
 * Launch sequence. Progress comes from REAL milestones (fonts, 3D chunk, texture generation, first
 * rendered frame) - it only reaches 100% when the universe is actually ready.
 */
export function Preloader({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const target = useSyncExternalStore(loadStore.subscribe, loadStore.getSnapshot, () => 0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'welcome' | 'done'>('loading');
  const doneRef = useRef(false);
  const stars = useMemo(() => { const r = seededRandom(5); return Array.from({ length: 90 }, () => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 2, d: r() * 3, at: r() * 0.8 })); }, []);

  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      setShown((v) => { const t = target * 100; return v >= t ? v : Math.min(t, v + Math.max(25 * dt, (t - v) * 6 * dt)); });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  useEffect(() => {
    if (shown >= 99.9 && target >= 1 && phase === 'loading') {
      setPhase('welcome');
      window.setTimeout(() => setPhase('done'), reduced ? 700 : 1300);
    }
  }, [shown, target, phase, reduced]);

  useEffect(() => {
    if (phase === 'done' && !doneRef.current) { doneRef.current = true; onDone(); }
  }, [phase, onDone]);

  const pct = Math.floor(shown);
  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div key="pre" role="status" aria-live="polite" aria-label="Loading" className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-space" exit={{ opacity: 0, scale: reduced ? 1 : 1.25 }} transition={{ duration: reduced ? 0.4 : 0.9, ease: 'easeInOut' }}>
          {!reduced && stars.map((s, i) => (
            <span key={i} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: pct / 100 > s.at ? 0.85 : 0, transition: 'opacity .6s', animation: `tw ${2 + s.d}s ease-in-out infinite` }} />
          ))}
          <div className="relative flex w-full max-w-md flex-col items-center px-8 text-center">
            {!reduced && (
              <div className="relative mb-10 h-56 w-56">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700" style={{ width: pct > 8 ? 26 : 4, height: pct > 8 ? 26 : 4, opacity: pct > 3 ? 1 : 0, background: 'radial-gradient(circle,#fff6d0,#ffae33 55%,#ff6a00)', boxShadow: pct > 8 ? '0 0 50px 16px rgba(255,150,40,.55)' : 'none' }} />
                {PLANETS.map((p, i) => {
                  const r = 22 + i * 12;
                  const on = pct > 12 + i * 10;
                  return (
                    <div key={p.name} className="absolute left-1/2 top-1/2 rounded-full border border-white/10" style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, opacity: on ? 1 : 0, transition: 'opacity .5s', animation: `orbit-spin ${6 + i * 3}s linear infinite` }}>
                      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: 5 + (i === 4 || i === 5 ? 4 : 0), height: 5 + (i === 4 || i === 5 ? 4 : 0), background: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}` }} />
                    </div>
                  );
                })}
              </div>
            )}
            <p className="font-display text-3xl font-bold tracking-[0.35em] sm:text-4xl"><span className="gradient-text">NEXUS COSMOS</span></p>
            <AnimatePresence mode="wait">
              {phase === 'loading' ? (
                <motion.div key="l" exit={{ opacity: 0 }} className="mt-6 w-full">
                  <p className="mono-label mb-3">INITIALIZING UNIVERSE...</p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-3 font-mono text-2xl tabular-nums text-slate-200">{pct}%</p>
                </motion.div>
              ) : (
                <motion.p key="w" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-display text-sm tracking-[0.25em] text-cyan-200 sm:text-base">WELCOME TO ABHISHEK'S UNIVERSE.</motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
