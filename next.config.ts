import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@mui/material": "@mui/material/index.js",
    },
  },
  /* config options here */
};

export default nextConfig;
