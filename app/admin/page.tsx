"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";
import PendingVersionsQueue from "@/components/PendingVersionsQueue";
import UserVerificationQueue from "@/components/UserVerificationQueue";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function AdminReviewPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [token, setToken] = useState<string | null>(null);
  const [queue, setQueue] = useState<PreprintSummary[]>([]);
  const [error, setError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  async function reload(t: string) {
    try {
      const res = await api.reviewQueue(t);
      setQueue(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "加载失败（可能不是管理员账号）");
    }
  }

  useEffect(() => {
    const tk = getToken();
    if (!tk) {
      router.push("/login");
      return;
    }
    setToken(tk);
    reload(tk);
  }, [router]);

  async function handleApprove(slug: string) {
    if (!token) return;
    setBusySlug(slug);
    setError("");
    try {
      await api.approve(token, slug);
      await reload(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_publish_error"));
    } finally {
      setBusySlug(null);
    }
  }

  async function handleReject(slug: string) {
    if (!token) return;
    const reason = window.prompt(t("admin_reject_reason_prompt"));
    if (!reason) return;
    setBusySlug(slug);
    setError("");
    try {
      await api.reject(token, slug, reason);
      await reload(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin_action_error"));
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <div>
      {token && <UserVerificationQueue token={token} />}

      <h1>{t("admin_queue_title")}</h1>
      <p style={{ fontSize: 13, color: "#888" }}>{t("admin_queue_desc")}</p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {queue.length === 0 && <p>{t("admin_queue_empty")}</p>}
      {queue.map((item) => (
        <div className="cp-card" key={item.slug}>
          <h3>{item.title_zh || item.title_en}</h3>
          <p style={{ fontSize: 13, color: "#555" }}>
            {item.authors.map((a) => a.name).join(", ")} · slug: {item.slug}
          </p>
          <p>{(item.abstract_zh || item.abstract_en || "").slice(0, 200)}</p>
          <button
            className="cp-btn"
            disabled={busySlug === item.slug}
            onClick={() => handleApprove(item.slug)}
          >
            {busySlug === item.slug ? t("admin_processing") : t("admin_approve_publish_button")}
          </button>{" "}
          <button
            className="cp-btn danger"
            disabled={busySlug === item.slug}
            onClick={() => handleReject(item.slug)}
          >
            {t("admin_reject_button")}
          </button>
        </div>
      ))}
      {token && <PendingVersionsQueue token={token} />}
    </div>
  );
}
