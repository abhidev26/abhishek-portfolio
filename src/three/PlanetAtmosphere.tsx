import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, FrontSide, Mesh, Vector3 } from 'three';
import type { AtmosphereDef } from './orbit';

const vert = /* glsl */ `
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorldNormal;
void main(){
  vNormal = normalize(normalMatrix*normal);
  vWorldNormal = normalize(mat3(modelMatrix)*normal);
  vec4 mv = modelViewMatrix*vec4(position,1.);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix*mv;
}`;

/** Outer halo: Fresnel-based glow that fades out away from the limb and is stronger on the sunlit side. */
const haloFrag = /* glsl */ `
uniform vec3 uColor; uniform float uStrength; uniform vec3 uSunDir; uniform float uInner;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorldNormal;
void main(){
  float a = abs(dot(normalize(vNormal), vView));
  float glow = pow(clamp(a/uInner,0.,1.), 2.2);
  float lit = 0.22 + 0.78*smoothstep(-0.35,0.65,dot(normalize(vWorldNormal), uSunDir));
  gl_FragColor = vec4(uColor*glow*uStrength*lit, glow*lit);
}`;

/** Thin inner rim light that hugs the visible limb of the planet. */
const rimFrag = /* glsl */ `
uniform vec3 uColor; uniform float uStrength; uniform vec3 uSunDir;
varying vec3 vNormal; varying vec3 vView; varying vec3 vWorldNormal;
void main(){
  float f = pow(1.-abs(dot(normalize(vNormal), vView)), 3.2);
  float lit = smoothstep(-0.15,0.7,dot(normalize(vWorldNormal), uSunDir));
  gl_FragColor = vec4(uColor*f*uStrength*lit*0.9, f*lit);
}`;

interface Props {
  radius: number;
  def: AtmosphereDef;
  segments: number;
}

function PlanetAtmosphereImpl({ radius, def, segments }: Props) {
  const halo = useRef<Mesh>(null);
  const world = useMemo(() => new Vector3(), []);
  const color = useMemo(() => new Color(def.color[0], def.color[1], def.color[2]), [def]);
  const sunDir = useMemo(() => new Vector3(1, 0, 0), []);
  // Shell radius r_s => limb sits at |dot| = sqrt(1 - (1/scale)^2) on the back faces.
  const inner = useMemo(() => Math.sqrt(1 - 1 / (def.scale * def.scale)), [def.scale]);

  const haloUniforms = useMemo(() => ({ uColor: { value: color }, uStrength: { value: def.strength }, uSunDir: { value: sunDir }, uInner: { value: inner } }), [color, def.strength, sunDir, inner]);
  const rimUniforms = useMemo(() => ({ uColor: { value: color }, uStrength: { value: def.strength }, uSunDir: { value: sunDir } }), [color, def.strength, sunDir]);

  useFrame(() => {
    if (!halo.current) return;
    halo.current.getWorldPosition(world);
    sunDir.copy(world).multiplyScalar(-1).normalize(); // Sun sits at the origin.
  });

  return (
    <group>
      <mesh ref={halo} scale={def.scale}>
        <sphereGeometry args={[radius, segments, segments]} />
        <shaderMaterial vertexShader={vert} fragmentShader={haloFrag} uniforms={haloUniforms} side={BackSide} transparent depthWrite={false} blending={AdditiveBlending} />
      </mesh>
      <mesh scale={1.012}>
        <sphereGeometry args={[radius, segments, segments]} />
        <shaderMaterial vertexShader={vert} fragmentShader={rimFrag} uniforms={rimUniforms} side={FrontSide} transparent depthWrite={false} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}
export const PlanetAtmosphere = memo(PlanetAtmosphereImpl);
