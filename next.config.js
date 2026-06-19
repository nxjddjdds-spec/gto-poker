/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\/.*\.(json|js|css|png|jpg|svg|ico)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\/api\/.*/,
      handler: "NetworkFirst",
      options: { cacheName: "api-cache", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 } },
    },
    {
      urlPattern: /^https?:\/\/.*\/_next\/data\/.*/,
      handler: "NetworkFirst",
      options: { cacheName: "next-data", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 } },
    },
    {
      urlPattern: /.*/,
      handler: "NetworkFirst",
      options: { cacheName: "others", expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 } },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
