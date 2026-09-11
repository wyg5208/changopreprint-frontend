/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8012/api/v1";

const nextConfig = {
  // 独立部署到 Vercel，不使用 Next.js rewrites 反代 madechango.com；
  // 主站到本站的引流只在 madechango.com 那一侧做 301，不在这里处理。
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.aliyuncs.com" },
    ],
  },
  async rewrites() {
    // Scholar 要求 citation_pdf_url 与摘要页同一子目录。
    // beforeFiles 必须先于 /p/[slug] 动态路由，否则 slug 会吃进 ".pdf" 变成 404。
    return {
      beforeFiles: [
        {
          source: "/p/:slug.pdf",
          destination: `${API_BASE}/public/preprints/:slug/file`,
        },
      ],
    };
  },
};

module.exports = nextConfig;
