const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#1E1E1E", // Charcoal
        accent: "#FFD700", // Gold
        secondary: "#FF4500", // OrangeRed
        neutral: "#F5F5F5", // Whisper White
        trueGray: colors.trueGray,
      },
    },
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      header: ["Poppins", "Montserrat", ...defaultTheme.fontFamily.sans],
      body: ["Lato", "Source Sans Pro", ...defaultTheme.fontFamily.sans],
      stock: [defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
