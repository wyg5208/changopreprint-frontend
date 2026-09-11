import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = ["/login", "/register", "/dashboard", "/submit", "/admin", "/profile"];

export default function robots(): MetadataRoute.Robots {
  const host = SITE_URL.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "Googlebot-Scholar",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
