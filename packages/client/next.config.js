const withTM = require("next-transpile-modules")(["postprocessing", "@react-three/postprocessing"]);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = withTM(config);
