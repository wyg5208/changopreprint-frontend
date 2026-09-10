import { api } from "@/lib/api";
import PreprintCard from "@/components/PreprintCard";

export const revalidate = 60; // 首页浏览列表每分钟重新拉取一次，不需要实时

export default async function HomePage() {
  let data;
  try {
    data = await api.browse({});
  } catch {
    data = { total: 0, items: [] as Awaited<ReturnType<typeof api.browse>>["items"] };
  }

  return (
    <div>
      <h1>最新预印本</h1>
      <p style={{ color: "#555" }}>
        未同行评审的学术预印本，发布后获得 Zenodo/DataCite 注册的可引用 DOI。
      </p>
      {data.items.length === 0 && <p>暂无已发布预印本。</p>}
      {data.items.map((item) => (
        <PreprintCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
