import { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, CanvasTexture, DoubleSide, Mesh, ShaderMaterial, Sprite, SRGBColorSpace } from 'three';
import { SUN_RADIUS } from './orbit';

const NOISE = /* glsl */ `
float hash(vec3 p){p=fract(p*0.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return v;}
`;

const surfaceFrag = /* glsl */ `
uniform float uTime; varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
${NOISE}
void main(){
  vec3 p = normalize(vPos)*2.3;
  float n = fbm(p + vec3(0.,uTime*.07,0.));
  float n2 = fbm(p*2.2 + vec3(uTime*.05,0.,-uTime*.06) + n*1.6);
  float heat = smoothstep(.22,.85,n*.55+n2*.65);
  vec3 col = mix(vec3(1.,.26,.02), vec3(1.,.6,.1), heat);
  col = mix(col, vec3(1.,.93,.62), pow(heat,3.));
  float spots = smoothstep(.62,.8,fbm(p*1.3+vec3(0.,0.,uTime*.02)));
  col *= 1.0 - spots*.45;
  float fres = pow(1. - max(dot(normalize(vNormal), vView), 0.), 2.6);
  col += vec3(1.,.45,.08)*fres*.9;
  gl_FragColor = vec4(col*1.7, 1.);
}`;

const coronaFrag = /* glsl */ `
uniform float uTime; varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
${NOISE}
void main(){
  float a = abs(dot(normalize(vNormal), vView));
  float glow = pow(clamp(a/0.55,0.,1.), 2.4);
  float flick = 0.75 + 0.5*fbm(normalize(vPos)*3. + vec3(uTime*.15));
  gl_FragColor = vec4(vec3(1.,.55,.14)*glow*flick*1.15, glow);
}`;

const vert = /* glsl */ `
varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
void main(){ vPos = position; vNormal = normalize(normalMatrix*normal);
  vec4 mv = modelViewMatrix*vec4(position,1.); vView = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;

function makeRaysTexture(): CanvasTexture {
  const s = 512;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  if (!g) throw new Error('2D canvas unavailable');
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(255,235,190,1)');
  grd.addColorStop(0.12, 'rgba(255,170,70,0.55)');
  grd.addColorStop(0.4, 'rgba(255,110,30,0.12)');
  grd.addColorStop(1, 'rgba(255,90,20,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  g.translate(s / 2, s / 2);
  for (let i = 0; i < 14; i++) {
    g.save();
    g.rotate((i / 14) * Math.PI * 2 + (i % 2) * 0.1);
    const len = s * (0.3 + (i % 3) * 0.08);
    const lg = g.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0, 'rgba(255,210,140,0.5)');
    lg.addColorStop(1, 'rgba(255,160,60,0)');
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(0, -3 - (i % 3));
    g.lineTo(len, 0);
    g.lineTo(0, 3 + (i % 3));
    g.fill();
    g.restore();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function SunImpl({ segments }: { segments: number }) {
  const surface = useRef<ShaderMaterial>(null);
  const corona = useRef<ShaderMaterial>(null);
  const rays = useRef<Sprite>(null);
  const rays2 = useRef<Sprite>(null);
  const body = useRef<Mesh>(null);
  const tex = useMemo(makeRaysTexture, []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const cUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    cUniforms.uTime.value = t;
    if (body.current) body.current.rotation.y += dt * 0.03;
    if (rays.current) rays.current.material.rotation += dt * 0.02;
    if (rays2.current) rays2.current.material.rotation -= dt * 0.013;
  });

  return (
    <group>
      <mesh ref={body}>
        <sphereGeometry args={[SUN_RADIUS, segments, segments]} />
        <shaderMaterial ref={surface} vertexShader={vert} fragmentShader={surfaceFrag} uniforms={uniforms} toneMapped={false} />
      </mesh>
      <mesh scale={1.34}>
        <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
        <shaderMaterial ref={corona} vertexShader={vert} fragmentShader={coronaFrag} uniforms={cUniforms} side={BackSide} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </mesh>
      <sprite ref={rays} scale={[SUN_RADIUS * 9, SUN_RADIUS * 9, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={AdditiveBlending} opacity={0.55} toneMapped={false} side={DoubleSide} />
      </sprite>
      <sprite ref={rays2} scale={[SUN_RADIUS * 6, SUN_RADIUS * 6, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={AdditiveBlending} opacity={0.4} toneMapped={false} />
      </sprite>
      {/* The Sun is the scene's only light source. decay=0 keeps distant planets readable. */}
      <pointLight intensity={4.2} decay={0} color="#fff1dc" />
    </group>
  );
}
export const Sun = memo(SunImpl);
