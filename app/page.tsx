import { api } from "@/lib/api";
import PreprintCard from "@/components/PreprintCard";
import T from "@/components/T";

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
      <h1>
        <T k="home_title" />
      </h1>
      <p style={{ color: "#555" }}>
        <T k="home_desc" />
      </p>
      {data.items.length === 0 && (
        <p>
          <T k="home_empty" />
        </p>
      )}
      {data.items.map((item) => (
        <PreprintCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
