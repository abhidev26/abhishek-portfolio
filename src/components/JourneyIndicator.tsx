import { AnimatePresence, motion } from 'framer-motion';
import { SECTIONS } from '../data/personal';
import { scrollToSection } from '../lib/ui';

/** Right-hand cosmic journey indicator showing the active destination. */
export function JourneyIndicator({ active }: { active: number }) {
  return (
    <nav aria-label="Cosmic journey" className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex lg:right-6">
      <AnimatePresence mode="wait">
        <motion.p key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="mono-label hidden rounded-full bg-black/30 px-3 py-1 backdrop-blur lg:block">
          <span className="text-cyan-300">{SECTIONS[active].code}</span> · {SECTIONS[active].planet}
        </motion.p>
      </AnimatePresence>
      <ul className="flex flex-col items-center gap-3">
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button type="button" aria-label={`Travel to ${s.planet} — ${s.label}`} aria-current={active === i} onClick={() => scrollToSection(s.id)} className="group relative grid h-4 w-4 place-items-center">
              <span className={`block rounded-full transition-all duration-300 ${active === i ? 'h-3 w-3 bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_14px_3px_rgba(6,182,212,0.7)]' : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/80'}`} />
              <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] text-slate-200 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 lg:hidden">{s.planet}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
