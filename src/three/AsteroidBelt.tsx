import { memo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Group, InstancedMesh, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import { seededRandom } from '../lib/utils';
import { BELT_INNER, BELT_OUTER } from './orbit';

/** Thousands of asteroids in ONE draw call (InstancedMesh), each with its own scale, rotation and tint. */
function AsteroidBeltImpl({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const rnd = seededRandom(4242);
    const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
    const mat = new Matrix4();
    const q = new Quaternion();
    const pos = new Vector3();
    const scl = new Vector3();
    const o = new Object3D();
    const c = new Color();
    for (let i = 0; i < count; i++) {
      const r = BELT_INNER + (BELT_OUTER - BELT_INNER) * (0.5 + gauss() * 0.5);
      const a = rnd() * Math.PI * 2;
      pos.set(Math.cos(a) * r, gauss() * 1.1, Math.sin(a) * r);
      o.rotation.set(rnd() * 6.28, rnd() * 6.28, rnd() * 6.28);
      q.copy(o.quaternion);
      const s = 0.04 + Math.pow(rnd(), 3.2) * 0.2;
      scl.set(s * (0.7 + rnd() * 0.7), s * (0.6 + rnd() * 0.7), s * (0.7 + rnd() * 0.7));
      mat.compose(pos, q, scl);
      m.setMatrixAt(i, mat);
      c.setHSL(0.06 + rnd() * 0.05, 0.12 + rnd() * 0.2, 0.28 + rnd() * 0.32);
      m.setColorAt(i, c);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.012;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} metalness={0.05} flatShading />
      </instancedMesh>
    </group>
  );
}
export const AsteroidBelt = memo(AsteroidBeltImpl);
