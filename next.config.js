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
const path = require("path"); // Import the 'path' module

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com", "firebasestorage.googleapis.com"],
    // unoptimized: true, // Consider setting to false for Vercel's Image Optimization unless you have specific reasons
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // output: "standalone", // For typical Vercel deployments, this is often not needed.
  // If you're not using Docker for Vercel, you can likely remove this.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use path.resolve to ensure an absolute path to the project root
      "@": path.resolve(__dirname),
    };
    return config;
  },
  // swcMinify is true by default in recent Next.js versions.
  // Remove this line if it's causing the "Unrecognized key" warning.
  // swcMinify: true,
};

module.exports = nextConfig;
