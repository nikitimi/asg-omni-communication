import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clicksend-api-downloads.s3.ap-southeast-2.amazonaws.com",
        pathname: "/_private/**",
      },
    ],
  },
};

export default nextConfig;
