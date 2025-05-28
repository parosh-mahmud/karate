// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Allow optimized images from Cloudinary
//   images: {
//     domains: [
//       "storage.googleapis.com", // For Firebase Storage
//       "firebasestorage.googleapis.com",
//     ],
//     unoptimized: true,
//   },

//   // Internationalization settings
//   i18n: {
//     locales: ["en"],
//     defaultLocale: "en",
//   },

//   // Replace deprecated `target` with new `output`
//   //   "standalone" → outputs a minimal server build you can run anywhere
//   //   "export"     → outputs a fully static export (no Node server)
//   output: "standalone",

//   // Custom webpack tweaks
//   webpack: (config) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       "@": __dirname,
//     };
//     return config;
//   },
// };

// module.exports = nextConfig;

// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/context": path.resolve(__dirname, "context"),
      "@/components": path.resolve(__dirname, "components"),
      "@/lib": path.resolve(__dirname, "lib"),
    };
    return config;
  },
};

module.exports = nextConfig;
