// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg': 'var(--color-bg)',
        'theme-main': 'var(--color-main)',
        'theme-sub': 'var(--color-sub)',
        'theme-text': 'var(--color-text)',
        'theme-error': 'var(--color-error)',
        'theme-error-bg': 'var(--color-error-bg)',
        'theme-correct': 'var(--color-correct)',
        'theme-caret': 'var(--color-caret)',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'caret-blink': 'blink 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}