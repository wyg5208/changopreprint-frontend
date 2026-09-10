import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "ChangoPreprint —— 马来西亚中国留学生预印本平台",
    template: "%s | ChangoPreprint",
  },
  description:
    "ChangoPreprint 面向马来西亚中国留学生的免费预印本发布平台，投稿经审核后归档于 Zenodo 并获得可引用的 DOI。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="cp-container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
