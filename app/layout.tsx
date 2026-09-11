import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { SITE_URL } from "@/lib/site";

const SITE_DESC =
  "ChangoPreprint 面向马来西亚中国留学生的免费预印本发布平台，投稿经审核后归档于 Zenodo 并获得可引用的 DOI。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ChangoPreprint —— 马来西亚中国留学生预印本平台",
    template: "%s | ChangoPreprint",
  },
  description: SITE_DESC,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "ChangoPreprint",
    title: "ChangoPreprint —— 马来西亚中国留学生预印本平台",
    description: SITE_DESC,
  },
  twitter: {
    card: "summary",
    title: "ChangoPreprint —— 马来西亚中国留学生预印本平台",
    description: SITE_DESC,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ChangoPreprint",
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: ["zh-CN", "en"],
  publisher: {
    "@type": "Organization",
    name: "ChangoPreprint",
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LanguageProvider>
          <Header />
          <main className="cp-container">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
