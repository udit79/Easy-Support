import type { NextConfig } from "next";
const tunnelHost = "t9clbz85-3000.inc1.devtunnels.ms";
const isDevelopment = process.env.NODE_ENV === "development";
const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [tunnelHost],
  experimental: {
    agentFeedback: true,
    serverActions: {
      allowedOrigins: isDevelopment ? ["localhost:3000", tunnelHost] : [],
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
