import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKILLS, SKILL_FILTERS, type Skill, type SkillFilter } from '../data/skills';
import { SECTIONS } from '../data/personal';
import { SectionHeading } from '../components/SectionHeading';
import { FilterBar } from '../components/FilterBar';
import { SkillCard } from '../components/SkillCard';
import { SkillModal } from '../components/SkillModal';
import { ParticleCanvas } from '../components/ParticleCanvas';
import { Reveal } from '../components/Reveal';

export function Skills({ lite }: { lite: boolean }) {
  const s = SECTIONS[2];
  const [filter, setFilter] = useState<SkillFilter>('All');
  const [selected, setSelected] = useState<Skill | null>(null);
  const list = useMemo(() => (filter === 'All' ? SKILLS : SKILLS.filter((k) => k.category === filter)), [filter]);
  const counts = useMemo(() => Object.fromEntries(SKILL_FILTERS.map((f) => [f, f === 'All' ? SKILLS.length : SKILLS.filter((k) => k.category === f).length])) as Record<SkillFilter, number>, []);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative min-h-[100svh]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden"><ParticleCanvas variant="constellation" density={lite ? 0.5 : 1} /></div>
      <div className="section section-pad">
        <SectionHeading id="skills-title" code={s.code} planet={s.planet} title="Interactive Tech Stack Universe" subtitle="Click any card to explore what I use it for and where it appears in my projects." />
        <Reveal className="mb-9"><FilterBar items={SKILL_FILTERS} active={filter} onChange={setFilter} idPrefix="skills" label="Filter skills by category" counts={counts} /></Reveal>
        <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5" style={{ perspective: 1200 }}>
          <AnimatePresence mode="popLayout">
            {list.map((skill) => <SkillCard key={skill.id} skill={skill} onOpen={setSelected} />)}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>{selected && <SkillModal key={selected.id} skill={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}
