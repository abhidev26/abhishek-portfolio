import { Orbit } from 'lucide-react';
import { detectPerformance, QUALITY_KEY, type RenderMode } from '../hooks/useDevicePerformance';

const NEXT: Record<RenderMode, RenderMode> = { full: 'lite', lite: 'fallback', fallback: 'full' };
const LABEL: Record<RenderMode, string> = { full: '3D · Full', lite: '3D · Lite', fallback: '3D · Off' };

/** Lets the visitor choose the 3D quality. The choice is remembered and the page reloads to apply it. */
export function QualityToggle() {
  const mode = detectPerformance().mode;
  const change = () => {
    try { window.localStorage.setItem(QUALITY_KEY, NEXT[mode]); } catch { /* ignore */ }
    const url = new URL(window.location.href);
    url.searchParams.delete('quality');
    window.location.replace(url.toString());
  };
  return (
    <button type="button" onClick={change} aria-label={`3D quality: ${LABEL[mode]}. Click to change`} className="glass fixed bottom-5 left-[8.5rem] z-40 flex h-12 items-center gap-2 rounded-full px-4 text-xs text-slate-200 sm:left-[11.5rem]">
      <Orbit className="h-4 w-4 text-cyan-300" />
      <span className="font-mono uppercase tracking-widest">{LABEL[mode]}</span>
    </button>
  );
}
