import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F5',
        surface: '#FFFFFF',
        'surface-warm': '#F2EDE6',
        border: '#E8E2D9',
        accent: {
          DEFAULT: '#8B7355',
          light: '#B5956A',
          dark: '#6A5840',
        },
        dark: '#1A1714',
        'text-main': '#2D2926',
        muted: '#6B6459',
      },
      fontFamily: {
        // Latin face first; the browser falls through to the Arabic face per glyph.
        display: ['"Cormorant Garamond"', 'Amiri', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Tajawal', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        body: ['"Cormorant Garamond"', 'Amiri', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
