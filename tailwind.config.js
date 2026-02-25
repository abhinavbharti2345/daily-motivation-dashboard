/** @type {import('tailwindcss').Config} */
export default {
  // Scan all source files so Tailwind only ships classes that are actually used
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Brand colour palette — mirrors the original CSS custom properties
      colors: {
        accent: {
          DEFAULT: "#f5a623",           // main orange accent
          gold: "#f5c842",           // brighter gold for headings / streak
          dim: "rgba(245,166,35,0.18)", // subtle tinted background
          glow: "rgba(245,166,35,0.35)", // box-shadow / text-shadow glow
        },
        bg: {
          DEFAULT: "#1a1528",                   // page background
          glass: "rgba(18,14,35,0.72)",       // card glass fill
          glass2: "rgba(28,22,50,0.80)",       // slightly lighter glass (fav bar)
          sidebar: "rgba(22,18,42,0.82)",       // right sidebar fill
        },
        text: {
          DEFAULT: "#f0e8d0", // primary text (warm white)
          muted: "#a89878", // secondary / label text
        },
        border: "rgba(245,166,35,0.22)", // global glass border colour
      },

      fontFamily: {
        // System stack — loads instantly without a web-font request
        sans: ["'Segoe UI'", "'Inter'", "'Trebuchet MS'", "sans-serif"],
      },

      borderRadius: {
        card: "16px", // used for all glass cards
      },

      backdropBlur: {
        card: "14px", // consistent glassmorphism blur depth
      },

      // Custom keyframes referenced via the animation tokens below
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      animation: {
        "slide-up": "slideUp 0.5s ease-out",
        "slide-up-fast": "slideUp 0.35s ease-out",
        "spin-slow": "spinSlow 0.75s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};
