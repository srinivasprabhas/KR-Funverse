import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — other lockfiles exist elsewhere on this machine.
  turbopack: { root: __dirname },
  images: {
    // Local images live in /public/images. Remote patterns are kept as a
    // fallback so the site still renders if any image is referenced remotely.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
    qualities: [60, 75, 90],
  },
};

export default nextConfig;
