import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { store } from '../lib/store';
import { clamp, damp, lerp, smootherstep } from '../lib/utils';
import { PLANET_BY_NAME, planetPosition, type PlanetName } from './orbit';

/**
 * ONE centralised camera controller for the whole COSMIC JOURNEY.
 *
 * Scroll position (shared via `store`, written by the scroll listener / Lenis) is mapped to camera
 * waypoints. Waypoints are expressed relative to LIVE planet positions, so the camera follows the
 * moving planets and never jumps. Only the scroll value is damped; poses are computed analytically
 * every frame. Nothing here touches React state.
 */

interface Dest {
  planet: PlanetName;
  /** Distance from the planet centre in planet radii. */
  k: number;
  /** Height above the orbital plane in planet radii. */
  h: number;
  /** Azimuth around the planet, measured from the sun-facing direction (rad). */
  az: number;
  /** Sideways look offset in radii (moves the planet off-centre so content has room). */
  shift: number;
  /** [r,g,b] 0-255 tint of the atmospheric portal overlay. */
  tint: string;
}

const DESTS: readonly Dest[] = [
  { planet: 'Earth', k: 3.3, h: 0.7, az: 0.55, shift: -1.6, tint: '70,130,255' },
  { planet: 'Mercury', k: 3.0, h: 0.5, az: -0.6, shift: 1.5, tint: '255,150,70' },
  { planet: 'Mars', k: 3.1, h: 0.6, az: 0.5, shift: -1.6, tint: '255,80,50' },
  { planet: 'Jupiter', k: 2.5, h: 0.45, az: -0.45, shift: 0.9, tint: '255,190,110' },
  { planet: 'Saturn', k: 2.15, h: 0.28, az: 0.65, shift: -1.1, tint: '255,214,140' },
  { planet: 'Neptune', k: 3.2, h: 0.6, az: -0.5, shift: 1.5, tint: '60,110,255' },
];

interface Pose {
  pos: Vector3;
  look: Vector3;
}
const UP = new Vector3(0, 1, 0);

export function CameraController() {
  const sv = useRef(-1);
  const w = useMemo(
    () => ({
      a: { pos: new Vector3(), look: new Vector3() } as Pose,
      b: { pos: new Vector3(), look: new Vector3() } as Pose,
      P: new Vector3(),
      S: new Vector3(),
      side: new Vector3(),
      pos: new Vector3(),
      look: new Vector3(),
      right: new Vector3(),
      out: new Vector3(),
      sun: new Vector3(0, 0, 0),
      lastFov: 0,
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const cam = state.camera as PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const portrait = aspect < 1;
    const widen = clamp(1.25 / aspect, 1, 2.4); // pull back on narrow screens

    // ---- damped virtual scroll -----------------------------------------------------------
    if (sv.current < 0) sv.current = store.scrollY;
    sv.current = damp(sv.current, store.scrollY, 6, dt);
    const s = sv.current;

    // ---- poses ---------------------------------------------------------------------------
    const heroPose = (pose: Pose) => {
      const shiftX = aspect > 1.3 ? -26 : 0;
      pose.pos.set(shiftX, 50 * widen, 118 * widen);
      pose.look.set(shiftX, -2, 0);
    };
    const destPose = (i: number, pose: Pose) => {
      const d = DESTS[i - 1];
      const def = PLANET_BY_NAME[d.planet];
      planetPosition(def, t, w.P);
      w.S.copy(w.P).multiplyScalar(-1).normalize(); // direction planet -> sun
      w.side.crossVectors(UP, w.S).normalize();
      const R = def.radius;
      const k = d.k * (portrait ? 1.45 : lerp(1, 1.25, clamp(1.3 - aspect, 0, 1)));
      const shift = d.shift * (portrait ? 0.15 : 1);
      const ca = Math.cos(d.az), sa = Math.sin(d.az);
      // rotate S about Y by az
      const dx = w.S.x * ca + w.S.z * sa;
      const dz = -w.S.x * sa + w.S.z * ca;
      pose.pos.set(w.P.x + dx * R * k, w.P.y + R * d.h * (portrait ? 1.4 : 1), w.P.z + dz * R * k);
      pose.look.copy(w.P).addScaledVector(w.side, R * shift);
    };
    const poseFor = (i: number, pose: Pose) => (i === 0 ? heroPose(pose) : destPose(i, pose));

    // ---- which part of the journey are we in? --------------------------------------------
    const secs = store.sections;
    const vh = store.vh;
    let from = 0, to = 0, e = 0;
    if (secs.length >= 2) {
      let found = false;
      for (let i = 1; i < secs.length; i++) {
        const start = secs[i].top - vh;
        const end = secs[i].top - vh * 0.12;
        if (s < start) {
          from = to = i - 1;
          found = true;
          break;
        }
        if (s <= end) {
          from = i - 1;
          to = i;
          e = smootherstep((s - start) / Math.max(1, end - start));
          found = true;
          break;
        }
      }
      if (!found) from = to = secs.length - 1;
    }

    poseFor(from, w.a);
    let focusIdx = from;
    if (to !== from) {
      poseFor(to, w.b);
      w.pos.lerpVectors(w.a.pos, w.b.pos, e);
      w.look.lerpVectors(w.a.look, w.b.look, e);
      // lift the flight path over the ecliptic so we never cut through the Sun or other planets
      const dist = w.a.pos.distanceTo(w.b.pos);
      w.pos.y += Math.sin(e * Math.PI) * (14 + dist * 0.16);
      focusIdx = e > 0.5 ? to : from;
    } else {
      w.pos.copy(w.a.pos);
      w.look.copy(w.a.look);
    }

    // ---- finale: slowly pull back into space after the contact form ---------------------
    let outro = 0;
    if (from === DESTS.length && to === from && secs.length) {
      const last = secs[secs.length - 1];
      const startS = last.top + vh * 0.35;
      outro = smootherstep((s - startS) / Math.max(1, store.maxScroll - startS));
      if (outro > 0) {
        const nep = PLANET_BY_NAME.Neptune;
        planetPosition(nep, t, w.P);
        w.S.copy(w.P).multiplyScalar(-1).normalize();
        w.out.copy(w.P).addScaledVector(w.S, nep.radius * 22).setY(nep.radius * 9);
        w.pos.lerp(w.out, outro);
        w.look.lerp(w.sun.set(0, 0, 0), outro * 0.8);
      }
    }

    // ---- intro: camera zooms into the system once the preloader finishes -----------------
    let intro = 0;
    if (store.introStart >= 0) intro = 1 - Math.pow(1 - clamp((performance.now() - store.introStart) / 3600, 0, 1), 3);
    if (from === 0 && to === 0) w.pos.sub(w.look).multiplyScalar(1 + (1 - intro) * 1.1).add(w.look);

    // ---- gentle breathing + pointer parallax ---------------------------------------------
    cam.position.copy(w.pos);
    cam.lookAt(w.look);
    const dist = cam.position.distanceTo(w.look);
    const amt = dist * 0.012;
    cam.translateX(store.pointer.x * amt + Math.sin(t * 0.15) * amt * 0.4);
    cam.translateY(-store.pointer.y * amt * 0.6);

    // ---- speed warp FOV kick while travelling ---------------------------------------------
    const baseFov = portrait ? 58 : 50;
    const fov = baseFov + (to !== from ? Math.sin(e * Math.PI) * 15 : 0);
    if (Math.abs(fov - w.lastFov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
      w.lastFov = fov;
    }

    // ---- atmospheric portal overlay (DOM, written directly, no React) --------------------
    const el = store.overlayEl;
    if (el) {
      let alpha = 0;
      let tint = DESTS[0].tint;
      if (focusIdx > 0) {
        tint = DESTS[focusIdx - 1].tint;
        const settled = to === from ? 1 : 0;
        const arriving = to !== from && focusIdx === to ? smootherstep((e - 0.5) / 0.5) : 0;
        const leaving = to !== from && focusIdx === from ? smootherstep((0.5 - e) / 0.5) : 0;
        const bump = to !== from ? Math.sin(clamp((e - 0.55) / 0.45, 0, 1) * Math.PI) * (focusIdx === to ? 1 : 0) : 0;
        alpha = (0.2 * settled + 0.2 * Math.max(arriving, leaving) + 0.5 * bump) * (1 - outro * 0.8);
      }
      el.style.setProperty('--portal', tint);
      el.style.opacity = alpha.toFixed(3);
    }
  });

  return null;
}
