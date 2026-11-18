import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, FolderGit2, MapPin, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiExpress, SiJavascript } from 'react-icons/si';
import { Mail } from 'lucide-react';
import { PERSONAL } from '../data/personal';
import { scrollToSection } from '../lib/ui';
import { GradientButton } from '../components/GradientButton';

function useTypewriter(words: readonly string[], reduced: boolean) {
  const [text, setText] = useState(reduced ? words[0] : '');
  useEffect(() => {
    if (reduced) return;
    let w = 0, i = 0, del = false, t = 0;
    const tick = () => {
      const word = words[w];
      i += del ? -1 : 1;
      setText(word.slice(0, i));
      let wait = del ? 35 : 75;
      if (!del && i === word.length) { del = true; wait = 1500; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
      t = window.setTimeout(tick, wait);
    };
    t = window.setTimeout(tick, 600);
    return () => window.clearTimeout(t);
  }, [words, reduced]);
  return text;
}

const FLOATERS = [
  { Icon: SiReact, c: '#61DAFB', x: '58%', y: '16%', d: 0 },
  { Icon: SiNodedotjs, c: '#5FA04E', x: '84%', y: '30%', d: 1.2 },
  { Icon: SiMongodb, c: '#47A248', x: '70%', y: '70%', d: 0.6 },
  { Icon: SiExpress, c: '#E2E8F0', x: '90%', y: '62%', d: 1.8 },
  { Icon: SiJavascript, c: '#F7DF1E', x: '52%', y: '60%', d: 2.4 },
];

export function Hero({ reduced }: { reduced: boolean }) {
  const role = useTypewriter(PERSONAL.roles, reduced);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 });
  const fx = useTransform(sx, (v) => v * -28), fy = useTransform(sy, (v) => v * -20);

  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center"
      onPointerMove={(e) => { mx.set((e.clientX / window.innerWidth - 0.5) * 2); my.set((e.clientY / window.innerHeight - 0.5) * 2); }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050816]/85 via-[#050816]/40 to-transparent lg:from-[#050816]/80 lg:via-[#050816]/25" />
      <motion.div aria-hidden="true" style={{ x: fx, y: fy }} className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATERS.map(({ Icon, c, x, y, d }, i) => (
          <motion.span key={i} className="glass absolute grid h-14 w-14 place-items-center rounded-2xl" style={{ left: x, top: y }} animate={reduced ? undefined : { y: [0, -14, 0] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: d }}>
            <Icon size={26} color={c} />
          </motion.span>
        ))}
      </motion.div>

      <div className="section pb-24 pt-32">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mono-label mb-5 flex items-center gap-3">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" /></span>
          {PERSONAL.brand} · {PERSONAL.tagline}
        </motion.p>

        <h1 id="hero-title" className="font-display text-[clamp(3.2rem,12vw,9rem)] font-bold leading-[0.95] tracking-tight" aria-label={PERSONAL.name}>
          <span aria-hidden="true" className="gradient-text inline-block">
            {PERSONAL.name.split('').map((ch, i) => (
              <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 70, rotateX: -80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{ch}</motion.span>
            ))}
          </span>
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-5 max-w-2xl font-display text-lg text-slate-200 sm:text-xl">{PERSONAL.title}</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }} className="mt-4 h-8 font-mono text-base text-cyan-300 sm:text-lg" aria-live="off">
          <span aria-hidden="true">&gt; {role}<span className="ml-0.5 inline-block w-[0.55ch] animate-pulse bg-cyan-300">&nbsp;</span></span>
          <span className="sr-only">{PERSONAL.roles.join(', ')}</span>
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">“{PERSONAL.heroTagline}”</motion.p>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="mt-9 flex flex-wrap items-center gap-3">
          <GradientButton href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }} icon={<FolderGit2 className="h-4 w-4" />}>View Projects</GradientButton>
          <GradientButton href={PERSONAL.resumeUrl} download variant="ghost" icon={<Download className="h-4 w-4" />}>Download Resume</GradientButton>
          <GradientButton href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} variant="outline" icon={<Send className="h-4 w-4" />}>Contact Me</GradientButton>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="mt-9 flex flex-wrap items-center gap-5">
          <div className="flex gap-2.5">
            <a aria-label="GitHub profile" href={PERSONAL.github} target="_blank" rel="noreferrer noopener" className="glass grid h-11 w-11 place-items-center rounded-full text-slate-200 transition hover:text-white hover:shadow-[0_0_24px_rgba(124,58,237,.6)]"><FaGithub size={18} /></a>
            <a aria-label="LinkedIn profile" title={PERSONAL.linkedinConfigured ? undefined : 'Placeholder URL — edit LINKEDIN_URL in src/data/personal.ts'} href={PERSONAL.linkedin} target="_blank" rel="noreferrer noopener" className="glass grid h-11 w-11 place-items-center rounded-full text-slate-200 transition hover:text-white hover:shadow-[0_0_24px_rgba(37,99,235,.6)]"><FaLinkedin size={18} /></a>
            <a aria-label="Send email" href={`mailto:${PERSONAL.email}`} className="glass grid h-11 w-11 place-items-center rounded-full text-slate-200 transition hover:text-white hover:shadow-[0_0_24px_rgba(236,72,153,.6)]"><Mail size={18} /></a>
          </div>
          <p className="flex items-center gap-2 font-mono text-xs text-slate-300"><MapPin className="h-4 w-4 text-pink-400" aria-hidden="true" />{PERSONAL.location}</p>
        </motion.div>
      </div>

      <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} aria-label="Scroll down to About" className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center text-slate-400 hover:text-white">
        <span className="mono-label mb-1">Scroll</span>
        {[0, 1, 2].map((i) => <svg key={i} viewBox="0 0 24 24" className="-mt-2.5 h-5 w-5 animate-chevron" style={{ animationDelay: `${i * 0.2}s` }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>)}
      </a>
    </section>
  );
}
