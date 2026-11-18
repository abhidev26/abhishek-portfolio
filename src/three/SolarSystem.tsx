import { memo, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, type Texture } from 'three';
import type { PerfConfig } from '../hooks/useDevicePerformance';
import { setLoad } from '../lib/store';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { AsteroidBelt } from './AsteroidBelt';
import { StarField } from './StarField';
import { Nebula } from './Nebula';
import { ShootingStars } from './ShootingStars';
import { CameraController } from './CameraController';
import { PostProcessing } from './PostProcessing';
import { PLANETS } from './orbit';
import { generateTextures, type TextureName } from './textures';

/** Thin orbital paths. One shared line geometry per radius. */
function OrbitRings() {
  const geos = useMemo(
    () =>
      PLANETS.map((p) => {
        const pts: number[] = [];
        for (let i = 0; i < 256; i++) {
          const a = (i / 256) * Math.PI * 2;
          pts.push(Math.cos(a) * p.orbit, 0, Math.sin(a) * p.orbit);
        }
        const g = new BufferGeometry();
        g.setAttribute('position', new Float32BufferAttribute(pts, 3));
        return g;
      }),
    [],
  );
  useEffect(() => () => geos.forEach((g) => g.dispose()), [geos]);
  return (
    <>
      {geos.map((g, i) => (
        <lineLoop key={PLANETS[i].name} geometry={g} renderOrder={-3}>
          <lineBasicMaterial color="#8aa4ff" transparent opacity={0.16} depthWrite={false} />
        </lineLoop>
      ))}
    </>
  );
}

type TextureMap = Partial<Record<TextureName, Texture>>;

/** Generates textures progressively (real loading progress) and signals when the first frame is on screen. */
function useProceduralTextures(perf: PerfConfig): TextureMap {
  const [textures, setTextures] = useState<TextureMap>({});
  useEffect(() => {
    let dead = false;
    const created: Texture[] = [];
    void generateTextures(
      perf.textureWidth,
      (name, tex, done, total) => {
        created.push(tex);
        setTextures((prev) => ({ ...prev, [name]: tex }));
        setLoad('textures', done / total);
      },
      () => dead,
    );
    return () => {
      dead = true;
      created.forEach((t) => t.dispose());
    };
  }, [perf.textureWidth]);
  return textures;
}

function FirstFrameSignal() {
  const [frames, setFrames] = useState(0);
  useFrame(() => {
    if (frames < 3) setFrames((f) => f + 1);
  });
  useEffect(() => {
    if (frames >= 3) setLoad('frame', 1);
  }, [frames]);
  return null;
}

function SceneContents({ perf }: { perf: PerfConfig }) {
  const textures = useProceduralTextures(perf);
  const gl = useThree((s) => s.gl);
  useEffect(() => () => gl.renderLists.dispose(), [gl]);

  return (
    <>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.1} color="#6f7fcf" />
      <hemisphereLight args={['#3b4a9c', '#0a0618', 0.14]} />
      <Nebula layers={perf.nebulaLayers} octaves={perf.nebulaOctaves} />
      <StarField stars={perf.stars} dust={perf.dust} />
      {perf.shootingStars && <ShootingStars />}
      <Sun segments={perf.sphereSegments} />
      <OrbitRings />
      <AsteroidBelt count={perf.belt} />
      {PLANETS.map((def) => {
        const tex = textures[def.name];
        if (!tex) return null;
        return (
          <Planet
            key={def.name}
            def={def}
            texture={tex}
            clouds={def.name === 'Earth' ? textures.EarthClouds : undefined}
            moon={def.name === 'Earth' ? textures.Moon : undefined}
            segments={perf.sphereSegments}
            ringRocks={perf.ringRocks}
          />
        );
      })}
      <CameraController />
      <PostProcessing perf={perf} />
      <FirstFrameSignal />
    </>
  );
}

function SolarSystemImpl({ perf, onFail }: { perf: PerfConfig; onFail: () => void }) {
  const [dpr, setDpr] = useState(Math.min(perf.dprMax, typeof window !== 'undefined' ? window.devicePixelRatio : 1));
  return (
    <Canvas
      aria-hidden="true"
      className="!fixed inset-0 z-0 pointer-events-none"
      style={{ position: 'fixed', inset: 0 }}
      dpr={[1, dpr]}
      flat
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 50, near: 0.1, far: 4000, position: [-26, 60, 140] }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr(() => Math.min(perf.dprMax, window.devicePixelRatio))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <SceneContents perf={perf} />
    </Canvas>
  );
}

const SolarSystem = memo(SolarSystemImpl);
export default SolarSystem;
