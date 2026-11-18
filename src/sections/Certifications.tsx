import { motion } from 'framer-motion';
import { Brain, CalendarCheck, PenTool, Rocket, ShieldCheck, Users, Award } from 'lucide-react';
import { ACHIEVEMENTS, CERTIFICATIONS, type IconKey } from '../data/certifications';
import { SECTIONS } from '../data/personal';
import { SectionHeading } from '../components/SectionHeading';
import { TiltCard } from '../components/TiltCard';
import { GlassCard } from '../components/GlassCard';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';

const ICONS: Record<IconKey, typeof Brain> = { shield: ShieldCheck, brain: Brain, rocket: Rocket, pen: PenTool, calendar: CalendarCheck, users: Users };

export function Certifications() {
  const s = SECTIONS[5];
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[120%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-60">
        {[0.55, 0.7, 0.85, 1].map((k, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 rounded-[50%] border" style={{ width: `${k * 70}%`, height: `${k * 22}%`, transform: 'translate(-50%,-50%) rotate(-14deg)', borderColor: i % 2 ? 'rgba(124,58,237,.25)' : 'rgba(234,190,110,.28)', boxShadow: i % 2 ? 'none' : '0 0 40px rgba(234,190,110,.08)' }} />
        ))}
      </div>
      <div className="section section-pad relative">
        <SectionHeading id="certifications-title" code={s.code} planet={s.planet} title="Certifications & Achievements" subtitle="Credentials and moments from my journey so far." />
        <div className="grid gap-6 md:grid-cols-2">
          {CERTIFICATIONS.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}>
                  <TiltCard className="rounded-3xl border border-white/[0.08] bg-[rgba(14,14,30,0.8)] p-7" max={8}>
                    <div className="flex items-start gap-5">
                      <span className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-gradient-to-br from-amber-300/20 to-violet-500/20 ring-1 ring-amber-200/25"><Icon className="h-8 w-8 text-amber-200" aria-hidden="true" /></span>
                      <div>
                        <p className="mono-label !text-amber-200/90 flex items-center gap-2"><Award className="h-3.5 w-3.5" aria-hidden="true" />Certification</p>
                        <h3 className="mt-2 font-display text-xl font-bold leading-snug">{c.title}</h3>
                        <p className="mt-1.5 text-sm text-slate-300">{c.issuer}</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
        <h3 className="mono-label mb-5 mt-14">Achievements</h3>
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = ICONS[a.icon];
            return (
              <StaggerItem key={a.id}>
                <GlassCard className="group flex h-full items-center gap-4 p-5 transition hover:border-amber-200/30">
                  <motion.span whileHover={{ rotate: [0, -12, 12, 0], scale: 1.15 }} animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 6 + i, repeat: Infinity }} className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-violet-500/15 ring-1 ring-violet-300/25"><Icon className="h-6 w-6 text-violet-200 transition group-hover:text-amber-200" aria-hidden="true" /></motion.span>
                  <p className="font-display text-base font-semibold leading-snug">{a.title}</p>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
