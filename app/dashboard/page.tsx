"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type PreprintSummary } from "@/lib/api";
import { getToken } from "@/lib/auth";
import PublishedActions from "@/components/PublishedActions";

const STATUS_LABEL: Record<string, string> = {
  draft: "草稿",
  submitted: "已提交，待审核",
  under_review: "发布中（正在同步 Zenodo）",
  published: "已发布",
  rejected: "已拒绝",
  withdrawn: "已撤稿",
};

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<PreprintSummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .listMine(token)
      .then((res) => setItems(res as PreprintSummary[]))
      .catch(() => setError("加载失败，请重新登录"));
  }, [router]);

  return (
    <div>
      <h1>我的稿件</h1>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {items.length === 0 && <p>暂无稿件，去 <a href="/submit">投稿</a> 吧。</p>}
      {items.map((item) => (
        <div className="cp-card" key={item.slug}>
          <span className="cp-badge">{STATUS_LABEL[item.status] || item.status}</span>
          <h3>{item.title_zh || item.title_en}</h3>
          {item.version_doi && (
            <p>
              DOI: <span className="cp-doi">{item.version_doi}</span>
            </p>
          )}
          {(item.status === "published" || item.status === "withdrawn") && (
            <a href={`/p/${item.slug}`}>查看落地页</a>
          )}
          <PublishedActions
            item={item}
            onUpdated={(updated) =>
              setItems((prev) => prev.map((it) => (it.slug === updated.slug ? updated : it)))
            }
          />
        </div>
      ))}
    </div>
  );
}
