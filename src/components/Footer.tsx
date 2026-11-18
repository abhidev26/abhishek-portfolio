import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Mail } from 'lucide-react';
import { PERSONAL } from '../data/personal';
import { LogoMark } from './Logo';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md">
      <div className="section flex flex-col items-center gap-4 py-10 text-center">
        <LogoMark className="h-9 w-9" />
        <p className="font-display text-lg font-bold tracking-[0.3em]">{PERSONAL.brand}</p>
        <p className="gradient-text font-display text-sm sm:text-base">{PERSONAL.signature}</p>
        <div className="flex gap-3">
          <a aria-label="GitHub" href={PERSONAL.github} target="_blank" rel="noreferrer noopener" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"><FaGithub /></a>
          <a aria-label="LinkedIn" href={PERSONAL.linkedin} target="_blank" rel="noreferrer noopener" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"><FaLinkedin /></a>
          <a aria-label="Email" href={`mailto:${PERSONAL.email}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:text-white"><Mail className="h-4 w-4" /></a>
        </div>
        <p className="mono-label">Created by ABHISHEK · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
