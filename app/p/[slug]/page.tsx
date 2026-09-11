import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, type LandingData } from "@/lib/api";
import VersionHistory from "@/components/VersionHistory";
import T from "@/components/T";

// 服务端渲染 + 每篇预印本自己的 <meta name="citation_*"> 标签，这是整个
// 免费方案里 Google Scholar 能收录的关键 —— Zenodo 官方不被 Scholar 系统
// 索引，落地页必须在 ChangoPreprint 自己的域名上，且必须是纯 HTML/SSR，
// 不能是客户端渲染后才出现的内容（爬虫不一定执行 JS）。

async function fetchLanding(slug: string): Promise<LandingData | null> {
  try {
    return await api.getLanding(slug);
  } catch {
    return null;
  }
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchLanding(slug);
  if (!data) return { title: "预印本不存在" };

  const title = data.preprint.title_en || data.preprint.title_zh;
  const other: Record<string, string> = {};
  for (const tag of data.scholar_meta) {
    other[tag.name] = tag.content;
  }

  return {
    title,
    description: (data.preprint.abstract_en || data.preprint.abstract_zh || "").slice(0, 200),
    alternates: { canonical: data.canonical_url },
    other,
  };
}

export default async function PreprintLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchLanding(slug);
  if (!data) notFound();

  const { preprint, pdf_url, json_ld } = data;
  const title = preprint.title_en || preprint.title_zh;
  const abstract = preprint.abstract_en || preprint.abstract_zh;

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(json_ld) }}
      />

      {preprint.status === "withdrawn" && (
        <div className="cp-card" style={{ borderColor: "#b91c1c", background: "#fef2f2" }}>
          <strong>
            <T k="landing_withdrawn_notice" />
          </strong>
          {preprint.withdrawal_note && <p>{preprint.withdrawal_note}</p>}
        </div>
      )}

      {preprint.subject_area && <span className="cp-badge">{preprint.subject_area}</span>}
      <h1>{title}</h1>
      <p style={{ color: "#555" }}>
        {preprint.authors.map((a) => a.name).join(", ")}
      </p>

      <div className="cp-card">
        <p>
          <strong>DOI: </strong>
          {preprint.version_doi ? (
            <a
              className="cp-doi"
              href={`https://doi.org/${preprint.version_doi}`}
              target="_blank"
              rel="noreferrer"
            >
              {preprint.version_doi}
            </a>
          ) : (
            <T k="landing_publishing" />
          )}
        </p>
        <p>
          <strong>
            <T k="landing_license_label" />
          </strong>
          {preprint.license.toUpperCase()}
        </p>
        {preprint.journal_doi && (
          <p>
            <strong>
              <T k="landing_official_publication_label" />
            </strong>
            <a href={`https://doi.org/${preprint.journal_doi}`} target="_blank" rel="noreferrer">
              {preprint.journal_doi}
            </a>
          </p>
        )}
        {pdf_url && (
          <a className="cp-btn" href={pdf_url} target="_blank" rel="noreferrer">
            <T k="landing_download_pdf" />
          </a>
        )}
      </div>

      <h2>
        <T k="landing_abstract_heading" />
      </h2>
      <p>{abstract}</p>

      {preprint.keywords.length > 0 && (
        <p>
          <strong>
            <T k="landing_keywords_label" />
          </strong>
          {preprint.keywords.join(" · ")}
        </p>
      )}

      <VersionHistory versions={preprint.versions} conceptDoi={preprint.concept_doi} />

      <p style={{ fontSize: 13, color: "#888" }}>
        <T
          k="card_stats"
          vars={{ views: preprint.view_count, downloads: preprint.download_count }}
        />{" "}
        · <T k="landing_archived_at" />{" "}
        <a href="https://zenodo.org" target="_blank" rel="noreferrer">
          Zenodo
        </a>
      </p>
    </article>
  );
}
