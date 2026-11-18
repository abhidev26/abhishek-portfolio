import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { SECTIONS } from '../data/personal';
import { scrollToSection } from '../lib/ui';
import { store } from '../lib/store';
import { Logo } from './Logo';
import { GradientButton } from './GradientButton';

export function Navbar({ active }: { active: number }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    store.lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); store.lenis?.start(); };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); window.setTimeout(() => scrollToSection(id), open ? 250 : 0); };

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
      <nav aria-label="Primary" className="glass flex w-full max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2">
        <a href="#home" onClick={go('home')} aria-label="Abhishek — home" className="rounded-full"><Logo /></a>
        <ul className="hidden items-center gap-0.5 lg:flex">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={go(s.id)} aria-current={active === i ? 'page' : undefined} className={`relative block rounded-full px-3.5 py-2 font-display text-sm font-medium transition-colors ${active === i ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                {active === i && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span className="relative z-[1]">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <GradientButton href="#contact" onClick={go('contact')} size="sm" className="hidden sm:inline-flex">Contact Me</GradientButton>
          <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bd" className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside key="panel" id="mobile-nav" role="dialog" aria-label="Site navigation" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="glass-solid fixed bottom-0 right-0 top-0 z-50 flex w-[82%] max-w-sm flex-col p-6 lg:hidden">
              <div className="mb-8 flex items-center justify-between"><Logo /><button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/10"><X className="h-5 w-5" /></button></div>
              <ul className="flex flex-1 flex-col gap-1">
                {SECTIONS.map((s, i) => (
                  <motion.li key={s.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.1 }}>
                    <a href={`#${s.id}`} onClick={go(s.id)} className={`flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg ${active === i ? 'bg-white/10 text-white' : 'text-slate-300'}`}>
                      <span>{s.label}</span><span className="font-mono text-xs text-slate-500">{s.planet}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <GradientButton href="#contact" onClick={go('contact')}>Contact Me</GradientButton>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
