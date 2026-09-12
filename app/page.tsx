import Link from "next/link";
import { api } from "@/lib/api";
import PreprintCard from "@/components/PreprintCard";
import ShowcaseCard from "@/components/ShowcaseCard";
import Pagination from "@/components/Pagination";
import HomeHero from "@/components/HomeHero";
import StatsStrip from "@/components/StatsStrip";
import BenefitsSection from "@/components/BenefitsSection";
import T from "@/components/T";

export const revalidate = 60;

const PAGE_SIZE = 20;
const NEWS_PREVIEW_SIZE = 3;

type PageProps = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const q = (sp.q || "").trim();
  // 只有"无搜索词 + 第一页"才是真正的首页落地态，展示 Hero/统计/资讯栏；
  // 翻页或搜索结果页保持简洁，参考大多数预印本平台"首页丰富、结果页从简"的做法。
  const isLanding = page === 1 && !q;

  let data;
  try {
    data = await api.browse({ page, q: q || undefined });
  } catch {
    data = { total: 0, page, page_size: PAGE_SIZE, items: [] as Awaited<ReturnType<typeof api.browse>>["items"] };
  }

  let stats: Awaited<ReturnType<typeof api.stats>> | null = null;
  let newsItems: Awaited<ReturnType<typeof api.showcase>>["items"] = [];
  if (isLanding) {
    try {
      stats = await api.stats();
    } catch {
      stats = null;
    }
    try {
      const news = await api.showcase({ page: 1, page_size: NEWS_PREVIEW_SIZE });
      newsItems = news.items;
    } catch {
      newsItems = [];
    }
  }

  return (
    <div>
      {isLanding && <HomeHero />}
      {isLanding && stats && <StatsStrip stats={stats} />}

      {isLanding && newsItems.length > 0 && (
        <section className="cp-section">
          <div className="cp-section-heading">
            <h2 className="cp-section-title">
              <T k="home_news_heading" />
            </h2>
            <Link href="/showcase">
              <T k="home_news_more" /> →
            </Link>
          </div>
          <div className="cp-news-grid">
            {newsItems.map((item) => (
              <ShowcaseCard key={`${item.source}-${item.id}`} item={item} compact />
            ))}
          </div>
        </section>
      )}

      {isLanding && <BenefitsSection />}

      <section className="cp-section">
        <div className="cp-section-heading">
          <h2 className="cp-section-title">
            <T k="home_title" />
          </h2>
        </div>
        {q ? (
          <p style={{ color: "#555" }}>
            <T k="home_search_result_prefix" vars={{ q }} />
            {" · "}
            <Link href="/">
              <T k="home_search_clear" />
            </Link>
          </p>
        ) : (
          <p style={{ color: "#555" }}>
            <T k="home_desc" />
          </p>
        )}
        {data.items.length === 0 && (
          <p>
            <T k="home_empty" />
            {!q && (
              <>
                <br />
                <Link href="/showcase" className="cp-home-showcase-teaser">
                  <T k="nav_showcase" /> →
                </Link>
              </>
            )}
          </p>
        )}
        {data.items.map((item) => (
          <PreprintCard key={item.slug} item={item} />
        ))}
        <Pagination
          page={data.page || page}
          pageSize={data.page_size || PAGE_SIZE}
          total={data.total}
          basePath="/"
          extraParams={q ? { q } : undefined}
        />
      </section>
    </div>
  );
}
