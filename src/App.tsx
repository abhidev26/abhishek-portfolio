import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { detectPerformance } from './hooks/useDevicePerformance';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useLenis } from './hooks/useLenis';
import { useScrollProgress } from './hooks/useScrollProgress';
import { SECTIONS } from './data/personal';
import { store, setLoad, skipScene, completeAllLoading } from './lib/store';
import { scrollToSection } from './lib/ui';
import { Navbar } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { JourneyIndicator } from './components/JourneyIndicator';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { BackToTop } from './components/BackToTop';
import { SoundToggle } from './components/SoundToggle';
import { QualityToggle } from './components/QualityToggle';
import { Toaster } from './components/Toaster';
import { Footer } from './components/Footer';
import { CssStarfield } from './components/CssStarfield';
import { SceneBoundary } from './components/SceneBoundary';
import { AtmosphereOverlay } from './components/AtmosphereOverlay';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Education } from './sections/Education';
import { Certifications } from './sections/Certifications';
import { Contact } from './sections/Contact';

// Dynamic import: the whole 3D stack (three, r3f, postprocessing) is split into its own chunk.
const SolarSystem = lazy(() =>
  import('./three/SolarSystem').then((m) => {
    setLoad('chunk', 1);
    return m;
  }),
);

export default function App() {
  const perf = useMemo(() => detectPerformance(), []);
  const reduced = useReducedMotion();
  const [sceneFailed, setSceneFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const use3D = perf.mode !== 'fallback' && !sceneFailed;
  const lite = perf.mode !== 'full';

  useLenis();
  const active = useScrollProgress();

  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready);
    store.lenis?.[ready ? 'start' : 'stop']();
  }, [ready]);

  useEffect(() => {
    void (document.fonts?.ready ?? Promise.resolve()).then(() => setLoad('fonts', 1));
    if (!use3D) skipScene();
    const t = window.setTimeout(completeAllLoading, 20000); // safety net: never trap visitors on the loader
    return () => window.clearTimeout(t);
  }, [use3D]);

  const onDone = useCallback(() => {
    store.introStart = performance.now();
    setReady(true);
  }, []);

  // Keyboard shortcuts: 1-7 jump to a destination, [ and ] step through them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest('input,textarea,select,[contenteditable],[role="dialog"]')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= SECTIONS.length) scrollToSection(SECTIONS[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a href="#about" className="sr-only z-[300] rounded bg-white px-4 py-2 text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      {use3D ? (
        <SceneBoundary onError={() => setSceneFailed(true)}>
          <Suspense fallback={null}>
            <SolarSystem perf={perf} onFail={() => setSceneFailed(true)} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <CssStarfield animate={!reduced} />
      )}
      {use3D && <AtmosphereOverlay />}
      <div aria-hidden="true" className="noise pointer-events-none fixed inset-0 z-[60]" />
      <ScrollProgress />
      <Navbar active={active} />
      <JourneyIndicator active={active} />
      <main className="relative z-10 overflow-x-clip">
        <Hero reduced={reduced} />
        <About />
        <Skills lite={lite} />
        <Projects lite={lite} />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <SoundToggle />
      <QualityToggle />
      <Toaster />
      {!perf.coarsePointer && <CustomCursor />}
      <Preloader reduced={reduced} onDone={onDone} />
    </>
  );
}
