import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface Props<T extends string> {
  items: readonly T[];
  active: T;
  onChange: (v: T) => void;
  idPrefix: string;
  label: string;
  counts?: Partial<Record<T, number>>;
}

/** Pill filter with an animated sliding active indicator (shared layoutId). */
export function FilterBar<T extends string>({ items, active, onChange, idPrefix, label, counts }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => {
        const on = item === active;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(item)}
            className={cn('relative rounded-full px-4 py-2 font-display text-sm font-medium transition-colors', on ? 'text-white' : 'text-slate-400 hover:text-white')}
          >
            {on && (
              <motion.span
                layoutId={`${idPrefix}-pill`}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/90 to-cyan-500/80 shadow-[0_0_28px_-4px_rgba(124,58,237,0.8)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {!on && <span className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03]" />}
            <span className="relative z-[1] flex items-center gap-1.5">
              {item}
              {counts?.[item] !== undefined && <span className="font-mono text-[10px] opacity-70">{counts[item]}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
