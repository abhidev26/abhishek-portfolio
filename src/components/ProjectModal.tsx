import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import type { Project } from '../data/projects';
import { useModal } from '../hooks/useModal';
import { GradientBorder } from './GradientBorder';
import { ProjectLinks } from './ProjectLinks';

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  return createPortal(
    <div className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6">
      <motion.div className="absolute inset-0 bg-black/75 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div ref={ref} layoutId={`project-${project.id}`} role="dialog" aria-modal="true" aria-labelledby="project-title" style={{ borderRadius: 28 }} data-lenis-prevent className="gb-host glass-solid relative max-h-[92vh] w-full max-w-3xl overflow-y-auto" transition={{ type: 'spring', stiffness: 280, damping: 32 }}>
        <GradientBorder />
        <button type="button" data-autofocus aria-label="Close project details" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/50 backdrop-blur hover:bg-black/70"><X className="h-5 w-5" /></button>
        <div className="relative aspect-[16/8] overflow-hidden">
          <img src={project.image} alt={project.imageAlt} width={1200} height={600} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,15,32,1)] to-transparent" />
          <span className="absolute bottom-3 left-5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-300 backdrop-blur">Preview artwork · not a real screenshot</span>
        </div>
        <motion.div className="p-6 sm:p-8" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label" style={{ color: project.accent }}>{project.category}</p>
            <span className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-widest ${project.badge ? 'bg-amber-400/90 text-black' : 'border border-emerald-400/40 text-emerald-300'}`}>{project.badge ?? 'PORTFOLIO PROJECT'}</span>
          </div>
          <h3 id="project-title" className="mt-3 font-display text-3xl font-bold sm:text-4xl">{project.name}</h3>
          <p className="mt-1 text-lg text-slate-300">{project.title}</p>
          <p className="mt-5 leading-relaxed text-slate-300">{project.description}</p>
          <h4 className="mono-label mb-3 mt-7">Features</h4>
          <ul className="space-y-2">
            {project.features.map((f) => <li key={f} className="flex gap-2.5 text-sm text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" aria-hidden="true" />{f}</li>)}
          </ul>
          <h4 className="mono-label mb-3 mt-7">Technologies</h4>
          <ul className="flex flex-wrap gap-2">{project.tech.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
          <p className="mono-label mb-3 mt-7">Status · <span className="text-slate-200">{project.status}</span></p>
          <ProjectLinks project={project} showDetails={false} />
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
