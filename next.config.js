//const withTM = import("next-transpile-modules")(["three"]);
// @ts-check
/** @type {import('next').NextConfig} */
//import i18n from "./next-i18next.config.js";
import path from "path";

const nextConfig = {
  webpack(config, options) {
    config.module.rules.push(
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        use: ["glslify-loader", "raw-loader"],
      },
      {
        test: /\.mp3$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      }
    );
    return config;
  },

  images: { unoptimized: true },
  pageExtensions: ["jsx", "tsx", "ts"],
  output: undefined, // Outputs a Single-Page Application (SPA)
  distDir: "./dist", // Changes the output directory `./dist/`
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig; //withTM(nextConfig);
