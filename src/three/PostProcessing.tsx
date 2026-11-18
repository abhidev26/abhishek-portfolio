import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import type { PerfConfig } from '../hooks/useDevicePerformance';

/**
 * Selective bloom: the threshold sits above the brightness of sunlit planets, so only HDR-bright
 * objects (the Sun, its rays and corona, the brightest stars) glow. Mobile gets a cheaper chain.
 */
export function PostProcessing({ perf }: { perf: PerfConfig }) {
  const desktop = perf.device === 'desktop';
  return (
    <EffectComposer multisampling={perf.msaa} enableNormalPass={false}>
      <Bloom
        intensity={desktop ? 1.1 : 0.85}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.2}
        mipmapBlur={desktop}
        kernelSize={desktop ? KernelSize.LARGE : KernelSize.SMALL}
        radius={0.75}
      />
      {desktop ? <Vignette eskil={false} offset={0.2} darkness={0.55} /> : <></>}
    </EffectComposer>
  );
}
