"use client";

// 精选外部预印本卡片。刻意跟 PreprintCard（本站真实投稿）在视觉上区分：
// 顶部有醒目的"转自 XX"来源角标，标题不可点击跳转本站落地页，只有
// "阅读原文"按钮跳到外部平台原文（target=_blank + rel=noopener noreferrer），
// 避免用户误以为这是本站已发布、已获 DOI 的原创稿件。
import type { ShowcaseItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ShowcaseCard({
  item,
  compact = false,
}: {
  item: ShowcaseItem;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const authorLimit = compact ? 2 : 4;
  const authors = item.authors.slice(0, authorLimit);
  const hasMoreAuthors = item.authors.length > authorLimit;
  const abstractLimit = compact ? 110 : 220;

  return (
    <div className={`cp-card cp-showcase-card${compact ? " compact" : ""}`}>
      <div className="cp-showcase-source">
        {t("showcase_source_prefix", { source: item.source_name || "OpenAlex" })}
      </div>
      {!compact && item.subject_area && <span className="cp-badge">{item.subject_area}</span>}
      <h3 className="cp-showcase-title">{item.title}</h3>
      {item.title_zh && <p className="cp-alt-title">{item.title_zh}</p>}
      {authors.length > 0 && (
        <p style={{ color: "#555", fontSize: 14 }}>
          {authors.join(", ")}
          {hasMoreAuthors ? " " + t("showcase_authors_more") : ""}
        </p>
      )}
      {item.abstract && (
        <p style={{ fontSize: 14 }}>
          {item.abstract.slice(0, abstractLimit)}
          {item.abstract.length > abstractLimit ? "…" : ""}
        </p>
      )}
      <p style={{ fontSize: 13, color: "#888" }}>
        {!compact && item.external_doi && (
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
