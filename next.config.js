const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Transpile iceberg-js: optional chaining breaks webpack 4 / acorn in Next 9.
    config.module.rules.push({
      test: /\.(?:jsx?|cjs)$/,
      include: [path.resolve(__dirname, "node_modules", "iceberg-js")],
      use: {
        loader: require.resolve("babel-loader", {
          paths: [require.resolve("next/package.json")],
        }),
        options: {
          babelrc: false,
          configFile: false,
          compact: false,
          presets: [require.resolve("next/babel")],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
