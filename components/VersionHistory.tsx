"use client";

// 落地页版本历史展示：Concept DOI 跨版本不变，每个版本自己的 Version DOI
// 由 Zenodo newversion 流程注册（见后端 admin.py 的 publish-version）。
import type { PreprintVersionInfo } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function VersionHistory({
  versions,
  conceptDoi,
}: {
  versions: PreprintVersionInfo[];
  conceptDoi: string;
}) {
  const { t } = useLanguage();
  const published = versions.filter((v) => v.doi);
  if (published.length <= 1) return null;

  return (
    <div className="cp-card">
      <h2>{t("version_history_heading")}</h2>
      {conceptDoi && (
        <p style={{ fontSize: 13, color: "#888" }}>
          {t("version_history_concept_doi_label")}
          <a href={`https://doi.org/${conceptDoi}`} target="_blank" rel="noreferrer">
            {conceptDoi}
          </a>
        </p>
      )}
      <ul>
        {[...published].reverse().map((v) => (
          <li key={v.version_no}>
            {t("version_history_version_prefix", { n: v.version_no })}{" "}
            <a href={`https://doi.org/${v.doi}`} target="_blank" rel="noreferrer">
              {v.doi}
            </a>
            {v.changelog && <span style={{ color: "#888" }}> ({v.changelog})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
