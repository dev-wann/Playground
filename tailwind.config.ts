import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-gold":
          "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)",
      },
      animation: {
        "card-flip-front": "card-flip-front 1.8s linear",
        "card-flip-back": "card-flip-back 1.8s linear",
      },
      keyframes: {
        "card-flip-front": {
          "0%": { transform: "rotateY(0deg) scale(1)" },
          "10%": { transform: "rotateY(180deg)" },
          "20%": { transform: "rotateY(360deg) scale(0.85)" },
          "40%": { transform: "rotateY(540deg) scale(0.8)" },
          "70%": { transform: "rotateY(720deg) scale(0.95)" },
          "85%": { transform: "rotateY(720deg) scale(0.9)" },
          "90%": { transform: "rotateY(720deg) scale(0.95)" },
          "95%": { transform: "rotateY(720deg) scale(1.02)" },
          "100%": { transform: "rotateY(720deg) scale(1)" },
        },
        "card-flip-back": {
          "0%": { transform: "rotateY(180deg) scale(1)" },
          "10%": { transform: "rotateY(360deg)" },
          "20%": { transform: "rotateY(540deg) scale(0.85)" },
          "40%": { transform: "rotateY(720deg) scale(0.8)" },
          "70%": { transform: "rotateY(900deg) scale(0.95)" },
          "85%": { transform: "rotateY(900deg) scale(0.9)" },
          "90%": { transform: "rotateY(900deg) scale(0.95)" },
          "95%": { transform: "rotateY(900deg) scale(1.02)" },
          "100%": { transform: "rotateY(900deg) scale(1)" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
};

export default config;
