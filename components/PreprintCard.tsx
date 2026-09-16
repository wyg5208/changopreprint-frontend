"use client";

import Link from "next/link";
import type { PreprintSummary } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import SubjectBadge from "@/components/SubjectBadge";

export default function PreprintCard({ item }: { item: PreprintSummary }) {
  const { t } = useLanguage();
  const title = item.title_en || item.title_zh;

  return (
    <div className="cp-card">
      <SubjectBadge primary={item.subject_area} secondary={item.subject_area_secondary} />
      <h3 className="citation_title">
        <Link href={`/p/${item.slug}`}>{title}</Link>
      </h3>
      {item.title_zh && item.title_en && item.title_zh !== item.title_en ? (
        <p className="cp-alt-title">{item.title_zh}</p>
      ) : null}
      <p style={{ color: "#555", fontSize: 14 }}>
        {item.authors.map((a, idx) => (
          <span key={idx}>
            {idx > 0 && ", "}
            <Link href={`/authors/${encodeURIComponent(a.name)}`}>{a.name}</Link>
          </span>
        ))}
      </p>
      <p style={{ fontSize: 14 }}>
        {(item.abstract_en || item.abstract_zh || "").slice(0, 180)}
        {(item.abstract_en || item.abstract_zh || "").length > 180 ? "…" : ""}
      </p>
      <p style={{ fontSize: 13, color: "#888" }}>
        {item.version_doi && (
          <>
            DOI: <span className="cp-doi">{item.version_doi}</span> ·{" "}
          </>
        )}
        {t("card_stats", { views: item.view_count, downloads: item.download_count })}
      </p>
    </div>
  );
}
