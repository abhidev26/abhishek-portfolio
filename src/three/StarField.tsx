import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, ShaderMaterial } from 'three';
import { seededRandom } from '../lib/utils';
import { store } from '../lib/store';

const vert = /* glsl */ `
attribute float aSize; attribute float aPhase; attribute float aBright; attribute vec3 aColor;
uniform float uTime; uniform float uPR; uniform float uAtten;
varying vec3 vColor;
void main(){
  vec4 mv = modelViewMatrix*vec4(position,1.);
  gl_Position = projectionMatrix*mv;
  float tw = 0.72 + 0.28*sin(uTime*(0.7+aPhase*1.6)+aPhase*60.);
  float size = aSize*uPR*(0.85+0.3*tw);
  if (uAtten > 0.) size *= clamp(uAtten/(-mv.z), 0.15, 3.0);
  gl_PointSize = size;
  vColor = aColor*aBright*tw;
}`;
const frag = /* glsl */ `
varying vec3 vColor;
void main(){
  float d = length(gl_PointCoord-.5);
  float a = smoothstep(.5,.0,d); a*=a;
  gl_FragColor = vec4(vColor, a);
}`;

interface Props {
  count: number;
  /** Radius range of the shell / volume the particles live in. */
  minRadius: number;
  maxRadius: number;
  /** Vertical flattening (1 = sphere, <1 = disc-like dust). */
  flatten?: number;
  size: [number, number];
  brightness?: [number, number];
  /** >0 enables perspective size attenuation (used for nearby dust). */
  attenuation?: number;
  drift?: number;
  seed: number;
  tint?: 'stars' | 'dust';
  parallax?: number;
}

function ParticlesImpl({ count, minRadius, maxRadius, flatten = 1, size, brightness = [0.5, 1.4], attenuation = 0, drift = 0.002, seed, tint = 'stars', parallax = 0 }: Props) {
  const group = useRef<Group>(null);
  const mat = useRef<ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const rnd = seededRandom(seed);
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phase = new Float32Array(count);
    const bright = new Float32Array(count);
    const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rnd() * 2 - 1;
      const a = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = minRadius + (maxRadius - minRadius) * Math.cbrt(rnd());
      pos[i * 3] = Math.cos(a) * s * r;
      pos[i * 3 + 1] = u * r * flatten;
      pos[i * 3 + 2] = Math.sin(a) * s * r;
      sizes[i] = size[0] + Math.pow(rnd(), 4) * (size[1] - size[0]);
      phase[i] = rnd();
      bright[i] = brightness[0] + Math.pow(rnd(), 3) * (brightness[1] - brightness[0]);
      const k = rnd();
      if (tint === 'stars') {
        // mostly white, with blue-white and warm stars
        const c = k < 0.55 ? [1, 1, 1] : k < 0.8 ? [0.65, 0.78, 1] : k < 0.93 ? [1, 0.9, 0.7] : [1, 0.7, 0.6];
        color.set(c, i * 3);
      } else {
        const c = k < 0.5 ? [0.6, 0.55, 0.9] : k < 0.8 ? [0.45, 0.75, 0.95] : [0.95, 0.6, 0.8];
        color.set(c, i * 3);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('aSize', new BufferAttribute(sizes, 1));
    g.setAttribute('aPhase', new BufferAttribute(phase, 1));
    g.setAttribute('aBright', new BufferAttribute(bright, 1));
    g.setAttribute('aColor', new BufferAttribute(color, 3));
    return g;
  }, [count, minRadius, maxRadius, flatten, size, brightness, seed, tint]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPR: { value: 1 }, uAtten: { value: attenuation } }), [attenuation]);

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPR.value = gl.getPixelRatio();
    if (group.current) {
      group.current.rotation.y += dt * drift; // slow cosmic drift
      if (parallax) {
        // subtle pointer parallax
        group.current.rotation.x += (store.pointer.y * parallax - group.current.rotation.x) * 0.02;
        group.current.rotation.z += (store.pointer.x * parallax - group.current.rotation.z) * 0.02;
      }
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false} renderOrder={-5}>
        <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
      </points>
    </group>
  );
}
export const Particles = memo(ParticlesImpl);

/** Distant twinkling stars (different sizes and brightness) + nearby deep-space dust. */
export function StarField({ stars, dust }: { stars: number; dust: number }) {
  return (
    <>
      <Particles count={stars} minRadius={420} maxRadius={1500} size={[1.2, 4.2]} brightness={[0.45, 1.5]} seed={1} drift={0.0025} parallax={0.012} />
      <Particles count={dust} minRadius={14} maxRadius={130} flatten={0.22} size={[1.5, 5]} attenuation={55} brightness={[0.12, 0.45]} seed={9} tint="dust" drift={0.006} />
    </>
  );
}
