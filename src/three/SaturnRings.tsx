import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, Object3D, Quaternion, Vector3 } from 'three';
import { seededRandom } from '../lib/utils';

const vert = /* glsl */ `
varying vec3 vWorld; varying float vRad; varying vec3 vN;
uniform float uInner; uniform float uOuter;
void main(){
  vRad = (length(position.xy)-uInner)/(uOuter-uInner);
  vWorld = (modelMatrix*vec4(position,1.)).xyz;
  vN = normalize(mat3(modelMatrix)*normal);
  gl_Position = projectionMatrix*viewMatrix*vec4(vWorld,1.);
}`;

const frag = /* glsl */ `
uniform vec3 uCenter; uniform float uRadius; uniform float uOpacity; uniform float uSeed; uniform vec3 uTint;
varying vec3 vWorld; varying float vRad; varying vec3 vN;
float h(float x){return fract(sin(x*12.9898+uSeed*78.233)*43758.5453);}
float n1(float x){float i=floor(x);float f=fract(x);f=f*f*(3.-2.*f);return mix(h(i),h(i+1.),f);}
void main(){
  float r = vRad;
  float edge = smoothstep(0.,.04,r)*(1.-smoothstep(.94,1.,r));
  // layered ringlets (coarse + fine) and gaps (Cassini ~0.62, Encke ~0.9)
  float coarse = n1(r*14.);
  float fine = n1(r*130.)*.6 + n1(r*420.)*.4;
  float dens = mix(.35,1.,coarse)*mix(.55,1.,fine);
  dens *= 1.-smoothstep(.035,0.,abs(r-.62))*.96;
  dens *= 1.-smoothstep(.012,0.,abs(r-.9))*.85;
  dens *= mix(.55,1.,smoothstep(.0,.3,r)); // fainter inner edge
  vec3 base = mix(vec3(.62,.55,.43), vec3(.93,.84,.66), coarse*.7+fine*.3) * uTint;
  // sun is at the origin: ray from this fragment toward the sun, tested against the planet sphere
  vec3 L = normalize(-vWorld);
  float t = dot(uCenter - vWorld, L);
  float d = length(vWorld + L*t - uCenter);
  float shadow = (t>0.) ? smoothstep(uRadius*.97, uRadius*1.04, d) : 1.;
  float light = .5 + .5*abs(dot(normalize(vN), L));
  vec3 col = base*(.12 + .88*shadow)*light*1.15;
  gl_FragColor = vec4(col, edge*dens*uOpacity);
}`;

interface RingProps {
  inner: number;
  outer: number;
  opacity: number;
  seed: number;
  tint?: [number, number, number];
  planetRadius: number;
}

function Ring({ inner, outer, opacity, seed, tint = [1, 1, 1], planetRadius }: RingProps) {
  const mesh = useRef<Mesh>(null);
  const world = useMemo(() => new Vector3(), []);
  const uniforms = useMemo(
    () => ({
      uCenter: { value: new Vector3() },
      uRadius: { value: planetRadius },
      uOpacity: { value: opacity },
      uSeed: { value: seed },
      uTint: { value: new Color(tint[0], tint[1], tint[2]) },
      uInner: { value: inner },
      uOuter: { value: outer },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.getWorldPosition(world);
    uniforms.uCenter.value.copy(world);
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[inner, outer, 160, 1]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} side={DoubleSide} transparent depthWrite={false} />
    </mesh>
  );
}

function RingRocks({ radius, count }: { radius: number; count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rnd = seededRandom(77);
    const m = new Matrix4();
    const q = new Quaternion();
    const p = new Vector3();
    const s = new Vector3();
    const o = new Object3D();
    const color = new Color();
    for (let i = 0; i < count; i++) {
      // sample radius while avoiding the Cassini gap
      let r = rnd();
      if (r > 0.57 && r < 0.67) r += 0.12;
      const rr = radius * (1.3 + r * 1.05);
      const a = rnd() * Math.PI * 2;
      p.set(Math.cos(a) * rr, (rnd() - 0.5) * radius * 0.03, Math.sin(a) * rr);
      o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
      q.copy(o.quaternion);
      const k = radius * (0.004 + Math.pow(rnd(), 3) * 0.016);
      s.set(k * (0.7 + rnd() * 0.6), k * (0.7 + rnd() * 0.6), k * (0.7 + rnd() * 0.6));
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
      color.setHSL(0.09 + rnd() * 0.03, 0.25 + rnd() * 0.2, 0.45 + rnd() * 0.3);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, radius]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.03;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} metalness={0} flatShading />
      </instancedMesh>
    </group>
  );
}

interface Props {
  radius: number;
  rocks: number;
}

/** Layered Saturn ring system: shader rings with analytic planet shadow + instanced ring particles. */
function SaturnRingsImpl({ radius, rocks }: Props) {
  return (
    <group>
      <Ring inner={radius * 1.18} outer={radius * 1.34} opacity={0.22} seed={3} tint={[0.85, 0.8, 0.75]} planetRadius={radius} />
      <Ring inner={radius * 1.36} outer={radius * 2.38} opacity={0.95} seed={11} planetRadius={radius} />
      <Ring inner={radius * 2.45} outer={radius * 2.52} opacity={0.4} seed={29} tint={[0.9, 0.85, 0.75]} planetRadius={radius} />
      <RingRocks radius={radius} count={rocks} />
    </group>
  );
}
export const SaturnRings = memo(SaturnRingsImpl);
