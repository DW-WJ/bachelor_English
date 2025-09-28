import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置代理到后端API
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },

  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NODE_ENV === "production"
        ? "https://your-production-api.com/api/v1"
        : "http://localhost:3001/api/v1",
  },

  // 开发环境配置
  ...(process.env.NODE_ENV === "development" && {
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
