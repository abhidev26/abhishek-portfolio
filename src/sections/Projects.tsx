import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROJECTS, PROJECT_BY_ID, PROJECT_FILTERS, type Project, type ProjectFilter } from '../data/projects';
import { SECTIONS } from '../data/personal';
import { OPEN_PROJECT_EVENT } from '../lib/ui';
import { SectionHeading } from '../components/SectionHeading';
import { FilterBar } from '../components/FilterBar';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { ParticleCanvas } from '../components/ParticleCanvas';
import { Reveal } from '../components/Reveal';

export function Projects({ lite }: { lite: boolean }) {
  const s = SECTIONS[3];
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const list = useMemo(() => (filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter))), [filter]);
  const counts = useMemo(() => Object.fromEntries(PROJECT_FILTERS.map((f) => [f, f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(f)).length])) as Record<ProjectFilter, number>, []);

  useEffect(() => {
    const h = (e: Event) => { const p = PROJECT_BY_ID[(e as CustomEvent<string>).detail]; if (p) setSelected(p); };
    window.addEventListener(OPEN_PROJECT_EVENT, h);
    return () => window.removeEventListener(OPEN_PROJECT_EVENT, h);
  }, []);
  useEffect(() => { rail.current?.scrollTo({ left: 0 }); updateBar(); }, [filter]);

  const updateBar = () => {
    const r = rail.current; const b = bar.current; if (!r || !b) return;
    const max = r.scrollWidth - r.clientWidth;
    b.style.width = `${max <= 0 ? 100 : Math.max(12, (r.clientWidth / r.scrollWidth) * 100)}%`;
    b.style.transform = `translateX(${max <= 0 ? 0 : (r.scrollLeft / max) * ((100 / Math.max(12, (r.clientWidth / r.scrollWidth) * 100)) - 1) * 100}%)`;
  };
  const nudge = (dir: number) => rail.current?.scrollBy({ left: dir * Math.min(440, window.innerWidth * 0.86), behavior: 'smooth' });

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative min-h-[100svh]">
      {!lite && <div className="pointer-events-none absolute inset-0 overflow-hidden"><ParticleCanvas variant="dust" /></div>}
      <div className="section section-pad pb-8">
        <SectionHeading id="projects-title" code={s.code} planet={s.planet} title="Mars Project Gallery" subtitle="Six projects floating in a space gallery — swipe, scroll sideways or use the arrows." />
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <FilterBar items={PROJECT_FILTERS} active={filter} onChange={setFilter} idPrefix="projects" label="Filter projects" counts={counts} />
          <div className="hidden gap-2 sm:flex">
            <button type="button" aria-label="Previous projects" onClick={() => nudge(-1)} className="glass grid h-11 w-11 place-items-center rounded-full"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" aria-label="Next projects" onClick={() => nudge(1)} className="glass grid h-11 w-11 place-items-center rounded-full"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </Reveal>
      </div>
      <div ref={rail} onScroll={updateBar} tabIndex={0} role="region" aria-label="Project gallery, scrollable" className="relative z-[1] overflow-x-auto overflow-y-hidden pb-10 pt-4 [scrollbar-width:none] focus-visible:outline-offset-[-3px] [&::-webkit-scrollbar]:hidden">
        <motion.div layout className="flex w-max snap-x snap-mandatory gap-6 px-5 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />)}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="section pb-24"><div className="h-1 w-full overflow-hidden rounded-full bg-white/10"><div ref={bar} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: '30%' }} /></div></div>
      <AnimatePresence>{selected && <ProjectModal key={selected.id} project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}
