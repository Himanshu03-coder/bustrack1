/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:  'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        glass:    'rgb(var(--c-glass) / <alpha-value>)',
        line:     'rgb(var(--c-line) / <alpha-value>)',
        accent:   'rgb(var(--c-accent) / <alpha-value>)',
        accent2:  'rgb(var(--c-accent2) / <alpha-value>)',
        ink:      'rgb(var(--c-ink) / <alpha-value>)',
        muted:    'rgb(var(--c-muted) / <alpha-value>)',
        ok:       'rgb(var(--c-ok) / <alpha-value>)',
        warn:     'rgb(var(--c-warn) / <alpha-value>)',
        err:      'rgb(var(--c-err) / <alpha-value>)',
        gold:     'rgb(var(--c-accent) / <alpha-value>)',
      },
      boxShadow: {
        glass:     '0 4px 32px rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.07)',
        'glass-sm':'0 2px 16px rgb(0 0 0 / 0.25), inset 0 1px 0 rgb(255 255 255 / 0.05)',
        bubble:    '0 4px 12px rgb(0 0 0 / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.15)',
        glow:      '0 0 20px rgb(var(--c-accent) / 0.25), 0 8px 32px rgb(var(--c-accent2) / 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse at 20% 50%, rgb(59 130 246 / 0.2) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
};
