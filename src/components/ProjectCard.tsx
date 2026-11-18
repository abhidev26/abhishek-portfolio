import { motion } from 'framer-motion';
import type { Project } from '../data/projects';
import { TiltCard } from './TiltCard';
import { ProjectLinks } from './ProjectLinks';

export function ProjectCard({ project, onOpen, index }: { project: Project; onOpen: (p: Project) => void; index: number }) {
  const shown = project.tech.slice(0, 5);
  return (
    <motion.article layout layoutId={`project-${project.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} style={{ borderRadius: 28 }} className="w-[86vw] flex-none snap-start sm:w-[400px]">
      <div className="bob" style={{ animationDelay: `${index * -1.3}s` }}>
        <TiltCard className="rounded-[28px] border border-white/[0.07] bg-[rgba(9,12,28,0.82)] backdrop-blur-sm" max={7} lift={8}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[28px]">
            <img src={project.image} alt={project.imageAlt} width={800} height={500} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,12,28,1)] via-transparent to-transparent" />
            <span className="absolute left-4 top-4 font-mono text-xs text-white/80">{project.index}</span>
            {project.badge && <span className="absolute right-4 top-4 rounded-full bg-amber-400/90 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-black">{project.badge}</span>}
            <span className="absolute bottom-3 left-4 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-slate-300 backdrop-blur">Preview artwork · screenshot coming soon</span>
          </div>
          <div className="p-5 sm:p-6">
            <p className="mono-label" style={{ color: project.accent }}>{project.category}</p>
            <h3 className="mt-2 font-display text-2xl font-bold">{project.name}</h3>
            <p className="mt-1 text-sm text-slate-300">{project.title}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
              {shown.map((t) => <li key={t} className="chip">{t}</li>)}
              {project.tech.length > shown.length && <li className="chip">+{project.tech.length - shown.length}</li>}
            </ul>
            <div className="mt-5"><ProjectLinks project={project} onDetails={() => onOpen(project)} /></div>
          </div>
        </TiltCard>
      </div>
    </motion.article>
  );
}
