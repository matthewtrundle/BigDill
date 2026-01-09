import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Crown Gold
        gold: {
          50: '#FFFDF5',
          100: '#FFF9E6',
          200: '#FFF0C2',
          300: '#FFE699',
          400: '#FFD966',
          500: '#FFCC33', // Primary crown gold
          600: '#E6B800',
          700: '#CC9900',
          800: '#997300',
          900: '#664D00',
          950: '#332600',
        },
        // Pickleball Green (lime green balls)
        pickle: {
          50: '#F2FDE8',
          100: '#E2FBCC',
          200: '#C5F79E',
          300: '#9EEF65',
          400: '#7AE435',
          500: '#5FD115', // Primary pickleball green
          600: '#48A80F',
          700: '#378011',
          800: '#2F6614',
          900: '#295615',
          950: '#123006',
        },
        // Pink (alternative ball color)
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899', // Primary pink
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
          950: '#500724',
        },
        // Clean background
        cream: {
          50: '#FDFCFB',
          100: '#FAF9F7',
          200: '#F5F3F0', // Primary background
          300: '#EBE7E1',
          400: '#D9D3C9',
          500: '#C7BEB1',
          600: '#A89D8D',
          700: '#8A7F6F',
          800: '#6E655A',
          900: '#5A534A',
        },
        // Dark charcoal for text
        charcoal: {
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#A4A4A4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#2D2D2D', // Primary text
          950: '#1A1A1A',
        },
        // Court blue (accent)
        court: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Court blue
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'soft': '4px',
        'crown': '8px',
      },
      boxShadow: {
        'gold': '0 4px 14px rgba(255, 204, 51, 0.25)',
        'gold-lg': '0 10px 40px rgba(255, 204, 51, 0.35)',
        'pickle': '0 4px 14px rgba(95, 209, 21, 0.25)',
        'soft': '0 4px 14px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFCC33 0%, #E6B800 100%)',
        'pickle-gradient': 'linear-gradient(135deg, #7AE435 0%, #5FD115 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FAF9F7 0%, #F5F3F0 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'crown-glow': 'crownGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        crownGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 204, 51, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 204, 51, 0.6)' },
        },
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
