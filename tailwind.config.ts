// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
        content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // <--- ESTA LÍNEA DEBE ESTAR
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  theme: {
    extend: {
          keyframes: {
      ticker: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' },
      },
    },
    animation: {
      ticker: 'ticker 28s linear infinite',
    },
      colors: {
        brand: {
          brown: '#7A4A2A',   // El color principal de los títulos
          red: '#B75D4D',     // Un acento
          dark: '#4E3B3B',    // Texto y menú
          cream: '#F8E2D1',   // El fondo de la barra del logo y bordes glass
        }
      },
      // Usaremos una fuente serif de Google para los títulos principales
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      
    },
    
  },
  plugins: [],
};
export default config;