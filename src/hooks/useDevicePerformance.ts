import { prefersReducedMotion } from './useReducedMotion';

export type RenderMode = 'full' | 'lite' | 'fallback';
export type DeviceClass = 'desktop' | 'tablet' | 'mobile';

export interface PerfConfig {
  mode: RenderMode;
  device: DeviceClass;
  coarsePointer: boolean;
  stars: number;
  dust: number;
  belt: number;
  ringRocks: number;
  nebulaLayers: number;
  nebulaOctaves: number;
  sphereSegments: number;
  textureWidth: number;
  dprMax: number;
  msaa: number;
  shootingStars: boolean;
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

export const QUALITY_KEY = 'nexus-quality';
let cached: PerfConfig | null = null;

/**
 * Detects the device once and returns the budget for the 3D scene.
 * `?quality=full|lite|fallback` overrides detection (handy for testing).
 */
export function detectPerformance(): PerfConfig {
  if (cached) return cached;
  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
  const device: DeviceClass = w < 768 ? 'mobile' : w < 1100 || (coarse && w < 1280) ? 'tablet' : 'desktop';
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2);

  // The 3D universe runs whenever WebGL exists. Reduced-motion / weak devices get the cheaper 'lite'
  // scene instead of losing the 3D background entirely; the CSS starfield is only for no-WebGL.
  let mode: RenderMode = 'full';
  if (!hasWebGL()) mode = 'fallback';
  else if (prefersReducedMotion() || lowEnd || device !== 'desktop') mode = 'lite';

  // Visitor choice (quality switch button) or ?quality= override.
  let saved: string | null = null;
  try { saved = window.localStorage.getItem(QUALITY_KEY); } catch { /* storage blocked */ }
  const q = new URLSearchParams(window.location.search).get('quality') ?? saved;
  if (q === 'full' || q === 'lite' || q === 'fallback') mode = q;

  const d = device;
  cached = {
    mode,
    device,
    coarsePointer: coarse,
    stars: d === 'desktop' ? 5200 : d === 'tablet' ? 2800 : 1400,
    dust: d === 'desktop' ? 1600 : d === 'tablet' ? 900 : 450,
    belt: d === 'desktop' ? 4200 : d === 'tablet' ? 2200 : 900,
    ringRocks: d === 'desktop' ? 2400 : d === 'tablet' ? 1200 : 500,
    nebulaLayers: d === 'desktop' ? 3 : 1,
    nebulaOctaves: d === 'desktop' ? 4 : 3,
    sphereSegments: d === 'desktop' ? 64 : d === 'tablet' ? 40 : 28,
    textureWidth: d === 'desktop' ? 1024 : d === 'tablet' ? 640 : 512,
    dprMax: d === 'desktop' ? 1.75 : d === 'tablet' ? 1.5 : 1.25,
    msaa: d === 'desktop' ? 4 : 0,
    shootingStars: d !== 'mobile',
  };
  return cached;
}

export function useDevicePerformance(): PerfConfig {
  return detectPerformance();
}
