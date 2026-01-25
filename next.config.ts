import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.x.com",
        // pathname: "/avatars/**",
      },
    ],
  },
  /* config options here */
}

export default nextConfig
