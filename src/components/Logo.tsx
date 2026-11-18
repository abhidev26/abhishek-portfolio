export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C3AED" /><stop offset="0.55" stopColor="#06B6D4" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path d="M20 3 L36 35 H28.5 L20 17.5 L11.5 35 H4 Z" fill="none" stroke="url(#lm)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M13 27 H27" stroke="url(#lm)" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="20" cy="3" r="2.2" fill="#F8FAFC" />
    </svg>
  );
}
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-base font-bold tracking-[0.22em] text-starlight">ABHISHEK</span>
    </span>
  );
}
