// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors"); // For accessing Tailwind's default color palette

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Assuming you might want dark mode capabilities
  theme: {
    extend: {
      colors: {
        // == NEW BRANDING PALETTE BASED ON HERO.JS ==
        // Backgrounds
        brandBackground: colors.slate[50], // #F8FAFC (Hero section background)

        // Text
        brandTextPrimary: colors.slate[900], // #0F172A (Main heading text)
        brandTextSecondary: colors.slate[700], // #334155 (Paragraphs, list items)
        brandTextSoft: colors.slate[800], // #1E293B (Secondary headings)
        brandTextMuted: colors.slate[500], // #64748B (Old price, less important text)
        brandTextInfo: colors.slate[600], // #475569 (Promo text)
        brandTextOnAccent: colors.white, // #FFFFFF (Text on accent buttons/backgrounds)

        // Accents (Based on Sky Blue)
        brandAccent: colors.sky[600], // #0284C7 (Main accent: "SELF DEFENCE!", new price, button bg)
        brandAccentHover: colors.sky[700], // #0369A1 (Hover state for accent elements)
        brandAccentFocus: colors.sky[500], // #0EA5E9 (Focus ring for accent elements, SVG icon fill)

        // Keep trueGray if you use it for other specific neutral shades
        trueGray: colors.trueGray,
      },
      fontFamily: {
        // Your existing font setup - assuming this is preferred
        sans: [`var(--font-poppins)`, ...defaultTheme.fontFamily.sans],
        poppins: [`var(--font-poppins)`, ...defaultTheme.fontFamily.sans],
        header: [
          `var(--font-poppins)`,
          `var(--font-montserrat)`,
          ...defaultTheme.fontFamily.sans,
        ],
        body: [
          `var(--font-lato)`,
          "Source Sans Pro",
          ...defaultTheme.fontFamily.sans,
        ],
        inter: [`var(--font-inter)`, ...defaultTheme.fontFamily.sans],
        stock: [`var(--font-inter)`, ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    // Consider adding these if you need them:
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
  ],
};
