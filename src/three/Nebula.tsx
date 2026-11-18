import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, Mesh } from 'three';

const vert = /* glsl */ `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;

const makeFrag = (octaves: number) => /* glsl */ `
uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uScale; uniform float uIntensity; uniform float uSeed;
varying vec3 vDir;
float hash(vec3 p){p=fract(p*0.3183099+.1+uSeed);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<${octaves};i++){v+=a*noise(p);p=p*2.1+vec3(3.1,1.7,5.3);a*=.5;}return v;}
void main(){
  vec3 d = normalize(vDir);
  vec3 p = d*uScale + vec3(uTime*.012, uTime*.006, -uTime*.009);
  float w = fbm(p*.8);
  float n = fbm(p + w*1.7);
  float m = fbm(p*1.7 - w);
  float cloud = smoothstep(.42,.86,n);
  vec3 col = mix(uA, uB, m) * cloud * uIntensity;
  col += uB * pow(cloud, 3.) * .25 * uIntensity;
  gl_FragColor = vec4(col, 1.);
}`;

interface LayerProps {
  radius: number;
  a: string;
  b: string;
  scale: number;
  intensity: number;
  seed: number;
  octaves: number;
  follow: number;
}

function Layer({ radius, a, b, scale, intensity, seed, octaves, follow }: LayerProps) {
  const ref = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uA: { value: new Color(a) }, uB: { value: new Color(b) }, uScale: { value: scale }, uIntensity: { value: intensity }, uSeed: { value: seed } }),
    [a, b, scale, intensity, seed],
  );
  const frag = useMemo(() => makeFrag(octaves), [octaves]);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    // Layers trail the camera by different amounts -> layered parallax between nebulae.
    ref.current?.position.copy(state.camera.position).multiplyScalar(follow);
  });
  return (
    <mesh ref={ref} renderOrder={-20} frustumCulled={false}>
      <sphereGeometry args={[radius, 32, 24]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} side={BackSide} transparent depthWrite={false} depthTest={false} blending={AdditiveBlending} />
    </mesh>
  );
}

/** Procedural, slowly drifting nebula shells (cheap on mobile: 1 layer, 3 octaves). */
function NebulaImpl({ layers, octaves }: { layers: number; octaves: number }) {
  return (
    <>
      <Layer radius={1800} a="#2a1a6e" b="#7C3AED" scale={1.6} intensity={0.62} seed={0.11} octaves={octaves} follow={0.97} />
      {layers > 1 && <Layer radius={1700} a="#0b3a6b" b="#06B6D4" scale={2.2} intensity={0.34} seed={0.37} octaves={octaves} follow={0.9} />}
      {layers > 2 && <Layer radius={1600} a="#4a0f3c" b="#EC4899" scale={2.9} intensity={0.26} seed={0.73} octaves={octaves} follow={0.82} />}
    </>
  );
}
export const Nebula = memo(NebulaImpl);
