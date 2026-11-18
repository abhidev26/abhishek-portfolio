import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Matrix4, Mesh, Vector3 } from 'three';

const vert = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const frag = `uniform float uAlpha; varying vec2 vUv;
void main(){ float along = vUv.x; float across = 1.-abs(vUv.y-.5)*2.;
  float a = pow(along,2.2)*pow(across,1.6)*uAlpha; gl_FragColor = vec4(vec3(.8,.9,1.)*a*2.2, a); }`;

interface Streak {
  mesh: Mesh | null;
  life: number;
  max: number;
  pos: Vector3;
  dir: Vector3;
}
const POOL = 4;

/** A few randomly timed meteors, spawned inside the camera's view so visitors actually see them. */
function ShootingStarsImpl() {
  const refs = useRef<Array<Mesh | null>>([]);
  const streaks = useMemo<Streak[]>(() => Array.from({ length: POOL }, () => ({ mesh: null, life: 0, max: 1, pos: new Vector3(), dir: new Vector3() })), []);
  const next = useRef(2.5);
  const basis = useMemo(() => new Matrix4(), []);
  const tmp = useMemo(() => ({ f: new Vector3(), r: new Vector3(), u: new Vector3(), x: new Vector3(), y: new Vector3(), z: new Vector3() }), []);
  const uniformsList = useMemo(() => Array.from({ length: POOL }, () => ({ uAlpha: { value: 0 } })), []);

  useEffect(() => {
    streaks.forEach((s, i) => (s.mesh = refs.current[i]));
  }, [streaks]);

  useFrame((state, dt) => {
    const cam = state.camera;
    next.current -= dt;
    if (next.current <= 0) {
      const free = streaks.find((s) => s.life <= 0);
      if (free) {
        cam.getWorldDirection(tmp.f);
        tmp.r.crossVectors(tmp.f, cam.up).normalize();
        tmp.u.crossVectors(tmp.r, tmp.f).normalize();
        const dist = 160 + Math.random() * 60;
        free.pos.copy(cam.position).addScaledVector(tmp.f, dist).addScaledVector(tmp.r, (Math.random() - 0.5) * dist * 1.3).addScaledVector(tmp.u, (Math.random() - 0.2) * dist * 0.6);
        const sign = Math.random() < 0.5 ? -1 : 1;
        free.dir.copy(tmp.r).multiplyScalar(sign).addScaledVector(tmp.u, -0.35 - Math.random() * 0.3).normalize();
        free.max = free.life = 0.7 + Math.random() * 0.5;
      }
      next.current = 2.5 + Math.random() * 4.5;
    }
    streaks.forEach((s, i) => {
      const m = s.mesh;
      if (!m) return;
      if (s.life <= 0) {
        m.visible = false;
        return;
      }
      s.life -= dt;
      const k = 1 - s.life / s.max;
      s.pos.addScaledVector(s.dir, dt * 240);
      m.visible = true;
      m.position.copy(s.pos);
      tmp.x.copy(s.dir);
      tmp.z.copy(cam.position).sub(s.pos).normalize();
      tmp.y.crossVectors(tmp.z, tmp.x).normalize();
      tmp.z.crossVectors(tmp.x, tmp.y);
      basis.makeBasis(tmp.x, tmp.y, tmp.z);
      m.quaternion.setFromRotationMatrix(basis);
      uniformsList[i].uAlpha.value = Math.sin(Math.min(1, k) * Math.PI);
    });
  });

  return (
    <>
      {streaks.map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false} frustumCulled={false} renderOrder={-4}>
          <planeGeometry args={[34, 0.32]} />
          <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniformsList[i]} transparent depthWrite={false} blending={AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
}
export const ShootingStars = memo(ShootingStarsImpl);
