import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { relatedProjects, type Skill } from '../data/skills';
import { PROJECTS } from '../data/projects';
import { useModal } from '../hooks/useModal';
import { openProject, scrollToSection } from '../lib/ui';
import { GradientBorder } from './GradientBorder';

export function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  const related = relatedProjects(skill);
  const Icon = skill.icon;
  const share = related.length / PROJECTS.length;

  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div ref={ref} layoutId={`skill-${skill.id}`} role="dialog" aria-modal="true" aria-labelledby="skill-title" style={{ borderRadius: 28 }} data-lenis-prevent className="gb-host glass-solid relative max-h-[88vh] w-full max-w-lg overflow-y-auto p-6 sm:p-8" transition={{ type: 'spring', stiffness: 300, damping: 32 }}>
        <GradientBorder />
        <button type="button" data-autofocus aria-label="Close details" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"><X className="h-5 w-5" /></button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 place-items-center rounded-3xl bg-white/[0.05] ring-1 ring-white/10" style={{ boxShadow: `0 0 50px -10px ${skill.color}` }}><Icon size={44} color={skill.color} aria-hidden="true" /></span>
            <div>
              <h3 id="skill-title" className="font-display text-3xl font-bold">{skill.name}</h3>
              <p className="mono-label mt-1">{skill.category}{skill.official ? ' · official logo' : ''}</p>
            </div>
          </div>
          <dl className="mt-7 space-y-5 text-sm">
            <div><dt className="mono-label mb-1.5">Experience</dt><dd className="text-base text-slate-100">{skill.level}</dd></div>
            <div><dt className="mono-label mb-1.5">What it's used for</dt><dd className="leading-relaxed text-slate-300">{skill.usage}</dd></div>
            {related.length > 0 && (
              <div>
                <dt className="mono-label mb-2">Used in {related.length} of {PROJECTS.length} portfolio projects</dt>
                <dd>
                  <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" initial={{ width: 0 }} animate={{ width: `${share * 100}%` }} transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }} /></div>
                  <ul className="flex flex-wrap gap-2">
                    {related.map((p) => (
                      <li key={p.id}><button type="button" onClick={() => { onClose(); scrollToSection('projects'); window.setTimeout(() => openProject(p.id), 900); }} className="chip transition hover:border-cyan-400/50 hover:text-white">{p.name}</button></li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
