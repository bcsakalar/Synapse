import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@synapse/shared"],
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "ioredis", "bullmq"],
};

export default nextConfig;
