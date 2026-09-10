/** @type {import('next').NextConfig} */
const nextConfig = {
  // 独立部署到 Vercel，不使用 Next.js rewrites 反代 madechango.com；
  // 主站到本站的引流只在 madechango.com 那一侧做 301，不在这里处理。
  reactStrictMode: true,
  images: {
    // PDF/图片走阿里云 OSS 公开直链，不经 Next.js 图片优化服务
    remotePatterns: [
      { protocol: "https", hostname: "*.aliyuncs.com" },
    ],
  },
};

module.exports = nextConfig;
