import { memo, useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3, type Texture } from 'three';
import { planetPosition, type PlanetDef } from './orbit';
import { PlanetAtmosphere } from './PlanetAtmosphere';
import { SaturnRings } from './SaturnRings';

interface Props {
  def: PlanetDef;
  texture: Texture;
  clouds?: Texture;
  moon?: Texture;
  segments: number;
  ringRocks: number;
}

function PlanetImpl({ def, texture, clouds, moon, segments, ringRocks }: Props) {
  const orbit = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const cloudMesh = useRef<Mesh>(null);
  const moonPivot = useRef<Group>(null);
  const tmp = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    // Position is a pure function of the clock, shared with the camera controller.
    if (orbit.current) orbit.current.position.copy(planetPosition(def, state.clock.elapsedTime, tmp));
    if (body.current) body.current.rotation.y += def.spin * dt;
    if (cloudMesh.current) cloudMesh.current.rotation.y += def.spin * dt * 1.25;
    if (moonPivot.current) moonPivot.current.rotation.y += dt * 0.55;
  });

  const isEarth = def.name === 'Earth';
  const isSaturn = def.name === 'Saturn';

  let extra: ReactNode = null;
  if (isEarth && moon) {
    extra = (
      <group ref={moonPivot} rotation={[0.09, 0, 0]}>
        <mesh position={[def.radius * 3.3, 0, 0]}>
          <sphereGeometry args={[def.radius * 0.27, 32, 32]} />
          <meshStandardMaterial map={moon} roughness={1} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={orbit} name={def.name}>
      <group rotation={[0, 0, def.tilt]}>
        <mesh ref={body}>
          <sphereGeometry args={[def.radius, segments, segments]} />
          <meshStandardMaterial map={texture} roughness={isEarth ? 0.62 : 0.92} metalness={0} />
        </mesh>
        {isEarth && clouds && (
          <mesh ref={cloudMesh} scale={1.012}>
            <sphereGeometry args={[def.radius, segments, segments]} />
            <meshStandardMaterial map={clouds} transparent depthWrite={false} roughness={1} />
          </mesh>
        )}
        {isSaturn && <SaturnRings radius={def.radius} rocks={ringRocks} />}
      </group>
      {def.atmosphere && <PlanetAtmosphere radius={def.radius} def={def.atmosphere} segments={Math.max(24, Math.round(segments * 0.75))} />}
      {extra}
    </group>
  );
}
export const Planet = memo(PlanetImpl);
