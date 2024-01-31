const { nextui } = require("@nextui-org/react");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 👇 Add CSS variables
        sans: ["var(--font-nunito)"],
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        mint: "#47cfb0",
        violet: "#8d80e3",
        lightGreen: "#74d240",
        yellow: "#ffce1f",
        lime: "#a7d934",
        softBlue: "#5e9ff9",
        orange: "#ff9240",
        pink: "#faa0b3",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "float-up": "floatUp 6s ease-in-out infinite",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translate(0,  0px) rotate(0.25deg)" },
          "50%": { transform: "translate(0, -3px) rotate(0.25deg)" },
          "100%": { transform: "translate(0, -0px) rotate(0.25deg)" },
        },
        float: {
          "0%": { transform: "translate(0,  0px) rotate(-0.25deg)" },
          "50%": { transform: "translate(0, 3px) rotate(-0.25deg)" },
          "100%": { transform: "translate(0, -0px) rotate(-0.25deg)" },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /bg-.*/,
    },
  ],
  darkMode: "class",
  plugins: [
    nextui(),
    require("@tailwindcss/typography"),
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addUtilities({
        ".no-scrollbar": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
