import { Reveal } from './Reveal';

interface Props {
  id: string;
  code: string;
  planet: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ id, code, planet, title, subtitle, align = 'left' }: Props) {
  const center = align === 'center';
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      <Reveal>
        <p className={`mono-label mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
          <span className="text-cyan-300">{code}</span>
          <span className="h-px w-10 bg-gradient-to-r from-cyan-400/80 to-transparent" />
          <span>Destination · {planet}</span>
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">{title}</span>
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
