/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#050505",
        neonPink: "#FF007F",
        magenta: "#BC13FE",
        slate: "#708090",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, #FF007F15 1px, transparent 1px)",
      },
      boxShadow: {
        'neon': '0 0 5px #FF007F, 0 0 20px #FF007F',
        'neon-strong': '0 0 10px #FF007F, 0 0 40px #FF007F',
      }
    },
  },
  plugins: [],
}
