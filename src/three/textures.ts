import { CanvasTexture, RepeatWrapping, SRGBColorSpace, LinearMipmapLinearFilter, LinearFilter } from 'three';
import { clamp, seededRandom } from '../lib/utils';

/* ---------------------------------------------------------------------------------------------
 * Procedural planet surfaces.
 * Every texture is generated at runtime from seamless 3-D noise sampled on a sphere, so there are
 * no external texture files, no seams at the poles/date-line and no licensing questions.
 * ------------------------------------------------------------------------------------------- */

type RGB = [number, number, number];

const perm = new Uint8Array(512);
{
  const rnd = seededRandom(20260611);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lp = (a: number, b: number, t: number) => a + (b - a) * t;
function grad(h: number, x: number, y: number, z: number) {
  const hh = h & 15;
  const u = hh < 8 ? x : y;
  const v = hh < 4 ? y : hh === 12 || hh === 14 ? x : z;
  return ((hh & 1) === 0 ? u : -u) + ((hh & 2) === 0 ? v : -v);
}
/** Perlin noise, range ~[-1, 1]. */
function noise3(x: number, y: number, z: number): number {
  const fx = Math.floor(x), fy = Math.floor(y), fz = Math.floor(z);
  const X = fx & 255, Y = fy & 255, Z = fz & 255;
  x -= fx; y -= fy; z -= fz;
  const u = fade(x), v = fade(y), w = fade(z);
  const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
  const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
  return lp(
    lp(lp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u), lp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
    lp(lp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u), lp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
    w,
  );
}
/** Fractal noise normalised to ~[0, 1]. */
function fbm(x: number, y: number, z: number, oct = 5, lac = 2.03, gain = 0.5): number {
  let amp = 0.5, sum = 0, norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * noise3(x, y, z);
    norm += amp;
    x *= lac; y *= lac; z *= lac;
    amp *= gain;
  }
  return (sum / norm) * 0.5 + 0.5;
}
function hash3(x: number, y: number, z: number): number {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Distance to the nearest random feature point (cellular noise) - used for craters. */
function worley(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let best = 9;
  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++) {
        const cx = ix + dx, cy = iy + dy, cz = iz + dz;
        const px = cx + hash3(cx, cy, cz), py = cy + hash3(cy, cz, cx + 7), pz = cz + hash3(cz, cx + 3, cy);
        const d = (px - x) ** 2 + (py - y) ** 2 + (pz - z) ** 2;
        if (d < best) best = d;
      }
  return Math.sqrt(best);
}

const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const scale = (a: RGB, k: number): RGB => [a[0] * k, a[1] * k, a[2] * k];
function ramp(stops: Array<[number, RGB]>, t: number): RGB {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
  }
  return stops[stops.length - 1][1];
}

type Shader = (x: number, y: number, z: number, lat: number, lon: number) => [number, number, number, number?];

function paint(w: number, h: number, fn: Shader): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let j = 0; j < h; j++) {
    const lat = (0.5 - (j + 0.5) / h) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let i = 0; i < w; i++) {
      const lon = ((i + 0.5) / w) * Math.PI * 2;
      const c = fn(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat, lon);
      const o = (j * w + i) * 4;
      d[o] = c[0];
      d[o + 1] = c[1];
      d[o + 2] = c[2];
      d[o + 3] = c[3] ?? 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/* ---------------------------------------- planets ------------------------------------------- */

const crater = (x: number, y: number, z: number, freq: number) => {
  const d = worley(x * freq, y * freq, z * freq);
  const floor = ss(0.34, 0.2, d); // dark bowl
  const rim = ss(0.3, 0.38, d) * ss(0.5, 0.38, d); // bright rim
  return rim * 0.5 - floor * 0.45;
};

const mercury: Shader = (x, y, z) => {
  const base = fbm(x * 3, y * 3, z * 3, 5);
  const c = crater(x, y, z, 5) + crater(x + 4, y, z, 11) * 0.6;
  const v = clamp(0.42 + (base - 0.5) * 0.6 + c * 0.55, 0, 1);
  const col = mix([70, 64, 60], [168, 158, 148], v);
  return [col[0], col[1], col[2]];
};

const venus: Shader = (x, y, z) => {
  const wx = fbm(x * 1.8, y * 1.8, z * 1.8, 4);
  const n = fbm(x * 2.2 + wx * 2.2, y * 5.5 + wx, z * 2.2 - wx * 1.5, 5);
  const col = ramp([[0, [176, 124, 64]], [0.45, [225, 184, 112]], [0.7, [243, 220, 160]], [1, [255, 243, 205]]], n);
  return [col[0], col[1], col[2]];
};

const earthElevation = (x: number, y: number, z: number) => fbm(x * 1.35 + 3.1, y * 1.35, z * 1.35, 3) * 0.7 + fbm(x * 4.2, y * 4.2 + 9, z * 4.2, 5) * 0.3;
const earth: Shader = (x, y, z, lat) => {
  const e = earthElevation(x, y, z);
  const sea = 0.5;
  const alat = Math.abs(lat);
  let col: RGB;
  if (e < sea) {
    const depth = ss(0.25, sea, e);
    col = mix([4, 16, 52], [20, 84, 148], depth);
    col = mix(col, [58, 150, 190], ss(sea - 0.03, sea, e));
  } else {
    const h = (e - sea) / 0.28;
    const moist = fbm(x * 2.4 + 20, y * 2.4, z * 2.4, 4);
    const tropical = 1 - ss(0.2, 1.1, alat);
    const dry = ss(0.45, 0.62, moist) * ss(0.15, 0.55, tropical) * (1 - ss(0.0, 0.5, h) * 0);
    col = mix([40, 112, 52], [88, 128, 62], 1 - tropical);
    col = mix(col, [196, 166, 108], clamp(1 - moist * 1.6, 0, 1) * ss(0.2, 0.9, tropical) + dry * 0.0);
    col = mix(col, [118, 100, 86], ss(0.35, 0.7, h));
    col = mix(col, [244, 246, 250], ss(0.75, 0.95, h));
  }
  const ice = ss(1.12 + (fbm(x * 6, y * 6, z * 6, 3) - 0.5) * 0.25, 1.32, alat);
  col = mix(col, [240, 246, 252], ice);
  return [col[0], col[1], col[2]];
};

const earthClouds: Shader = (x, y, z) => {
  const wx = fbm(x * 2, y * 2, z * 2, 3);
  const n = fbm(x * 2.6 + wx * 1.6, y * 3.4, z * 2.6 - wx, 6);
  const a = ss(0.5, 0.74, n);
  return [255, 255, 255, Math.round(a * 235)];
};

const mars: Shader = (x, y, z, lat) => {
  const n = fbm(x * 3, y * 3, z * 3, 6);
  let col = ramp([[0, [106, 46, 28]], [0.5, [176, 90, 52]], [1, [222, 150, 100]]], n);
  col = mix(col, [74, 36, 28], ss(0.58, 0.74, fbm(x * 1.5 + 9, y * 1.5, z * 1.5, 4)) * 0.8);
  col = mix(col, scale([210, 130, 80], 1), ss(0.6, 0.8, fbm(x * 5 + 2, y * 5, z * 5, 3)) * 0.25);
  col = mix(col, [245, 245, 250], ss(1.28 + (n - 0.5) * 0.15, 1.42, Math.abs(lat)));
  return [col[0], col[1], col[2]];
};

const angDiff = (a: number, b: number) => {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
};

const jupiter: Shader = (x, y, z, lat, lon) => {
  const v = lat / (Math.PI / 2);
  const t = fbm(x * 4, y * 16, z * 4, 5);
  const band = 0.5 + 0.5 * Math.sin(v * 17 + (t - 0.5) * 4.2);
  let col = ramp([[0, [128, 78, 54]], [0.3, [198, 148, 108]], [0.55, [238, 218, 188]], [0.78, [196, 128, 86]], [1, [118, 70, 52]]], band);
  // Great Red Spot-inspired storm.
  const dx = angDiff(lon, 3.6) * Math.cos(lat);
  const dy = lat + 0.42;
  const r = Math.sqrt((dx / 0.3) ** 2 + (dy / 0.15) ** 2);
  const swirl = fbm(x * 12 + 4, y * 12, z * 12, 3);
  const spot = ss(1.15, 0.55, r);
  col = mix(col, [236, 224, 205], ss(1.35, 1.05, r) * ss(0.95, 1.15, r) * 0.7);
  col = mix(col, mix([160, 52, 34], [214, 96, 60], swirl), spot);
  return [col[0], col[1], col[2]];
};

const saturn: Shader = (x, y, z, lat) => {
  const v = lat / (Math.PI / 2);
  const t = fbm(x * 3, y * 18, z * 3, 4);
  const band = 0.5 + 0.5 * Math.sin(v * 22 + (t - 0.5) * 2.4);
  const col = ramp([[0, [176, 146, 98]], [0.5, [218, 194, 142]], [1, [240, 224, 182]]], band * 0.8 + (t - 0.5) * 0.3);
  return [col[0], col[1], col[2]];
};

const uranus: Shader = (x, y, z, lat) => {
  const v = lat / (Math.PI / 2);
  const t = fbm(x * 2, y * 10, z * 2, 3);
  const band = 0.5 + 0.5 * Math.sin(v * 14 + t * 2);
  const col = mix([126, 208, 218], [168, 234, 238], band * 0.6 + (t - 0.5) * 0.25);
  return [col[0], col[1], col[2]];
};

const neptune: Shader = (x, y, z, lat, lon) => {
  const v = lat / (Math.PI / 2);
  const t = fbm(x * 3, y * 12, z * 3, 5);
  const band = 0.5 + 0.5 * Math.sin(v * 12 + (t - 0.5) * 3.2);
  let col = mix([28, 52, 168], [70, 112, 232], band * 0.75 + (t - 0.5) * 0.4);
  const dx = angDiff(lon, 1.2) * Math.cos(lat);
  const dy = lat + 0.35;
  col = mix(col, [14, 26, 96], ss(1.1, 0.4, Math.sqrt((dx / 0.26) ** 2 + (dy / 0.13) ** 2)) * 0.85);
  col = mix(col, [214, 232, 255], ss(0.7, 0.86, fbm(x * 7, y * 18, z * 7, 3)) * 0.35);
  return [col[0], col[1], col[2]];
};

const moon: Shader = (x, y, z) => {
  const base = fbm(x * 3, y * 3, z * 3, 5);
  const v = clamp(0.5 + (base - 0.5) * 0.5 + crater(x, y, z, 6) * 0.6, 0, 1);
  const col = mix([60, 60, 62], [190, 188, 184], v);
  return [col[0], col[1], col[2]];
};

export type TextureName = 'Mercury' | 'Venus' | 'Earth' | 'EarthClouds' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Moon';

interface Recipe {
  name: TextureName;
  shader: Shader;
  /** Relative resolution multiplier. */
  res: number;
}

export const TEXTURE_RECIPES: readonly Recipe[] = [
  { name: 'Earth', shader: earth, res: 1 },
  { name: 'EarthClouds', shader: earthClouds, res: 1 },
  { name: 'Mercury', shader: mercury, res: 0.5 },
  { name: 'Mars', shader: mars, res: 0.75 },
  { name: 'Jupiter', shader: jupiter, res: 1 },
  { name: 'Saturn', shader: saturn, res: 0.75 },
  { name: 'Venus', shader: venus, res: 0.5 },
  { name: 'Uranus', shader: uranus, res: 0.5 },
  { name: 'Neptune', shader: neptune, res: 0.75 },
  { name: 'Moon', shader: moon, res: 0.5 },
];

export function buildTexture(recipe: Recipe, baseWidth: number): CanvasTexture {
  const w = Math.max(128, Math.round((baseWidth * recipe.res) / 64) * 64);
  const canvas = paint(w, w / 2, recipe.shader);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.anisotropy = 4;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const yieldToBrowser = () => new Promise<void>((r) => window.setTimeout(r, 0));

/** Generates all textures one at a time, yielding to the browser between each so the UI stays alive. */
export async function generateTextures(
  baseWidth: number,
  onTexture: (name: TextureName, tex: CanvasTexture, done: number, total: number) => void,
  cancelled: () => boolean,
): Promise<void> {
  for (let i = 0; i < TEXTURE_RECIPES.length; i++) {
    await yieldToBrowser();
    if (cancelled()) return;
    const recipe = TEXTURE_RECIPES[i];
    onTexture(recipe.name, buildTexture(recipe, baseWidth), i + 1, TEXTURE_RECIPES.length);
  }
}
