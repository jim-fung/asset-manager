import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/book",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
