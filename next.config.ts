// This file is used to configure Next.js settings, including image optimization.
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost:3000'], // <-- You can add your domain here
    // This allows Next.js to optimize images from your Payload CMS
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // <-- You HAVE configured it here!
        port: '3000',
        pathname: '/**',
      },

    ],
  },
};

export default nextConfig;
