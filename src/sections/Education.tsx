import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { GraduationCap, School, BookOpen, Code2 } from 'lucide-react';
import { EDUCATION } from '../data/education';
import { SECTIONS } from '../data/personal';
import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';

const icons = [Code2, GraduationCap, BookOpen, School];

export function Education() {
  const s = SECTIONS[4];
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="education" aria-labelledby="education-title" className="relative min-h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.22]" style={{ background: 'repeating-linear-gradient(180deg, rgba(214,150,96,.55) 0 38px, rgba(240,220,190,.35) 38px 70px, rgba(170,100,60,.5) 70px 120px, rgba(228,200,160,.3) 120px 150px)', maskImage: 'radial-gradient(70% 60% at 50% 50%, #000 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(70% 60% at 50% 50%, #000 20%, transparent 80%)', filter: 'blur(14px)' }} />
      <div className="section section-pad">
        <SectionHeading id="education-title" code={s.code} planet={s.planet} title="Education Timeline" subtitle="My learning path, from SSLC to full-stack training." align="center" />
        <div className="relative mx-auto max-w-4xl">
          <div aria-hidden="true" className="absolute bottom-2 top-2 left-5 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div style={{ scaleY: draw, transformOrigin: 'top' }} className="h-full w-full bg-gradient-to-b from-violet-400 via-cyan-300 to-pink-400 shadow-[0_0_14px_rgba(6,182,212,.9)]" />
          </div>
          <ol ref={ref} className="space-y-10 md:space-y-14">
            {EDUCATION.map((e, i) => {
              const Icon = icons[i];
              const left = i % 2 === 0;
              return (
                <li key={e.id} className={`relative grid pl-14 md:grid-cols-2 md:pl-0 ${left ? '' : ''}`}>
                  <motion.span aria-hidden="true" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: '-20% 0px' }} transition={{ type: 'spring', delay: 0.15 }} className="absolute left-5 top-6 z-[2] grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-space ring-2 ring-cyan-300 shadow-[0_0_18px_4px_rgba(6,182,212,.7)] md:left-1/2"><span className={`h-1.5 w-1.5 rounded-full bg-cyan-200 ${e.current ? 'animate-ping' : ''}`} /></motion.span>
                  <motion.div initial={{ opacity: 0, x: left ? -50 : 50, filter: 'blur(8px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={{ once: true, margin: '-12% 0px' }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={left ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12'}>
                    <GlassCard border={Boolean(e.current)} className="p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10"><Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" /></span>
                        <p className={`mono-label ${e.current ? '!text-emerald-300' : ''}`}>{e.period}</p>
                      </div>
                      <h3 className="font-display text-xl font-bold leading-snug">{e.title}</h3>
                      {e.institution && <p className="mt-1 text-sm text-slate-300">{e.institution}</p>}
                      {e.result && <p className="mt-4 inline-flex items-baseline gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5"><span className="mono-label !text-[10px]">{e.result.label}</span><span className="gradient-text font-display text-lg font-bold">{e.result.value}</span></p>}
                      {e.current && <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 font-mono text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />In progress</p>}
                    </GlassCard>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
