import { motion } from 'framer-motion';
import { Camera, Clapperboard, Languages, LayoutDashboard, PenTool } from 'lucide-react';
import { PERSONAL, SECTIONS } from '../data/personal';
import { PROJECTS } from '../data/projects';
import { CERTIFICATIONS } from '../data/certifications';
import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { LogoMark } from '../components/Logo';

const interestIcons = [PenTool, LayoutDashboard, Clapperboard, Camera];
const STATS = [
  { label: 'Portfolio projects', to: PROJECTS.length, decimals: 0 },
  { label: 'BCA CGPA', to: 7.19, decimals: 2 },
  { label: 'Languages spoken', to: PERSONAL.languages.length, decimals: 0 },
  { label: 'Certifications', to: CERTIFICATIONS.length, decimals: 0 },
];

export function About() {
  const s = SECTIONS[1];
  return (
    <section id="about" aria-labelledby="about-title" className="section section-pad flex min-h-[100svh] flex-col justify-center">
      <SectionHeading id="about-title" code={s.code} planet={s.planet} title="About Me" subtitle="Discover the person behind the code." />
      <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div className="space-y-6">
          <Reveal>
            <GlassCard border className="p-6 sm:p-8">
              <p className="text-base leading-[1.8] text-slate-200 sm:text-lg">{PERSONAL.summary}</p>
            </GlassCard>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            <Reveal delay={0.05}>
              <GlassCard className="h-full p-5">
                <h3 className="mono-label mb-4 flex items-center gap-2"><Languages className="h-4 w-4 text-cyan-300" aria-hidden="true" />Languages</h3>
                <ul className="flex flex-wrap gap-2">{PERSONAL.languages.map((l) => <li key={l} className="chip text-sm">{l}</li>)}</ul>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.12}>
              <GlassCard className="h-full p-5">
                <h3 className="mono-label mb-4">Interests</h3>
                <ul className="grid gap-2.5">
                  {PERSONAL.interests.map((it, i) => { const Icon = interestIcons[i]; return <li key={it} className="flex items-center gap-3 text-sm text-slate-200"><Icon className="h-4 w-4 text-pink-300" aria-hidden="true" />{it}</li>; })}
                </ul>
              </GlassCard>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((st) => (
              <StaggerItem key={st.label}>
                <GlassCard className="p-4 text-center">
                  <p className="gradient-text font-display text-3xl font-bold tabular-nums"><AnimatedCounter to={st.to} decimals={st.decimals} /></p>
                  <p className="mono-label mt-1 !text-[10px]">{st.label}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1} className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center">
          <div aria-hidden="true" className="absolute inset-0 animate-[orbit-spin_40s_linear_infinite] rounded-full border border-dashed border-cyan-300/25">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_4px_rgba(6,182,212,.8)]" />
          </div>
          <div aria-hidden="true" className="absolute inset-[12%] animate-[orbit-spin_28s_linear_infinite_reverse] rounded-full border border-violet-400/30">
            <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_14px_3px_rgba(124,58,237,.9)]" />
          </div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="glass relative grid h-[58%] w-[58%] place-items-center rounded-full" style={{ boxShadow: '0 0 80px -10px rgba(70,130,255,.55), inset 0 0 40px rgba(124,58,237,.25)' }} role="img" aria-label="Abhishek monogram">
            <LogoMark className="h-1/2 w-1/2" />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
