/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: '#050816',
        cosmic: '#080A12',
        violet: { cosmic: '#7C3AED' },
        cyan: { electric: '#06B6D4' },
        nebula: '#EC4899',
        glow: '#2563EB',
        starlight: '#F8FAFC',
        muted: '#94A3B8',
      },
      fontFamily: {
        display: ['"Space Grotesk Variable"', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        chevron: { '0%': { opacity: '0', transform: 'translateY(-6px)' }, '50%': { opacity: '1' }, '100%': { opacity: '0', transform: 'translateY(6px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite', chevron: 'chevron 1.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
