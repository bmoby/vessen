import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/promotions",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/promotions/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
