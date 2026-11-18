import { motion } from 'framer-motion';
import type { Skill } from '../data/skills';
import { TiltCard } from './TiltCard';

export function SkillCard({ skill, onOpen }: { skill: Skill; onOpen: (s: Skill) => void }) {
  const Icon = skill.icon;
  return (
    <motion.div layout layoutId={`skill-${skill.id}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }} style={{ borderRadius: 20 }}>
      <TiltCard
        role="button" tabIndex={0} aria-label={`${skill.name}, ${skill.category}. Open details`}
        onClick={() => onOpen(skill)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(skill); } }}
        className="group cursor-pointer rounded-[20px] border border-white/[0.07] bg-[rgba(10,13,30,0.78)] p-4 sm:p-5" max={12} lift={5}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-125" style={{ boxShadow: `0 0 28px -8px ${skill.color}` }}>
            <Icon size={30} color={skill.color} aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-starlight sm:text-[15px]">{skill.name}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{skill.category}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
