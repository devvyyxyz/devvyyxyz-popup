import type { NextConfig } from "next";

// GitHub Pages serves project repos from /<repo-name>/
// Change this if you rename the repo or deploy to a user/org site (<username>.github.io).
const basePath = process.env.NEXT_BASE_PATH || "/devvyyxyz-popup";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  turbopack: {
    root: import.meta.dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;