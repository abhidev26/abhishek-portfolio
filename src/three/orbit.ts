import { Vector3 } from 'three';

export type PlanetName = 'Mercury' | 'Venus' | 'Earth' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune';

export interface AtmosphereDef {
  color: [number, number, number];
  strength: number;
  scale: number;
}

export interface PlanetDef {
  name: PlanetName;
  /** Visual radius (artistically enlarged relative to the orbits so planets read at hero distance). */
  radius: number;
  orbit: number;
  /** Orbital angular speed (rad / s). */
  speed: number;
  /** Axial rotation speed (rad / s). */
  spin: number;
  phase: number;
  /** Axial tilt (rad). */
  tilt: number;
  atmosphere?: AtmosphereDef;
}

export const SUN_RADIUS = 6;
export const BELT_INNER = 36;
export const BELT_OUTER = 44;

export const PLANETS: readonly PlanetDef[] = [
  { name: 'Mercury', radius: 1.1, orbit: 13, speed: 0.12, spin: 0.05, phase: 1.2, tilt: 0.0 },
  { name: 'Venus', radius: 1.9, orbit: 18.5, speed: 0.09, spin: -0.02, phase: 3.9, tilt: 3.09, atmosphere: { color: [1.0, 0.82, 0.5], strength: 0.75, scale: 1.1 } },
  { name: 'Earth', radius: 2.0, orbit: 25, speed: 0.06, spin: 0.22, phase: 0.45, tilt: 0.41, atmosphere: { color: [0.3, 0.6, 1.0], strength: 1.2, scale: 1.14 } },
  { name: 'Mars', radius: 1.5, orbit: 31, speed: 0.048, spin: 0.21, phase: 2.5, tilt: 0.44, atmosphere: { color: [1.0, 0.45, 0.25], strength: 0.55, scale: 1.09 } },
  { name: 'Jupiter', radius: 4.8, orbit: 55, speed: 0.028, spin: 0.45, phase: 5.2, tilt: 0.05, atmosphere: { color: [0.95, 0.75, 0.55], strength: 0.5, scale: 1.07 } },
  { name: 'Saturn', radius: 4.1, orbit: 70, speed: 0.021, spin: 0.4, phase: 1.0, tilt: 0.47, atmosphere: { color: [1.0, 0.85, 0.55], strength: 0.45, scale: 1.07 } },
  { name: 'Uranus', radius: 2.9, orbit: 83, speed: 0.015, spin: -0.3, phase: 3.3, tilt: 1.7, atmosphere: { color: [0.5, 0.9, 1.0], strength: 0.9, scale: 1.1 } },
  { name: 'Neptune', radius: 2.8, orbit: 95, speed: 0.012, spin: 0.33, phase: 4.4, tilt: 0.49, atmosphere: { color: [0.25, 0.45, 1.0], strength: 1.1, scale: 1.12 } },
] as const;

export const PLANET_BY_NAME = Object.fromEntries(PLANETS.map((p) => [p.name, p])) as Record<PlanetName, PlanetDef>;

/** Planet position as a pure function of time, so meshes and the camera never disagree. */
export function planetPosition(def: PlanetDef, t: number, out: Vector3): Vector3 {
  const a = def.phase + t * def.speed;
  return out.set(Math.cos(a) * def.orbit, 0, Math.sin(a) * def.orbit);
}
