import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a1628',
        'bg-secondary': '#0f2042',
        'bg-panel': '#132a4a',
        'accent-blue': '#00d4ff',
        'accent-blue-dim': '#0088aa',
        'status-green': '#00ff88',
        'status-red': '#ff4757',
        'status-orange': '#ffa502',
        'status-yellow': '#ffdd57',
        'status-idle': '#4a90d9',
        'text-primary': '#e0e8f0',
        'text-secondary': '#8899aa',
        'border-glow': 'rgba(0, 212, 255, 0.3)',
      },
      fontFamily: {
        display: ['"DIN Alternate"', '"Roboto Mono"', 'monospace'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 212, 255, 0.15), 0 0 30px rgba(0, 212, 255, 0.05)',
        'glow-strong': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
        card: '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'status-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'scroll-left': 'scroll-left 30s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'status-blink': 'status-blink 1s ease-in-out infinite',
        'border-flow': 'border-flow 3s ease infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
