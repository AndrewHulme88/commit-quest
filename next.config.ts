import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from inferring a parent directory as the workspace root.
  // A wrong root makes PostCSS resolve packages outside this app's node_modules.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
