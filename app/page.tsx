import { api } from "@/lib/api";
import PreprintCard from "@/components/PreprintCard";
import Pagination from "@/components/Pagination";
import T from "@/components/T";

export const revalidate = 60;

const PAGE_SIZE = 20;

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  let data;
  try {
    data = await api.browse({ page });
  } catch {
    data = { total: 0, page, page_size: PAGE_SIZE, items: [] as Awaited<ReturnType<typeof api.browse>>["items"] };
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
      <Pagination page={data.page || page} pageSize={data.page_size || PAGE_SIZE} total={data.total} />
    </div>
  );
}
