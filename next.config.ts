import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rlvlgbddtgnoffemtrpu.supabase.co",
      },
    ],
  },
};

export default nextConfig;
