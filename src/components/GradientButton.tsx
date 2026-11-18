import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

type Variant = 'primary' | 'ghost' | 'outline';

interface Common {
  variant?: Variant;
  size?: 'sm' | 'md';
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}
type AnchorProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>;
type BtnProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

const styles: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#06B6D4] text-white shadow-[0_10px_40px_-10px_rgba(124,58,237,0.8)] hover:shadow-[0_14px_50px_-8px_rgba(6,182,212,0.7)] btn-shine',
  ghost: 'border border-white/15 bg-white/[0.05] text-starlight hover:bg-white/[0.1] backdrop-blur-md',
  outline: 'border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 hover:border-cyan-300/70',
};

/** Magnetic button: subtly attracted to the cursor, with an animated shine. Works as <a> or <button>. */
export function GradientButton(props: AnchorProps | BtnProps) {
  const { variant = 'primary', size = 'md', children, icon, className } = props;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.34);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const cls = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-[box-shadow,background-color,border-color] duration-300 select-none',
    size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-sm sm:text-base',
    styles[variant],
    className,
  );

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _i; void _c; void _ch;
    return (
      <motion.a ref={(n) => (ref.current = n)} href={href} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} className={cls} {...(rest as object)}>
        {icon}
        <span className="relative z-[1]">{children}</span>
      </motion.a>
    );
  }
  const { variant: _v, size: _s, icon: _i, className: _c, children: _ch, ...rest } = props as BtnProps;
  void _v; void _s; void _i; void _c; void _ch;
  return (
    <motion.button ref={(n) => (ref.current = n)} type="button" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} className={cls} {...(rest as object)}>
      {icon}
      <span className="relative z-[1]">{children}</span>
    </motion.button>
  );
}
