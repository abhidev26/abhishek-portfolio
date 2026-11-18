import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { Project } from '../data/projects';
import { PERSONAL } from '../data/personal';
import { toast } from '../lib/ui';
import { cn } from '../lib/utils';

const btn = 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-[13px] font-semibold transition';

export function ProjectLinks({ project, onDetails, showDetails = true }: { project: Project; onDetails?: () => void; showDetails?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.demoUrl ? (
        <a href={project.demoUrl} target="_blank" rel="noreferrer noopener" className={cn(btn, 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white')}><ExternalLink className="h-3.5 w-3.5" />Live Demo</a>
      ) : (
        <button type="button" onClick={() => toast('info', `${project.name}: live demo link isn't published yet. Add demoUrl in src/data/projects.ts.`)} className={cn(btn, 'bg-gradient-to-r from-violet-600/80 to-cyan-500/80 text-white')}><ExternalLink className="h-3.5 w-3.5" />Live Demo</button>
      )}
      <a href={project.repoUrl || PERSONAL.github} target="_blank" rel="noreferrer noopener" title={project.repoUrl ? undefined : 'Repository link not added yet — opens GitHub profile'} className={cn(btn, 'border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10')}><FaGithub className="h-3.5 w-3.5" />GitHub</a>
      {showDetails && onDetails && <button type="button" onClick={onDetails} className={cn(btn, 'border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10')}>Details</button>}
    </div>
  );
}
