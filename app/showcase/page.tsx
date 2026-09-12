import type { Metadata } from "next";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import ShowcaseCard from "@/components/ShowcaseCard";
import Pagination from "@/components/Pagination";
import T from "@/components/T";

// "学术资讯"栏目：精选来自 arXiv/SSRN/bioRxiv 等平台的公开预印本，
// 用于本站原创投稿还较少时充实内容。这不是本站投稿列表，见
// components/ShowcaseCard.tsx 与后端 models/external_showcase.py 说明。
export const revalidate = 300;

const PAGE_SIZE = 12;

type PageProps = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "学术资讯 - ChangoPreprint",
    description: "精选来自 arXiv、SSRN、bioRxiv 等主流预印本平台的最新学术资讯。",
    alternates: { canonical: `${SITE_URL}/showcase` },
    robots: { index: false, follow: true },
  };
}

export default async function ShowcasePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  let data;
  try {
    data = await api.showcase({ page, page_size: PAGE_SIZE });
  } catch {
    data = { total: 0, page, page_size: PAGE_SIZE, items: [] as Awaited<ReturnType<typeof api.showcase>>["items"] };
  }

  return (
    <div>
      <h1>
        <T k="showcase_title" />
      </h1>
      <p style={{ color: "#555" }}>
        <T k="showcase_desc" />
      </p>
      {data.items.length === 0 && (
        <p>
          <T k="showcase_empty" />
        </p>
      )}
      {data.items.map((item) => (
        <ShowcaseCard key={`${item.source}-${item.id}`} item={item} />
      ))}
      <Pagination
        page={data.page || page}
        pageSize={data.page_size || PAGE_SIZE}
        total={data.total}
        basePath="/showcase"
      />
    </div>
  );
}
