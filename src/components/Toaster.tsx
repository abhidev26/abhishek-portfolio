import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { subscribeToasts, type ToastItem } from '../lib/ui';

const icons = { success: CheckCircle2, error: XCircle, info: Info } as const;
const colors = { success: 'text-emerald-300', error: 'text-rose-300', info: 'text-cyan-300' } as const;

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(
    () =>
      subscribeToasts((t) => {
        setItems((prev) => [...prev.slice(-2), t]);
        window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 5000);
      }),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => {
          const Icon = icons[t.kind];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="glass-solid pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-sm"
            >
              <Icon className={`mt-0.5 h-5 w-5 flex-none ${colors[t.kind]}`} aria-hidden="true" />
              <span className="text-slate-100">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
