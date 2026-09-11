"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";
import PendingVersionsQueue from "@/components/PendingVersionsQueue";
import UserVerificationQueue from "@/components/UserVerificationQueue";

export default function AdminReviewPage() {
  const router = useRouter();
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
    const t = getToken();
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
    reload(t);
  }, [router]);

  async function handleApprove(slug: string) {
    if (!token) return;
    setBusySlug(slug);
    setError("");
    try {
      await api.approve(token, slug);
      await reload(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "发布失败");
    } finally {
      setBusySlug(null);
    }
  }

  async function handleReject(slug: string) {
    if (!token) return;
    const reason = window.prompt("请填写拒绝理由");
    if (!reason) return;
    setBusySlug(slug);
    setError("");
    try {
      await api.reject(token, slug, reason);
      await reload(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "操作失败");
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <div>
      {token && <UserVerificationQueue token={token} />}

      <h1>审核队列</h1>
      <p style={{ fontSize: 13, color: "#888" }}>
        通过后会自动创建 Zenodo deposition、上传 PDF 并发布，注册正式 DOI。
      </p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {queue.length === 0 && <p>队列为空。</p>}
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
            {busySlug === item.slug ? "处理中…" : "通过并发布到 Zenodo"}
          </button>{" "}
          <button
            className="cp-btn danger"
            disabled={busySlug === item.slug}
            onClick={() => handleReject(item.slug)}
          >
            拒绝
          </button>
        </div>
      ))}
      {token && <PendingVersionsQueue token={token} />}
    </div>
  );
}
