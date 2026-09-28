import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  ...(process.env.GITHUB_PAGES === 'true' ? { distDir: 'pages-export' } : {}),
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
