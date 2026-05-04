/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Outfit'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      colors: {
        void: "#04050a",
        deep: "#080b14",
        cosmos: "#0e1220",
        nebula: "#161c2e",
        dust: "#242d45",
        star: "#f0f2ff",
        dim: "#8891b0",
        faint: "#4a5275",
        gold: "#f5c842",
        nova: "#ff6b35",
        pulsar: "#4fc3f7",
        aurora: "#7c6bff",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        twinkle: "twinkle 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        twinkle: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.3 },
        },
      },
    },
  },
  plugins: [],
};
