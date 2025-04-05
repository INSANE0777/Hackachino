import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // --- EXISTING & ADDED COLORS ---
      colors: {
        // Existing HSL colors (keep them)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Neo-Brutalist Pop Colors (Added)
        'pop-white': '#FFFFFF',        // Pure White
        // Using your existing pop-black definition:
        'pop-black': '#121212',        // Your defined black (slightly off-black)
        'pop-yellow': '#FDE047',       // Tailwind yellow-300
        'pop-blue': '#60A5FA',         // Tailwind blue-400
        'pop-red': '#F87171',          // Tailwind red-400
        'pop-green': '#4ADE80',        // Tailwind green-400
        'pop-pink': '#F472B6',         // Tailwind pink-400
        'pop-purple': '#A78BFA',       // Tailwind purple-400
      },
      // --- FONTS (Keep Existing) ---
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        'bebas': ['Bebas Neue', 'sans-serif'], // Already exists - ensure font is linked
        'inter': ['Inter', 'sans-serif'],     // Already exists
      },
      // --- BOX SHADOWS (Refined & Added) ---
      boxShadow: {
        // Refined Brutal Shadows (Using #000000 for stronger contrast)
        'brutal': '4px 4px 0px #000000',
        'brutal-hover': '6px 6px 0px #000000', // Example hover effect
        'brutal-light': '4px 4px 0px #FFFFFF', // White shadow for dark backgrounds

        // Specific Shadows from the Component (Optional - for semantic use)
        // You can use arbitrary values like shadow-[3px_3px_0px_#A3A3A3] directly in JSX instead
        'modal-btn-dark-hover': '1px 1px 0px #A3A3A3',
        'modal-btn-dark': '3px 3px 0px #A3A3A3',
        'modal-btn-yellow-hover': '1px 1px 0px #000000',
        'modal-btn-yellow': '3px 3px 0px #000000',
        'footer-submit': '2px 2px 0px rgba(255,255,255,0.3)',
        'footer-submit-hover': '1px 1px 0px rgba(255,255,255,0.3)',
      },
      // --- BORDER RADIUS (Keep Existing) ---
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // --- KEYFRAMES (Existing & Added) ---
      keyframes: {
        // Existing Accordion
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Added for Landing Page
        'spin-slow': { // For footer shape
           to: { transform: 'rotate(360deg)' }
        },
        'bounce-slow': { // For footer shape
           '0%, 100%': { transform: 'translateY(-15%)', 'animation-timing-function': 'cubic-bezier(0.8,0,1,1)' },
           '50%': { transform: 'translateY(0)', 'animation-timing-function': 'cubic-bezier(0,0,0.2,1)' },
        },
        'modal-pop-in': { // For modal appearance
           'from': { transform: 'scale(0.95)', opacity: '0' },
           'to': { transform: 'scale(1)', opacity: '1' },
        }
      },
      // --- ANIMATION (Existing & Added) ---
      animation: {
        // Existing Accordion
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Added for Landing Page
        'spin-slow': 'spin-slow 6s linear infinite',
        'bounce-slow': 'bounce-slow 2s infinite',
        'modal-pop-in': 'modal-pop-in 0.2s ease-out forwards', // Added 'forwards'
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Keep existing plugin
} satisfies Config;