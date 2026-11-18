import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ambient } from '../lib/ambient';
import { toast } from '../lib/ui';

/** Optional ambient audio. Muted by default; nothing plays until the visitor presses this button. */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const toggle = async () => {
    try { await ambient.set(!on); setOn(!on); } catch { toast('error', 'Audio is not available in this browser.'); }
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={on} aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'} className="glass fixed bottom-5 left-4 z-40 flex h-12 items-center gap-2 rounded-full px-4 text-xs text-slate-200 sm:left-6">
      {on ? <Volume2 className="h-4 w-4 text-cyan-300" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden font-mono uppercase tracking-widest sm:inline">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
