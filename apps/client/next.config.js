/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: "loose",
    appDir: true,
  },
};

module.exports = config;
