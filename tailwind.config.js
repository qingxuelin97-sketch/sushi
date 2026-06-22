/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // British parliamentary palette
        commons: {
          green: "#2D3E2F",
          light: "#3D5340",
          dark: "#1F2B21",
        },
        lords: {
          red: "#6B1C23",
          dark: "#4A1318",
          light: "#8F2A33",
        },
        gold: {
          DEFAULT: "#C8A13A",
          light: "#E6C86E",
          dark: "#9A7B28",
          pale: "#E8D9A9",
        },
        wood: {
          DEFAULT: "#4A332A",
          light: "#6B4C3F",
          dark: "#2E201A",
        },
        parchment: {
          DEFAULT: "#F3EFE4",
          dark: "#E6DFCE",
          light: "#FBFAF5",
        },
        ink: {
          DEFAULT: "#1A1714",
          light: "#3A3530",
          muted: "#6B6459",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Cormorant Garamond", "serif"],
        inscription: ["Cinzel", "serif"],
        mono: ["Source Code Pro", "monospace"],
      },
      boxShadow: {
        brass: "0 0 0 1px #9A7B28, 0 0 0 2px #E6C86E, 0 4px 14px rgba(0,0,0,0.35)",
        parchment: "0 1px 3px rgba(26,23,20,0.08), 0 8px 24px rgba(26,23,20,0.12)",
        depth: "0 20px 50px -12px rgba(0,0,0,0.45)",
        glow: "0 0 20px rgba(200,161,58,0.25)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        "paper-texture": "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5'/%3E%3CfeDiffuseLighting lighting-color='%23F3EFE4' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E\")",
      },
      animation: {
        "flicker": "flicker 4s ease-in-out infinite alternate",
        "shimmer": "shimmer 2.5s linear infinite",
        "sway": "sway 6s ease-in-out infinite",
        "bell-ring": "bellRing 1.2s ease-in-out",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "stamp": "stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.82" },
          "70%": { opacity: "0.94" },
          "85%": { opacity: "0.76" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        bellRing: {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(15deg)" },
          "20%": { transform: "rotate(-15deg)" },
          "30%": { transform: "rotate(10deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(5deg)" },
          "60%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(2) rotate(-10deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-4deg)" },
        },
      },
    },
  },
  plugins: [],
};
