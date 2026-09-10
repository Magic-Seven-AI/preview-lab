import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cwwp2.dot.ca.gov",
        pathname: "/data/**",
      },
    ],
  },
};

export default nextConfig;
