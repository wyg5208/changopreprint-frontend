"use client";

// 精选外部预印本卡片。刻意跟 PreprintCard（本站真实投稿）在视觉上区分：
// 顶部有醒目的"转自 XX"来源角标，标题不可点击跳转本站落地页，只有
// "阅读原文"按钮跳到外部平台原文（target=_blank + rel=noopener noreferrer），
// 避免用户误以为这是本站已发布、已获 DOI 的原创稿件。
import type { ShowcaseItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const { t } = useLanguage();
  const authors = item.authors.slice(0, 4);
  const hasMoreAuthors = item.authors.length > 4;

  return (
    <div className="cp-card cp-showcase-card">
      <div className="cp-showcase-source">
        {t("showcase_source_prefix", { source: item.source_name || "OpenAlex" })}
      </div>
      {item.subject_area && <span className="cp-badge">{item.subject_area}</span>}
      <h3 className="cp-showcase-title">{item.title}</h3>
      {authors.length > 0 && (
        <p style={{ color: "#555", fontSize: 14 }}>
          {authors.join(", ")}
          {hasMoreAuthors ? " " + t("showcase_authors_more") : ""}
        </p>
      )}
      {item.abstract && (
        <p style={{ fontSize: 14 }}>
          {item.abstract.slice(0, 220)}
          {item.abstract.length > 220 ? "…" : ""}
        </p>
      )}
      <p style={{ fontSize: 13, color: "#888" }}>
        {item.external_doi && (
          <>
            DOI: <span className="cp-doi">{item.external_doi}</span> ·{" "}
          </>
        )}
        <a href={item.source_url} target="_blank" rel="noopener noreferrer nofollow">
          {t("showcase_read_original")} →
        </a>
      </p>
    </div>
  );
}
