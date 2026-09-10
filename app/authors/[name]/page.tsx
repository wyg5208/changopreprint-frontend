import type { Metadata } from "next";
import { api } from "@/lib/api";
import PreprintCard from "@/components/PreprintCard";

// 简易作者主页：不是独立的作者实体表，只是按 PreprintAuthor.name 模糊检索
// 该作者名下所有已发布预印本（见后端 public.py 的 author 参数）。
// 同名作者会被合并展示，这是当前阶段的已知取舍，不是bug。

type PageProps = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} 的预印本 - ChangoPreprint` };
}

export default async function AuthorPage({ params }: PageProps) {
  const { name } = await params;
  const authorName = decodeURIComponent(name);

  let data;
  try {
    data = await api.browse({ author: authorName });
  } catch {
    data = { total: 0, items: [] as Awaited<ReturnType<typeof api.browse>>["items"] };
  }

  return (
    <div>
      <h1>{authorName}</h1>
      <p style={{ color: "#555" }}>共 {data.total} 篇已发布预印本</p>
      {data.items.length === 0 && <p>暂无匹配的已发布预印本。</p>}
      {data.items.map((item) => (
        <PreprintCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
