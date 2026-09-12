import T from "@/components/T";

export default function Pagination({
  page,
  pageSize,
  total,
  basePath = "/",
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const hrefFor = (n: number) => (n <= 1 ? basePath : `${basePath}?page=${n}`);

  return (
    <nav className="cp-pagination" aria-label="pagination">
      {page > 1 ? (
        <a href={hrefFor(page - 1)}>
          <T k="home_prev" />
        </a>
      ) : (
        <span />
      )}
      <span>
        <T k="home_page" vars={{ page, pages }} />
      </span>
      {page < pages ? (
        <a href={hrefFor(page + 1)}>
          <T k="home_next" />
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
