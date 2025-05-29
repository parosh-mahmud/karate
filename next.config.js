// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "**", // Allows any pathname
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**", // Adjust the pathname to match your storage structure
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "**", // Allows any pathname
      },
    ],
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
