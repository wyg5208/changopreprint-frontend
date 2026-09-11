import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const PAGE_SIZE = 20;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    const data = await api.getSitemap();
    for (const item of data.preprints) {
      entries.push({
        url: `${base}/p/${item.slug}`,
        lastModified: item.updated_at || item.published_at || undefined,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
    for (const name of data.authors) {
      entries.push({
        url: `${base}/authors/${encodeURIComponent(name)}`,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
    const pages = Math.ceil(data.preprints.length / PAGE_SIZE);
    for (let page = 2; page <= pages; page += 1) {
      entries.push({
        url: `${base}/?page=${page}`,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  } catch {
    // 后端暂时不可达时仍返回首页，避免 sitemap.xml 整份 500
  }

  return entries;
}
