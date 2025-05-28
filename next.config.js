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

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow optimized images from Cloudinary
  images: {
    domains: [
      "storage.googleapis.com", // For Firebase Storage
      "firebasestorage.googleapis.com",
    ],
    unoptimized: true,
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // Internationalization settings
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  // Use standalone output
  output: "standalone",

  // Performance optimizations
  swcMinify: true, // Use SWC for minification (faster than Terser)
  reactStrictMode: true, // Enable React strict mode

  // Custom webpack tweaks
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    };
    return config;
  },
};

module.exports = nextConfig;
