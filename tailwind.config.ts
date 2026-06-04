import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: '#00e5ff',
        },
        orange: {
          accent: '#ff6a00',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 12px 2px rgba(0,229,255,0.45)',
        'glow-sm': '0 0 6px 1px rgba(0,229,255,0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config
