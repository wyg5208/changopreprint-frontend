"use client";

// 管理员后台的"新版本待发布"队列，从 admin/page.tsx 拆出来的独立模块，
// 对应后端 GET /admin/preprints/pending-versions + POST .../publish-version。
import { useEffect, useState } from "react";
import { api, ApiError, type PreprintSummary, type PreprintVersionInfo } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type PendingItem = PreprintSummary & { pending_version: PreprintVersionInfo };

export default function PendingVersionsQueue({ token }: { token: string }) {
  const { t } = useLanguage();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  async function reload() {
    try {
      const res = await api.pendingVersions(token);
      setItems(res as PendingItem[]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("pending_versions_error"));
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handlePublish(slug: string) {
    setBusySlug(slug);
    setError("");
    try {
      await api.publishVersion(token, slug);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_publish_error"));
    } finally {
      setBusySlug(null);
    }
  }

  if (items.length === 0 && !error) return null;

  return (
    <div>
      <h2>{t("pending_versions_heading")}</h2>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {items.map((item) => (
        <div className="cp-card" key={item.slug}>
          <h3>{item.title_zh || item.title_en}</h3>
          <p style={{ fontSize: 13, color: "#555" }}>
            {t("pending_versions_line", {
              slug: item.slug,
              n: item.pending_version.version_no,
              filename: item.pending_version.original_filename,
            })}
          </p>
          {item.pending_version.changelog && (
            <p>
              {t("pending_versions_changelog_label")}
              {item.pending_version.changelog}
            </p>
          )}
          <button
            className="cp-btn"
            disabled={busySlug === item.slug}
            onClick={() => handlePublish(item.slug)}
          >
            {busySlug === item.slug ? t("admin_processing") : t("pending_versions_publish_button")}
          </button>
        </div>
      ))}
    </div>
  );
}
