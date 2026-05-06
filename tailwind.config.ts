import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: {
          DEFAULT: 'var(--c-surface)',
          2: 'var(--c-surface-2)',
        },
        text: {
          DEFAULT: 'var(--c-text)',
          muted: 'var(--c-text-muted)',
          subtle: 'var(--c-text-subtle)',
        },
        border: {
          DEFAULT: 'var(--c-border)',
          strong: 'var(--c-border-strong)',
        },
        status: {
          ur: 'var(--c-status-ur)',
          closed: 'var(--c-status-closed)',
          cufc: 'var(--c-status-cufc)',
        },
        accent: 'var(--c-accent)',
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '14px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['14px', { lineHeight: '20px' }],
        md: ['15px', { lineHeight: '22px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['18px', { lineHeight: '26px' }],
        '2xl': ['22px', { lineHeight: '30px' }],
        '3xl': ['28px', { lineHeight: '34px' }],
        '4xl': ['32px', { lineHeight: '38px' }],
      },
      letterSpacing: {
        label: '0.06em',
      },
    },
  },
  plugins: [],
};

export default config;
