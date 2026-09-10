"use client";

// 管理员后台的"新版本待发布"队列，从 admin/page.tsx 拆出来的独立模块，
// 对应后端 GET /admin/preprints/pending-versions + POST .../publish-version。
import { useEffect, useState } from "react";
import { api, ApiError, type PreprintSummary, type PreprintVersionInfo } from "@/lib/api";

type PendingItem = PreprintSummary & { pending_version: PreprintVersionInfo };

export default function PendingVersionsQueue({ token }: { token: string }) {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  async function reload() {
    try {
      const res = await api.pendingVersions(token);
      setItems(res as PendingItem[]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "加载新版本队列失败");
    }
  }

  useEffect(() => {
    reload();
  }, [token]);

  async function handlePublish(slug: string) {
    setBusySlug(slug);
    setError("");
    try {
      await api.publishVersion(token, slug);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "发布新版本失败");
    } finally {
      setBusySlug(null);
    }
  }

  if (items.length === 0 && !error) return null;

  return (
    <div>
      <h2>新版本待发布</h2>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {items.map((item) => (
        <div className="cp-card" key={item.slug}>
          <h3>{item.title_zh || item.title_en}</h3>
          <p style={{ fontSize: 13, color: "#555" }}>
            slug: {item.slug} · 待发布第 {item.pending_version.version_no} 版 ·{" "}
            {item.pending_version.original_filename}
          </p>
          {item.pending_version.changelog && <p>修订说明：{item.pending_version.changelog}</p>}
          <button
            className="cp-btn"
            disabled={busySlug === item.slug}
            onClick={() => handlePublish(item.slug)}
          >
            {busySlug === item.slug ? "处理中…" : "发布该新版本到 Zenodo"}
          </button>
        </div>
      ))}
    </div>
  );
}
