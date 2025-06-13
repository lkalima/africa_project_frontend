// This file is used to configure Next.js settings, including image optimization.
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // <-- You HAVE configured it here!
        port: '3000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
