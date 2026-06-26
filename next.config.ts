import type { NextConfig } from "next";

// GitHub Pages serves from /<repo-name>/ unless it's the <username>.github.io repo.
// The workflow sets NEXT_BASE_PATH before building.
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;