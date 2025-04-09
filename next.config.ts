import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // This allows us to use the <img> tag without warnings
    unoptimized: true,
  },
  eslint: {
    // This disables ESLint checking during production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
