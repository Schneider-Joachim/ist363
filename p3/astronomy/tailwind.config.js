/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "sans-serif"],
        body:    ["'Outfit'",   "sans-serif"],
        mono:    ["'Orbitron'", "sans-serif"],
      },
      colors: {
        /* exact P2 tokens */
        bg:      "#07090f",
        surface: "#0d0f1f",
        card:    "#101220",
        border:  "rgba(167,139,250,0.18)",
        accent:  "#a78bfa",
        amber:   "#f6ad55",
        txt:     "#e2e8f0",
        muted:   "#718096",
        /* extras */
        deep:    "#07090f",
        cosmos:  "#0d0f1f",
        nebula:  "#101220",
        dust:    "rgba(167,139,250,0.18)",
        star:    "#e2e8f0",
        dim:     "#718096",
        faint:   "#4a5275",
        pulsar:  "#a78bfa",
        gold:    "#f6ad55",
        aurora:  "#7c3aed",
        nova:    "#f6ad55",
        void:    "#07090f",
      },
      animation: {
        "fade-up":   "fadeUp 0.5s ease forwards",
        "fade-in":   "fadeIn 0.4s ease forwards",
        "spin-slow": "spin 20s linear infinite",
        pulse:       "pulse 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulse: {
          "0%,100%": { opacity: 1 },
          "50%":     { opacity: 0.4 },
        },
      },
    },
  },
  plugins: [],
};
