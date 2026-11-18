import type Lenis from 'lenis';

export interface SectionRange {
  top: number;
  bottom: number;
}

/**
 * Shared, mutable runtime state. It is read every frame by the Three.js camera controller,
 * so it deliberately lives OUTSIDE React state (no re-renders per animation frame).
 */
export const store = {
  scrollY: 0,
  vh: 800,
  vw: 1280,
  maxScroll: 1,
  sections: [] as SectionRange[],
  pointer: { x: 0, y: 0 },
  /** performance.now() timestamp when the preloader finished (camera intro starts); -1 while loading. */
  introStart: -1,
  lenis: null as Lenis | null,
  /** DOM node of the atmospheric portal overlay, tinted by the camera controller. */
  overlayEl: null as HTMLElement | null,
};

// ---- Loading progress (real milestones, no fake counter) -------------------------------------
type Stage = 'fonts' | 'chunk' | 'textures' | 'frame';
const WEIGHTS: Record<Stage, number> = { fonts: 0.1, chunk: 0.2, textures: 0.6, frame: 0.1 };
const stages: Record<Stage, number> = { fonts: 0, chunk: 0, textures: 0, frame: 0 };
const listeners = new Set<() => void>();
let snapshot = 0;

function recompute() {
  snapshot = (Object.keys(stages) as Stage[]).reduce((sum, k) => sum + WEIGHTS[k] * stages[k], 0);
  listeners.forEach((l) => l());
}
export function setLoad(stage: Stage, fraction: number): void {
  const f = Math.min(1, Math.max(stages[stage], fraction));
  if (f === stages[stage]) return;
  stages[stage] = f;
  recompute();
}
export function completeAllLoading(): void {
  (Object.keys(stages) as Stage[]).forEach((k) => (stages[k] = 1));
  recompute();
}
export function skipScene(): void {
  stages.chunk = 1;
  stages.textures = 1;
  stages.frame = 1;
  recompute();
}
export const loadStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  getSnapshot: () => snapshot,
};
